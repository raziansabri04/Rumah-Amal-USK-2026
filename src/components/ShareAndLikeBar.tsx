'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp, faFacebookF } from '@fortawesome/free-brands-svg-icons';

interface ShareAndLikeBarProps {
  contentType: 'news' | 'announcements' | 'program' | 'newsletter' | 'kampanye' | 'gallery' | string;
  contentId: string;
  title: string;
  initialLikesCount?: number;
  lang?: 'id' | 'en' | 'ar';
  className?: string;
  compact?: boolean;
}

export default function ShareAndLikeBar({
  contentType,
  contentId,
  title,
  initialLikesCount = 0,
  lang = 'id',
  className = '',
  compact = false,
}: ShareAndLikeBarProps) {
  const [likesCount, setLikesCount] = useState<number>(initialLikesCount ?? 0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [copiedInstagram, setCopiedInstagram] = useState<boolean>(false);

  // Fetch latest total likes count from DB on mount / contentId change
  useEffect(() => {
    if (!contentId) return;
    let isMounted = true;

    async function fetchLatestLikes() {
      try {
        const res = await fetch(`/api/likes?type=${encodeURIComponent(contentType)}&id=${encodeURIComponent(contentId)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && typeof data.likesCount === 'number') {
            setLikesCount(data.likesCount);
          }
        }
      } catch (err) {
        console.error('Error fetching likes:', err);
      }
    }

    fetchLatestLikes();

    return () => {
      isMounted = false;
    };
  }, [contentType, contentId]);

  const handleToggleLike = async () => {
    if (isLiking || !contentId) return;

    const nextLikedState = !isLiked;
    const nextCount = nextLikedState ? likesCount + 1 : Math.max(0, likesCount - 1);

    // Optimistic state update
    setIsLiked(nextLikedState);
    setLikesCount(nextCount);
    setIsLiking(true);

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: contentType,
          id: contentId,
          action: nextLikedState ? 'like' : 'unlike',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (typeof data.likesCount === 'number') {
          setLikesCount(data.likesCount);
        }
      } else {
        const errorText = await res.text();
        console.error('API likes error:', res.status, errorText);
      }
    } catch (err) {
      console.error('Error updating like:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const getCurrentUrl = () => {
    if (typeof window !== 'undefined') {
      const current = window.location.href;
      try {
        const urlObj = new URL(current);
        if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
          return `https://rumahamal.usk.ac.id${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
        }
      } catch {
        // Fallback
      }
      return current;
    }
    return 'https://rumahamal.usk.ac.id';
  };

  const handleCopyLink = () => {
    const url = getCurrentUrl();
    if (url && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
      }, 2500);
    }
  };

  const handleInstagramShare = () => {
    const url = getCurrentUrl();
    if (url && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedInstagram(true);
      setTimeout(() => setCopiedInstagram(false), 2500);
    }
    window.open('https://www.instagram.com', '_blank');
  };

  const handleWhatsAppShare = () => {
    const url = getCurrentUrl();
    const shareText = `${title}\n${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleFacebookShare = () => {
    const url = getCurrentUrl();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const getLabelBagikan = () => {
    if (lang === 'ar') return 'مشاركة:';
    if (lang === 'en') return 'Share:';
    return 'Bagikan:';
  };

  const getTooltipText = () => {
    if (lang === 'ar') return ['تم نسخ', 'الرابط!'];
    if (lang === 'en') return ['Link has been', 'copied!'];
    return ['Tautan telah', 'disalin!'];
  };

  const [tooltipLine1, tooltipLine2] = getTooltipText();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Bar: Like Button & Count */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          {/* Tombol Like */}
          <button
            type="button"
            onClick={handleToggleLike}
            disabled={isLiking}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all duration-200 cursor-pointer shadow-2xs ${isLiked
              ? 'bg-rose-50 border-rose-200 text-rose-600 font-extrabold hover:bg-rose-100'
              : 'bg-white border-gray-200 text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-300 hover:text-rose-600'
              }`}
            title={isLiked ? 'Batal Suka' : 'Sukai Konten Ini'}
          >
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${isLiked ? 'scale-110 fill-rose-500 stroke-rose-500' : 'fill-none stroke-current'
                }`}
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm font-extrabold">{likesCount}</span>
            <span className="text-xs text-gray-500 font-medium">
              {lang === 'ar' ? 'إعجاب' : lang === 'en' ? 'Likes' : 'Suka'}
            </span>
          </button>
        </div>
      </div>

      {/* Share Section */}
      <div className="pt-2">
        <p className="font-bold text-gray-900 text-base mb-3 tracking-tight">
          {getLabelBagikan()}
        </p>

        {/* 4 Social Share Buttons Grid */}
        <div className="flex items-center gap-3.5 flex-wrap">
          {/* Instagram Button */}
          <button
            type="button"
            onClick={handleInstagramShare}
            className="relative group w-12 h-12 rounded-2xl bg-[#ea4c89] hover:bg-[#e1306c] text-white flex items-center justify-center shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
            title="Bagikan ke Instagram"
          >
            <FontAwesomeIcon icon={faInstagram} className="!w-[30px] !h-[30px] text-white" />
            {copiedInstagram && (
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#006400] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap z-20 animate-bounce">
                Tautan disalin!
              </span>
            )}
          </button>

          {/* WhatsApp Button */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="w-12 h-12 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
            title="Bagikan ke WhatsApp"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="!w-[30px] !h-[30px] text-white" />
          </button>

          {/* Facebook Button */}
          <button
            type="button"
            onClick={handleFacebookShare}
            className="w-12 h-12 rounded-2xl bg-[#1877F2] hover:bg-[#1565d8] text-white flex items-center justify-center shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
            title="Bagikan ke Facebook"
          >
            <FontAwesomeIcon icon={faFacebookF} className="!w-6 !h-6 text-white" />
          </button>

          {/* Copy Link Button with Speech-Bubble Tooltip */}
          <div className="relative inline-block">
            {/* Tooltip Speech Bubble (Matching User Image 2) */}
            {showTooltip && (
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center animate-fade-in">
                <div className="bg-[#006400] text-white font-extrabold text-xs py-2 px-3.5 rounded-xl shadow-xl text-center leading-tight whitespace-nowrap min-w-[120px]">
                  <div>{tooltipLine1}</div>
                  <div>{tooltipLine2}</div>
                </div>
                {/* Downward Pointer Triangle */}
                <div className="w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-[#006400] -mt-0.5" />
              </div>
            )}

            <button
              type="button"
              onClick={handleCopyLink}
              className="w-12 h-12 rounded-2xl bg-[#e5e7eb] hover:bg-gray-300 text-gray-700 flex items-center justify-center shadow-xs hover:scale-105 transition-all duration-200 cursor-pointer"
              title="Salin Tautan"
            >
              <svg className="w-6 h-6 text-[#374151] fill-current" viewBox="0 0 24 24">
                <path d="M13.59 11.59a3 3 0 0 0-4.24 0l-4.25 4.24a3 3 0 0 0 4.25 4.25l1.41-1.42a1 1 0 0 1 1.42 1.42l-1.42 1.41a5 5 0 0 1-7.07-7.07l4.24-4.24a5 5 0 0 1 7.07 0 1 1 0 0 1-1.41 1.41z" />
                <path d="M10.41 12.41a3 3 0 0 0 4.24 0l4.25-4.24a3 3 0 0 0-4.25-4.25l-1.41 1.42a1 1 0 0 1-1.42-1.42l1.42-1.41a5 5 0 0 1 7.07 7.07l-4.24 4.24a5 5 0 0 1-7.07 0 1 1 0 0 1 1.41-1.41z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
