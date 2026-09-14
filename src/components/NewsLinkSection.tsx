"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import NewsLinkCard from "./NewsLinkCard";
import { HomeLanguage, homeDictionary } from "@/lib/i18n/home";

interface NewsLinkItem {
  id: string;
  url: string;
  title: string;
  image: string | null;
  description: string | null;
  source: string | null;
}

export default function NewsLinkSection({
  newsLinks: initialNewsLinks,
  lang = "id",
  title,
}: {
  newsLinks: NewsLinkItem[];
  lang?: HomeLanguage;
  title?: string;
}) {
  const [items, setItems] = useState<NewsLinkItem[]>(initialNewsLinks || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [itemsPerView, setItemsPerView] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(4);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [loadedImageIds, setLoadedImageIds] = useState<Record<string, boolean>>({});
  const isHovering = useRef(false);

  const sectionTitle =
    title ||
    homeDictionary[lang]?.sections?.beritaTerkait ||
    "RILIS MEDIA EKSTERNAL";

  // Sync initial prop items when prop changes or loads
  useEffect(() => {
    if (initialNewsLinks && initialNewsLinks.length > 0) {
      setItems(initialNewsLinks);
      if (initialNewsLinks.length < 10) {
        setHasMore(false);
      }
    }
  }, [initialNewsLinks]);

  // Deteksi jumlah item per view berdasarkan lebar layar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sinkronkan index saat itemsPerView berubah
  useEffect(() => {
    setIsTransitioning(false);
    setCurrentIndex(itemsPerView);
  }, [itemsPerView]);

  // Function to load the next batch of external news links from backend API
  const loadNextBatch = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/news-link?page=${nextPage}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        const newItems: NewsLinkItem[] = data.newsLinks || [];
        if (newItems.length > 0) {
          setItems((prev) => {
            const existingIds = new Set(prev.map((i) => i.id));
            const uniqueNew = newItems.filter((i) => !existingIds.has(i.id));
            return [...prev, ...uniqueNew];
          });
          setPage(nextPage);
        }
        setHasMore(Boolean(data.hasMore));
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more news links:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, page]);

  const canSlide = items && items.length > itemsPerView;

  // Trigger background loading of next page when sliding near the end of loaded items
  useEffect(() => {
    if (canSlide && hasMore && !isLoadingMore) {
      if (currentIndex >= items.length - itemsPerView - 1) {
        loadNextBatch();
      }
    }
  }, [currentIndex, items.length, itemsPerView, canSlide, hasMore, isLoadingMore, loadNextBatch]);

  // Duplikasi item di awal dan akhir untuk efek infinite loop meluncur ke kiri
  const extendedItems = canSlide
    ? [
      ...items.slice(-itemsPerView),
      ...items,
      ...items.slice(0, itemsPerView),
    ]
    : items;

  // Virtual preloading logic: Hanya load gambar untuk kartu yang sedang/akan bergeser ke layar
  useEffect(() => {
    if (!extendedItems || extendedItems.length === 0) return;
    const buffer = 1; // 1 kartu penyangga di kiri & kanan
    const minVisibleIdx = currentIndex - buffer;
    const maxVisibleIdx = currentIndex + itemsPerView + buffer - 1;

    setLoadedImageIds((prev) => {
      let changed = false;
      const next = { ...prev };
      extendedItems.forEach((item, idx) => {
        if (idx >= minVisibleIdx && idx <= maxVisibleIdx) {
          if (!next[item.id]) {
            next[item.id] = true;
            changed = true;
          }
        }
      });
      return changed ? next : prev;
    });
  }, [currentIndex, itemsPerView, extendedItems]);

  const nextSlide = useCallback(() => {
    if (!canSlide) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [canSlide]);

  const prevSlide = useCallback(() => {
    if (!canSlide) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [canSlide]);

  // Auto-slide setiap 3.5 detik meluncur ke kiri
  useEffect(() => {
    if (!canSlide) return;

    const interval = setInterval(() => {
      if (!isHovering.current) {
        nextSlide();
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [canSlide, nextSlide]);

  const handleTransitionEnd = () => {
    if (!canSlide) return;

    if (currentIndex >= items.length + itemsPerView) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - items.length);
    } else if (currentIndex < itemsPerView) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + items.length);
    }
  };

  if (!items || items.length === 0) return null;

  const itemWidthPercent = 100 / itemsPerView;

  // Hitung active index yang sebenarnya untuk titik navigasi (dots)
  const realActiveIndex = canSlide
    ? ((currentIndex - itemsPerView) % items.length + items.length) % items.length
    : 0;

  const activeTranslateIndex = canSlide ? currentIndex : 0;

  return (
    <section className="max-w-[1340px] mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
      {/* Section Heading */}
      <div className="flex flex-col items-center mb-8 sm:mb-12">
        <h2 className={`text-[22px] sm:text-[26px] md:text-[30px] lg:text-[32px] font-extrabold text-[#112b27] tracking-[0.1em] sm:tracking-[0.14em] uppercase text-center ${lang === 'ar' ? 'font-serif' : ''}`}>
          {sectionTitle}
        </h2>
        <div className="mt-2 sm:mt-2.5 w-12 sm:w-14 h-[3px] sm:h-[3.5px] bg-[#ffc800] rounded-full" />
      </div>

      {/* Slider Container */}
      <div
        className="relative group py-2"
        onMouseEnter={() => {
          isHovering.current = true;
        }}
        onMouseLeave={() => {
          isHovering.current = false;
        }}
      >
        {/* Left Navigation Arrow */}
        {canSlide && (
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-gray-800 shadow-md border border-gray-200 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Navigation Arrow */}
        {canSlide && (
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-gray-800 shadow-md border border-gray-200 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Track Container */}
        <div className="overflow-hidden rounded-2xl">
          <div
            onTransitionEnd={handleTransitionEnd}
            className={`flex -mx-2 sm:-mx-2.5 will-change-transform ${isTransitioning ? "transition-transform duration-500 ease-in-out" : ""
              }`}
            style={{
              transform: `translate3d(-${activeTranslateIndex * itemWidthPercent}%, 0, 0)`,
              willChange: "transform",
            }}
          >
            {extendedItems.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="shrink-0 px-2 sm:px-2.5"
                style={{ width: `${itemWidthPercent}%` }}
              >
                <NewsLinkCard
                  url={item.url}
                  title={item.title}
                  image={item.image}
                  description={item.description}
                  source={item.source}
                  lang={lang}
                  shouldLoadImage={Boolean(loadedImageIds[item.id])}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


