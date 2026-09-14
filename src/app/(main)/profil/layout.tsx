"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { profilDictionary, ProfilLanguage } from "@/lib/i18n/profil";

interface ProfilContextType {
  lang: ProfilLanguage;
  setLang: (lang: ProfilLanguage) => void;
  dict: typeof profilDictionary['id'];
}

const ProfilContext = createContext<ProfilContextType>({
  lang: 'id',
  setLang: () => {},
  dict: profilDictionary.id,
});

export const useProfilLang = () => useContext(ProfilContext);

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [lang, setLangState] = useState<ProfilLanguage>('id');

  useEffect(() => {
    const saved = (localStorage.getItem('app_lang') || localStorage.getItem('profil_lang') || localStorage.getItem('program_lang')) as ProfilLanguage;
    if (saved && ['id', 'en', 'ar'].includes(saved)) {
      setLangState(saved);
    }
  }, []);

  const changeLanguage = (newLang: ProfilLanguage) => {
    setLangState(newLang);
    localStorage.setItem('profil_lang', newLang);
  };

  const dict = profilDictionary[lang] || profilDictionary.id;

  const isLinkActive = (href: string) => {
    if (href === "/profil") {
      return pathname === "/profil" || pathname === "/profil/";
    }
    return pathname.startsWith(href);
  };

  const activeItemIndex = dict.menuItems.findIndex((item) => isLinkActive(item.href));
  const activeLabel = activeItemIndex !== -1 ? dict.menuItems[activeItemIndex].label : dict.menuItems[0].label;

  return (
    <ProfilContext.Provider value={{ lang, setLang: changeLanguage, dict }}>
      <main className="min-h-screen bg-white pb-24 font-sans">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">



          {/* Content Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left Column: Main Content (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="text-gray-700 text-sm md:text-[15px] leading-relaxed space-y-4 pt-1">
                {children}
              </div>
            </div>

            {/* Right Column: Sidebar Navigation Card (4 cols) */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <div className="bg-[#f4f6f8] rounded-xl overflow-hidden shadow-2xs border border-gray-200/80">
                {dict.menuItems.map((item) => {
                  const isActive = isLinkActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block w-full text-left px-5 py-3.5 text-sm transition-all duration-200 border-b border-gray-200/70 last:border-b-0 cursor-pointer ${
                        isActive
                          ? "border-l-[4px] border-[#0b6330] bg-gray-200/80 text-[#0b6330] font-bold"
                          : "text-gray-700 font-medium hover:bg-gray-100/80 hover:text-[#0b6330]"
                      } ${lang === 'ar' ? 'text-right border-l-0 border-r-[4px]' : ''}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </main>
    </ProfilContext.Provider>
  );
}
