import { NextRequest, NextResponse } from 'next/server';
import { neonPrisma } from '@/lib/neon-prisma';

export async function POST(req: NextRequest) {
  try {
    // 1. Verifikasi secret token
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || new URL(req.url).searchParams.get('secret');

    const expectedSecret = process.env.CRON_SECRET || 'secret';
    if (!token || token !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized: Invalid or missing secret token' }, { status: 401 });
    }

    // 2. Cek submission yang macet > 15 menit (sedang_diproses tapi tidak selesai)
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

    // 3. Ambil batch antrean menunggu_diproses (maks 5 per batch agar aman di serverless Vercel)
    const pendingSubmissions = await neonPrisma.submission.findMany({
      where: { status: 'menunggu_diproses' },
      take: 5,
      include: {
        program: {
          include: {
            documentFields: true,
            biodataFields: true,
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

    // Catatan: Di Fase 5, pipeline verifikasi dokumen lengkap (OCR Tesseract, keyword check,
    // date check, fuzzy name check, dan pdf-lib merge) akan dieksekusi di sini per submission.
    // Untuk Fase 2, endpoint ini siap menerima trigger dan memvalidasi otorisasi antrean.

    return NextResponse.json({
      success: true,
      message: `Ditemukan ${pendingSubmissions.length} antrean siap diproses.`,
      pendingCount: pendingSubmissions.length,
      stuckRecovered: stuckSubmissions.count,
    });
  } catch (err: any) {
    console.error('[Worker Error /api/worker/proses-antrean]', err);
    return NextResponse.json(
      { error: 'Internal server error: ' + (err?.message || 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Support GET for simple webhook / cron ping
  return POST(req);
}
