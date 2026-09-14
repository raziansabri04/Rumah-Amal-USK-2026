import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import prisma from '@/lib/prisma';

const BUCKET = 'Mitra';

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Konfigurasi Supabase tidak ditemukan. Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY ada di .env.' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;
    const nama = (formData.get('nama') as string | null)?.trim();

    if (!nama) {
      return NextResponse.json({ error: 'Nama mitra wajib diisi.' }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: 'Gambar mitra wajib diupload.' }, { status: 400 });
    }

    const ext = file.name.split('.').pop() ?? 'webp';
    const fileName = `mitra-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Try uploading to 'Mitra' bucket, fallback to 'Galeri' if 'Mitra' bucket doesn't exist
    let targetBucket = BUCKET;
    let { error: uploadError } = await supabase.storage
      .from(targetBucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError && uploadError.message.toLowerCase().includes('not found')) {
      targetBucket = 'Galeri';
      const fallbackResult = await supabase.storage
        .from(targetBucket)
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });
      uploadError = fallbackResult.error;
    }

    if (uploadError) {
      return NextResponse.json({ error: `Gagal upload gambar: ${uploadError.message}` }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from(targetBucket)
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;

    const mitra = await prisma.mitra.create({
      data: {
        nama,
        imageUrl,
      },
    });

    return NextResponse.json({ success: true, mitra });
  } catch (err) {
    console.error('[POST /api/mitra/upload]', err);
    return NextResponse.json(
      { error: `Internal server error: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
