/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { defaultCache } from "@serwist/turbopack/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";
import { incrementBadgeCount, clearBadgeCount } from "./lib/sw-badge";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}
declare const self: ServiceWorkerGlobalScope;

// Manifest dari build (Next.js/Turbopack). Kosong di dev mode,
// lengkap (termasuk /~offline) di production build.
const manifestEntries = self.__SW_MANIFEST || [];

// Cek apakah /~offline SUDAH otomatis masuk manifest (biasanya iya
// di production build). Kalau sudah ada, JANGAN tambahkan manual lagi,
// karena akan bikin dua entry untuk URL yang sama dengan revision
// berbeda -> Serwist/Workbox menolak install ("add-to-cache-list-
// conflicting-entries") dan seluruh service worker gagal register.
const hasOfflineEntry = manifestEntries.some((entry) =>
  typeof entry === "string"
    ? entry.includes("/~offline")
    : entry.url.includes("/~offline")
);

const serwist = new Serwist({
  precacheEntries: [
    ...manifestEntries,
    // Fallback manual: cuma dipakai saat dev mode (manifest kosong),
    // supaya /~offline tetap ke-precache walau Turbopack dev server
    // tidak generate manifest lengkap.
    ...(hasOfflineEntry ? [] : [{ url: "/~offline", revision: "1" }]),
  ],
  precacheOptions: {
    plugins: [
      {
        // Next.js App Router mengirim header Vary: RSC, Next-Router-State-Tree, dll
        // di setiap response halaman. Kalau Vary ini ikut tersimpan di cache,
        // Cache.match() akan membandingkan header-header itu antara request yang
        // gagal (navigasi asli, bawa header RSC) vs request yang dipakai saat
        // precache (fetch polos tanpa header itu) -> hasilnya cache miss walau
        // entry-nya ada. Solusinya: buang header Vary sebelum disimpan ke cache.
        cacheWillUpdate: async ({ response }) => {
          if (!response) return null;
          const headers = new Headers(response.headers);
          headers.delete("vary");
          const body = await response.clone().arrayBuffer();
          return new Response(body, {
            status: response.status,
            statusText: response.statusText,
            headers,
          });
        },
      },
    ],
  },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();

// TAMBAHAN: tampilkan notifikasi saat push event diterima dari server.
// Tanpa ini, data push yang dikirim server-side via web-push sampai ke
// browser tapi tidak ada yang memerintahkan browser menampilkannya.
self.addEventListener("push", (event) => {
  let data: { title?: string; body?: string; url?: string } = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    // fallback kalau payload bukan JSON valid
    data = { title: "Rumah Amal Masjid Jamik USK", body: event.data?.text() };
  }

  const title = data.title || "Rumah Amal Masjid Jamik USK";
  const options: NotificationOptions = {
    body: data.body || "",
    icon: "/icons/icon-192x192.png", // sesuaikan path icon PWA kamu
    badge: "/icons/icon-192x192.png", // sesuaikan juga
    data: { url: data.url || "/" },
  };

  // Tampilkan notifikasi DAN naikkan angka badge di icon app secara bersamaan.
  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      incrementBadgeCount(),
    ])
  );
});

// TAMBAHAN: saat notifikasi diklik, buka/fokus ke halaman terkait.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data as { url?: string })?.url || "/";

  event.waitUntil(
    Promise.all([
      // User sudah lihat notifikasinya (klik) -> badge di-reset ke 0.
      clearBadgeCount(),
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      }),
    ])
  );
});

// TAMBAHAN: listener pesan dari client (dipanggil oleh hook `useBadgeSync`
// di src/hooks/use-badge-sync.ts). Dipakai untuk kasus user TIDAK klik
// notifikasi (mis. swipe-away) tapi tetap buka/fokus ke app secara manual --
// badge harus tetap ke-reset saat itu.
self.addEventListener("message", (event) => {
  if (event.data?.type === "CLEAR_BADGE") {
    event.waitUntil(clearBadgeCount());
  }
});