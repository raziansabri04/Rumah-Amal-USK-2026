import { NextRequest, NextResponse } from 'next/server';
import { getLinkPreview } from '@/lib/getLinkPreview';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL wajib diisi.' }, { status: 400 });
    }

    // Validasi format URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Format URL tidak valid. Pastikan dimulai dengan https://' },
        { status: 400 }
      );
    }

    const preview = await getLinkPreview(url);

    if (!preview) {
      return NextResponse.json(
        {
          error:
            'Tidak bisa mengambil preview otomatis. Silakan isi judul & gambar secara manual.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ preview });
  } catch (error) {
    console.error('[POST /api/admin/news-link/preview]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
