'use client';

import { useEffect, useState, useCallback, use } from 'react';
import Link from 'next/link';
import ShareAndLikeBar from '@/components/ShareAndLikeBar';

interface Tag {
  id: string;
  name: string;
}

interface CommentReply {
  id: string;
  name: string | null;
  content: string;
  createdAt: string;
}

interface CommentItem {
  id: string;
  name: string | null;
  content: string;
  createdAt: string;
  replies?: CommentReply[];
}

interface AnnouncementDetail {
  id: string;
  title: string;
  titleAr?: string | null;
  titleEn?: string | null;
  slug: string;
  category: string | null;
  coverImageUrl: string | null;
  content: string;
  contentAr?: string | null;
  contentEn?: string | null;
  viewsCount: number;
  likesCount?: number;
  publishedAt: string;
  tags?: Tag[];
}

type Language = 'id' | 'en' | 'ar';

export default function PublicAnnouncementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [announcement, setAnnouncement] = useState<AnnouncementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [lang, setLang] = useState<Language>('id');

  // Form State Komentar Utama
  const [commentName, setCommentName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const [recentAnnouncements, setRecentAnnouncements] = useState<AnnouncementDetail[]>([]);
  const [sidebarQuery, setSidebarQuery] = useState('');

  useEffect(() => {
    const savedLang = localStorage.getItem('announcement_lang') as Language;
    if (savedLang && ['id', 'en', 'ar'].includes(savedLang)) {
      setLang(savedLang);
    }
  }, []);

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('announcement_lang', newLang);
  };

  // Fetch Announcement & Recent Announcements
  const fetchAnnouncement = useCallback(async () => {
    setLoading(true);
    try {
      const [detailRes, listRes] = await Promise.all([
        fetch(`/api/announcements?slug=${encodeURIComponent(slug)}`),
        fetch(`/api/announcements`)
      ]);

      if (detailRes.ok) {
        const data = await detailRes.json();
        setAnnouncement(data.announcement);

        if (data.announcement?.id) {
          fetch(`/api/announcements/${data.announcement.id}/views`, { method: 'POST' }).catch(() => {});
          fetchComments(data.announcement.id);
        }
      }

      if (listRes.ok) {
        const listData = await listRes.json();
        setRecentAnnouncements((listData.announcements || []).slice(0, 5));
      }
    } catch (err) {
      console.error('Error loading announcement:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Fetch Comments
  const fetchComments = async (announcementId: string) => {
    setLoadingComments(true);
    try {
      const res = await fetch(`/api/announcements/${announcementId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchAnnouncement();
  }, [fetchAnnouncement]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !announcement) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/announcements/${announcement.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: commentName.trim() || 'Anonim',
          content: commentContent.trim(),
        }),
      });

      const isJson = res.headers.get('content-type')?.includes('application/json');
      if (res.ok && isJson) {
        setCommentContent('');
        setCommentName('');
        fetchComments(announcement.id);
      } else {
        const errorData = isJson ? await res.json() : null;
        alert(`Gagal mengirim komentar: ${errorData?.error || 'Server Error (' + res.status + ')'}`);
      }
    } catch (err) {
      alert(`Error: ${(err as Error).message}`);
    } finally {
      setSubmittingComment(false);
    }
  };

  const getTitle = (item: AnnouncementDetail) => {
    if (lang === 'en' && item.titleEn) return item.titleEn;
    if (lang === 'ar' && item.titleAr) return item.titleAr;
    return item.title;
  };

  const getContent = (item: AnnouncementDetail) => {
    if (lang === 'en' && item.contentEn) return item.contentEn;
    if (lang === 'ar' && item.contentAr) return item.contentAr;
    return item.content;
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

  const formatRelativeTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return lang === 'ar' ? 'اليوم' : lang === 'en' ? 'Today' : 'Hari ini';
      if (diffDays === 1) return lang === 'ar' ? 'أمس' : lang === 'en' ? 'Yesterday' : 'Kemarin';
      if (diffDays < 30) return `${diffDays} ${lang === 'ar' ? 'أيام مضت' : lang === 'en' ? 'days ago' : 'hari yang lalu'}`;
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} ${lang === 'ar' ? 'أشهر مضت' : lang === 'en' ? 'months ago' : 'bulan yang lalu'}`;
    } catch {
      return formatDate(dateStr);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-4 bg-gray-200 w-1/4 rounded mb-6" />
          <div className="h-8 bg-gray-200 w-3/4 rounded mb-4" />
          <div className="h-64 bg-gray-100 rounded-2xl mb-8" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 w-full rounded" />
            <div className="h-4 bg-gray-200 w-5/6 rounded" />
            <div className="h-4 bg-gray-200 w-4/6 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="min-h-screen bg-white py-16 px-4 text-center font-sans">
        <div className="max-w-md mx-auto bg-gray-50 p-8 rounded-2xl border border-gray-200">
          <span className="text-4xl mb-3 block">📢</span>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {lang === 'ar' ? 'الإعلان غير موجود' : lang === 'en' ? 'Announcement Not Found' : 'Pengumuman Tidak Ditemukan'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {lang === 'ar'
              ? 'الإعلان الذي تبحث عنه غير متوفر أو تم حذفه.'
              : lang === 'en'
              ? 'The announcement you are looking for is not available or has been deleted.'
              : 'Pengumuman yang Anda cari tidak tersedia atau telah dihapus.'}
          </p>
          <Link
            href="/"
            className="px-5 py-2.5 bg-[#0b6330] text-white font-bold rounded-xl text-sm inline-block hover:bg-[#074722] transition-colors"
          >
            {lang === 'ar' ? 'العودة إلى الرئيسية' : lang === 'en' ? 'Back to Home' : 'Kembali ke Beranda'}
          </Link>
        </div>
      </div>
    );
  }

  const handleSidebarSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sidebarQuery.trim()) {
      window.location.href = `/pengumuman?q=${encodeURIComponent(sidebarQuery.trim())}`;
    }
  };

  const hasArabicTitle = Boolean(announcement.titleAr && announcement.titleAr.trim() !== '');
  const hasArabicContent = Boolean(announcement.contentAr && announcement.contentAr.trim() !== '');

  const isTitleRtl = lang === 'ar' && hasArabicTitle;
  const isContentRtl = lang === 'ar' && hasArabicContent;

  const displayTitle = getTitle(announcement);
  const displayContent = getContent(announcement);

  return (
    <div className="min-h-screen bg-[#f8fafc]/50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      <div className="max-w-[1340px] mx-auto">

        {/* Layout 2 Kolom */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ===== KAMPUS/ARTIKEL UTAMA (Kiri - 8 Kolom) ===== */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100/90">

            {/* Judul Besar */}
            <h1 className={`text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug mb-6 uppercase ${isTitleRtl ? 'font-serif text-right' : ''}`} dir={isTitleRtl ? 'rtl' : 'ltr'}>
              {displayTitle}
            </h1>

            {/* Gambar Sampul */}
            {announcement.coverImageUrl && (
              <div className="mb-6 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={announcement.coverImageUrl}
                  alt={displayTitle}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Isi Konten Artikel */}
            <div className="prose max-w-none text-gray-800 mb-8">
              <style>{`
                .public-article-content p { margin-bottom: 1.25rem; line-height: 1.8; font-size: 1.05rem; }
                .public-article-content h1 { font-size: 1.75rem; font-weight: 800; margin-top: 1.75rem; margin-bottom: 0.75rem; }
                .public-article-content h2 { font-size: 1.4rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.6rem; }
                .public-article-content h3 { font-size: 1.15rem; font-weight: 700; margin-top: 1.25rem; margin-bottom: 0.5rem; }
                .public-article-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
                .public-article-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.25rem; }
                .public-article-content li { margin-bottom: 0.35rem; }
                .public-article-content blockquote { border-left: 4px solid #d1d5db; padding-left: 1rem; color: #6b7280; font-style: italic; margin: 1.25rem 0; }
                .public-article-content a { color: #2563eb; text-decoration: underline; }
                .public-article-content img { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 1.25rem 0; }
                .rtl-body { text-align: right; direction: rtl; font-family: serif, sans-serif; }
                .rtl-body blockquote { border-left: none; border-right: 4px solid #d1d5db; padding-left: 0; padding-right: 1rem; }
                .rtl-body ul, .rtl-body ol { padding-left: 0; padding-right: 1.5rem; }
                div[data-type="bank-banner"] { direction: ltr !important; unicode-bidi: isolate !important; text-align: center !important; }
                div[data-type="bank-banner"] div { direction: ltr !important; text-align: center !important; }
                .public-article-content a[data-type="download-button"],
                .public-article-content a[data-type="link-button"],
                .public-article-content a[download],
                .public-article-content div.my-4 a,
                .public-article-content div:has(> a[data-type="download-button"]),
                .public-article-content div:has(> a[data-type="link-button"]) {
                  display: flex !important;
                  width: 100% !important;
                  justify-content: center !important;
                  text-align: center !important;
                  box-sizing: border-box !important;
                  border-radius: 16px !important;
                  direction: ltr !important;
                  unicode-bidi: isolate !important;
                }
                .public-article-content a[data-type="download-button"],
                .public-article-content a[data-type="link-button"],
                .public-article-content a[download],
                .public-article-content div.my-4 a {
                  background: #0b6330 !important;
                  color: #ffffff !important;
                  padding: 12px 24px !important;
                  font-weight: 700 !important;
                  text-decoration: none !important;
                  font-size: 14px !important;
                  box-shadow: 0 2px 8px rgba(11, 99, 48, 0.25) !important;
                  margin: 16px 0 !important;
                }
              `}</style>
              <div
                className={`public-article-content ${isContentRtl ? 'rtl-body' : 'ltr-body'}`}
                dir={isContentRtl ? 'rtl' : 'ltr'}
                dangerouslySetInnerHTML={{ __html: displayContent }}
              />
            </div>

            {/* Informasi Views, Tags & Bagikan */}
            <div className="pt-6 border-t border-gray-200 mb-8 space-y-6">
              <div className="flex items-center gap-6 text-gray-600 text-sm font-semibold flex-wrap">
                <div className="flex items-center gap-2" title="Jumlah Pembaca / Views">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-gray-800 font-extrabold text-base">{announcement.viewsCount || 0}</span>
                  <span className="text-xs text-gray-500 font-medium">
                    {lang === 'ar' ? 'مشاهدة' : lang === 'en' ? 'views' : 'pembaca'}
                  </span>
                </div>

                <div className="flex items-center gap-2" title="Tags">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {announcement.tags && announcement.tags.length > 0 ? (
                    <div className="flex gap-1.5">
                      {announcement.tags.map((tag) => (
                        <span key={tag.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 font-normal">
                      {lang === 'ar' ? 'عام' : lang === 'en' ? 'General' : 'Umum'}
                    </span>
                  )}
                </div>
              </div>

              {/* Share & Like Bar */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
                <ShareAndLikeBar
                  contentType="announcements"
                  contentId={announcement.id}
                  title={displayTitle}
                  initialLikesCount={announcement.likesCount || 0}
                  lang={lang}
                />
              </div>
            </div>

            {/* Seksi Komentar */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-extrabold text-gray-900 mb-6">
                {lang === 'ar' ? 'التعليقات' : lang === 'en' ? 'Comments' : 'Komentar'} ({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})
              </h3>

              {/* Form Input Komentar Utama */}
              <div className="bg-gray-50/70 border border-gray-200 rounded-2xl p-5 shadow-2xs mb-8">
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder={lang === 'ar' ? 'الاسم (اختياري)' : lang === 'en' ? 'Name (optional)' : 'Nama (optional)'}
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#0b6330] bg-white"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={3}
                      placeholder={lang === 'ar' ? 'اكتب تعليقك هنا...' : lang === 'en' ? 'Write your comment here...' : 'Tulis komentar Anda...'}
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#0b6330] bg-white"
                      required
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={submittingComment}
                      className="px-6 py-2.5 bg-[#0b6330] hover:bg-[#074722] text-white font-bold text-sm rounded-xl transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
                    >
                      {submittingComment ? 'Sending…' : (lang === 'ar' ? 'إرسال التعليق' : lang === 'en' ? 'Submit Comment' : 'Kirim Komentar')}
                    </button>
                  </div>
                </form>
              </div>

              {/* List Komentar */}
              {loadingComments ? (
                <div className="text-sm text-gray-400 py-4 animate-pulse">
                  {lang === 'ar' ? 'جاري تحميل التعليقات...' : lang === 'en' ? 'Loading comments...' : 'Memuat komentar…'}
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-sm">
                  {lang === 'ar' ? 'لا يوجد تعليقات حتى الآن.' : lang === 'en' ? 'No comments yet. Be the first to comment!' : 'Belum ada komentar. Jadilah yang pertama memberikan komentar!'}
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-extrabold text-gray-900 text-sm">
                          {comment.name || 'Anonim'}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 leading-relaxed mb-3 whitespace-pre-line">
                        {comment.content}
                      </p>

                      {/* Child Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-[#0b6330] space-y-3 rtl:pl-0 rtl:pr-4 rtl:border-l-0 rtl:border-r-2">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100/80">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-extrabold text-[#0b6330] text-xs">
                                  {reply.name || 'Admin Rumah Amal USK'}
                                </span>
                                <span className="text-[10px] bg-[#0b6330] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                  Admin
                                </span>
                                <span className="text-[11px] text-gray-400 font-medium ml-auto">
                                  {formatRelativeTime(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-line">
                                {reply.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ===== SIDEBAR KANAN (4 Kolom) ===== */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100/90 space-y-8 sticky top-24">

            {/* Box 1: Pencarian */}
            <div>
              <h3 className="font-extrabold text-base text-gray-900 mb-4 tracking-tight">
                {lang === 'ar' ? 'البحث' : lang === 'en' ? 'Search' : 'Pencarian'}
              </h3>
              <form onSubmit={handleSidebarSearchSubmit} className="flex">
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'ابحث عن الإعلانات...' : lang === 'en' ? 'Search announcements...' : 'Cari pengumuman berdasarkan judul....'}
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
                    <path fillRule="evenodd" clipRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Box 2: Postingan Terkini */}
            <div>
              <h3 className="font-extrabold text-base text-gray-900 mb-4 tracking-tight">
                {lang === 'ar' ? 'أحدث الإعلانات' : lang === 'en' ? 'Recent Posts' : 'Postingan Terkini'}
              </h3>
              <div className="space-y-4">
                {recentAnnouncements.map((item) => {
                  const recTitle = getTitle(item);
                  return (
                    <Link
                      key={item.id}
                      href={`/pengumuman/${item.slug}`}
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
                        <h4 className={`text-xs font-bold text-gray-800 group-hover:text-[#0b6330] line-clamp-2 leading-snug transition-colors uppercase ${lang === 'ar' ? 'font-serif text-right' : ''}`}>
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
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
