'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ShareAndLikeBar from '@/components/ShareAndLikeBar';

interface NewsletterItem {
  id: string;
  judul: string;
  imageUrl: string;
  tanggal: string;
  likesCount?: number;
  createdAt: string;
}

export default function NewsletterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [newsletter, setNewsletter] = useState<NewsletterItem | null>(null);
  const [recentList, setRecentList] = useState<NewsletterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      try {
        const res = await fetch(`/api/newsletter/${id}`);
        if (res.ok) {
          const data = await res.json();
          setNewsletter(data.newsletter);
          setRecentList(data.recent || []);
        } else {
          setNewsletter(null);
        }
      } catch (err) {
        console.error('Error loading newsletter detail:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  const handleSidebarSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/newsletter?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9fafb] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1340px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 h-[600px]"></div>
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 h-40"></div>
            <div className="bg-white rounded-2xl p-6 h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!newsletter) {
    return (
      <div className="min-h-screen bg-white py-16 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Newsletter Tidak Ditemukan</h1>
        <p className="text-gray-500 mb-6">Halaman newsletter yang Anda cari tidak tersedia atau telah dihapus.</p>
        <Link
          href="/newsletter"
          className="inline-block bg-[#0b6330] text-white font-bold px-6 py-2.5 rounded-lg hover:bg-[#084823] transition-colors"
        >
          ← Kembali ke Newsletter
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1340px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Kolom Kiri: Detail Newsletter Utama */}
          <main className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-2xs p-6 sm:p-8">
            {/* Judul Utama */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-6 uppercase leading-tight">
              NEWSLETTER: {newsletter.judul}
            </h1>

            {/* Gambar Cover Utama */}
            <div className="w-full bg-gray-50 rounded-xl overflow-hidden mb-6 border border-gray-100 shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={newsletter.imageUrl}
                alt={`Newsletter ${newsletter.judul}`}
                className="w-full h-auto object-contain max-h-[1100px]"
              />
            </div>

            {/* Tanggal Terbit */}
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-6">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
              </svg>
              <span>{formatDate(newsletter.tanggal)}</span>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Share & Like Section */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
              <ShareAndLikeBar
                contentType="newsletter"
                contentId={newsletter.id}
                title={`NEWSLETTER: ${newsletter.judul}`}
                initialLikesCount={newsletter.likesCount || 0}
                lang="id"
              />
            </div>
          </main>

          {/* Kolom Kanan: Sidebar (Pencarian & Newsletter Terkini) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Box Pencarian */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-6">
              <h2 className="font-extrabold text-gray-900 text-lg mb-4">Pencarian</h2>
              <form onSubmit={handleSidebarSearch} className="flex">
                <input
                  type="text"
                  placeholder="Cari newsletter berdasarkan judul..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 border border-r-0 border-gray-300 rounded-l-xl text-sm focus:outline-none focus:border-[#0b6330]"
                />
                <button
                  type="submit"
                  className="bg-[#ffc800] hover:bg-[#e8b500] text-gray-900 px-4 rounded-r-xl font-bold flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Cari"
                >
                  <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" strokeWidth={2.5} />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth={2.5} />
                  </svg>
                </button>
              </form>
            </div>

            {/* Box Newsletter Terkini */}
            {recentList.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-6">
                <h2 className="font-extrabold text-gray-900 text-lg mb-5">Newsletter Terkini</h2>
                <div className="flex flex-col gap-4">
                  {recentList.map((item) => (
                    <Link
                      key={item.id}
                      href={`/newsletter/${item.id}`}
                      className="group flex gap-3.5 items-center p-1 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      {/* Thumbnail Cover */}
                      <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl}
                          alt={item.judul}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>

                      {/* Info Text */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-[#0b6330] transition-colors leading-snug line-clamp-2 mb-1">
                          Newsletter: {item.judul}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                            <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                            <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                            <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                          </svg>
                          <span>{formatDate(item.tanggal)}</span>
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>

        </div>
      </div>
    </div>
  );
}
