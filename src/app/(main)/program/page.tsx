'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  CATEGORIES_RAW,
  CATEGORIES_TRANSLATED,
  programDictionary,
  ProgramLanguage,
} from '@/lib/i18n/program';

interface ProgramItem {
  id: string;
  title: string;
  titleAr?: string | null;
  titleEn?: string | null;
  slug: string;
  category: string;
  excerpt: string | null;
  excerptAr?: string | null;
  excerptEn?: string | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
}

export default function PublicProgramPage() {
  const [items, setItems] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('SEMUA');
  const [page, setPage] = useState(1);
  const [lang, setLang] = useState<ProgramLanguage>('id');
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const savedLang = (localStorage.getItem('app_lang') ||
      localStorage.getItem('program_lang')) as ProgramLanguage;
    if (savedLang && ['id', 'en', 'ar'].includes(savedLang)) {
      setLang(savedLang);
    }
  }, []);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const url =
        selectedCategory !== 'SEMUA'
          ? `/api/program?category=${encodeURIComponent(selectedCategory)}`
          : '/api/program';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setItems(data.programs || []);
      }
    } catch (err) {
      console.error('Error fetching programs:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchPrograms();
    setPage(1);
  }, [fetchPrograms]);

  const filteredItems = items;

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = filteredItems.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getItemTitle = (item: ProgramItem) => {
    if (lang === 'en' && item.titleEn) return item.titleEn;
    if (lang === 'ar' && item.titleAr) return item.titleAr;
    return item.title;
  };

  const t = programDictionary[lang] || programDictionary.id;

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1340px] mx-auto">
        {/* Header Section: Title & Category Filter Inline */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 mt-1 pb-4 border-b border-gray-100">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight uppercase ${lang === 'ar' ? 'font-serif text-right' : ''}`}>
              {t.pageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              {lang === 'ar' ? 'برامج ومبادرات الخير' : lang === 'en' ? 'Programs and community initiatives' : 'Program pemberdayaan dan pilar kebaikan Rumah Amal USK'}
            </p>
          </div>

          {/* Filter Kategori Dropdown */}
          <div className="w-full md:w-72 shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2 border border-[#0b6330] rounded-lg text-sm text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#0b6330] bg-white cursor-pointer tracking-wider uppercase shadow-2xs"
            >
              {CATEGORIES_RAW.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORIES_TRANSLATED[lang]?.[cat] || cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 animate-pulse mb-12">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden flex flex-col"
              >
                <div className="bg-gray-200 aspect-[16/10] w-full"></div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="bg-gray-200 h-5 w-24 rounded-md mb-3"></div>
                  <div className="bg-gray-200 h-5 w-3/4 rounded-sm mb-3"></div>
                  <div className="bg-gray-200 h-4 w-1/2 rounded-sm mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : paginatedItems.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200 mb-12">
            <p className="text-lg font-semibold mb-2">{t.notFoundTitle}</p>
            <p className="text-sm text-gray-400">
              {selectedCategory !== 'SEMUA'
                ? `${t.notFoundCategory} "${CATEGORIES_TRANSLATED[lang]?.[selectedCategory] || selectedCategory
                }".`
                : t.notFoundEmpty}
            </p>
          </div>
        ) : (
          /* Program Cards Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 mb-12">
            {paginatedItems.map((item) => {
              if (!item.coverImageUrl) return null;
              const displayTitle = getItemTitle(item);
              return (
                <Link
                  key={item.id}
                  href={`/program/${item.slug}`}
                  className="group relative rounded-[24px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gray-50 aspect-square flex flex-col justify-center items-center border border-gray-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.coverImageUrl}
                    alt={displayTitle}
                    className="w-full h-full object-cover rounded-[24px] group-hover:scale-103 transition-transform duration-300"
                    loading="lazy"
                  />
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-8 text-sm font-bold mb-8 flex-wrap">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 text-[#0b6330] hover:text-[#084823] disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {t.prev}
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
              {t.next}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
