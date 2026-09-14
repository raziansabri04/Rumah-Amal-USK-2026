import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Fetch comments for an announcement
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const announcementId = resolvedParams.id;

    if (!announcementId) {
      return NextResponse.json({ error: 'ID pengumuman tidak valid' }, { status: 400 });
    }

    const comments = await prisma.announcementComment.findMany({
      where: {
        announcementId,
        parentId: null,
        isApproved: true,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        replies: {
          where: { isApproved: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('[GET /api/announcements/[id]/comments]', error);
    return NextResponse.json(
      { error: `Gagal mengambil komentar: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

// POST: Add a new comment or reply
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const announcementId = resolvedParams.id;

    if (!announcementId) {
      return NextResponse.json({ error: 'ID pengumuman tidak valid' }, { status: 400 });
    }

    const body = await req.json();
    const { name, content, parentId } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Komentar tidak boleh kosong' },
        { status: 400 }
      );
    }

    // Pastikan pengumuman ada
    const announcement = await prisma.announcement.findUnique({
      where: { id: announcementId },
    });

    if (!announcement) {
      return NextResponse.json(
        { error: 'Pengumuman tidak ditemukan' },
        { status: 404 }
      );
    }

    // Buat komentar baru
    const newComment = await prisma.announcementComment.create({
      data: {
        announcementId,
        name: name?.trim() || 'Anonim',
        content: content.trim(),
        parentId: parentId || null,
      },
    });

    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    console.error('[POST /api/announcements/[id]/comments]', error);
    return NextResponse.json(
      { error: `Gagal mengirim komentar: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
