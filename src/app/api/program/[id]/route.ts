import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.program.delete({
      where: { id },
    });

    revalidatePath('/program');
    revalidatePath('/upload/program');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting program:', error);
    return NextResponse.json({ error: 'Gagal menghapus program' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const program = await prisma.program.update({
      where: { id },
      data: body,
    });

    revalidatePath('/program');
    revalidatePath('/upload/program');

    return NextResponse.json({ success: true, program });
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json({ error: 'Gagal memperbarui program' }, { status: 500 });
  }
}
