'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { kampanyeDictionary, KampanyeLanguage } from '@/lib/i18n/kampanye';

interface KampanyeItem {
  id: string;
  judul: string;
  judulAr?: string | null;
  judulEn?: string | null;
  deskripsi: string | null;
  deskripsiAr?: string | null;
  deskripsiEn?: string | null;
  imageUrl: string;
  targetDana: number | null;
  terkumpul: number;
  tanggalSelesai: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function PublicKampanyePage() {
  const [lang, setLang] = useState<KampanyeLanguage>('id');
  const [items, setItems] = useState<KampanyeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');

  useEffect(() => {
    const readLang = () => {
      const saved = (localStorage.getItem('app_lang') || localStorage.getItem('program_lang')) as KampanyeLanguage;
      if (saved && ['id', 'en', 'ar'].includes(saved)) {
        setLang(saved);
      }
    };
    readLang();
    window.addEventListener('languageChange', readLang);
    return () => window.removeEventListener('languageChange', readLang);
  }, []);

  const dict = kampanyeDictionary[lang] || kampanyeDictionary.id;

  const getItemTitle = (item: KampanyeItem) => {
    if (lang === 'en' && item.judulEn) return item.judulEn;
    if (lang === 'ar' && item.judulAr) return item.judulAr;
    return item.judul;
  };

  const fetchKampanye = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/kampanye');
      if (res.ok) {
        const data = await res.json();
        setItems(data.kampanyes || []);
      }
    } catch (err) {
      console.error('Error fetching kampanye:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKampanye();
  }, [fetchKampanye]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(searchQuery);
  };

  const filteredItems = items.filter((item) => {
    if (!activeQuery.trim()) return true;
    const titleToSearch = getItemTitle(item).toLowerCase();
    return titleToSearch.includes(activeQuery.trim().toLowerCase()) || item.judul.toLowerCase().includes(activeQuery.trim().toLowerCase());
  });

  const formatRupiah = (val: number | null) => {
    if (val === null || val === undefined) return '0,00';
    return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1340px] mx-auto">

        {/* Header Section: Title & Search Bar Inline */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 mt-1 pb-4 border-b border-gray-100">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight uppercase ${lang === 'ar' ? 'font-serif text-right' : ''}`}>
              {dict.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              {lang === 'ar' ? 'اختر برنامج الخير وشارِك بالصدقة' : lang === 'en' ? 'Choose a campaign and share your kindness' : 'Pilih program kebaikan dan salurkan infaq terbaik Anda'}
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="w-full md:w-80 lg:w-96 flex gap-2 shrink-0">
            <input
              type="text"
              placeholder={dict.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3.5 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 font-medium focus:outline-none focus:border-[#0b6330] focus:ring-1 focus:ring-[#0b6330] bg-white transition-colors shadow-2xs"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 animate-pulse mb-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden flex flex-col">
                <div className="bg-gray-200 aspect-[16/9] w-full"></div>
                <div className="p-5 flex flex-col flex-1 space-y-3">
                  <div className="bg-gray-200 h-5 w-3/4 rounded-md"></div>
                  <div className="bg-gray-200 h-3 w-full rounded-full"></div>
                  <div className="flex justify-between">
                    <div className="bg-gray-200 h-4 w-20 rounded-md"></div>
                    <div className="bg-gray-200 h-4 w-20 rounded-md"></div>
                  </div>
                  <div className="bg-gray-200 h-10 w-full rounded-xl mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200 mb-12 shadow-xs">
            <p className="text-lg font-semibold mb-2">{dict.emptyTitle}</p>
            <p className="text-sm text-gray-400">
              {activeQuery ? `${dict.noResultFor} "${activeQuery}"` : dict.emptyDesc}
            </p>
          </div>
        ) : (
          /* Kampanye Grid (3 Columns) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-12">
            {filteredItems.map((item) => {
              const target = item.targetDana || 0;
              const current = item.terkumpul || 0;
              const rawPct = target > 0 ? (current / target) * 100 : 0;
              const barWidth = rawPct > 0 ? Math.max(1.5, Math.min(100, rawPct)) : 0;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Top Cover Image */}
                  <div className="relative aspect-[16/9] w-full bg-gray-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.judul}
                      className="w-full h-full object-cover hover:scale-103 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Body Content */}
                  <div className="p-4.5 sm:p-5 flex flex-col flex-1">
                    {/* Title */}
                    <h3 className={`font-bold text-[#112b27] text-base sm:text-lg leading-tight mb-3.5 line-clamp-2 min-h-[42px] sm:min-h-[44px] ${lang === 'ar' ? 'font-serif text-right' : ''}`}>
                      {getItemTitle(item)}
                    </h3>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-3">
                      <div
                        className="bg-[#FFBB0C] h-full rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>

                    {/* Terkumpul vs Dana Dibutuhkan */}
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <span className="block text-xs font-semibold text-gray-600">{dict.terkumpul}</span>
                        <span className="text-sm font-extrabold text-[#0b6330]">
                          Rp. {formatRupiah(current)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-semibold text-gray-600">{dict.danaDibutuhkan}</span>
                        <span className="text-sm font-extrabold text-[#0b6330]">
                          Rp. {formatRupiah(target)}
                        </span>
                      </div>
                    </div>

                    {/* Action INFAQ Button */}
                    <Link
                      href={`/infaq?kampanyeId=${item.id}`}
                      className="w-full bg-[#0b6330] hover:bg-[#074722] text-white font-extrabold py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm transition-all duration-200 text-center tracking-wider uppercase block shadow-sm hover:shadow-md mt-auto"
                    >
                      {dict.infaqSekarang}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

