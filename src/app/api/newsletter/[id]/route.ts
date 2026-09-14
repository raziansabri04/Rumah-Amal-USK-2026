import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const newsletter = await prisma.newsletter.findUnique({
      where: { id },
    });

    if (!newsletter) {
      return NextResponse.json({ error: 'Newsletter tidak ditemukan.' }, { status: 404 });
    }

    // Ambil 4 newsletter terkini selain yang sedang dibuka
    const recent = await prisma.newsletter.findMany({
      where: {
        id: { not: id },
      },
      orderBy: { tanggal: 'desc' },
      take: 4,
    });

    return NextResponse.json({ newsletter, recent });
  } catch (error) {
    console.error('[GET /api/newsletter/[id]]', error);
    return NextResponse.json({ error: 'Gagal mengambil detail newsletter.' }, { status: 500 });
  }
}
