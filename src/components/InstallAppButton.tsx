"use client";

import { useState } from "react";
import { useInstallPrompt } from "@/hooks/use-install-prompt";

interface InstallAppButtonProps {
  label?: string;
  iosInstructionTitle?: string;
}

export function InstallAppButton({
  label = "Install Aplikasi",
  iosInstructionTitle = "Install Aplikasi",
}: InstallAppButtonProps) {
  const { isInstalled, platform, canPromptNatively, promptInstall } =
    useInstallPrompt();
  const [showModal, setShowModal] = useState(false);

  // Tombol tetap ditampilkan untuk semua platform (termasuk Firefox/Safari desktop)
  // karena kita tetap ingin memberi tahu cara alternatif, kecuali app sudah ter-install.
  if (isInstalled) return null;

  const handleClick = async () => {
    if (canPromptNatively) {
      await promptInstall();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        aria-label={label}
        className="inline-flex items-center justify-center gap-2 border border-[#ffc800] text-[#ffc800] font-extrabold text-sm px-8 py-3 rounded-full transition-all duration-200 hover:bg-[#ffc800] hover:text-[#111]"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
        </svg>
        {label}
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#002B14]">
                {iosInstructionTitle}
              </h3>
              <button onClick={() => setShowModal(false)} aria-label="Tutup">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {platform === "ios" && (
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-100 text-xs font-semibold">1</span>
                  <span>Tap tombol <b>Bagikan/Share</b> di Safari</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-100 text-xs font-semibold">2</span>
                  <span>Pilih <b>Add to Home Screen</b></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-100 text-xs font-semibold">3</span>
                  <span>Tap <b>Add</b> di pojok kanan atas</span>
                </li>
              </ol>
            )}

            {platform === "firefox-desktop" && (
              <p className="text-sm text-gray-700">
                Firefox belum mendukung instalasi aplikasi web (PWA) di desktop.
                Untuk menginstal aplikasi ini, silakan buka website kami menggunakan{" "}
                <b>Google Chrome</b> atau <b>Microsoft Edge</b>, lalu klik tombol
                ini lagi.
              </p>
            )}

            {platform === "safari-desktop" && (
              <p className="text-sm text-gray-700">
                Safari di macOS belum mendukung instalasi aplikasi web (PWA)
                dengan cara ini. Untuk menginstal aplikasi ini, silakan buka
                website kami menggunakan <b>Google Chrome</b> atau{" "}
                <b>Microsoft Edge</b>, lalu klik tombol ini lagi.
              </p>
            )}

            {platform === "chromium" && (
              <p className="text-sm text-gray-700">
                Buka menu browser (ikon titik tiga di pojok kanan atas), lalu
                pilih <b>Install App</b> atau <b>Add to Home Screen</b>.
              </p>
            )}

            {platform === "unsupported" && (
              <p className="text-sm text-gray-700">
                Browser ini belum mendukung instalasi aplikasi web secara
                langsung. Coba gunakan <b>Google Chrome</b> atau{" "}
                <b>Microsoft Edge</b> untuk pengalaman terbaik.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}