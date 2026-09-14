import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const skip = (page - 1) * limit;

    const [newsLinks, total] = await Promise.all([
      prisma.newsLink.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.newsLink.count({ where: { isActive: true } }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      newsLinks,
      total,
      page,
      totalPages,
      hasMore,
    });
  } catch (error) {
    console.error('[GET /api/news-link]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
