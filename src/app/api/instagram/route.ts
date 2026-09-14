import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache 1 jam

interface InstagramPostItem {
  id: string;
  imageUrl: string;
  caption: string;
  url: string;
}

const DEFAULT_INSTAGRAM_URL = "https://www.instagram.com/rumahamal.usk/";

const STATIC_POSTS: InstagramPostItem[] = [
  {
    id: "ig-1",
    imageUrl: "/instagram/ig1.png",
    caption: "Selamat & Sukses Amal Prestasi",
    url: DEFAULT_INSTAGRAM_URL,
  },
  {
    id: "ig-2",
    imageUrl: "/instagram/ig2.png",
    caption: "Peserta Webinar & Zoom Meeting",
    url: DEFAULT_INSTAGRAM_URL,
  },
  {
    id: "ig-3",
    imageUrl: "/instagram/ig3.png",
    caption: "Sosialisasi Zakat Rumah Amal USK",
    url: DEFAULT_INSTAGRAM_URL,
  },
  {
    id: "ig-4",
    imageUrl: "/instagram/ig4.png",
    caption: "Keutamaan Duduk di Shaf Pertama",
    url: DEFAULT_INSTAGRAM_URL,
  },
  {
    id: "ig-5",
    imageUrl: "/instagram/ig5.png",
    caption: "Mahir Series #36: Drg. Iin Sundari M.Si",
    url: DEFAULT_INSTAGRAM_URL,
  },
  {
    id: "ig-6",
    imageUrl: "/instagram/ig6.png",
    caption: "Coba di Zoom",
    url: DEFAULT_INSTAGRAM_URL,
  },
];

export async function GET() {
  const feedUrl =
    process.env.INSTAGRAM_BEHOLD_URL ||
    process.env.NEXT_PUBLIC_BEHOLD_URL ||
    process.env.INSTAGRAM_FEED_URL;

  if (!feedUrl) {
    return NextResponse.json({
      isDynamic: false,
      posts: STATIC_POSTS,
      message: "Menggunakan data statis. Atur INSTAGRAM_BEHOLD_URL di .env untuk mengaktifkan sinkronisasi otomatis.",
    });
  }

  try {
    const res = await fetch(feedUrl, {
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Feed HTTP Error: ${res.status}`);
    }

    const rawData = await res.json();
    const rawItems = Array.isArray(rawData) ? rawData : rawData.data || rawData.posts || [];

    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      throw new Error("Data feed kosong atau format tidak sesuai");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalizedPosts: InstagramPostItem[] = rawItems.slice(0, 6).map((item: any, index: number) => {
      const imageUrl =
        item.sizes?.medium?.mediaUrl ||
        item.mediaUrl ||
        item.thumbnailUrl ||
        item.media_url ||
        item.imageUrl ||
        `/instagram/ig${(index % 6) + 1}.png`;

      const url =
        item.permalink ||
        item.url ||
        item.link ||
        DEFAULT_INSTAGRAM_URL;

      const caption =
        item.caption ||
        item.title ||
        "Postingan Instagram Rumah Amal USK";

      return {
        id: item.id ? String(item.id) : `ig-dyn-${index}`,
        imageUrl,
        caption,
        url,
      };
    });

    return NextResponse.json({
      isDynamic: true,
      posts: normalizedPosts,
    });
  } catch (error) {
    console.error("[GET /api/instagram] Gagal mengambil feed Instagram dinamis:", error);
    return NextResponse.json({
      isDynamic: false,
      posts: STATIC_POSTS,
      error: error instanceof Error ? error.message : "Gagal mengambil data",
    });
  }
}
