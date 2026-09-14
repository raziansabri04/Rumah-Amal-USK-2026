import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/banner/image-only
 * Upload gambar ke bucket Supabase tanpa membuat record database.
 * Digunakan saat mengganti gambar banner yang sudah ada (edit in-place).
 */
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

    if (!file) {
      return NextResponse.json({ error: 'Gambar wajib diunggah.' }, { status: 400 });
    }

    // Validasi MIME type di sisi server
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Format file tidak didukung: ${file.type || 'tidak diketahui'}. Gunakan JPG, PNG, WEBP, atau GIF.` },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop() ?? 'webp';
    const fileName = `banner-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const candidateBuckets = ['BANNER', 'banner', 'Banner', 'Galeri'];
    let targetBucket = candidateBuckets[0];
    let uploadError: any = null;

    for (const b of candidateBuckets) {
      const res = await supabase.storage.from(b).upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

      if (!res.error) {
        targetBucket = b;
        uploadError = null;
        break;
      }

      uploadError = res.error;
      if (!res.error.message.toLowerCase().includes('not found')) {
        break;
      }
    }

    if (uploadError) {
      return NextResponse.json({ error: `Gagal upload gambar: ${uploadError.message}` }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from(targetBucket)
      .getPublicUrl(fileName);

    return NextResponse.json({ success: true, imageUrl: urlData.publicUrl });
  } catch (err) {
    console.error('[POST /api/banner/image-only]', err);
    return NextResponse.json(
      { error: `Internal server error: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
