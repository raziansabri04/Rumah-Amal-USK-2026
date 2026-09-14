import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const PRIMARY_BUCKET = 'Berita';
const FALLBACK_BUCKETS = ['announcements', 'Galeri', 'Program', 'Kampanye', 'Newsletter', 'Mitra', 'Dokumen', 'StrukturOrganisasi'];



export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Konfigurasi Supabase URL / Key belum diset di .env' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const reqBucket = (formData.get('bucket') as string | null)?.trim();

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diupload.' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const originalArrayBuffer = await file.arrayBuffer();
    const originalBuffer = Buffer.from(originalArrayBuffer);


    const bucketList = reqBucket
      ? [reqBucket, PRIMARY_BUCKET, ...FALLBACK_BUCKETS]
      : [PRIMARY_BUCKET, ...FALLBACK_BUCKETS];
    const uniqueBuckets = Array.from(new Set(bucketList));

    let uploadedBucket = '';
    let uploadErrorMsg = '';

    for (const b of uniqueBuckets) {
      const { error: err } = await supabase.storage
        .from(b)
        .upload(fileName, originalBuffer, {
          contentType: file.type || 'application/octet-stream',
          upsert: false,
        });

      if (!err) {
        uploadedBucket = b;
        break;
      }

      uploadErrorMsg = err.message;
      if (!err.message.toLowerCase().includes('not found')) {
        break;
      }
    }

    if (!uploadedBucket) {
      return NextResponse.json(
        { error: `Gagal upload file ke Supabase Storage: ${uploadErrorMsg}` },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from(uploadedBucket)
      .getPublicUrl(fileName);

    return NextResponse.json({
      url: urlData.publicUrl,
      storagePath: `${uploadedBucket}/${fileName}`,
      originalName: file.name,
      fileType: file.type || 'application/octet-stream',
      size: originalBuffer.byteLength,
    });
  } catch (err) {
    console.error('[Upload API Error]', err);
    return NextResponse.json(
      { error: `Server error: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
