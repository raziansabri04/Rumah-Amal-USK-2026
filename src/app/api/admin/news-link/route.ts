import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isActiveParam = searchParams.get('isActive');

    const where =
      isActiveParam === 'true'
        ? { isActive: true }
        : isActiveParam === 'false'
        ? { isActive: false }
        : {};

    const newsLinks = await prisma.newsLink.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ newsLinks });
  } catch (error) {
    console.error('[GET /api/admin/news-link]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { url, title, image, description, source } = body;

    if (!url || !title?.trim()) {
      return NextResponse.json(
        { error: 'URL dan judul wajib diisi.' },
        { status: 400 }
      );
    }

    // Validasi format URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Format URL tidak valid.' },
        { status: 400 }
      );
    }

    // Cek duplikat
    const existing = await prisma.newsLink.findUnique({ where: { url } });
    if (existing) {
      return NextResponse.json(
        { error: 'Link ini sudah pernah ditambahkan.' },
        { status: 409 }
      );
    }

    const newsLink = await prisma.newsLink.create({
      data: {
        url,
        title: title.trim(),
        image: image || null,
        description: description?.trim() || null,
        source: source || null,
      },
    });

    return NextResponse.json({ success: true, newsLink }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/admin/news-link]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
