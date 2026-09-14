import { NextRequest, NextResponse } from 'next/server';
import prisma, { getPrismaInstance } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get('all') === 'true';

    const client = (prisma.banner ? prisma : getPrismaInstance()) as any;
    const banners = client.banner?.findMany
      ? await client.banner.findMany({
        where: showAll ? undefined : { isActive: true },
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' },
        ],
      })
      : [];

    return NextResponse.json({ success: true, banners });
  } catch (err) {
    console.error('[GET /api/banner]', err);
    return NextResponse.json(
      { error: 'Gagal mengambil data banner' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, titleAr, titleEn, imageUrl, linkUrl, order, isActive } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'Judul dan URL gambar wajib diisi.' },
        { status: 400 }
      );
    }

    const client = (prisma.banner ? prisma : getPrismaInstance()) as any;
    if (!client.banner) {
      return NextResponse.json({ error: 'Prisma Client Banner belum diinisialisasi' }, { status: 500 });
    }

    const banner = await client.banner.create({
      data: {
        title,
        titleAr: titleAr || null,
        titleEn: titleEn || null,
        imageUrl,
        linkUrl: linkUrl || null,
        order: typeof order === 'number' ? order : 0,
        isActive: typeof isActive === 'boolean' ? isActive : true,
      },
    });

    return NextResponse.json({ success: true, banner });
  } catch (err) {
    console.error('[POST /api/banner]', err);
    return NextResponse.json(
      { error: 'Gagal membuat banner' },
      { status: 500 }
    );
  }
}
