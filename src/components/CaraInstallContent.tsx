"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { InstallAppButton } from "@/components/InstallAppButton";
import InstallGuideIllustration from "@/components/InstallGuideIllustration";
import { useInstallPrompt } from "@/hooks/use-install-prompt";
import {
  installGuideDictionary,
  InstallGuideLanguage,
  InstallGuideTab,
} from "@/lib/i18n/cara-install";

const TAB_ORDER: InstallGuideTab[] = ["android", "ios", "desktop"];

// Aplikasi lain yang membuka website lewat browser bawaannya (install tidak bisa dari sana)
const IN_APP_BROWSER_REGEX =
  /FBAN|FBAV|Instagram|Line\/|MicroMessenger|TikTok|musical_ly|Snapchat|Twitter|GSA\//i;

/**
 * Gambar tiap langkah:
 * 1) pakai screenshot asli di public/cara-install/<tab>-<nomor>.webp kalau filenya ada,
 * 2) kalau belum ada, tampilkan ilustrasi bawaan (InstallGuideIllustration).
 */
function StepImage({
  src,
  alt,
  tab,
  step,
}: {
  src: string;
  alt: string;
  tab: InstallGuideTab;
  step: number;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <InstallGuideIllustration tab={tab} step={step} label={alt} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="mt-3 w-full max-w-xs rounded-xl border border-gray-200 shadow-sm"
    />
  );
}

export default function CaraInstallContent() {
  const [lang, setLang] = useState<InstallGuideLanguage>("id");
  const [tab, setTab] = useState<InstallGuideTab>("android");
  const [inAppBrowser, setInAppBrowser] = useState(false);
  const { isInstalled, platform } = useInstallPrompt();

  // Bahasa: pola yang sama dengan Footer dan halaman lain
  useEffect(() => {
    const readLang = () => {
      const saved = (localStorage.getItem("app_lang") ||
        localStorage.getItem("program_lang")) as InstallGuideLanguage;
      if (saved && ["id", "en", "ar"].includes(saved)) {
        setLang(saved);
      }
    };
    readLang();
    window.addEventListener("languageChange", readLang);
    return () => window.removeEventListener("languageChange", readLang);
  }, []);

  // Tab awal: ?perangkat=android|ios|desktop, kalau tidak ada tebak dari perangkat
  useEffect(() => {
    const ua = window.navigator.userAgent;
    setInAppBrowser(IN_APP_BROWSER_REGEX.test(ua));

    const fromQuery = new URLSearchParams(window.location.search).get(
      "perangkat"
    ) as InstallGuideTab | null;
    if (fromQuery && TAB_ORDER.includes(fromQuery)) {
      setTab(fromQuery);
      return;
    }
    if (platform === "ios") setTab("ios");
    else if (/Android/i.test(ua)) setTab("android");
    else setTab("desktop");
  }, [platform]);

  const dict = installGuideDictionary[lang] || installGuideDictionary.id;
  const guide = dict.platforms[tab];
  const isRtl = lang === "ar";

  return (
    <main
      className="font-sans pb-16 sm:pb-20"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-3xl mx-auto px-5 sm:px-6 pt-12 sm:pt-16">
        {/* ===== Judul ===== */}
        <div className="flex flex-col items-center mb-8 sm:mb-10 text-center">
          <h1
            className={`text-[22px] sm:text-[26px] md:text-[30px] font-extrabold text-[#112b27] tracking-[0.06em] uppercase ${
              isRtl ? "font-serif" : ""
            }`}
          >
            {dict.pageTitle}
          </h1>
          <div className="mt-2.5 w-14 h-[3.5px] bg-[#ffc800] rounded-full" />
          <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-xl leading-relaxed">
            {dict.pageSubtitle}
          </p>
        </div>

        {/* ===== Status khusus ===== */}
        {isInstalled && (
          <div className="mb-6 rounded-xl border border-[#0b6330]/30 bg-[#0b6330]/10 px-4 py-3 text-sm text-[#0b6330] font-semibold">
            {dict.installedNote}
          </div>
        )}
        {inAppBrowser && !isInstalled && (
          <div className="mb-6 rounded-xl border border-[#ffc800] bg-[#fff8dc] px-4 py-3 text-sm text-[#5c4700] leading-relaxed">
            {dict.inAppWarning}
          </div>
        )}

        {/* ===== Apa itu install ===== */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-md">
          <h2 className="text-base sm:text-lg font-extrabold text-[#112b27] mb-2">
            {dict.whatTitle}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {dict.whatBody}
          </p>
          <ul className="mt-4 space-y-2">
            {dict.benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <svg
                  className="mt-0.5 h-4 w-4 flex-none text-[#0b6330]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ===== Pilih perangkat + langkah ===== */}
        <section className="mt-10">
          <h2 className="text-base sm:text-lg font-extrabold text-[#112b27] mb-3">
            {dict.chooseDevice}
          </h2>

          <div
            role="tablist"
            aria-label={dict.chooseDevice}
            className="grid grid-cols-3 gap-2 rounded-xl bg-gray-100 p-1"
          >
            {TAB_ORDER.map((key) => (
              <button
                key={key}
                role="tab"
                id={`tab-${key}`}
                aria-selected={tab === key}
                aria-controls="panel-langkah"
                onClick={() => setTab(key)}
                className={`rounded-lg px-2 py-2.5 text-xs sm:text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b6330] ${
                  tab === key
                    ? "bg-[#0b6330] text-white shadow"
                    : "text-gray-600 hover:bg-white"
                }`}
              >
                {dict.tabs[key]}
              </button>
            ))}
          </div>

          <div
            id="panel-langkah"
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            className="mt-5"
          >
            <p className="mb-4 text-sm font-semibold text-gray-500">
              {guide.label}
            </p>

            <ol className="space-y-4">
              {guide.steps.map((step, index) => (
                <li
                  key={`${tab}-${index}`}
                  className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-md"
                >
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#ffc800] text-sm font-extrabold text-[#111]">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-[15px] font-bold text-[#112b27] leading-snug">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                      {step.desc}
                    </p>
                    <StepImage
                      src={`/cara-install/${tab}-${index + 1}.webp`}
                      alt={step.title}
                      tab={tab}
                      step={index + 1}
                    />
                  </div>
                </li>
              ))}
            </ol>

            {guide.note && (
              <p className="mt-4 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-600 leading-relaxed">
                {guide.note}
              </p>
            )}
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="mt-10">
          <h2 className="text-base sm:text-lg font-extrabold text-[#112b27] mb-3">
            {dict.faqTitle}
          </h2>
          <div className="space-y-3">
            {dict.faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-3 text-sm font-bold text-[#112b27]">
                  <span>{item.q}</span>
                  <svg
                    className="h-4 w-4 flex-none text-gray-400 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ===== CTA ===== */}
        {!isInstalled && (
          <section className="mt-10 rounded-2xl bg-[#002B14] p-6 sm:p-8 text-center text-white">
            <h2 className="text-lg sm:text-xl font-extrabold">
              {dict.ctaTitle}
            </h2>
            <p className="mt-2 mb-5 text-sm text-gray-300 leading-relaxed">
              {dict.ctaDesc}
            </p>
            <div className="flex justify-center">
              <InstallAppButton
                label={dict.ctaButton}
                iosInstructionTitle={dict.ctaButton}
              />
            </div>
          </section>
        )}

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="text-sm font-bold text-[#0b6330] hover:text-[#084823] underline underline-offset-4"
          >
            {dict.backHome}
          </Link>
        </div>
      </div>
    </main>
  );
}
