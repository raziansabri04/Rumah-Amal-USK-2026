"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

type Language = "id" | "en" | "ar";

const LANG_OPTIONS: Record<Language, { code: Language; label: string }[]> = {
  id: [
    { code: "id", label: "Indonesia" },
    { code: "en", label: "Inggris" },
    { code: "ar", label: "Arab" },
  ],
  en: [
    { code: "id", label: "Indonesian" },
    { code: "en", label: "English" },
    { code: "ar", label: "Arabic" },
  ],
  ar: [
    { code: "id", label: "الإندونيسية" },
    { code: "en", label: "الإنجليزية" },
    { code: "ar", label: "العربية" },
  ],
};

const NAV_LABELS: Record<Language, Record<string, string>> = {
  id: {
    Beranda: "Beranda",
    Profil: "Profil",
    Program: "Program",
    Kampanye: "Kampanye",
    Berita: "Berita",
    Pengumuman: "Pengumuman",
    Newsletter: "Newsletter",
    Dokumen: "Dokumen",
    Galeri: "Galeri",
    BayarZakat: "Kalkulator Zakat",
    CekRiwayat: "Cek Riwayat Zakat & Infaq",
    Bahasa: "Bahasa",
  },
  en: {
    Beranda: "Home",
    Profil: "Profile",
    Program: "Programs",
    Kampanye: "Campaigns",
    Berita: "News",
    Pengumuman: "Announcements",
    Newsletter: "Newsletter",
    Dokumen: "Documents",
    Galeri: "Gallery",
    BayarZakat: "Zakat Calculator",
    CekRiwayat: "Check Zakat & Infaq History",
    Bahasa: "Language",
  },
  ar: {
    Beranda: "الرئيسية",
    Profil: "الملف التعريفي",
    Program: "البرامج",
    Kampanye: "الحملات",
    Berita: "الأخبار",
    Pengumuman: "الإعلانات",
    Newsletter: "النشرة الإخبارية",
    Dokumen: "الوثائق",
    Galeri: "المعرض",
    BayarZakat: "حاسبة الزكاة",
    CekRiwayat: "التحقق من سجل الزكاة والإنفاق",
    Bahasa: "اللغة",
  },
};

export default function Navbar() {
  const pathname = usePathname();
  const [programDropdownOpen, setProgramDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProgramOpen, setMobileProgramOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>("id");
  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const saved = (localStorage.getItem("app_lang") ||
      localStorage.getItem("program_lang") ||
      localStorage.getItem("profil_lang") ||
      localStorage.getItem("announcement_lang") ||
      localStorage.getItem("dokumen_lang")) as Language;
    if (saved && ["id", "en", "ar"].includes(saved)) {
      setCurrentLang(saved);
    }
  }, []);

  const changeGlobalLanguage = (newLang: Language) => {
    setCurrentLang(newLang);
    localStorage.setItem("app_lang", newLang);
    localStorage.setItem("program_lang", newLang);
    localStorage.setItem("profil_lang", newLang);
    localStorage.setItem("announcement_lang", newLang);
    localStorage.setItem("dokumen_lang", newLang);
    localStorage.setItem("galeri_lang", newLang);
    localStorage.setItem("newsletter_lang", newLang);
    window.dispatchEvent(new Event("languageChange"));
    window.location.reload();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProgramDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const t = NAV_LABELS[currentLang] || NAV_LABELS.id;
  const languages = LANG_OPTIONS[currentLang] || LANG_OPTIONS.id;

  const navLinks = [
    { href: "/", label: t.Beranda },
    { href: "/profil", label: t.Profil },
    { href: "#program", label: t.Program, hasDropdown: true },
    { href: "/berita", label: t.Berita },
    { href: "/pengumuman", label: t.Pengumuman },
    { href: "/newsletter", label: t.Newsletter },
    { href: "/dokumen", label: t.Dokumen },
    { href: "/galeri", label: t.Galeri },
  ];

  const isHomePage = pathname === "/";

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${mobileMenuOpen
          ? "bg-[#383d42] border-b border-transparent shadow-none"
          : isHomePage
            ? isScrolled
              ? "bg-white border-b border-gray-200 shadow-md lg:fixed lg:top-0 lg:inset-x-0 lg:translate-y-0 lg:opacity-100 lg:pointer-events-auto"
              : "bg-white border-b border-gray-200 shadow-2xs lg:fixed lg:top-0 lg:inset-x-0 lg:-translate-y-full lg:opacity-0 lg:pointer-events-none"
            : "bg-white border-b border-gray-200 shadow-2xs"
          }`}
        dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="w-full px-3 sm:px-6 lg:px-4 xl:px-8">
          <div className="flex items-center justify-between h-[64px] sm:h-[68px] gap-1.5 xl:gap-2.5 w-full">

            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/logo/Rumah Amal.png"
                alt="Rumah Amal Masjid Jamik USK"
                width={180}
                height={45}
                priority
                className={` h-8 sm:h-9 xl:h-10 w-auto object-contain transition-all ${mobileMenuOpen ? "brightness-0 invert" : ""
                  }`}
              />
            </Link>

            {/* Flat Nav Links (Stretched with flex-1) */}
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.label}
                    ref={dropdownRef}
                    className="hidden lg:flex flex-1 justify-center relative text-[11px] xl:text-[12.5px] 2xl:text-[13.5px] font-semibold whitespace-nowrap"
                    onMouseEnter={() => setProgramDropdownOpen(true)}
                    onMouseLeave={() => setProgramDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProgramDropdownOpen((prev) => !prev);
                      }}
                      className="group relative flex items-center gap-0.5 px-1 xl:px-1.5 py-1 text-gray-600 hover:text-[#0b6330] transition-colors duration-200 cursor-pointer"
                    >
                      <span>{link.label}</span>
                      <svg
                        className={`w-3 h-3 transition-transform duration-200 ${programDropdownOpen ? "rotate-180 text-[#0b6330]" : "text-gray-400"
                          }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span className="absolute bottom-0 left-0 h-[2.5px] bg-[#0b6330] w-0 group-hover:w-full transition-all duration-300 ease-out" />
                    </button>

                    <div
                      className={`absolute top-full left-0 w-44 pt-1.5 z-50 transition-all duration-200 ease-out transform before:content-[''] before:absolute before:-top-4 before:inset-x-0 before:h-4 ${programDropdownOpen
                        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                        : "opacity-0 translate-y-2 scale-95 pointer-events-none"
                        }`}
                    >
                      <div className="bg-white rounded-xl shadow-2xl border border-gray-100/80 py-1.5 text-left">
                        <Link
                          href="/program"
                          onClick={() => setProgramDropdownOpen(false)}
                          className="block px-4 py-2 text-[13px] text-gray-700 font-semibold hover:bg-gray-50 hover:text-[#0b6330] transition-colors"
                        >
                          {t.Program}
                        </Link>
                        <Link
                          href="/kampanye"
                          onClick={() => setProgramDropdownOpen(false)}
                          className="block px-4 py-2 text-[13px] text-gray-700 font-semibold hover:bg-gray-50 hover:text-[#0b6330] transition-colors"
                        >
                          {t.Kampanye}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`hidden lg:inline-flex flex-1 justify-center text-center group relative px-1 xl:px-1.5 py-1 text-[11px] xl:text-[12.5px] 2xl:text-[13.5px] font-semibold whitespace-nowrap transition-colors duration-200 ${isActive ? "text-[#0b6330] font-bold" : "text-gray-600 hover:text-[#0b6330]"
                    }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[2.5px] bg-[#0b6330] transition-all duration-300 ease-out ${isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                  />
                </Link>
              );
            })}

            {/* Global Language Switcher Dropdown */}
            <div className="hidden lg:relative lg:block shrink-0" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1 px-2 xl:px-2.5 py-1 text-[10px] xl:text-xs font-bold text-white bg-[#0b6330] hover:bg-[#084d25] rounded-lg transition-all duration-200 cursor-pointer shadow-xs"
                aria-expanded={langDropdownOpen}
                aria-label="Select Language"
              >
                <span>{t.Bahasa}</span>
                <svg
                  className={`w-3 h-3 text-white/80 transition-transform duration-200 ${langDropdownOpen ? "rotate-180 text-white" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {langDropdownOpen && (
                <div className={`absolute top-full mt-1.5 w-36 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 z-50 ${currentLang === 'ar' ? 'left-0' : 'right-0'}`}>
                  {languages.map((langItem) => {
                    const isSelected = currentLang === langItem.code;
                    return (
                      <button
                        key={langItem.code}
                        type="button"
                        onClick={() => {
                          changeGlobalLanguage(langItem.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-xs transition-colors cursor-pointer ${currentLang === 'ar' ? 'text-right' : 'text-left'} ${isSelected
                          ? "bg-green-50 text-[#0b6330] font-bold"
                          : "text-gray-700 font-medium hover:bg-gray-50 hover:text-[#0b6330]"
                          }`}
                      >
                        {langItem.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cek Riwayat Zakat & Infaq Button */}
            <Link
              href="/riwayat"
              className="hidden lg:inline-flex items-center justify-center bg-[#ffc800] hover:bg-[#e8b500] text-[#1a1a1a] font-bold text-[10px] xl:text-[12px] px-2 xl:px-3.5 py-1.5 rounded-lg transition-all duration-200 shadow-2xs whitespace-nowrap shrink-0"
            >
              {t.CekRiwayat}
            </Link>

            {/* Kalkulator Zakat Button */}
            <Link
              href="/kalkulator"
              className="hidden lg:inline-flex items-center justify-center bg-[#ffc800] hover:bg-[#e8b500] text-[#1a1a1a] font-bold text-[10px] xl:text-[12px] px-2 xl:px-3.5 py-1.5 rounded-lg transition-all duration-200 shadow-2xs whitespace-nowrap shrink-0"
            >
              {t.BayarZakat}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className={`flex lg:hidden p-2 rounded-lg transition-colors cursor-pointer shrink-0 ${mobileMenuOpen ? "text-white hover:bg-white/10" : "text-gray-700 hover:text-[#0b6330]"
                }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[68px] bottom-0 bg-[#383d42]/90 backdrop-blur-xs z-50 overflow-y-auto px-4 py-4 sm:px-6">
            <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-lg mx-auto flex flex-col gap-2 border border-gray-100">

              {/* Mobile Language Switcher Dropdown */}
              <div className="border-b border-gray-100 pb-3 mb-2">
                <button
                  type="button"
                  onClick={() => setMobileLangOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-[#0b6330] hover:bg-[#084d25] text-white rounded-xl font-bold text-sm transition-all cursor-pointer shadow-xs"
                >
                  <span>{t.Bahasa}</span>
                  <svg
                    className={`w-4 h-4 text-white/80 transition-transform duration-200 ${mobileLangOpen ? "rotate-180 text-white" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {mobileLangOpen && (
                  <div className="mt-1.5 p-1 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-1">
                    {languages.map((langItem) => {
                      const isSelected = currentLang === langItem.code;
                      return (
                        <button
                          key={langItem.code}
                          type="button"
                          onClick={() => {
                            changeGlobalLanguage(langItem.code);
                            setMobileLangOpen(false);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${isSelected ? "bg-[#0b6330] text-white shadow-xs font-bold" : "text-gray-700 font-medium hover:bg-gray-200/60"
                            }`}
                        >
                          {langItem.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Beranda */}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-[17px] font-bold text-[#0b6330] transition-colors"
              >
                {t.Beranda}
              </Link>

              {/* Profil */}
              <Link
                href="/profil"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-[17px] font-medium text-gray-500 hover:text-[#0b6330] transition-colors"
              >
                {t.Profil}
              </Link>

              {/* Program */}
              <div>
                <div
                  onClick={() => setMobileProgramOpen(!mobileProgramOpen)}
                  className="py-2.5 text-[17px] font-bold text-[#0b6330] flex items-center justify-between cursor-pointer"
                >
                  <span>{t.Program}</span>
                  <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${mobileProgramOpen ? "rotate-180" : ""
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {mobileProgramOpen && (
                  <div className="pl-4 py-1 flex flex-col gap-2 border-l-2 border-green-200 my-1">
                    <Link
                      href="/program"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-1.5 text-base font-semibold text-gray-700 hover:text-[#0b6330]"
                    >
                      {t.Program}
                    </Link>
                    <Link
                      href="/kampanye"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-1.5 text-base font-semibold text-gray-700 hover:text-[#0b6330]"
                    >
                      {t.Kampanye}
                    </Link>
                  </div>
                )}
              </div>

              {/* Berita */}
              <Link
                href="/berita"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-[17px] font-bold text-[#0b6330] transition-colors"
              >
                {t.Berita}
              </Link>

              {/* Pengumuman */}
              <Link
                href="/pengumuman"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-[17px] font-bold text-[#0b6330] transition-colors"
              >
                {t.Pengumuman}
              </Link>

              {/* Newsletter */}
              <Link
                href="/newsletter"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-[17px] font-bold text-[#0b6330] transition-colors"
              >
                {t.Newsletter}
              </Link>

              {/* Dokumen */}
              <Link
                href="/dokumen"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-[17px] font-bold text-[#0b6330] transition-colors"
              >
                {t.Dokumen}
              </Link>

              {/* Galeri */}
              <Link
                href="/galeri"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-[17px] font-bold text-[#0b6330] transition-colors mb-1"
              >
                {t.Galeri}
              </Link>

              {/* Cek Riwayat Zakat & Infaq */}
              <Link
                href="/riwayat"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-[#ffc800] hover:bg-[#e8b500] text-[#111111] font-bold text-[16px] text-center px-5 py-3.5 rounded-xl shadow-xs transition-all block mt-2"
              >
                {t.CekRiwayat}
              </Link>

              {/* Kalkulator Zakat */}
              <Link
                href="/kalkulator"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-[#ffc800] hover:bg-[#e8b500] text-[#111111] font-bold text-[16px] text-center px-5 py-3.5 rounded-xl shadow-xs transition-all block mt-2"
              >
                {t.BayarZakat}
              </Link>

            </div>
          </div>
        )}
      </header>
    </>
  );
}
