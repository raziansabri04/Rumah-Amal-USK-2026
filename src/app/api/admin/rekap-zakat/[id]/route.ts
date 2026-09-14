import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { nip, muzakkiNIP, tahunRekap, fileUrl } = body;
    const cleanNip = (muzakkiNIP || nip)?.toString().trim();

    if (!cleanNip || !tahunRekap || !fileUrl) {
      return NextResponse.json({ error: 'NIP, Tahun Rekap, dan URL File wajib diisi' }, { status: 400 });
    }

    const updated = await prisma.rekapZakat.update({
      where: { id },
      data: {
        muzakkiNIP: cleanNip,
        tahunRekap: String(tahunRekap).trim(),
        fileUrl: fileUrl.trim(),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating rekap zakat:', error);
    return NextResponse.json({ error: 'Gagal memperbarui data rekap zakat' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.rekapZakat.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting rekap zakat:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

