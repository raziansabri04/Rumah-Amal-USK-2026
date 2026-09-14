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

    const searchFilter: Prisma.RekapZakatWhereInput = search
      ? {
          OR: [
            { muzakkiNIP: { contains: search } },
            { tahunRekap: { contains: search } },
            { muzakki: { nama: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {};

    const unitKerjaFilter: Prisma.RekapZakatWhereInput =
      unitKerja && unitKerja !== 'all'
        ? { muzakki: { unitKerja: { equals: unitKerja, mode: 'insensitive' } } }
        : {};

    const where: Prisma.RekapZakatWhereInput = {
      AND: [searchFilter, unitKerjaFilter],
    };

    const [rekaps, total, distinctUnitKerja] = await Promise.all([
      prisma.rekapZakat.findMany({
        where,
        include: {
          muzakki: {
            select: { nama: true, unitKerja: true },
          },
        },
        orderBy: [{ tahunRekap: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.rekapZakat.count({ where }),
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

    const formatted = rekaps.map((r) => ({
      id: r.id,
      muzakkiNIP: r.muzakkiNIP,
      muzakki: r.muzakki,
      tahunRekap: r.tahunRekap,
      fileUrl: r.fileUrl,
      createdAt: new Date(r.createdAt).toLocaleDateString('id-ID'),
    }));

    return NextResponse.json({
      data: formatted,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      availableUnitKerja,
    });
  } catch (error) {
    console.error('Error fetching rekap zakat:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}


