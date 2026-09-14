import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * POST /api/documents/[id]/download
 * Increment downloadCount untuk dokumen tertentu.
 * Dipanggil saat user klik tombol download di halaman publik.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID dokumen tidak valid.' }, { status: 400 });
    }

    const updated = await prisma.document.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
      select: { id: true, downloadCount: true },
    });

    return NextResponse.json({ success: true, downloadCount: updated.downloadCount });
  } catch (err) {
    console.error('[POST /api/documents/[id]/download]', err);
    // Jangan gagalkan jika hanya tracking yang error — dokumen tetap bisa dibuka
    return NextResponse.json(
      { error: `Gagal mencatat unduhan: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
