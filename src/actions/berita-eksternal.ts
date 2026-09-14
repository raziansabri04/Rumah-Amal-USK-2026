'use server';

import prisma from '@/lib/prisma';

export async function getNewsLinks(page: number = 1, limit: number = 8, search: string = '') {
  const skip = (page - 1) * limit;

  const where: any = search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
          { source: { contains: search, mode: 'insensitive' as const } },
          { url: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [items, totalCount, activeCount, inactiveCount] = await Promise.all([
    prisma.newsLink.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.newsLink.count({ where }),
    prisma.newsLink.count({ where: { isActive: true } }),
    prisma.newsLink.count({ where: { isActive: false } }),
  ]);

  const totalPages = Math.ceil(totalCount / limit) || 1;

  return {
    items,
    totalCount,
    totalPages,
    activeCount,
    inactiveCount,
  };
}
