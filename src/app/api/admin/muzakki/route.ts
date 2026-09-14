import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20')));
    const search = searchParams.get('search')?.trim() || '';
    const unitKerja = (searchParams.get('unitKerja') || 'all').trim();
    const skip = (page - 1) * limit;

    const searchFilter: Prisma.MuzakkiWhereInput = search
      ? {
        OR: [
          { nama: { contains: search, mode: 'insensitive' } },
          { nip: { contains: search } },
          { unitKerja: { contains: search, mode: 'insensitive' } },
          { noHp: { contains: search } },
        ],
      }
      : {};

    const unitKerjaFilter: Prisma.MuzakkiWhereInput =
      unitKerja && unitKerja !== 'all'
        ? { unitKerja: { equals: unitKerja, mode: 'insensitive' } }
        : {};

    const where: Prisma.MuzakkiWhereInput = {
      AND: [searchFilter, unitKerjaFilter],
    };

    const [muzakkis, total, distinctUnitKerja] = await Promise.all([
      prisma.muzakki.findMany({
        where,
        orderBy: { nama: 'asc' },
        skip,
        take: limit,
      }),
      prisma.muzakki.count({ where }),
      prisma.muzakki.findMany({
        select: { unitKerja: true },
        where: { unitKerja: { not: null } },
        distinct: ['unitKerja'],
        orderBy: { unitKerja: 'asc' },
      }),
    ]);

    const availableUnitKerja = distinctUnitKerja
      .map(d => d.unitKerja?.trim())
      .filter((u): u is string => Boolean(u && u.length > 0));

    return NextResponse.json({
      data: muzakkis,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      availableUnitKerja,
    });
  } catch (error) {
    console.error('Error fetching muzakkis:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
