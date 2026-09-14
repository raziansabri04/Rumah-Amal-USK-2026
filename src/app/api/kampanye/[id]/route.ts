import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.kampanye.delete({
      where: { id },
    });

    revalidatePath('/kampanye');
    revalidatePath('/upload/kampanye');
    revalidatePath('/admin/kampanye');
    revalidatePath('/infaq');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting kampanye:', error);
    return NextResponse.json({ error: 'Gagal menghapus kampanye' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const kampanye = await prisma.kampanye.update({
      where: { id },
      data: body,
    });

    revalidatePath('/kampanye');
    revalidatePath('/upload/kampanye');
    revalidatePath('/admin/kampanye');
    revalidatePath('/infaq');

    return NextResponse.json({ success: true, kampanye });
  } catch (error) {
    console.error('Error updating kampanye status:', error);
    return NextResponse.json({ error: 'Gagal memperbarui kampanye' }, { status: 500 });
  }
}
