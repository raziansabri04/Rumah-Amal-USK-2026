"use client";

import Image from "next/image";
import { useProfilLang } from "./layout";

export default function ProfilPage() {
  const { dict, lang } = useProfilLang();
  const pData = dict.profilSingkat;

  return (
    <div className="space-y-6">
      {/* Mosque Header Image */}
      <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 relative w-full h-[300px] sm:h-[360px] md:h-[400px]">
        <Image
          src="/profil/mesjid-jamik.png"
          alt="Masjid Jamik Universitas Syiah Kuala"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 800px"
          className="object-cover"
        />
      </div>

      {/* Title */}
      <h2 className={`text-xl md:text-2xl font-black text-[#0b6330] tracking-wide uppercase mt-2 ${lang === 'ar' ? 'font-serif' : ''}`}>
        {pData.title}
      </h2>

      {/* Description Content */}
      <div className="text-gray-700 text-sm md:text-[15px] leading-relaxed space-y-4">
        <p className="leading-relaxed">{pData.p1}</p>
        <p className="leading-relaxed">{pData.p2}</p>
        <p className="leading-relaxed">{pData.p3}</p>
      </div>
    </div>
  );
}
