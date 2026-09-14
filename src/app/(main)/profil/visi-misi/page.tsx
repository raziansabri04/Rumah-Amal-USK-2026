"use client";

import Image from "next/image";
import { useProfilLang } from "../layout";

export default function VisiMisiPage() {
  const { dict, lang } = useProfilLang();
  const vm = dict.visiMisi;

  return (
    <div className="space-y-6">
      
      {/* Mosque Header Image */}
      <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 relative w-full h-[300px] sm:h-[360px] md:h-[400px]">
        <Image
          src="/profil/mesjid-jamik2.webp"
          alt="Masjid Jamik Universitas Syiah Kuala"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 800px"
          className="object-cover"
        />
      </div>

      {/* Visi & Misi Card Container */}
      <div className="bg-[#f8f9fa] rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-100/90 shadow-2xs space-y-8">
        
        {/* ===== VISI SECTION ===== */}
        <div className="text-center space-y-4">
          <h3 className={`text-2xl md:text-3xl font-black text-[#0b6330] tracking-widest uppercase ${lang === 'ar' ? 'font-serif' : ''}`}>
            {vm.visiTitle}
          </h3>
          <p className="text-gray-700 text-sm md:text-[15px] leading-relaxed max-w-2xl mx-auto font-medium">
            {vm.visiText}
          </p>
        </div>

        {/* ===== MISI SECTION ===== */}
        <div className="space-y-8 pt-2">
          <h3 className={`text-2xl md:text-3xl font-black text-[#0b6330] tracking-widest uppercase text-center ${lang === 'ar' ? 'font-serif' : ''}`}>
            {vm.misiTitle}
          </h3>

          {/* 2x2 Grid of Misi Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            
            {/* Misi Item 1 */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[2.5px] border-[#0b6330] flex items-center justify-center shrink-0 bg-white shadow-xs">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#0b6330]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 12v-2m-9 1l2.5-4.5h13L21 19m-14-4.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5" />
                </svg>
              </div>
              <p className="text-xs sm:text-[13px] md:text-sm text-gray-700 leading-relaxed font-medium">
                {vm.misi1}
              </p>
            </div>

            {/* Misi Item 2 */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[2.5px] border-[#0b6330] flex items-center justify-center shrink-0 bg-white shadow-xs">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#0b6330]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-3-3m0 0l-3 3m3-3v12M4 17l3 3m0 0l3-3m-3 3V7" />
                </svg>
              </div>
              <p className="text-xs sm:text-[13px] md:text-sm text-gray-700 leading-relaxed font-medium">
                {vm.misi2}
              </p>
            </div>

            {/* Misi Item 3 */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[2.5px] border-[#0b6330] flex items-center justify-center shrink-0 bg-white shadow-xs">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#0b6330]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V10a2 2 0 00-2-2H7a2 2 0 00-2 2v11m14 0H5m14 0h2m-16 0H3m6-11l3-3 3 3m-6 0h6" />
                </svg>
              </div>
              <p className="text-xs sm:text-[13px] md:text-sm text-gray-700 leading-relaxed font-medium">
                {vm.misi3}
              </p>
            </div>

            {/* Misi Item 4 */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[2.5px] border-[#0b6330] flex items-center justify-center shrink-0 bg-white shadow-xs">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#0b6330]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-xs sm:text-[13px] md:text-sm text-gray-700 leading-relaxed font-medium">
                {vm.misi4}
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
