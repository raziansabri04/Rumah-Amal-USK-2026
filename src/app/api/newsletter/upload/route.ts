import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import prisma from '@/lib/prisma';
import { autoTranslateAll } from '@/lib/translate';

const BUCKET = 'Newsletter';

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Konfigurasi Supabase tidak ditemukan.' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;
    const judul = formData.get('judul') as string | null;
    const tanggal = formData.get('tanggal') as string | null;

    if (!file || !judul || !tanggal) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi: image, judul, tanggal.' },
        { status: 400 }
      );
    }

    let judulEn: string | null = null;
    let judulAr: string | null = null;
    try {
      const translated = await autoTranslateAll({ title: judul });
      judulEn = translated.titleEn;
      judulAr = translated.titleAr;
    } catch (err) {
      console.error('Auto translate newsletter error:', err);
    }

    const ext = file.name.split('.').pop() ?? 'webp';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: `Upload gagal: ${uploadError.message}` }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

    const newsletter = await prisma.newsletter.create({
      data: {
        judul,
        judulEn,
        judulAr,
        imageUrl: urlData.publicUrl,
        tanggal: new Date(tanggal),
      },
    });

    return NextResponse.json({ success: true, newsletter });
  } catch (err) {
    console.error('[newsletter/upload]', err);
    return NextResponse.json(
      { error: `Internal server error: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
