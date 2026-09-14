import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID tidak valid.' }, { status: 400 });
    }

    await prisma.mitra.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Mitra berhasil dihapus.' });
  } catch (error) {
    console.error('[DELETE /api/mitra/[id]]', error);
    return NextResponse.json({ error: 'Gagal menghapus mitra.' }, { status: 500 });
  }
}
