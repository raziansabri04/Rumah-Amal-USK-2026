import { NextRequest, NextResponse } from 'next/server';
import prisma, { getPrismaInstance } from '@/lib/prisma';
import { deleteStorageFileByUrl } from '@/lib/supabase';

function getBannerClient() {
  const client = (prisma.banner ? prisma : getPrismaInstance()) as any;
  return client;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = getBannerClient();
    if (!client.banner) {
      return NextResponse.json({ error: 'Prisma Client Banner belum diinisialisasi' }, { status: 500 });
    }
    const banner = await client.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return NextResponse.json({ error: 'Banner tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, banner });
  } catch (err) {
    console.error('[GET /api/banner/[id]]', err);
    return NextResponse.json({ error: 'Gagal mengambil data banner' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { title, titleAr, titleEn, imageUrl, linkUrl, order, isActive } = body;

    const client = getBannerClient();
    if (!client.banner) {
      return NextResponse.json({ error: 'Prisma Client Banner belum diinisialisasi' }, { status: 500 });
    }

    const existing = await client.banner.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Banner tidak ditemukan' }, { status: 404 });
    }

    const updated = await client.banner.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(titleAr !== undefined && { titleAr }),
        ...(titleEn !== undefined && { titleEn }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(linkUrl !== undefined && { linkUrl }),
        ...(order !== undefined && { order: Number(order) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    return NextResponse.json({ success: true, banner: updated });
  } catch (err) {
    console.error('[PUT /api/banner/[id]]', err);
    return NextResponse.json({ error: 'Gagal memperbarui banner' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const client = getBannerClient();
    if (!client.banner) {
      return NextResponse.json({ error: 'Prisma Client Banner belum diinisialisasi' }, { status: 500 });
    }

    const banner = await client.banner.findUnique({ where: { id } });
    if (!banner) {
      return NextResponse.json({ error: 'Banner tidak ditemukan' }, { status: 404 });
    }

    // Delete image from Supabase storage
    if (banner.imageUrl) {
      await deleteStorageFileByUrl(banner.imageUrl);
    }

    await client.banner.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Banner berhasil dihapus' });
  } catch (err) {
    console.error('[DELETE /api/banner/[id]]', err);
    return NextResponse.json({ error: 'Gagal menghapus banner' }, { status: 500 });
  }
}
