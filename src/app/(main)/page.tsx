"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import MitraSection from "@/components/MitraSection";
import MediaSocialSection from "@/components/MediaSocialSection";
import NewsLinkSection from "@/components/NewsLinkSection";

import { homeDictionary, HomeLanguage } from "@/lib/i18n/home";

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

interface AnnouncementSlide {
  id: string;
  title: string;
  titleAr?: string | null;
  titleEn?: string | null;
  slug: string;
  category: string | null;
  coverImageUrl: string | null;
  publishedAt?: string;
  createdAt?: string;
}

interface BannerSlide {
  id: string;
  title: string;
  titleAr?: string | null;
  titleEn?: string | null;
  imageUrl: string;
  linkUrl?: string | null;
  order: number;
  isActive: boolean;
}

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

interface NewsletterItem {
  id: string;
  judul: string;
  judulAr?: string | null;
  judulEn?: string | null;
  imageUrl: string;
  tanggal: string;
}

interface NewsLinkItem {
  id: string;
  url: string;
  title: string;
  image: string | null;
  description: string | null;
  source: string | null;
}

// Scroll Reveal Wrapper Component
function RevealOnScroll({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
        } ${className}`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<HomeLanguage>('id');
  const [currentSlide, setCurrentSlide] = useState(0);
  const isHoveringSlider = useRef(false);

  const [kampanyes, setKampanyes] = useState<KampanyeItem[]>([]);
  const [loadingKampanye, setLoadingKampanye] = useState(true);

  const [announcements, setAnnouncements] = useState<AnnouncementSlide[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  const [banners, setBanners] = useState<BannerSlide[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(true);

  // Dynamic Aspect Ratio: mengunci tinggi slider ke gambar TERTIANGGI di antara seluruh slide
  const [maxBannerRatio, setMaxBannerRatio] = useState<number | null>(null);

  const handleBannerImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth > 0 && naturalHeight > 0) {
      const ratio = naturalHeight / naturalWidth;
      setMaxBannerRatio((prev) => (prev === null ? ratio : Math.max(prev, ratio)));
    }
  };

  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  const [newsletters, setNewsletters] = useState<NewsletterItem[]>([]);
  const [loadingNewsletters, setLoadingNewsletters] = useState(true);

  const [newsLinks, setNewsLinks] = useState<NewsLinkItem[]>([]);

  useEffect(() => {
    const readLang = () => {
      const saved = (localStorage.getItem('app_lang') || localStorage.getItem('program_lang')) as HomeLanguage;
      if (saved && ['id', 'en', 'ar'].includes(saved)) {
        setLang(saved);
      }
    };
    readLang();
    window.addEventListener('languageChange', readLang);
    return () => window.removeEventListener('languageChange', readLang);
  }, []);

  const dict = homeDictionary[lang] || homeDictionary.id;

  useEffect(() => {
    async function loadData() {
      try {
        const [kampanyeRes, newsRes, annRes, newsletterRes, bannerRes, newsLinkRes] = await Promise.all([
          fetch('/api/kampanye'),
          fetch('/api/news?limit=5'),
          fetch('/api/announcements?limit=4'),
          fetch('/api/newsletter?limit=3'),
          fetch('/api/banner'),
          fetch('/api/news-link?limit=10'),
        ]);

        if (kampanyeRes.ok) {
          const data = await kampanyeRes.json();
          setKampanyes(data.kampanyes || []);
        }

        if (newsRes.ok) {
          const data = await newsRes.json();
          setNewsList(data.news || []);
        }

        if (annRes.ok) {
          const data = await annRes.json();
          setAnnouncements(data.announcements || []);
        }

        if (newsletterRes.ok) {
          const data = await newsletterRes.json();
          setNewsletters(data.items || []);
        }

        if (bannerRes.ok) {
          const data = await bannerRes.json();
          setBanners(data.banners || []);
        }

        if (newsLinkRes.ok) {
          const data = await newsLinkRes.json();
          setNewsLinks(data.newsLinks || []);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoadingKampanye(false);
        setLoadingAnnouncements(false);
        setLoadingBanners(false);
        setLoadingNews(false);
        setLoadingNewsletters(false);
      }
    }
    loadData();
  }, []);

  const getItemTitle = (item: { title: string; titleEn?: string | null; titleAr?: string | null }) => {
    if (lang === 'en' && item.titleEn) return item.titleEn;
    if (lang === 'ar' && item.titleAr) return item.titleAr;
    return item.title;
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const localeMap = { id: 'id-ID', en: 'en-US', ar: 'ar-SA' };
      return d.toLocaleDateString(localeMap[lang] || 'id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatRupiah = (val: number | null) => {
    if (val === null || val === undefined) return '0,00';
    return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  };

  // 1. Take strictly 1 latest announcement with cover image
  const firstAnn = announcements.find((item) => Boolean(item.coverImageUrl && item.coverImageUrl.trim() !== ''));
  const announcementSlides = firstAnn ? [{
    id: `ann-${firstAnn.id}`,
    title: getItemTitle(firstAnn),
    imageUrl: firstAnn.coverImageUrl!,
    href: firstAnn.slug ? `/pengumuman/${firstAnn.slug}` : '/pengumuman',
  }] : [];

  // 2. Take active custom admin banners from /admin/banner
  const customBannerSlides = banners
    .filter((item) => Boolean(item.imageUrl && item.imageUrl.trim() !== ''))
    .map((item) => ({
      id: `ban-${item.id}`,
      title: getItemTitle(item),
      imageUrl: item.imageUrl,
      href: item.linkUrl || '#',
    }));

  // Strictly 1 latest announcement + active custom admin banners
  const activeSlides = [...announcementSlides, ...customBannerSlides];

  useEffect(() => {
    if (currentSlide >= activeSlides.length && activeSlides.length > 0) {
      setCurrentSlide(0);
    }
  }, [activeSlides.length, currentSlide]);

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeSlides.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeSlides.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  // Autoplay: maju slide otomatis setiap 5 detik, berhenti saat hover
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      if (!isHoveringSlider.current) {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const displayedKampanye = kampanyes.slice(0, 3);
  const displayedAnnouncements = announcements.slice(0, 3);
  const displayedNews = newsList.slice(0, 3);

  // True hanya jika setidaknya satu dari data banner/pengumuman masih dalam proses loading
  const isLoadingBanner = loadingAnnouncements || loadingBanners;


  return (
    <main className="min-h-screen bg-gray-50/50 pb-16 sm:pb-24 relative overflow-x-hidden font-sans">

      {/* Hero Section - Non-Floating Flush Under Navbar */}
      <section className="w-full">

        {/* Main Banner Slider with Smooth Transitions */}
        {isLoadingBanner ? (
          <div className="w-full aspect-[16/6] bg-gray-200/60 animate-pulse" />
        ) : activeSlides.length > 0 ? (
          <div
            className="relative bg-transparent overflow-hidden w-full group mx-auto transition-all duration-300 min-h-[200px]"
            style={{
              maxWidth: '100vw',
              aspectRatio: maxBannerRatio ? `${1 / maxBannerRatio}` : '16 / 6',
            }}
            onMouseEnter={() => { isHoveringSlider.current = true; }}
            onMouseLeave={() => { isHoveringSlider.current = false; }}
          >

            {/* Left Arrow Button */}
            {activeSlides.length > 1 && (
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs shadow-md hover:scale-105"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Right Arrow Button */}
            {activeSlides.length > 1 && (
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs shadow-md hover:scale-105"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Slide Images: Latar Belakang Menyatu dengan Page Background, Mentok Paling Atas */}
            {activeSlides.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out flex flex-col justify-start items-start bg-transparent ${isActive
                    ? "opacity-100 z-10 pointer-events-auto"
                    : "opacity-0 z-0 pointer-events-none"
                    }`}
                >
                  <Link
                    href={slide.href}
                    className="w-full h-full flex flex-col justify-start items-start cursor-pointer relative overflow-hidden bg-transparent"
                  >
                    {/* Gambar Utama (100% Lebar, Mentok Atas, Tidak Terpotong) */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      onLoad={handleBannerImageLoad}
                      className="w-full h-auto max-h-full object-contain object-top group-hover:scale-[1.003] transition-transform duration-700 block"
                    />
                  </Link>
                </div>
              );
            })}

          </div>
        ) : null}

        {/* 3 Action Cards */}
        <div className="relative z-20 px-5 sm:px-6 lg:px-8 mt-5 sm:mt-8 md:mt-10 max-w-[1340px] mx-auto">

          {/* 3 Action Cards Container */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4.5 sm:gap-6 md:gap-7 max-w-[1240px] mx-auto">

            {/* CARD 1: INFAK */}
            <div className="bg-[#f6f8fa] rounded-[18px] sm:rounded-[22px] md:rounded-[26px] p-5 sm:p-6 md:p-8 shadow-xl border border-gray-100/90 text-center flex flex-col items-center justify-between min-h-[190px] sm:min-h-[220px] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
              <div>
                <h3 className={`text-lg sm:text-xl md:text-[22px] font-black text-[#2d2d2d] mb-2 sm:mb-3 tracking-wider group-hover:text-[#197814] transition-colors ${lang === 'ar' ? 'font-serif' : ''}`}>
                  {dict.cards.infakTitle}
                </h3>
                <p className="text-xs sm:text-[13px] text-[#555555] leading-relaxed max-w-[280px] mx-auto font-medium">
                  {dict.cards.infakDesc}
                </p>
              </div>

              <div className="mt-4 sm:mt-6 w-full flex justify-center">
                <Link
                  href="/infaq"
                  className="w-32 sm:w-36 md:w-40 py-2 sm:py-2.5 px-4 rounded-full border border-[#197814] text-[#197814] font-bold text-xs sm:text-sm bg-transparent hover:bg-[#197814] hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-2xs inline-block text-center cursor-pointer"
                >
                  {dict.cards.infakBtn}
                </Link>
              </div>
            </div>

            {/* CARD 2: ZAKAT */}
            <div className="bg-[#f6f8fa] rounded-[18px] sm:rounded-[22px] md:rounded-[26px] p-5 sm:p-6 md:p-8 shadow-xl border border-gray-100/90 text-center flex flex-col items-center justify-between min-h-[190px] sm:min-h-[220px] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
              <div>
                <h3 className={`text-lg sm:text-xl md:text-[22px] font-black text-[#2d2d2d] mb-2 sm:mb-3 tracking-wider group-hover:text-[#197814] transition-colors ${lang === 'ar' ? 'font-serif' : ''}`}>
                  {dict.cards.zakatTitle}
                </h3>
                <p className="text-xs sm:text-[13px] text-[#555555] leading-relaxed max-w-[280px] mx-auto font-medium">
                  {dict.cards.zakatDesc}
                </p>
              </div>

              <div className="mt-4 sm:mt-6 w-full flex justify-center">
                <Link
                  href="/zakat"
                  className="w-32 sm:w-36 md:w-40 py-2 sm:py-2.5 px-4 rounded-full border border-[#197814] text-[#197814] font-bold text-xs sm:text-sm bg-transparent hover:bg-[#197814] hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-2xs inline-block text-center cursor-pointer"
                >
                  {dict.cards.zakatBtn}
                </Link>
              </div>
            </div>

            {/* CARD 3: PROGRAM */}
            <div className="bg-[#f6f8fa] rounded-[18px] sm:rounded-[22px] md:rounded-[26px] p-5 sm:p-6 md:p-8 shadow-xl border border-gray-100/90 text-center flex flex-col items-center justify-between min-h-[190px] sm:min-h-[220px] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group">
              <div>
                <h3 className={`text-lg sm:text-xl md:text-[22px] font-black text-[#2d2d2d] mb-2 sm:mb-3 tracking-wider group-hover:text-[#197814] transition-colors ${lang === 'ar' ? 'font-serif' : ''}`}>
                  {dict.cards.programTitle}
                </h3>
                <p className="text-xs sm:text-[13px] text-[#555555] leading-relaxed max-w-[280px] mx-auto font-medium">
                  {dict.cards.programDesc}
                </p>
              </div>

              <div className="mt-4 sm:mt-6 w-full flex justify-center">
                <Link
                  href="/program"
                  className="w-32 sm:w-36 md:w-40 py-2 sm:py-2.5 px-4 rounded-full border border-[#197814] text-[#197814] font-bold text-xs sm:text-sm bg-transparent hover:bg-[#197814] hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-2xs inline-block text-center cursor-pointer"
                >
                  {dict.cards.programBtn}
                </Link>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ===== SECTION 1: KAMPANYE UNGGULAN ===== */}
      <section id="kampanye" className="max-w-[1340px] mx-auto px-5 sm:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20">

        <RevealOnScroll>
          {/* Section Heading */}
          <div className="flex flex-col items-center mb-8 sm:mb-12">
            <h2 className={`text-[22px] sm:text-[26px] md:text-[30px] lg:text-[32px] font-extrabold text-[#112b27] tracking-[0.1em] sm:tracking-[0.14em] uppercase text-center ${lang === 'ar' ? 'font-serif' : ''}`}>
              {dict.sections.kampanye}
            </h2>
            <div className="mt-2 sm:mt-2.5 w-12 sm:w-14 h-[3px] sm:h-[3.5px] bg-[#ffc800] rounded-full" />
          </div>

          {/* Content */}
          {loadingKampanye ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 animate-pulse mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden flex flex-col">
                  <div className="bg-gray-200 aspect-[16/10] w-full" />
                  <div className="p-5 sm:p-6 flex flex-col flex-1 space-y-4">
                    <div className="bg-gray-200 h-6 w-3/4 rounded-md" />
                    <div className="bg-gray-200 h-4 w-1/3 ml-auto rounded-md" />
                    <div className="bg-gray-200 h-3 w-full rounded-full" />
                    <div className="flex justify-between">
                      <div className="bg-gray-200 h-4 w-24 rounded-md" />
                      <div className="bg-gray-200 h-4 w-24 rounded-md" />
                    </div>
                    <div className="bg-gray-200 h-11 w-full rounded-xl mt-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayedKampanye.length === 0 ? (
            <div className="text-center py-10 sm:py-12 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200 mb-8 shadow-xs">
              <p className="text-sm sm:text-base font-semibold">{dict.sections.noKampanye}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {displayedKampanye.map((item) => {
                const target = item.targetDana || 0;
                const current = item.terkumpul || 0;
                const rawPct = target > 0 ? (current / target) * 100 : 0;
                const barWidth = rawPct > 0 ? Math.max(1.5, Math.min(100, rawPct)) : 0;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col group"
                  >
                    {/* Top Cover Image */}
                    <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Body Content */}
                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      {/* Title */}
                      <h3 className={`font-bold text-[#112b27] text-base sm:text-lg md:text-[19px] leading-tight mb-3 sm:mb-4 line-clamp-2 min-h-[44px] sm:min-h-[48px] group-hover:text-[#0b6330] transition-colors ${lang === 'ar' ? 'font-serif text-right' : ''}`}>
                        {(lang === 'en' ? item.judulEn : lang === 'ar' ? item.judulAr : item.judul) || item.judul}
                      </h3>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-4">
                        <div
                          className="bg-[#FFBB0C] h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>

                      {/* Terkumpul vs Dana Dibutuhkan */}
                      <div className="flex justify-between items-end mb-5 sm:mb-6 text-xs sm:text-sm">
                        <div>
                          <span className="block text-xs font-semibold text-gray-700">{dict.sections.terkumpul}</span>
                          <span className="font-extrabold text-[#0b6330]">
                            Rp. {formatRupiah(current)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="block text-xs font-semibold text-gray-700">{dict.sections.danaDibutuhkan}</span>
                          <span className="font-extrabold text-[#0b6330]">
                            Rp. {formatRupiah(target)}
                          </span>
                        </div>
                      </div>

                      {/* Action INFAQ Button */}
                      <Link
                        href={`/infaq?kampanyeId=${item.id}`}
                        className="w-full bg-[#0b6330] hover:bg-[#074722] text-white font-extrabold py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm transition-all duration-200 text-center tracking-wider uppercase block shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] mt-auto"
                      >
                        {dict.sections.infaqSekarang}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Button Selengkapnya */}
          <div className="mt-8 sm:mt-12 flex justify-center">
            <Link
              href="/kampanye"
              className="bg-[#0b6330] hover:bg-[#084823] text-white font-extrabold text-xs sm:text-sm px-8 sm:px-10 py-2.5 sm:py-3 rounded-xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 inline-flex items-center justify-center cursor-pointer tracking-wide"
            >
              {dict.sections.viewMore}
            </Link>
          </div>
        </RevealOnScroll>

      </section>

      {/* ===== SECTION 2: PROFIL ===== */}
      <section id="profil" className="max-w-[1340px] mx-auto px-5 sm:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20">

        <RevealOnScroll>
          {/* Section Heading */}
          <div className="flex flex-col items-center mb-8 sm:mb-12">
            <h2 className={`text-[22px] sm:text-[26px] md:text-[30px] lg:text-[32px] font-extrabold text-[#112b27] tracking-[0.1em] sm:tracking-[0.14em] uppercase text-center ${lang === 'ar' ? 'font-serif' : ''}`}>
              {dict.sections.profil}
            </h2>
            <div className="mt-2 sm:mt-2.5 w-12 sm:w-14 h-[3px] sm:h-[3.5px] bg-[#ffc800] rounded-full" />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-stretch">

            {/* Left: Mosque Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100/80 group min-h-[240px] sm:min-h-[320px] lg:min-h-full relative flex w-full aspect-[16/10] lg:aspect-auto">
              <Image
                src="/profil/mesjid-jamik.png"
                alt="Masjid Jamik Universitas Syiah Kuala"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Right: Text Content */}
            <div className="flex flex-col justify-between gap-5 sm:gap-6 py-1">

              {/* Upper Content */}
              <div>
                <h3 className={`text-base sm:text-[17px] md:text-[19px] font-black text-[#0b6330] tracking-wide uppercase mb-2.5 sm:mb-3 leading-snug ${lang === 'ar' ? 'font-serif' : ''}`}>
                  {dict.sections.profilSub}
                </h3>

                <p className="text-xs sm:text-[13.5px] md:text-[14px] text-gray-600 leading-relaxed mb-4">
                  {dict.sections.profilText}
                </p>

                <Link
                  href="/profil"
                  className="text-[#c49a00] hover:text-[#a07d00] font-semibold text-xs sm:text-[13.5px] underline underline-offset-2 transition-colors inline-block"
                >
                  {dict.sections.viewMore}
                </Link>
              </div>

              {/* BSI Bank Info Card */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-md border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 md:gap-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer group">
                <div className="shrink-0 w-24 sm:w-28 relative h-10 sm:h-12 md:h-14 flex items-center">
                  <Image
                    src="/profil/BSI.png"
                    alt="Bank Syariah Indonesia"
                    fill
                    sizes="120px"
                    className="object-contain object-left sm:object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-col gap-0.5 sm:gap-1 text-xs sm:text-[13.5px] md:text-[14px] text-gray-800">
                  <span className="font-bold">
                    Bank Syariah Indonesia (<span className="text-[#0b6330]">BSI</span>)
                  </span>
                  <span className="font-bold">
                    {dict.sections.rekeningLabel} <span className="text-[#0b6330]">7099400409</span>
                  </span>
                  <span className="font-bold">
                    {dict.sections.anLabel} <span className="text-[#0b6330]">Rumah Amal Masjid Jamik USK</span>
                  </span>
                </div>
              </div>

            </div>
          </div>
        </RevealOnScroll>

      </section>

      {/* ===== SECTION 3: PENGUMUMAN ===== */}
      <section id="pengumuman" className="max-w-[1340px] mx-auto px-5 sm:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20">

        <RevealOnScroll>
          {/* Section Heading */}
          <div className="flex flex-col items-center mb-8 sm:mb-12">
            <h2 className={`text-[22px] sm:text-[26px] md:text-[30px] lg:text-[32px] font-extrabold text-[#112b27] tracking-[0.1em] sm:tracking-[0.14em] uppercase text-center ${lang === 'ar' ? 'font-serif' : ''}`}>
              {dict.sections.pengumuman}
            </h2>
            <div className="mt-2 sm:mt-2.5 w-12 sm:w-14 h-[3px] sm:h-[3.5px] bg-[#ffc800] rounded-full" />
          </div>

          {/* Content */}
          {loadingAnnouncements ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 animate-pulse mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden flex flex-col">
                  <div className="bg-gray-200 aspect-[16/10] w-full" />
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <div className="bg-gray-200 h-5 w-24 rounded-md mb-3" />
                    <div className="bg-gray-200 h-5 w-3/4 rounded-sm mb-3" />
                    <div className="bg-gray-200 h-4 w-1/2 rounded-sm mt-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayedAnnouncements.length === 0 ? (
            <div className="text-center py-10 sm:py-12 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200 mb-8 shadow-xs">
              <p className="text-sm sm:text-base font-semibold">{dict.sections.noPengumuman}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {displayedAnnouncements.map((item) => (
                <Link
                  key={item.id}
                  href={`/pengumuman/${item.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
                >
                  {/* Cover Image */}
                  <div className="relative aspect-[16/10] w-full bg-gray-50 overflow-hidden">
                    {item.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.coverImageUrl}
                        alt={getItemTitle(item)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                            {lang === 'ar' ? 'إعلان رسمي' : lang === 'en' ? 'OFFICIAL ANNOUNCEMENT' : 'PENGUMUMAN RESMI'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Body Content Card */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <div className="mb-2.5 sm:mb-3">
                      <span className="inline-block bg-[#ffc800] text-[#111827] text-[10px] sm:text-[11px] font-extrabold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md uppercase tracking-wider shadow-2xs">
                        {item.category && item.category !== 'Umum' && item.category !== 'UMUM' ? item.category : (lang === 'ar' ? 'إعلان' : lang === 'en' ? 'ANNOUNCEMENT' : 'PENGUMUMAN')}
                      </span>
                    </div>

                    <div className="flex flex-col justify-between flex-1">
                      <h3 className={`font-bold text-[#112b27] text-sm sm:text-[15px] leading-tight mb-2.5 sm:mb-3 line-clamp-4 group-hover:text-[#0b6330] transition-colors ${lang === 'ar' ? 'font-serif text-right' : ''}`}>
                        {getItemTitle(item)}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-auto">
                        {formatDate(item.publishedAt || item.createdAt || '')}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Button Selengkapnya */}
          <div className="mt-8 sm:mt-12 flex justify-center">
            <Link
              href="/pengumuman"
              className="bg-[#0b6330] hover:bg-[#084823] text-white font-extrabold text-xs sm:text-sm px-8 sm:px-10 py-2.5 sm:py-3 rounded-xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 inline-flex items-center justify-center cursor-pointer tracking-wide"
            >
              {dict.sections.viewMore}
            </Link>
          </div>
        </RevealOnScroll>

      </section>

      {/* ===== SECTION 4: BERITA TERKINI ===== */}
      <section id="berita" className="max-w-[1340px] mx-auto px-5 sm:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20">

        <RevealOnScroll>
          {/* Section Heading */}
          <div className="flex flex-col items-center mb-8 sm:mb-12">
            <h2 className={`text-[22px] sm:text-[26px] md:text-[30px] lg:text-[32px] font-extrabold text-[#112b27] tracking-[0.1em] sm:tracking-[0.14em] uppercase text-center ${lang === 'ar' ? 'font-serif' : ''}`}>
              {dict.sections.berita}
            </h2>
            <div className="mt-2 sm:mt-2.5 w-12 sm:w-14 h-[3px] sm:h-[3.5px] bg-[#ffc800] rounded-full" />
          </div>

          {/* Content */}
          {loadingNews ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 animate-pulse mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden flex flex-col">
                  <div className="bg-gray-200 aspect-[16/10] w-full" />
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <div className="bg-gray-200 h-5 w-24 rounded-md mb-3" />
                    <div className="bg-gray-200 h-5 w-3/4 rounded-sm mb-3" />
                    <div className="bg-gray-200 h-4 w-1/2 rounded-sm mt-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayedNews.length === 0 ? (
            <div className="text-center py-10 sm:py-12 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200 mb-8 shadow-xs">
              <p className="text-sm sm:text-base font-semibold">{dict.sections.noBerita}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {displayedNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
                >
                  {/* Cover Image */}
                  <div className="relative aspect-[16/10] w-full bg-gray-50 overflow-hidden">
                    {item.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.coverImageUrl}
                        alt={getItemTitle(item)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                            {lang === 'ar' ? 'خبر رسمي' : lang === 'en' ? 'OFFICIAL NEWS' : 'BERITA RESMI'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Body Content Card */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <div className="mb-2.5 sm:mb-3">
                      <span className="inline-block bg-[#ffc800] text-[#111827] text-[10px] sm:text-[11px] font-extrabold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md uppercase tracking-wider shadow-2xs">
                        {lang === 'ar' ? 'خبر' : lang === 'en' ? 'NEWS' : 'BERITA'}
                      </span>
                    </div>

                    <div className="flex flex-col justify-between flex-1">
                      <h3 className={`font-bold text-[#112b27] text-sm sm:text-[15px] leading-tight mb-2.5 sm:mb-3 line-clamp-4 group-hover:text-[#0b6330] transition-colors ${lang === 'ar' ? 'font-serif text-right' : ''}`}>
                        {getItemTitle(item)}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-auto">
                        {formatDate(item.publishedAt || item.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Button Selengkapnya */}
          <div className="mt-8 sm:mt-12 flex justify-center">
            <Link
              href="/berita"
              className="bg-[#0b6330] hover:bg-[#084823] text-white font-extrabold text-xs sm:text-sm px-8 sm:px-10 py-2.5 sm:py-3 rounded-xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 inline-flex items-center justify-center cursor-pointer tracking-wide"
            >
              {dict.sections.viewMore}
            </Link>
          </div>
        </RevealOnScroll>

      </section>

      {/* ===== SECTION 5: NEWSLETTER ===== */}
      <section id="newsletter" className="max-w-[1340px] mx-auto px-5 sm:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20">

        <RevealOnScroll>
          {/* Section Heading */}
          <div className="flex flex-col items-center mb-8 sm:mb-12">
            <h2 className={`text-[22px] sm:text-[26px] md:text-[30px] lg:text-[32px] font-extrabold text-[#112b27] tracking-[0.1em] sm:tracking-[0.14em] uppercase text-center ${lang === 'ar' ? 'font-serif' : ''}`}>
              {dict.sections.newsletter}
            </h2>
            <div className="mt-2 sm:mt-2.5 w-12 sm:w-14 h-[3px] sm:h-[3.5px] bg-[#ffc800] rounded-full" />
          </div>

          {/* Content */}
          {loadingNewsletters ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 animate-pulse mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs">
                  <div className="bg-gray-200 aspect-[3/4] w-full rounded-xl mb-3" />
                  <div className="bg-gray-200 h-4 w-3/4 rounded-md" />
                </div>
              ))}
            </div>
          ) : newsletters.length === 0 ? (
            <div className="text-center py-10 sm:py-12 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200 mb-8 shadow-xs">
              <p className="text-sm sm:text-base font-semibold">{dict.sections.noNewsletter}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {newsletters.map((item) => (
                <Link
                  key={item.id}
                  href={`/newsletter/${item.id}`}
                  className="group bg-white rounded-2xl border border-gray-100 p-4 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col cursor-pointer"
                >
                  <div className="relative aspect-[3/4] w-full bg-gray-100 rounded-xl overflow-hidden mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1 group-hover:text-[#0b6330] transition-colors">
                    {(lang === 'en' ? item.judulEn : lang === 'ar' ? item.judulAr : item.judul) || item.judul}
                  </h3>
                  <p className="text-xs text-gray-400 mt-auto">{formatDate(item.tanggal)}</p>
                </Link>
              ))}
            </div>
          )}

          {/* Button Selengkapnya */}
          <div className="mt-8 sm:mt-12 flex justify-center">
            <Link
              href="/newsletter"
              className="bg-[#0b6330] hover:bg-[#084823] text-white font-extrabold text-xs sm:text-sm px-8 sm:px-10 py-2.5 sm:py-3 rounded-xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 inline-flex items-center justify-center cursor-pointer tracking-wide"
            >
              {dict.sections.viewMore}
            </Link>
          </div>
        </RevealOnScroll>

      </section>



      {/* ===== SECTION 6: MEDIA & SOCIAL FEED ===== */}
      <RevealOnScroll>
        <MediaSocialSection />
      </RevealOnScroll>

      {/* ===== SECTION 7: RILIS MEDIA EKSTERNAL ===== */}
      <RevealOnScroll>
        <NewsLinkSection newsLinks={newsLinks} lang={lang} />
      </RevealOnScroll>

      {/* ===== SECTION 8: MITRA ===== */}
      <RevealOnScroll>
        <MitraSection />
      </RevealOnScroll>

    </main>
  );
}
