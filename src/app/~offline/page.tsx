"use client";

import { useEffect, useState } from "react";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Begitu koneksi balik, auto-reload biar user langsung
      // diarahkan ke halaman asli yang tadi mau dibuka.
      window.location.reload();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-6 text-center dark:bg-gray-950">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#fff7e0]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffc800"
          strokeWidth={1.5}
          className="h-12 w-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.364 5.636a9 9 0 010 12.728M12 12a3 3 0 100-6 3 3 0 000 6zm0 0v6m-6.364-.636a9 9 0 010-12.728M3 3l18 18"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Kamu sedang offline
        </h1>
        <p className="max-w-md text-gray-500 dark:text-gray-400">
          Sepertinya koneksi internet kamu sedang terputus. Halaman yang
          sudah pernah dibuka sebelumnya mungkin masih bisa diakses, tapi
          halaman ini belum sempat tersimpan di perangkatmu.
        </p>
      </div>

      <button
        onClick={handleRetry}
        className="rounded-full border border-[#ffc800] px-6 py-2 font-medium text-[#ffc800] transition hover:bg-[#ffc800] hover:text-white"
      >
        Coba Lagi
      </button>

      {!isOnline && (
        <p className="text-sm text-gray-400">Menunggu koneksi kembali...</p>
      )}
    </main>
  );
}