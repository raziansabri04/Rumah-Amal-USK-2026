import { NextRequest, NextResponse } from 'next/server';
import { neonPrisma } from '@/lib/neon-prisma';
import { downloadFileBuffer, uploadMergedPdfToDrive } from '@/lib/google-drive';
import {
  checkExpectedKeywords,
  checkDocumentMaxAge,
  checkApplicantNameMatch,
  runOcrOnBuffer,
  mergeDocumentsToSinglePdf,
  VerificationWarning,
} from '@/lib/verification-pipeline';
import { sendCorrectionEmail } from '@/lib/email-service';

export const maxDuration = 60; // Izinkan hingga 60 detik di serverless environment
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Verifikasi secret token otorisasi worker
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || new URL(req.url).searchParams.get('secret');

    const expectedSecret = process.env.CRON_SECRET || 'secret';
    if (!token || token !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized: Invalid or missing secret token' }, { status: 401 });
    }

    // 2. Pemulihan Antrean Macet (Stuck Submissions > 15 menit)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const stuckSubmissions = await neonPrisma.submission.updateMany({
      where: {
        status: 'sedang_diproses',
        processingStartedAt: { lt: fifteenMinutesAgo },
      },
      data: {
        status: 'gagal_diproses',
      },
    });

    // 3. Ambil Batch Submission Berstatus 'menunggu_diproses' (maks 3-5 agar aman dari execution timeout)
    const pendingSubmissions = await neonPrisma.submission.findMany({
      where: { status: 'menunggu_diproses' },
      take: 3,
      include: {
        program: {
          include: {
            documentFields: { orderBy: { order: 'asc' } },
            biodataFields: { orderBy: { order: 'asc' } },
          },
        },
        documents: true,
      },
      orderBy: { submittedAt: 'asc' },
    });

    if (pendingSubmissions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Tidak ada antrean pendaftaran yang menunggu diproses.',
        processed: 0,
        stuckRecovered: stuckSubmissions.count,
      });
    }

    const processedResults = [];

    // 4. Proses Tiap Submission Secara Sekuensial
    for (const submission of pendingSubmissions) {
      // Pasang Row-level Lock Sederhana
      await neonPrisma.submission.update({
        where: { id: submission.id },
        data: {
          status: 'sedang_diproses',
          processingStartedAt: new Date(),
        },
      });

      const warnings: VerificationWarning[] = [];
      const downloadedFiles: { buffer: Buffer; mimeType: string; filename: string }[] = [];

      // Dapatkan nama pendaftar dari biodataValues jika ada
      const biodata = (submission.biodataValues as Record<string, any>) || {};
      const applicantNameKey = Object.keys(biodata).find((k) => k.toLowerCase().includes('nama'));
      const applicantName = applicantNameKey ? String(biodata[applicantNameKey]) : '';

      // Map dokumen yang diupload berdasarkan key field
      const uploadedDocsMap = new Map(submission.documents.map((d) => [d.fieldKey, d]));

      // 4a. Periksa Tiap Syarat Dokumen (DocumentField)
      for (const docField of submission.program.documentFields) {
        const uploadedDoc = uploadedDocsMap.get(docField.key);

        // Validasi 1: Kelengkapan Dokumen Wajib
        if (!uploadedDoc) {
          if (docField.required) {
            warnings.push({
              fieldKey: docField.key,
              fieldLabel: docField.label,
              type: 'missing_document',
              message: `Berkas "${docField.label}" wajib diunggah tetapi tidak ditemukan.`,
              severity: 'warning',
            });
          }
          continue;
        }

        // Tandai flag stempel manual jika field membutuhkan
        if (docField.needsStampCheck) {
          warnings.push({
            fieldKey: docField.key,
            fieldLabel: docField.label,
            type: 'needs_manual_check',
            message: `Berkas "${docField.label}" membutuhkan verifikasi tanda tangan / stempel basah manual oleh verifikator.`,
            severity: 'info',
          });
        }

        // Download isi buffer berkas
        let fileBuffer: Buffer | null = null;
        try {
          fileBuffer = await downloadFileBuffer(uploadedDoc.fileUrl, uploadedDoc.driveFileId);
          downloadedFiles.push({
            buffer: fileBuffer,
            mimeType: uploadedDoc.mimeType || 'application/octet-stream',
            filename: uploadedDoc.originalFilename,
          });
        } catch (downloadErr: any) {
          console.error(`[Gagal download berkas ${uploadedDoc.id}]`, downloadErr);
          warnings.push({
            fieldKey: docField.key,
            fieldLabel: docField.label,
            type: 'ocr_failed',
            message: `Berkas "${docField.label}" tidak dapat diunduh untuk verifikasi.`,
            severity: 'warning',
          });
          continue;
        }

        // Jika dokumen adalah single combined upload (misal foto rumah) dan bukan teks, skip OCR
        if (docField.isSingleCombinedUpload) {
          continue;
        }

        // 4b. Jalankan OCR (jika berupa gambar)
        let ocrText = uploadedDoc.ocrText || '';
        if (!ocrText && uploadedDoc.mimeType?.startsWith('image/')) {
          ocrText = await runOcrOnBuffer(fileBuffer, uploadedDoc.mimeType);
          // Simpan teks OCR ke database agar tidak perlu OCR ulang
          await neonPrisma.submissionDocument.update({
            where: { id: uploadedDoc.id },
            data: { ocrText },
          });
        }

        // Jika OCR menghasilkan teks, lakukan validasi lanjutan:
        if (ocrText && ocrText.trim().length > 0) {
          // Validasi 2: Pengecekan Kata Kunci (Expected Keywords)
          if (docField.expectedKeywords && docField.expectedKeywords.length > 0) {
            const kwCheck = checkExpectedKeywords(ocrText, docField.expectedKeywords);
            if (!kwCheck.matches) {
              warnings.push({
                fieldKey: docField.key,
                fieldLabel: docField.label,
                type: 'keyword_mismatch',
                message: `Teks pada berkas "${docField.label}" tidak memuat kata kunci yang diharapkan (${docField.expectedKeywords.join(', ')}). Kemungkinan salah unggah file.`,
                severity: 'warning',
              });
            }
          }

          // Validasi 3: Batas Masa Berlaku Dokumen (Max Age Months)
          if (docField.maxAgeMonths) {
            const ageCheck = checkDocumentMaxAge(ocrText, submission.submittedAt, docField.maxAgeMonths);
            if (!ageCheck.valid) {
              warnings.push({
                fieldKey: docField.key,
                fieldLabel: docField.label,
                type: 'expired_document',
                message: `Masa berlaku berkas "${docField.label}" bermasalah: ${ageCheck.reason}`,
                severity: 'warning',
              });
            }
          }

          // Validasi 4: Pengecekan Kesesuaian Nama Pendaftar (Fuzzy Match)
          if (docField.nameCheckApplicable && applicantName) {
            const nameCheck = checkApplicantNameMatch(ocrText, applicantName);
            if (!nameCheck.matches) {
              warnings.push({
                fieldKey: docField.key,
                fieldLabel: docField.label,
                type: 'name_mismatch',
                message: `Nama pendaftar "${applicantName}" tidak terdeteksi pada dokumen "${docField.label}". Kemungkinan dokumen milik orang lain.`,
                severity: 'warning',
              });
            }
          }
        }
      }

      // 4c. Gabungkan Seluruh Dokumen Menjadi Satu PDF Utuh (Merge PDF)
      let mergedPdfUrl: string | null = null;
      if (downloadedFiles.length > 0) {
        try {
          const mergedBuffer = await mergeDocumentsToSinglePdf(downloadedFiles);
          const folderTag = `${applicantName.slice(0, 30)} - ${submission.token.slice(0, 8)}`;
          const filename = `Berkas_Lengkap_${applicantName.replace(/[^a-zA-Z0-9]/g, '_')}_${submission.token.slice(0, 6)}.pdf`;

          const uploadMergeRes = await uploadMergedPdfToDrive({
            buffer: mergedBuffer,
            filename,
            programName: submission.program.nama,
            applicantFolderTag: folderTag,
          });

          mergedPdfUrl = uploadMergeRes.fileUrl;
        } catch (mergeErr) {
          console.error(`[Gagal merge PDF submission: ${submission.id}]`, mergeErr);
        }
      }

      // 4d. Finalisasi Status Submission Menjadi 'belum_diseleksi'
      const updatedSubmission = await neonPrisma.submission.update({
        where: { id: submission.id },
        data: {
          status: 'belum_diseleksi',
          warnings: warnings as any,
          linkDokumenGabungan: mergedPdfUrl,
        },
      });

      // 4e. Kirim Email Notifikasi Perbaikan jika ada Warning Kritis (Dokumen salah, tidak cocok, expired)
      const actionableWarnings = warnings.filter((w) =>
        ['missing_document', 'keyword_mismatch', 'expired_document', 'name_mismatch'].includes(w.type)
      );

      if (actionableWarnings.length > 0) {
        const applicantEmailKey = Object.keys(biodata).find((k) => k.toLowerCase().includes('email'));
        const applicantEmail = applicantEmailKey ? String(biodata[applicantEmailKey]) : '';

        // Trigger kirim email perbaikan
        await sendCorrectionEmail({
          toEmail: applicantEmail,
          applicantName: applicantName || 'Pendaftar',
          programName: submission.program.nama,
          token: submission.token,
          warnings: actionableWarnings.map((w) => ({
            fieldLabel: w.fieldLabel,
            message: w.message,
          })),
        });
      }

      processedResults.push({
        id: updatedSubmission.id,
        token: updatedSubmission.token,
        warningsCount: warnings.length,
        hasMergedPdf: !!mergedPdfUrl,
        correctionEmailSent: actionableWarnings.length > 0,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil memproses ${processedResults.length} submission pendaftaran.`,
      processed: processedResults.length,
      stuckRecovered: stuckSubmissions.count,
      results: processedResults,
    });
  } catch (err: any) {
    console.error('[Worker Error /api/worker/proses-antrean]', err);
    return NextResponse.json(
      { error: 'Internal worker execution error: ' + (err?.message || 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
