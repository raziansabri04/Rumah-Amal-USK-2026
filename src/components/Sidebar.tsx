"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarDictionary, SidebarLanguage } from "@/lib/i18n/sidebar";

export default function Sidebar() {
  const pathname = usePathname();
  const [lang, setLang] = useState<SidebarLanguage>("id");

  useEffect(() => {
    const readLang = () => {
      const saved = (localStorage.getItem("language") ||
        localStorage.getItem("app_lang") ||
        "id") as SidebarLanguage;
      if (["id", "en", "ar"].includes(saved)) {
        setLang(saved);
      }
    };
    readLang();
    window.addEventListener("languageChange", readLang);
    return () => window.removeEventListener("languageChange", readLang);
  }, []);

  const t = sidebarDictionary[lang] || sidebarDictionary.id;
  const isAr = lang === "ar";

  const menuItems = [
    { href: "/zakat", label: t.zakat },
    { href: "/infaq", label: t.infaq },
    { href: "/riwayat", label: t.riwayat },
    { href: "/kalkulator", label: t.kalkulator },
  ];

  return (
    <div className="lg:col-span-3 space-y-3">
      {menuItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href === "/zakat" && pathname.startsWith("/zakat"));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-200 flex justify-between items-center text-sm shadow-xs ${
              isAr ? "text-right" : "text-left"
            } ${
              isActive
                ? "bg-[#FFBB0C] text-[#0b6330] shadow-md scale-[1.01]"
                : "bg-gray-100/90 text-gray-700 hover:bg-gray-200 hover:text-[#0b6330]"
            }`}
          >
            <span>{item.label}</span>
            <svg
              className={`w-4 h-4 transition-transform ${
                isAr ? "rotate-180" : ""
              } ${isActive ? "text-[#0b6330] translate-x-0.5" : "text-gray-400"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        );
      })}
    </div>
  );
}
