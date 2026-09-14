'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { newsletterDictionary, NewsletterLanguage } from '@/lib/i18n/newsletter';

interface NewsletterItem {
  id: string;
  judul: string;
  judulAr?: string | null;
  judulEn?: string | null;
  imageUrl: string;
  tanggal: string;
  createdAt: string;
}

export default function NewsletterPage() {
  const [lang, setLang] = useState<NewsletterLanguage>('id');
  const [items, setItems] = useState<NewsletterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const readLang = () => {
      const saved = (localStorage.getItem('app_lang') || localStorage.getItem('newsletter_lang') || localStorage.getItem('program_lang')) as NewsletterLanguage;
      if (saved && ['id', 'en', 'ar'].includes(saved)) {
        setLang(saved);
      }
    };
    readLang();
    window.addEventListener('languageChange', readLang);
    return () => window.removeEventListener('languageChange', readLang);
  }, []);

  const dict = newsletterDictionary[lang] || newsletterDictionary.id;

  const fetchNewsletters = useCallback(async (p: number, q: string) => {
    setLoading(true);
    try {
      const cleanQ = q.trim().toLowerCase() === 'newsletter' ? '' : q.trim();
      const res = await fetch(`/api/newsletter?page=${p}&limit=${ITEMS_PER_PAGE}&q=${encodeURIComponent(cleanQ)}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching newsletter:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewsletters(page, activeQuery);
  }, [page, activeQuery, fetchNewsletters]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setActiveQuery(searchQuery);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const locale = lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'id-ID';
      return d.toLocaleDateString(locale, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1340px] mx-auto">

        {/* Header Section: Title & Search Bar Inline */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 mt-1 pb-4 border-b border-gray-100">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold text-[#2d3238] tracking-tight uppercase ${lang === 'ar' ? 'font-serif text-right' : ''}`}>
              {dict.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              {lang === 'ar' ? 'النشرات الإخبارية والتقارير الدورية' : lang === 'en' ? 'Newsletters and periodic reports' : 'Buletin berkala dan warta informasi Rumah Amal USK'}
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="w-full md:w-80 lg:w-96 flex gap-2 shrink-0">
            <input
              type="text"
              placeholder={dict.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3.5 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 font-medium focus:outline-none focus:border-[#0b6330] focus:ring-1 focus:ring-[#0b6330] transition-colors shadow-2xs"
            />
            <button
              type="submit"
              className="bg-[#0b6330] hover:bg-[#074722] text-white font-bold text-sm px-5 py-2 rounded-lg transition-colors shadow-2xs cursor-pointer shrink-0"
            >
              {dict.searchBtn}
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse mb-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl p-4 border border-gray-100">
                <div className="bg-gray-200 rounded-xl aspect-[3/4] w-full mb-4"></div>
                <div className="bg-gray-200 h-5 w-3/4 rounded-sm mb-3"></div>
                <div className="bg-gray-200 h-4 w-1/2 rounded-sm"></div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200 mb-12">
            <p className="text-lg font-semibold mb-2">{dict.emptyTitle}</p>
            <p className="text-sm text-gray-400">
              {activeQuery ? `${dict.noResultFor} "${activeQuery}"` : dict.emptyDesc}
            </p>
          </div>
        ) : (
          /* Newsletter Grid (3 Kolom lanskap sejajar Pengumuman/Berita) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-12">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/newsletter/${item.id}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
              >
                {/* Cover Image Container */}
                <div className="relative aspect-[16/9] w-full bg-gray-50 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={`Newsletter ${item.judul}`}
                    className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-xs transition-opacity duration-300">
                      {dict.readBadge}
                    </span>
                  </div>
                </div>

                {/* Info Text */}
                <div className="p-4.5 sm:p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-[#112b27] text-base tracking-tight mb-2.5 uppercase leading-snug line-clamp-2">
                    {dict.prefixTitle}{(lang === 'en' ? item.judulEn : lang === 'ar' ? item.judulAr : item.judul) || item.judul}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-auto">
                    {formatDate(item.tanggal)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-8 text-sm font-bold flex-wrap">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 text-[#0b6330] hover:text-[#084823] disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {dict.prevBtn}
            </button>

            {(() => {
              const pages: (number | string)[] = [];
              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                pages.push(1);
                if (page > 3) pages.push('...1');
                const start = Math.max(2, page - 1);
                const end = Math.min(totalPages - 1, page + 1);
                for (let i = start; i <= end; i++) pages.push(i);
                if (page < totalPages - 2) pages.push('...2');
                pages.push(totalPages);
              }

              return pages.map((p, idx) => {
                if (typeof p === 'string') {
                  return (
                    <span key={`dots-${idx}`} className="w-8 h-9 flex items-center justify-center text-gray-400 font-semibold select-none">
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${p === page
                        ? 'bg-[#ffc800] text-[#1a1a1a] font-extrabold shadow-2xs'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-[#0b6330]'
                      }`}
                  >
                    {p}
                  </button>
                );
              });
            })()}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-[#0b6330] hover:text-[#084823] disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {dict.nextBtn}
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl p-3 sm:p-4 max-w-3xl max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 bg-white text-gray-700 hover:text-black w-8 h-8 rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-sm font-bold transition-all hover:scale-110 z-20 cursor-pointer"
              aria-label={dict.closeModal}
            >
              ✕
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt="Newsletter Fullsize"
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

