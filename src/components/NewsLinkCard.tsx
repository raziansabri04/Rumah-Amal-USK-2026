'use client';

import { HomeLanguage } from '@/lib/i18n/home';

interface NewsLinkCardProps {
  url: string;
  title: string;
  image: string | null;
  description: string | null;
  source: string | null;
  lang?: HomeLanguage;
  shouldLoadImage?: boolean;
}

export default function NewsLinkCard({
  url,
  title,
  image,
  description,
  source,
  lang = 'id',
  shouldLoadImage = true,
}: NewsLinkCardProps) {
  const newsLabel = lang === 'ar' ? 'أخبار' : lang === 'en' ? 'News' : 'Berita';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-pointer h-full"
    >
      {/* Gambar */}
      <div className="relative aspect-[16/9] w-full bg-gray-100 overflow-hidden flex-shrink-0">
        {image ? (
          shouldLoadImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-200/80 animate-pulse flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-300/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 gap-1.5">
            <svg
              className="w-6 h-6 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <span className={`text-[10px] text-gray-400 font-medium ${lang === 'ar' ? 'font-serif' : ''}`}>
              {newsLabel}
            </span>
          </div>
        )}

        {/* Source badge di atas gambar */}
        {source && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/65 backdrop-blur-xs text-white text-[9px] font-bold rounded-md tracking-wide">
            {source}
          </span>
        )}

        {/* External link icon */}
        <span className="absolute top-2 right-2 w-5 h-5 bg-black/40 backdrop-blur-xs rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4 gap-1.5">
        <h3 className={`text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#0b6330] transition-colors ${lang === 'ar' ? 'font-serif text-right' : ''}`}>
          {title}
        </h3>

        {description && (
          <p className={`text-[11px] sm:text-xs text-gray-500 line-clamp-2 leading-normal flex-1 ${lang === 'ar' ? 'font-serif text-right' : ''}`}>
            {description}
          </p>
        )}

        <div className="flex items-center gap-1.5 mt-auto pt-1 border-t border-gray-50">
          <svg className="w-3 h-3 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span className="text-[10px] text-gray-400 font-medium truncate">
            {source || new URL(url).hostname.replace('www.', '')}
          </span>
        </div>
      </div>
    </a>
  );
}

