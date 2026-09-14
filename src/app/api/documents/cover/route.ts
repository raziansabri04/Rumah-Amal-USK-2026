import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import prisma from '@/lib/prisma';

const BUCKET_COVER = 'dokumen-covers';
const FALLBACK_BUCKET = 'Dokumen';
const SECONDARY_FALLBACK = 'Galeri';

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
    const coverFile = formData.get('image') as File | null;

    if (!coverFile) {
      return NextResponse.json({ error: 'File gambar cover wajib diupload.' }, { status: 400 });
    }

    const ext = coverFile.name.split('.').pop() ?? 'webp';
    const fileName = `global-cover-${Date.now()}.${ext}`;
    const arrayBuffer = await coverFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let targetBucket = BUCKET_COVER;
    let { error: uploadError } = await supabase.storage
      .from(targetBucket)
      .upload(fileName, buffer, {
        contentType: coverFile.type,
        upsert: false,
      });

    if (uploadError && uploadError.message.toLowerCase().includes('not found')) {
      targetBucket = FALLBACK_BUCKET;
      const fallbackRes = await supabase.storage
        .from(targetBucket)
        .upload(fileName, buffer, {
          contentType: coverFile.type,
          upsert: false,
        });
      uploadError = fallbackRes.error;
    }

    if (uploadError && uploadError.message.toLowerCase().includes('not found')) {
      targetBucket = SECONDARY_FALLBACK;
      const secondaryRes = await supabase.storage
        .from(targetBucket)
        .upload(fileName, buffer, {
          contentType: coverFile.type,
          upsert: false,
        });
      uploadError = secondaryRes.error;
    }

    if (uploadError) {
      return NextResponse.json(
        { error: `Gagal upload cover ke storage: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage.from(targetBucket).getPublicUrl(fileName);
    const newCoverUrl = urlData.publicUrl;

    // Update ALL documents in database to use this new cover image!
    const result = await prisma.document.updateMany({
      data: {
        imageUrl: newCoverUrl,
      },
    });

    return NextResponse.json({
      success: true,
      coverUrl: newCoverUrl,
      updatedCount: result.count,
    });
  } catch (err) {
    console.error('[POST /api/documents/cover]', err);
    return NextResponse.json(
      { error: `Internal server error: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
