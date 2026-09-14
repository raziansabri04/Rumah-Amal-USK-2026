'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { galeriDictionary, GaleriLanguage } from '@/lib/i18n/galeri';
import ShareAndLikeBar from '@/components/ShareAndLikeBar';

interface GalleryItem {
  id: string;
  imageUrl: string;
  likesCount?: number;
  createdAt: string;
}

export default function GaleriPage() {
  const [lang, setLang] = useState<GaleriLanguage>('id');
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    const readLang = () => {
      const saved = (localStorage.getItem('app_lang') || localStorage.getItem('program_lang')) as GaleriLanguage;
      if (saved && ['id', 'en', 'ar'].includes(saved)) {
        setLang(saved);
      }
    };
    readLang();
    window.addEventListener('languageChange', readLang);
    return () => window.removeEventListener('languageChange', readLang);
  }, []);

  const dict = galeriDictionary[lang] || galeriDictionary.id;

  const fetchImages = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gallery?page=${p}&limit=${ITEMS_PER_PAGE}`);
      if (res.ok) {
        const data = await res.json();
        setImages(data.items || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages(page);
  }, [page, fetchImages]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      setSelectedIndex(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  }, [selectedIndex]);

  const handleNext = useCallback(() => {
    if (selectedIndex !== null && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  }, [selectedIndex, images.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    },
    [selectedIndex, handlePrev, handleNext]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1340px] mx-auto">

        {/* Header Section: Title Inline */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 mt-1 pb-4 border-b border-gray-100">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold text-[#2d3238] tracking-tight uppercase ${lang === 'ar' ? 'font-serif text-right' : ''}`}>
              {dict.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              {lang === 'ar' ? 'معرض الصور والتوثيق الميداني' : lang === 'en' ? 'Photo gallery and field documentation' : 'Dokumentasi foto dan kegiatan penyaluran Rumah Amal USK'}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse mb-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl aspect-[16/10] w-full"></div>
            ))}
          </div>
        ) : images.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-lg font-semibold mb-2">{dict.emptyTitle}</p>
            <p className="text-sm text-gray-400">{dict.emptyDesc}</p>
          </div>
        ) : (
          /* Grid 4 kolom */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className="group relative overflow-hidden rounded-xl bg-gray-100 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer aspect-[16/10] flex items-center justify-center"
                onClick={() => setSelectedIndex(idx)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.imageUrl}
                  alt="Dokumentasi Rumah Amal"
                  className="max-w-full max-h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
                  loading="lazy"
                />
              </div>
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
                        ? 'bg-[#ffc800] text-[#1a1a1a] font-extrabold shadow-xs'
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
      {selectedIndex !== null && images[selectedIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Tombol Panah Kiri (Prev) */}
          {selectedIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors p-2 text-4xl font-light select-none z-10 cursor-pointer"
              aria-label={dict.prevPhoto}
            >
              ‹
            </button>
          )}

          {/* Card Container Putih */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col items-center justify-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Close (X) di Pojok Kanan Atas Card */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-3 right-3 bg-gray-100 text-gray-700 hover:bg-gray-200 w-8 h-8 rounded-full shadow-xs border border-gray-200 flex items-center justify-center text-sm font-bold transition-all z-20 cursor-pointer"
              aria-label={dict.closeModal}
            >
              ✕
            </button>

            {/* Gambar yang Diperbesar */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[selectedIndex].imageUrl}
              alt="Dokumentasi Fullsize"
              className="max-w-full max-h-[60vh] object-contain rounded-xl mb-4"
            />

            {/* Share & Like Section */}
            <div className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200">
              <ShareAndLikeBar
                contentType="gallery"
                contentId={images[selectedIndex].id}
                title="Dokumentasi Galeri Rumah Amal"
                initialLikesCount={images[selectedIndex].likesCount || 0}
                lang={lang}
              />
            </div>
          </div>

          {/* Tombol Panah Kanan (Next) */}
          {selectedIndex < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 sm:left-auto sm:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors p-2 text-4xl font-light select-none z-10 cursor-pointer"
              aria-label={dict.nextPhoto}
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
}
