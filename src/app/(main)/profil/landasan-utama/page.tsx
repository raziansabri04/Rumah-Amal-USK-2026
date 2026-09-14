"use client";

import { useProfilLang } from "../layout";

export default function LandasanUtamaPage() {
  const { dict, lang } = useProfilLang();
  const lu = dict.landasanUtama;

  return (
    <div className="bg-[#f8f9fa] rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-100/90 shadow-2xs space-y-8">
      
      {/* Heading */}
      <h3 className={`text-2xl md:text-3xl font-black text-[#0b6330] tracking-widest uppercase text-center ${lang === 'ar' ? 'font-serif' : ''}`}>
        {lu.title}
      </h3>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
        {lu.items.map((item, idx) => (
          <div key={idx} className="p-5 rounded-2xl border border-gray-100 bg-white shadow-xs">
            <h4 className="font-bold text-[#0b6330] text-base mb-1.5">{item.title}</h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
