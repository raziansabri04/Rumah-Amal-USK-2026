'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { dokumenDictionary, DokumenLanguage } from '@/lib/i18n/dokumen';

interface DocumentItem {
  id: string;
  judul: string;
  judulEn?: string | null;
  judulAr?: string | null;
  imageUrl: string;
  pdfUrl: string;
  fileSize: number | null;
  downloadCount: number;
  createdAt: string;
}

export default function DokumenPage() {
  const [lang, setLang] = useState<DokumenLanguage>('id');
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Track download counts yang diupdate secara lokal (optimistic update)
  const [localDownloadCounts, setLocalDownloadCounts] = useState<Record<string, number>>({});

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const readLang = () => {
      const saved = (localStorage.getItem('app_lang') || localStorage.getItem('dokumen_lang') || localStorage.getItem('program_lang')) as DokumenLanguage;
      if (saved && ['id', 'en', 'ar'].includes(saved)) {
        setLang(saved);
      }
    };
    readLang();
    window.addEventListener('languageChange', readLang);
    return () => window.removeEventListener('languageChange', readLang);
  }, []);

  const dict = dokumenDictionary[lang] || dokumenDictionary.id;

  const fetchDocuments = useCallback(async (p: number, q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/documents?page=${p}&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(q.trim())}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.documents || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments(page, activeQuery);
  }, [page, activeQuery, fetchDocuments]);

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

  const handleDownload = async (item: DocumentItem) => {
    // Optimistic update: langsung tambah count di UI
    setLocalDownloadCounts((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] ?? item.downloadCount) + 1,
    }));

    // Buka PDF di tab baru
    window.open(item.pdfUrl, '_blank', 'noopener,noreferrer');

    // Kirim tracking ke API (fire-and-forget, tidak perlu await)
    fetch(`/api/documents/${item.id}/download`, { method: 'POST' }).catch(() => {
      // Jika tracking gagal, kembalikan count lokal
      setLocalDownloadCounts((prev) => ({
        ...prev,
        [item.id]: item.downloadCount,
      }));
    });
  };

  const changeLanguage = (newLang: DokumenLanguage) => {
    setLang(newLang);
    localStorage.setItem('dokumen_lang', newLang);
    localStorage.setItem('app_lang', newLang);
    window.dispatchEvent(new Event('languageChange'));
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1340px] mx-auto">

        {/* Header Section: Title & Search Bar Inline */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 mt-1 pb-4 border-b border-gray-100">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold text-[#2d3238] tracking-tight uppercase ${lang === 'ar' ? 'font-serif text-right' : ''}`}>
              {dict.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              {lang === 'ar' ? 'الوثائق الرسمية والتقارير المالية' : lang === 'en' ? 'Official documents and financial reports' : 'Dokumen publikasi dan laporan transparansi Rumah Amal USK'}
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
          /* Documents Grid (3 Kolom lanskap) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-12">
            {items.map((item) => {
              const displayDownloadCount = localDownloadCounts[item.id] ?? item.downloadCount;
              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Cover Image — klik untuk unduh/buka PDF */}
                  <div
                    className="relative aspect-[16/9] w-full bg-gray-50 cursor-pointer overflow-hidden"
                    onClick={() => handleDownload(item)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl || '/cover/Cover Doc RA.jpeg'}
                      alt={`Cover ${item.judul}`}
                      className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-300"
                      loading="lazy"
                    />
                    {/* Overlay hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-xs transition-opacity duration-300">
                        {dict.downloadBtn}
                      </span>
                    </div>
                  </div>

                  {/* Info & Download Button */}
                  <div className="flex flex-col flex-1 p-4 gap-3">
                    {/* Judul */}
                    <h3 className="font-extrabold text-[#111827] text-[0.95rem] tracking-tight leading-snug text-center line-clamp-3 uppercase">
                      {(lang === 'en' ? item.judulEn : lang === 'ar' ? item.judulAr : item.judul) || item.judul}
                    </h3>

                    {/* Meta info */}
                    <div className="flex flex-col gap-1 mt-auto">
                      {item.fileSize != null && (
                        <p className="text-xs text-gray-500 font-medium">
                          <span className="font-semibold text-gray-600">{dict.sizeLabel}</span>{' '}
                          {item.fileSize >= 1
                            ? `${item.fileSize} MB`
                            : `${(item.fileSize * 1024).toFixed(0)} KB`}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 font-medium">
                        <span className="font-semibold text-gray-600">{dict.downloadedLabel}</span>{' '}
                        {displayDownloadCount.toLocaleString(lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'id-ID')}
                      </p>
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(item)}
                      className="mt-1 w-full inline-flex items-center justify-center gap-2 bg-[#0b6330] hover:bg-[#084823] active:scale-[0.98] text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      {dict.downloadBtn}
                    </button>
                  </div>
                </div>
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
    </div>
  );
}
