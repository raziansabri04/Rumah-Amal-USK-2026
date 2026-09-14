import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { autoTranslateAll } from '@/lib/translate';

export const dynamic = 'force-dynamic';

const DEFAULT_COVER = '/cover/Cover Doc RA.jpeg';

/**
 * POST /api/documents/upload
 * Menerima JSON body dengan judul, pdfUrl, judulEn, judulAr.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { judul?: string; judulEn?: string; judulAr?: string; pdfUrl?: string; coverUrl?: string; createdAt?: string };
    const judul = body.judul?.trim();
    let judulEn = body.judulEn?.trim();
    let judulAr = body.judulAr?.trim();
    const pdfUrl = body.pdfUrl?.trim();
    const coverUrl = body.coverUrl?.trim() || DEFAULT_COVER;
    const customCreatedAt = body.createdAt;

    if (!judul) {
      return NextResponse.json({ error: 'Judul dokumen wajib diisi.' }, { status: 400 });
    }
    if (!pdfUrl) {
      return NextResponse.json({ error: 'Link Google Drive wajib diisi.' }, { status: 400 });
    }

    if (!judulEn || !judulAr) {
      try {
        const translated = await autoTranslateAll({ title: judul });
        if (!judulEn) judulEn = translated.titleEn;
        if (!judulAr) judulAr = translated.titleAr;
      } catch (err) {
        console.error('Auto translate document error:', err);
      }
    }

    const createdAtDate = customCreatedAt ? new Date(customCreatedAt) : new Date();

    const document = await prisma.document.create({
      data: {
        judul,
        judulEn: judulEn || null,
        judulAr: judulAr || null,
        imageUrl: coverUrl,
        pdfUrl,
        fileSize: null,
        createdAt: isNaN(createdAtDate.getTime()) ? new Date() : createdAtDate,
      },
    });

    console.log(`[Drive Link] Dokumen "${judul}" disimpan dengan link Drive.`);

    return NextResponse.json({ success: true, document });
  } catch (err) {
    console.error('[POST /api/documents/upload]', err);
    return NextResponse.json(
      { error: `Internal server error: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
