// src/hooks/use-badge-sync.ts
"use client";

import { useEffect } from "react";

/**
 * Hook client untuk sinkronisasi Badge API (angka notifikasi di icon app).
 *
 * Kenapa perlu ini selain reset di `notificationclick` pada service worker:
 * user bisa saja swipe-away notifikasi tanpa klik, atau buka app manual
 * (bukan lewat notifikasi) — badge tidak akan ke-clear otomatis kalau
 * cuma mengandalkan notificationclick.
 *
 * Hook ini mengirim pesan ke service worker setiap kali tab/app kembali
 * terlihat, supaya badge selalu direset saat user benar-benar membuka app.
 *
 * Pasang sekali saja, di komponen client yang selalu ter-mount
 * (mis. root layout wrapper, atau bareng NotificationToggle di Footer).
 */
export function useBadgeSync() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const clearBadge = () => {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.active?.postMessage({ type: "CLEAR_BADGE" });
        })
        .catch(() => {
          // SW belum siap — aman diabaikan, badge ke-clear di kesempatan berikutnya.
        });
    };

    // Clear saat mount (misal app dibuka langsung, bukan dari notifikasi)
    if (document.visibilityState === "visible") {
      clearBadge();
    }

    // Clear tiap kali tab kembali visible (switch tab lalu balik lagi)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        clearBadge();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
}