import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '6', 10));
    const skip = (page - 1) * limit;

    const whereCondition = query
      ? {
          OR: [
            { judul: { contains: query, mode: 'insensitive' as const } },
            { judulEn: { contains: query, mode: 'insensitive' as const } },
            { judulAr: { contains: query, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.newsletter.findMany({
        where: whereCondition,
        orderBy: { tanggal: 'desc' },
        skip,
        take: limit,
      }),
      prisma.newsletter.count({ where: whereCondition }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      items,
      total,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('[GET /api/newsletter]', error);
    return NextResponse.json({ error: 'Gagal mengambil data newsletter.' }, { status: 500 });
  }
}
