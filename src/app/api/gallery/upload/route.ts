import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import prisma from '@/lib/prisma';

const BUCKET = 'Galeri';

export async function POST(req: NextRequest) {
  // Inisialisasi di dalam handler agar env vars sudah tersedia
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
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Tidak ada file.' }, { status: 400 });
    }

    const results: { imageUrl: string }[] = [];
    const errors: string[] = [];

    for (const file of files) {
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
        errors.push(`${file.name}: ${uploadError.message}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;

      await prisma.gallery.create({
        data: { imageUrl },
      });

      results.push({ imageUrl });
    }

    return NextResponse.json({ uploaded: results, errors });
  } catch (err) {
    console.error('[gallery/upload]', err);
    return NextResponse.json(
      { error: `Internal server error: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
