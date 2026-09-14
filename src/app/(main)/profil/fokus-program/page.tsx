"use client";

import { useProfilLang } from "../layout";

export default function FokusProgramPage() {
  const { dict, lang } = useProfilLang();
  const fp = dict.fokusProgram;

  const icons = [
    <svg key="1" className="w-7 h-7 sm:w-8 sm:h-8 text-[#0b6330]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 12v-2m-9 1l2.5-4.5h13L21 19m-14-4.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5" /></svg>,
    <svg key="2" className="w-7 h-7 sm:w-8 sm:h-8 text-[#0b6330]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V10a2 2 0 00-2-2H7a2 2 0 00-2 2v11m14 0H5m14 0h2m-16 0H3m6-11l3-3 3 3m-6 0h6" /></svg>,
    <svg key="3" className="w-7 h-7 sm:w-8 sm:h-8 text-[#0b6330]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    <svg key="4" className="w-7 h-7 sm:w-8 sm:h-8 text-[#0b6330]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    <svg key="5" className="w-7 h-7 sm:w-8 sm:h-8 text-[#0b6330]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>,
    <svg key="6" className="w-7 h-7 sm:w-8 sm:h-8 text-[#0b6330]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>,
  ];

  return (
    <div className="bg-[#f8f9fa] rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-100/90 shadow-2xs space-y-8">
      
      {/* Heading */}
      <h3 className={`text-2xl md:text-3xl font-black text-[#0b6330] tracking-widest uppercase text-center ${lang === 'ar' ? 'font-serif' : ''}`}>
        {fp.title}
      </h3>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center pt-2">
        {fp.items.map((text, idx) => (
          <div key={idx} className="flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[2.5px] border-[#0b6330] flex items-center justify-center shrink-0 bg-white shadow-xs">
              {icons[idx % icons.length]}
            </div>
            <p className="text-xs sm:text-[13px] md:text-sm text-gray-700 leading-relaxed font-medium">
              {text}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
