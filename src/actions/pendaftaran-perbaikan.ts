import { neonPrisma } from '@/lib/neon-prisma';

/**
 * Mengambil data submission berdasarkan token untuk keperluan halaman perbaikan berkas
 */
export async function getSubmissionByToken(token: string) {
  try {
    const submission = await neonPrisma.submission.findUnique({
      where: { token },
      include: {
        program: {
          include: {
            documentFields: { orderBy: { order: 'asc' } },
            biodataFields: { orderBy: { order: 'asc' } },
          },
        },
        documents: {
          include: {
            documentField: true,
          },
        },
      },
    });

    if (!submission) {
      return { success: false, error: 'Token pendaftaran tidak valid atau tidak ditemukan.' };
    }

    return { success: true, data: submission };
  } catch (error: any) {
    console.error('[getSubmissionByToken error]', error);
    return { success: false, error: error.message || 'Gagal memuat data pendaftar.' };
  }
}
