'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { beritaDictionary, BeritaLanguage } from '@/lib/i18n/berita';

interface NewsItem {
  id: string;
  title: string;
  titleAr?: string | null;
  titleEn?: string | null;
  slug: string;
  category: string | null;
  coverImageUrl: string | null;
  publishedAt: string;
  createdAt: string;
}

export default function PublicNewsListPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lang, setLang] = useState<BeritaLanguage>('id');
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const readLang = () => {
      const savedLang = (localStorage.getItem('app_lang') ||
        localStorage.getItem('announcement_lang')) as BeritaLanguage;
      if (savedLang && ['id', 'en', 'ar'].includes(savedLang)) {
        setLang(savedLang);
      }
    };
    readLang();
    window.addEventListener('languageChange', readLang);
    return () => window.removeEventListener('languageChange', readLang);
  }, []);

  // ── Core fetch: calls server with page + optional search ─────────────
  const fetchPage = useCallback(async (p: number, query: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(p),
        limit: String(ITEMS_PER_PAGE),
      });
      if (query.trim()) params.set('search', query.trim());

      const res = await fetch(`/api/news?${params}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.news || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPage(1, '');
  }, [fetchPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery;
    setActiveQuery(q);
    setPage(1);
    fetchPage(1, q);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      fetchPage(newPage, activeQuery);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const localeMap = { id: 'id-ID', en: 'en-US', ar: 'ar-SA' };
      return d.toLocaleDateString(localeMap[lang] || 'id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const labels = beritaDictionary[lang] || beritaDictionary.id;

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1340px] mx-auto">
        {/* Header Section: Title & Search Bar Inline */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 mt-1 pb-4 border-b border-gray-100">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold text-[#374151] tracking-tight uppercase ${lang === 'ar' ? 'font-serif text-right' : ''}`}>
              {labels.pageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              {lang === 'ar' ? 'أحدث الأخبار والمستجدات الرسمية' : lang === 'en' ? 'Latest news and official updates' : 'Kabar dan berita kegiatan terkini Rumah Amal USK'}
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="w-full md:w-80 lg:w-96 flex gap-2 shrink-0">
            <input
              type="text"
              placeholder={labels.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3.5 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 font-medium focus:outline-none focus:border-[#0b6330] focus:ring-1 focus:ring-[#0b6330] transition-colors shadow-2xs"
            />
            <button
              type="submit"
              className="bg-[#0b6330] hover:bg-[#074722] text-white font-bold text-sm px-5 py-2 rounded-lg transition-colors shadow-2xs cursor-pointer shrink-0"
            >
              {labels.searchBtn}
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 animate-pulse mb-12">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden flex flex-col"
              >
                <div className="bg-gray-200 aspect-[16/9] w-full"></div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="bg-gray-200 h-5 w-24 rounded-md mb-3"></div>
                  <div className="bg-gray-200 h-5 w-3/4 rounded-sm mb-3"></div>
                  <div className="bg-gray-200 h-4 w-1/2 rounded-sm mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200 mb-12">
            <p className="text-lg font-semibold mb-2">{labels.notFoundTitle}</p>
            <p className="text-sm text-gray-400">
              {activeQuery ? `"${activeQuery}"` : labels.notFoundText}
            </p>
          </div>
        ) : (
          /* News Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-12">
            {items.map((item) => {
              const displayTitle =
                lang === 'en' && item.titleEn ? item.titleEn
                  : lang === 'ar' && item.titleAr ? item.titleAr
                    : item.title;
              return (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
                >
                  {/* Cover Image */}
                  <div className="relative aspect-[16/9] w-full bg-gray-50 overflow-hidden">
                    {item.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.coverImageUrl}
                        alt={displayTitle}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full relative bg-gradient-to-br from-[#064e26] via-[#0b6330] to-[#043319] overflow-hidden flex items-center justify-center p-6">
                        <div className="absolute -right-8 -top-8 w-36 h-36 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />
                        <div className="absolute -left-8 -bottom-8 w-36 h-36 bg-[#ffc800]/15 rounded-full blur-xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center justify-center text-center group-hover:scale-105 transition-transform duration-300">
                          <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-white/40 flex items-center justify-center mb-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/logo/rumah-amal.png"
                              alt="Rumah Amal USK"
                              className="h-7 sm:h-8 w-auto object-contain"
                            />
                          </div>
                          <span className="text-[10px] font-extrabold text-[#ffc800] tracking-widest uppercase mt-0.5 drop-shadow-2xs">
                            {labels.officialBadge}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Body Content Card */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="mb-3">
                      <span className="inline-block bg-[#ffc800] text-[#111827] text-[11px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider shadow-2xs">
                        {labels.badge}
                      </span>
                    </div>

                    <div className="flex flex-col justify-between flex-1">
                      <h3
                        className={`font-bold text-[#112b27] text-sm sm:text-base leading-tight mb-3 line-clamp-4 group-hover:text-[#0b6330] transition-colors ${lang === 'ar' ? 'font-serif text-right' : ''
                          }`}
                      >
                        {displayTitle}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mt-auto">
                        {formatDate(item.publishedAt || item.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
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
              {labels.prev}
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
                    <span
                      key={`dots-${idx}`}
                      className="w-8 h-9 flex items-center justify-center text-gray-400 font-semibold select-none"
                    >
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
              {labels.next}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
