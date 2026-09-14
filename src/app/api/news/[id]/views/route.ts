import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST: Increment views count for News
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const newsId = resolvedParams.id;

    if (!newsId) {
      return NextResponse.json({ error: 'ID berita tidak valid' }, { status: 400 });
    }

    const updated = await prisma.news.update({
      where: { id: newsId },
      data: {
        viewsCount: { increment: 1 },
      },
      select: { viewsCount: true },
    });

    return NextResponse.json({ success: true, viewsCount: updated.viewsCount });
  } catch (error) {
    console.error('[POST /api/news/[id]/views]', error);
    return NextResponse.json(
      { error: `Gagal memperbarui jumlah views: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
