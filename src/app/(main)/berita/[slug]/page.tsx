'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { beritaDictionary, BeritaLanguage } from '@/lib/i18n/berita';
import ShareAndLikeBar from '@/components/ShareAndLikeBar';

interface TagItem {
  id: string;
  name: string;
}

interface NewsDetail {
  id: string;
  title: string;
  titleAr?: string | null;
  titleEn?: string | null;
  slug: string;
  excerpt: string | null;
  category: string | null;
  coverImageUrl: string | null;
  content: string;
  contentAr?: string | null;
  contentEn?: string | null;
  viewsCount: number;
  likesCount?: number;
  publishedAt: string;
  createdAt: string;
  tags: TagItem[];
}

interface NewsSummary {
  id: string;
  title: string;
  titleAr?: string | null;
  titleEn?: string | null;
  slug: string;
  coverImageUrl?: string | null;
  publishedAt: string;
}

export default function PublicNewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [recentNews, setRecentNews] = useState<NewsSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lang, setLang] = useState<BeritaLanguage>('id');
  const [sidebarQuery, setSidebarQuery] = useState('');

  // Comment state
  const [commentName, setCommentName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccessMsg, setCommentSuccessMsg] = useState('');

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

  const t = beritaDictionary[lang] || beritaDictionary.id;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/news?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          setNews(data.news);
          if (data.news?.id) {
            fetch(`/api/news/${data.news.id}/views`, { method: 'POST' }).catch(() => {});
          }
        } else {
          setError(t.notFoundDetailDesc);
        }

        // Fetch recent news for sidebar
        const listRes = await fetch('/api/news');
        if (listRes.ok) {
          const listData = await listRes.json();
          const filtered = (listData.news || []).filter(
            (item: NewsSummary) => item.slug !== slug
          );
          setRecentNews(filtered.slice(0, 5));
        }
      } catch (err) {
        console.error('Error loading news detail:', err);
        setError(t.notFoundDetailDesc);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug, t.notFoundDetailDesc]);

  const getTitle = (item: { title: string; titleEn?: string | null; titleAr?: string | null }) => {
    if (lang === 'en' && item.titleEn) return item.titleEn;
    if (lang === 'ar' && item.titleAr) return item.titleAr;
    return item.title;
  };

  const getContent = (item: NewsDetail) => {
    if (lang === 'en' && item.contentEn) return item.contentEn;
    if (lang === 'ar' && item.contentAr) return item.contentAr;
    return item.content;
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const localeMap = { id: 'id-ID', en: 'en-US', ar: 'ar-SA' };
      return d.toLocaleDateString(localeMap[lang] || 'id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleSidebarSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sidebarQuery.trim()) {
      window.location.href = `/berita?q=${encodeURIComponent(sidebarQuery.trim())}`;
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setSubmittingComment(true);
    setTimeout(() => {
      setSubmittingComment(false);
      setCommentSuccessMsg(t.commentSuccessMsg);
      setCommentContent('');
      setCommentName('');
    }, 600);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-4xl mx-auto animate-pulse space-y-6">
          <div className="h-4 bg-gray-200 w-32 rounded"></div>
          <div className="h-8 bg-gray-200 w-3/4 rounded"></div>
          <div className="h-64 bg-gray-200 w-full rounded-2xl"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 w-full rounded"></div>
            <div className="h-4 bg-gray-200 w-5/6 rounded"></div>
            <div className="h-4 bg-gray-200 w-4/6 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-white py-16 px-4 text-center font-sans">
        <div className="max-w-md mx-auto bg-gray-50 p-8 rounded-2xl border border-gray-200">
          <span className="text-4xl mb-3 block">📰</span>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t.notFoundTitle}</h2>
          <p className="text-sm text-gray-500 mb-6">{error || t.notFoundDetailDesc}</p>
          <Link
            href="/berita"
            className="inline-flex items-center px-5 py-2.5 bg-[#0b6330] text-white text-sm font-bold rounded-xl hover:bg-[#074722] transition-colors"
          >
            ← {t.backToAll}
          </Link>
        </div>
      </div>
    );
  }

  const hasArabicTitle = Boolean(news.titleAr && news.titleAr.trim() !== '');
  const hasArabicContent = Boolean(news.contentAr && news.contentAr.trim() !== '');

  const isTitleRtl = lang === 'ar' && hasArabicTitle;
  const isContentRtl = lang === 'ar' && hasArabicContent;

  const displayTitle = getTitle(news);
  const displayContent = getContent(news);

  return (
    <div className="min-h-screen bg-[#f8fafc]/50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      <div className="max-w-[1340px] mx-auto">
        {/* Back Link Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-gray-500 hover:text-[#0b6330] transition-colors"
          >
            ← {t.backToAll}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Article Content (8 cols) */}
          <article className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100/90">
            {/* Category & Date */}
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#0b6330] uppercase tracking-wider mb-3">
              <span className="bg-[#ffc800] text-[#111827] px-3 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider shadow-2xs">
                {t.badge}
              </span>
              <span>•</span>
              <time dateTime={news.publishedAt}>
                {formatDate(news.publishedAt || news.createdAt)}
              </time>
            </div>

            {/* Title */}
            <h1
              className={`text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6 ${
                isTitleRtl ? 'font-serif text-right' : ''
              }`}
              dir={isTitleRtl ? 'rtl' : 'ltr'}
            >
              {displayTitle}
            </h1>

            {/* Cover Image */}
            {news.coverImageUrl && (
              <div className="mb-8 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex justify-center max-h-[460px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={news.coverImageUrl}
                  alt={displayTitle}
                  className="w-full object-cover max-h-[460px]"
                />
              </div>
            )}

            {/* Content Body */}
            <style>{`
              .article-body a[data-type="download-button"],
              .article-body a[data-type="link-button"],
              .article-body a[download],
              .article-body div.my-4 a,
              .article-body div:has(> a[data-type="download-button"]),
              .article-body div:has(> a[data-type="link-button"]) {
                display: flex !important;
                width: 100% !important;
                justify-content: center !important;
                text-align: center !important;
                box-sizing: border-box !important;
                border-radius: 16px !important;
                direction: ltr !important;
                unicode-bidi: isolate !important;
              }
              .article-body a[data-type="download-button"],
              .article-body a[data-type="link-button"],
              .article-body a[download],
              .article-body div.my-4 a {
                background: #0b6330 !important;
                color: #ffffff !important;
                padding: 12px 24px !important;
                font-weight: 700 !important;
                text-decoration: none !important;
                font-size: 14px !important;
                box-shadow: 0 2px 8px rgba(11, 99, 48, 0.25) !important;
                margin: 16px 0 !important;
              }
              .article-body p { margin-bottom: 1.25rem; line-height: 1.8; }
              .article-body h1 { font-size: 1.75rem; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; color: #111827; }
              .article-body h2 { font-size: 1.4rem; font-weight: 700; margin-top: 1.75rem; margin-bottom: 0.75rem; color: #111827; }
              .article-body h3 { font-size: 1.15rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #111827; }
              .article-body ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
              .article-body ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.25rem; }
              .article-body li { margin-bottom: 0.35rem; }
              .article-body blockquote { border-left: 4px solid #0b6330; padding-left: 1.25rem; color: #4b5563; font-style: italic; margin: 1.5rem 0; background: #f9fafb; padding: 1rem; border-radius: 0 0.75rem 0.75rem 0; }
              .article-body a { color: #0b6330; text-decoration: underline; font-weight: 600; }
              .article-body img { max-width: 100%; height: auto; border-radius: 1rem; margin: 1.5rem 0; shadow: 0 4px 12px rgba(0,0,0,0.05); }
              .rtl-body { text-align: right; direction: rtl; font-family: serif, sans-serif; }
              .rtl-body blockquote { border-left: none; border-right: 4px solid #0b6330; padding-left: 0; padding-right: 1.25rem; border-radius: 0.75rem 0 0 0.75rem; }
              .rtl-body ul, .rtl-body ol { padding-left: 0; padding-right: 1.5rem; }
              div[data-type="bank-banner"] { direction: ltr !important; unicode-bidi: isolate !important; text-align: center !important; }
              div[data-type="bank-banner"] div { direction: ltr !important; text-align: center !important; }
            `}</style>
            <div className="prose max-w-none text-gray-800 text-base sm:text-lg leading-relaxed">
              <div
                className={`article-body ${isContentRtl ? 'rtl-body' : 'ltr-body'}`}
                dir={isContentRtl ? 'rtl' : 'ltr'}
                dangerouslySetInnerHTML={{ __html: displayContent }}
              />
            </div>

            {/* Tags & Meta Section */}
            <div className="pt-6 border-t border-gray-200 mt-8 space-y-6">
              <div className="flex items-center gap-6 flex-wrap">
                {/* Jumlah Pembaca / Views Count dengan Icon Mata */}
                <div className="flex items-center gap-2 text-gray-600 text-sm font-semibold" title="Jumlah Pembaca / Views">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-gray-800 font-extrabold text-base">{news.viewsCount || 0}</span>
                  <span className="text-xs text-gray-500 font-medium">
                    {lang === 'ar' ? 'مشاهدة' : lang === 'en' ? 'views' : 'pembaca'}
                  </span>
                </div>

                {news.tags && news.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {t.tags}
                    </span>
                    {news.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="text-xs bg-gray-100 text-gray-700 font-semibold px-3 py-1 rounded-full border border-gray-200"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Share & Like Section */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
                <ShareAndLikeBar
                  contentType="news"
                  contentId={news.id}
                  title={displayTitle}
                  initialLikesCount={news.likesCount || 0}
                  lang={lang}
                />
              </div>
            </div>

            {/* Comment Section */}
            <section className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-extrabold text-gray-900 mb-6">{t.leaveComment}</h3>

              {commentSuccessMsg && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold rounded-xl">
                  {commentSuccessMsg}
                </div>
              )}

              <form
                onSubmit={handleCommentSubmit}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={t.namePlaceholder}
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    className="w-full sm:w-72 px-3.5 py-2 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:border-[#0b6330]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {t.commentLabel} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder={t.commentPlaceholder}
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:border-[#0b6330] resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingComment || !commentContent.trim()}
                  className="px-6 py-2.5 bg-[#0b6330] hover:bg-[#074722] text-white font-extrabold text-sm rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submittingComment ? t.submittingComment : t.submitComment}
                </button>
              </form>
            </section>
          </article>

          {/* ===== SIDEBAR KANAN (4 Kolom) ===== */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100/90 space-y-8 sticky top-24">
            {/* Box 1: Pencarian */}
            <div>
              <h3 className="font-extrabold text-base text-gray-900 mb-4 tracking-tight">
                {t.searchSidebarTitle}
              </h3>
              <form onSubmit={handleSidebarSearchSubmit} className="flex">
                <input
                  type="text"
                  placeholder={t.searchSidebarPlaceholder}
                  value={sidebarQuery}
                  onChange={(e) => setSidebarQuery(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-l-lg text-xs focus:outline-none focus:border-[#0b6330] bg-white text-gray-700 shadow-2xs rtl:rounded-l-none rtl:rounded-r-lg"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="bg-[#ffc800] hover:bg-[#e8b500] text-white px-4 py-2.5 rounded-r-lg flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs rtl:rounded-r-none rtl:rounded-l-lg"
                >
                  <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                    />
                  </svg>
                </button>
              </form>
            </div>

            {/* Box 2: Postingan Terkini */}
            <div>
              <h3 className="font-extrabold text-base text-gray-900 mb-4 tracking-tight">
                {t.recentPostsTitle}
              </h3>
              {recentNews.length === 0 ? (
                <p className="text-xs text-gray-400 italic">{t.noOtherNews}</p>
              ) : (
                <div className="space-y-4">
                  {recentNews.map((item) => {
                    const recTitle = getTitle(item);
                    return (
                      <Link
                        key={item.id}
                        href={`/berita/${item.slug}`}
                        className="flex gap-3 group items-center"
                      >
                        <div className="w-20 h-14 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100/80">
                          {item.coverImageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.coverImageUrl}
                              alt={recTitle}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#064e26] to-[#0b6330] text-white p-1">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src="/logo/rumah-amal.png"
                                alt="Rumah Amal"
                                className="h-5 w-auto object-contain brightness-0 invert opacity-90"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-xs font-bold text-gray-800 group-hover:text-[#0b6330] line-clamp-2 leading-snug transition-colors uppercase ${
                              lang === 'ar' ? 'font-serif text-right' : ''
                            }`}
                          >
                            {recTitle}
                          </h4>
                          <p className="text-[11px] text-gray-400 font-medium mt-1">
                            {formatDate(item.publishedAt)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
