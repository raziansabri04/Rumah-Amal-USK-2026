import { NextRequest, NextResponse } from 'next/server';
import { neonPrisma } from '@/lib/neon-prisma';
import { uploadFileToDrive } from '@/lib/google-drive';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const programId = formData.get('programId') as string;
    if (!programId) {
      return NextResponse.json({ success: false, error: 'Program ID wajib disertakan.' }, { status: 400 });
    }

    // 1. Validasi keberadaan dan status program di database Neon
    const program = await neonPrisma.programBantuan.findUnique({
      where: { id: programId },
      include: {
        biodataFields: { orderBy: { order: 'asc' } },
        documentFields: { orderBy: { order: 'asc' } },
      },
    });

    if (!program) {
      return NextResponse.json({ success: false, error: 'Program bantuan tidak ditemukan.' }, { status: 404 });
    }

    if (program.status !== 'dibuka') {
      return NextResponse.json(
        { success: false, error: 'Pendaftaran untuk program ini sedang ditutup.' },
        { status: 400 }
      );
    }

    const now = new Date();
    if (program.tanggalBuka && now < new Date(program.tanggalBuka)) {
      return NextResponse.json(
        { success: false, error: 'Pendaftaran program ini belum resmi dibuka.' },
        { status: 400 }
      );
    }
    if (program.tanggalTutup && now > new Date(program.tanggalTutup)) {
      return NextResponse.json(
        { success: false, error: 'Batas waktu pendaftaran program ini telah berakhir.' },
        { status: 400 }
      );
    }

    // 2. Parse dan validasi Biodata
    const biodataValues: Record<string, any> = {};
    for (const field of program.biodataFields) {
      const val = formData.get(`biodata_${field.key}`);
      const stringVal = typeof val === 'string' ? val.trim() : '';

      if (field.required && !stringVal) {
        return NextResponse.json(
          { success: false, error: `Kolom data diri "${field.label}" wajib diisi.` },
          { status: 400 }
        );
      }

      biodataValues[field.key] = stringVal;
    }

    // 3. Validasi keberadaan file dokumen wajib sebelum upload
    const filesToUpload: {
      field: typeof program.documentFields[0];
      file: File;
    }[] = [];

    for (const docField of program.documentFields) {
      const fileEntry = formData.get(`doc_${docField.key}`);
      if (fileEntry && typeof fileEntry === 'object' && 'arrayBuffer' in fileEntry && (fileEntry as File).size > 0) {
        filesToUpload.push({
          field: docField,
          file: fileEntry as File,
        });
      } else if (docField.required) {
        return NextResponse.json(
          { success: false, error: `Berkas persyaratan "${docField.label}" wajib diunggah.` },
          { status: 400 }
        );
      }
    }

    // 4. Generate tag pendaftar untuk nama folder
    // Menggunakan nama dari biodata jika ada (misal: 'nama', 'nama_lengkap', 'nama_pengusul')
    const applicantNameKey = Object.keys(biodataValues).find((k) =>
      k.toLowerCase().includes('nama')
    );
    const applicantName = applicantNameKey ? String(biodataValues[applicantNameKey]) : 'Pendaftar';

    // 5. Buat entri Submission terlebih dahulu dengan status 'menunggu_diproses'
    const submission = await neonPrisma.submission.create({
      data: {
        programId: program.id,
        biodataValues: biodataValues,
        status: 'menunggu_diproses',
        warnings: [],
      },
    });

    const folderTag = `${applicantName.slice(0, 30)} - ${submission.token.slice(0, 8)}`;

    // 6. Upload file ke Google Drive (atau fallback lokal) secara paralel
    const uploadPromises = filesToUpload.map(async ({ field, file }) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadRes = await uploadFileToDrive({
        buffer,
        originalFilename: file.name,
        mimeType: file.type,
        programName: program.nama,
        applicantFolderTag: folderTag,
      });

      // Simpan record SubmissionDocument
      return neonPrisma.submissionDocument.create({
        data: {
          submissionId: submission.id,
          documentFieldId: field.id,
          fieldKey: field.key,
          originalFilename: file.name,
          fileUrl: uploadRes.fileUrl,
          driveFileId: uploadRes.fileId,
          fileSizeBytes: file.size,
          mimeType: file.type,
        },
      });
    });

    await Promise.all(uploadPromises);

    // 7. Respon sukses cepat ke pendaftar
    return NextResponse.json({
      success: true,
      token: submission.token,
      message: 'Pendaftaran berhasil dikirim. Berkas Anda sedang masuk ke antrean verifikasi otomatis sistem.',
      programTitle: program.nama,
      submittedAt: submission.submittedAt,
    });
  } catch (error: any) {
    console.error('[API /api/pendaftaran/submit error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Terjadi kesalahan sistem saat memproses formulir.' },
      { status: 500 }
    );
  }
}
