import { NextRequest, NextResponse } from 'next/server';
import { neonPrisma } from '@/lib/neon-prisma';
import { uploadFileToDrive } from '@/lib/google-drive';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const token = formData.get('token') as string;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token pendaftaran wajib disertakan.' }, { status: 400 });
    }

    const submission = await neonPrisma.submission.findUnique({
      where: { token },
      include: {
        program: {
          include: {
            documentFields: true,
          },
        },
        documents: true,
      },
    });

    if (!submission) {
      return NextResponse.json({ success: false, error: 'Pendaftaran tidak ditemukan.' }, { status: 404 });
    }

    const biodata = (submission.biodataValues as Record<string, any>) || {};
    const applicantNameKey = Object.keys(biodata).find((k) => k.toLowerCase().includes('nama'));
    const applicantName = applicantNameKey ? String(biodata[applicantNameKey]) : 'Pendaftar';
    const folderTag = `${applicantName.slice(0, 30)} - ${submission.token.slice(0, 8)}`;

    const filesToUpdate: {
      fieldKey: string;
      docField: typeof submission.program.documentFields[0];
      file: File;
    }[] = [];

    // Cari file yang diunggah ulang
    for (const docField of submission.program.documentFields) {
      const fileEntry = formData.get(`reupload_${docField.key}`);
      if (fileEntry && typeof fileEntry === 'object' && 'arrayBuffer' in fileEntry && (fileEntry as File).size > 0) {
        filesToUpdate.push({
          fieldKey: docField.key,
          docField,
          file: fileEntry as File,
        });
      }
    }

    if (filesToUpdate.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Pilih minimal satu berkas yang perlu diperbaiki untuk diunggah ulang.' },
        { status: 400 }
      );
    }

    // Upload file revisi dan update atau create SubmissionDocument
    for (const item of filesToUpdate) {
      const arrayBuffer = await item.file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadRes = await uploadFileToDrive({
        buffer,
        originalFilename: item.file.name,
        mimeType: item.file.type,
        programName: submission.program.nama,
        applicantFolderTag: folderTag,
      });

      const existingDoc = submission.documents.find((d) => d.fieldKey === item.fieldKey);

      if (existingDoc) {
        await neonPrisma.submissionDocument.update({
          where: { id: existingDoc.id },
          data: {
            originalFilename: item.file.name,
            fileUrl: uploadRes.fileUrl,
            driveFileId: uploadRes.fileId,
            fileSizeBytes: item.file.size,
            mimeType: item.file.type,
            ocrText: null, // Reset teks OCR agar diproses ulang
            needsRevision: false,
            revisionNote: null,
          },
        });
      } else {
        await neonPrisma.submissionDocument.create({
          data: {
            submissionId: submission.id,
            documentFieldId: item.docField.id,
            fieldKey: item.fieldKey,
            originalFilename: item.file.name,
            fileUrl: uploadRes.fileUrl,
            driveFileId: uploadRes.fileId,
            fileSizeBytes: item.file.size,
            mimeType: item.file.type,
          },
        });
      }
    }

    // Kembalikan status submission ke 'menunggu_diproses' agar diverifikasi ulang oleh worker
    await neonPrisma.submission.update({
      where: { id: submission.id },
      data: {
        status: 'menunggu_diproses',
        processingStartedAt: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Berhasil mengunggah ${filesToUpdate.length} berkas perbaikan. Berkas Anda kembali masuk ke antrean verifikasi otomatis sistem.`,
    });
  } catch (error: any) {
    console.error('[API /api/pendaftaran/perbaiki error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Terjadi kesalahan sistem saat menyimpan berkas perbaikan.' },
      { status: 500 }
    );
  }
}
