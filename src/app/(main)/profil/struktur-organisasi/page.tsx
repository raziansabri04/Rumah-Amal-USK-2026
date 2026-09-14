"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useProfilLang } from "../layout";
import { getStrukturOrganisasi } from "@/actions/struktur-organisasi";

export default function StrukturOrganisasiPage() {
  const { dict, lang } = useProfilLang();
  const so = dict.strukturOrganisasi;

  const [imageUrl, setImageUrl] = useState<string>("/profil/struktur-organisasi.png");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchStrukturImage() {
      try {
        const data = await getStrukturOrganisasi();
        if (data?.imageUrl) {
          setImageUrl(data.imageUrl);
        }
      } catch (error) {
        console.error("Gagal mengambil gambar struktur organisasi:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStrukturImage();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">

      {/* Title */}
      <div className="flex flex-col items-center mb-4">
        <h3 className={`text-2xl md:text-3xl font-black text-gray-800 tracking-wide uppercase text-center leading-tight ${lang === 'ar' ? 'font-serif' : ''}`}>
          {so.title}
        </h3>
        <div className="mt-2.5 w-14 h-[3.5px] bg-[#ffc800] rounded-full" />
      </div>

      {/* Structure Image */}
      <div className="w-full relative rounded-2xl overflow-hidden shadow-xs border border-gray-100/80 bg-white p-2 min-h-[300px] flex items-center justify-center">
        {isLoading ? (
          <div className="w-full h-72 bg-gray-50 rounded-xl flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 border-4 border-[#0b6330] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt="Struktur Organisasi Rumah Amal USK"
            width={1200}
            height={800}
            priority
            sizes="(max-width: 1024px) 100vw, 800px"
            className="w-full h-auto object-contain rounded-xl"
            unoptimized={imageUrl.startsWith("http")}
          />
        )}
      </div>

    </div>
  );
}
