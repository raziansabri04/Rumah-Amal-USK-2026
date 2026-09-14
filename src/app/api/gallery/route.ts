import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '8', 10));

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.gallery.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.gallery.count(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      items,
      total,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('[GET /api/gallery]', error);
    return NextResponse.json({ error: 'Gagal mengambil data galeri.' }, { status: 500 });
  }
}
