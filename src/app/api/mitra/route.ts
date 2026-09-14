import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
    const skip = (page - 1) * limit;

    const whereCondition = query
      ? {
          nama: {
            contains: query,
            mode: 'insensitive' as const,
          },
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.mitra.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.mitra.count({ where: whereCondition }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      items,
      total,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('[GET /api/mitra]', error);
    return NextResponse.json({ error: 'Gagal mengambil data mitra.' }, { status: 500 });
  }
}
