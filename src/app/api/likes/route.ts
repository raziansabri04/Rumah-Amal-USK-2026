import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ error: 'Parameter type dan id wajib diisi.' }, { status: 400 });
    }

    let likesCount = 0;
    const cleanId = id.replace(/'/g, "''");

    switch (type) {
      case 'news':
      case 'berita': {
        const rows = await prisma.$queryRawUnsafe<{ likes_count: number }[]>(
          `SELECT COALESCE("likes_count", 0) AS likes_count FROM "news" WHERE "id" = '${cleanId}' OR "slug" = '${cleanId}' LIMIT 1`
        );
        likesCount = rows[0]?.likes_count ?? 0;
        break;
      }
      case 'announcements':
      case 'pengumuman': {
        const rows = await prisma.$queryRawUnsafe<{ likes_count: number }[]>(
          `SELECT COALESCE("likes_count", 0) AS likes_count FROM "announcements" WHERE "id" = '${cleanId}' OR "slug" = '${cleanId}' LIMIT 1`
        );
        likesCount = rows[0]?.likes_count ?? 0;
        break;
      }
      case 'program': {
        const rows = await prisma.$queryRawUnsafe<{ likes_count: number }[]>(
          `SELECT COALESCE("likes_count", 0) AS likes_count FROM "programs" WHERE "id" = '${cleanId}' OR "slug" = '${cleanId}' LIMIT 1`
        );
        likesCount = rows[0]?.likes_count ?? 0;
        break;
      }
      case 'newsletter': {
        const rows = await prisma.$queryRawUnsafe<{ likes_count: number }[]>(
          `SELECT COALESCE("likes_count", 0) AS likes_count FROM "newsletters" WHERE "id" = '${cleanId}' LIMIT 1`
        );
        likesCount = rows[0]?.likes_count ?? 0;
        break;
      }
      case 'kampanye': {
        const rows = await prisma.$queryRawUnsafe<{ likes_count: number }[]>(
          `SELECT COALESCE("likes_count", 0) AS likes_count FROM "kampanyes" WHERE "id" = '${cleanId}' LIMIT 1`
        );
        likesCount = rows[0]?.likes_count ?? 0;
        break;
      }
      case 'gallery':
      case 'galeri': {
        const rows = await prisma.$queryRawUnsafe<{ likes_count: number }[]>(
          `SELECT COALESCE("likes_count", 0) AS likes_count FROM "galleries" WHERE "id" = '${cleanId}' LIMIT 1`
        );
        likesCount = rows[0]?.likes_count ?? 0;
        break;
      }
      default:
        return NextResponse.json({ error: 'Tipe konten tidak dikenal.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, likesCount: Number(likesCount) || 0 });
  } catch (error) {
    console.error('[GET /api/likes]', error);
    return NextResponse.json(
      { error: `Gagal mengambil jumlah likes: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, id, action } = body; // action: 'like' | 'unlike'

    if (!type || !id) {
      return NextResponse.json({ error: 'Parameter type dan id wajib diisi.' }, { status: 400 });
    }

    const isLike = action !== 'unlike';
    const delta = isLike ? 1 : -1;
    let updatedLikesCount = 0;
    const cleanId = String(id).replace(/'/g, "''");

    switch (type) {
      case 'news':
      case 'berita': {
        const rows = await prisma.$queryRawUnsafe<{ likes_count: number }[]>(
          `UPDATE "news" SET "likes_count" = GREATEST(0, COALESCE("likes_count", 0) + ${delta}) WHERE "id" = '${cleanId}' OR "slug" = '${cleanId}' RETURNING "likes_count"`
        );
        if (!rows || rows.length === 0) {
          return NextResponse.json({ error: 'Konten berita tidak ditemukan' }, { status: 404 });
        }
        updatedLikesCount = rows[0]?.likes_count ?? 0;
        break;
      }

      case 'announcements':
      case 'pengumuman': {
        const rows = await prisma.$queryRawUnsafe<{ likes_count: number }[]>(
          `UPDATE "announcements" SET "likes_count" = GREATEST(0, COALESCE("likes_count", 0) + ${delta}) WHERE "id" = '${cleanId}' OR "slug" = '${cleanId}' RETURNING "likes_count"`
        );
        if (!rows || rows.length === 0) {
          return NextResponse.json({ error: 'Konten pengumuman tidak ditemukan' }, { status: 404 });
        }
        updatedLikesCount = rows[0]?.likes_count ?? 0;
        break;
      }

      case 'program': {
        const rows = await prisma.$queryRawUnsafe<{ likes_count: number }[]>(
          `UPDATE "programs" SET "likes_count" = GREATEST(0, COALESCE("likes_count", 0) + ${delta}) WHERE "id" = '${cleanId}' OR "slug" = '${cleanId}' RETURNING "likes_count"`
        );
        if (!rows || rows.length === 0) {
          return NextResponse.json({ error: 'Konten program tidak ditemukan' }, { status: 404 });
        }
        updatedLikesCount = rows[0]?.likes_count ?? 0;
        break;
      }

      case 'newsletter': {
        const rows = await prisma.$queryRawUnsafe<{ likes_count: number }[]>(
          `UPDATE "newsletters" SET "likes_count" = GREATEST(0, COALESCE("likes_count", 0) + ${delta}) WHERE "id" = '${cleanId}' RETURNING "likes_count"`
        );
        if (!rows || rows.length === 0) {
          return NextResponse.json({ error: 'Konten newsletter tidak ditemukan' }, { status: 404 });
        }
        updatedLikesCount = rows[0]?.likes_count ?? 0;
        break;
      }

      case 'kampanye': {
        const rows = await prisma.$queryRawUnsafe<{ likes_count: number }[]>(
          `UPDATE "kampanyes" SET "likes_count" = GREATEST(0, COALESCE("likes_count", 0) + ${delta}) WHERE "id" = '${cleanId}' RETURNING "likes_count"`
        );
        if (!rows || rows.length === 0) {
          return NextResponse.json({ error: 'Konten kampanye tidak ditemukan' }, { status: 404 });
        }
        updatedLikesCount = rows[0]?.likes_count ?? 0;
        break;
      }

      case 'gallery':
      case 'galeri': {
        const rows = await prisma.$queryRawUnsafe<{ likes_count: number }[]>(
          `UPDATE "galleries" SET "likes_count" = GREATEST(0, COALESCE("likes_count", 0) + ${delta}) WHERE "id" = '${cleanId}' RETURNING "likes_count"`
        );
        if (!rows || rows.length === 0) {
          return NextResponse.json({ error: 'Foto galeri tidak ditemukan' }, { status: 404 });
        }
        updatedLikesCount = rows[0]?.likes_count ?? 0;
        break;
      }

      default:
        return NextResponse.json({ error: 'Tipe konten tidak valid.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, likesCount: Number(updatedLikesCount) || 0 });
  } catch (error) {
    console.error('[POST /api/likes]', error);
    return NextResponse.json(
      { error: `Gagal memperbarui likes: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
