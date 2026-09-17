/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { defaultCache } from "@serwist/turbopack/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}
declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
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

  event.waitUntil(self.registration.showNotification(title, options));
});

// TAMBAHAN: saat notifikasi diklik, buka/fokus ke halaman terkait.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data as { url?: string })?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});