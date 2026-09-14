import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import prisma, { getPrismaInstance } from '@/lib/prisma';


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
    const titleParam = (formData.get('title') as string | null)?.trim();
    const title = titleParam && titleParam.length > 0 ? titleParam : 'Banner Hero';
    const titleAr = (formData.get('titleAr') as string | null)?.trim() || null;
    const titleEn = (formData.get('titleEn') as string | null)?.trim() || null;
    const linkUrl = (formData.get('linkUrl') as string | null)?.trim() || null;
    const orderStr = formData.get('order') as string | null;
    const isActiveStr = formData.get('isActive') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'Gambar banner wajib diunggah.' }, { status: 400 });
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
      // If error is not 'bucket not found', stop trying
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

    const imageUrl = urlData.publicUrl;

    const client = (prisma.banner ? prisma : getPrismaInstance()) as any;
    if (!client.banner) {
      return NextResponse.json({ error: 'Prisma Client Banner belum diinisialisasi. Silakan simpan ulang file atau restart server.' }, { status: 500 });
    }

    const banner = await client.banner.create({
      data: {
        title,
        titleAr,
        titleEn,
        imageUrl,
        linkUrl,
        order: orderStr ? parseInt(orderStr, 10) || 0 : 0,
        isActive: isActiveStr !== 'false',
      },
    });

    return NextResponse.json({ success: true, banner });
  } catch (err) {
    console.error('[POST /api/banner/upload]', err);
    return NextResponse.json(
      { error: `Internal server error: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
