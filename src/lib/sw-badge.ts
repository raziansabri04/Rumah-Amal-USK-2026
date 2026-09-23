// src/lib/sw-badge.ts
//
// Helper untuk kelola Badge API (angka di icon app) DARI DALAM service worker.
// Disimpan lewat Cache Storage karena service worker tidak punya memory
// persisten antar event — variabel biasa akan hilang tiap kali SW idle/wake.

const BADGE_CACHE_NAME = "ra-badge-store-v1";
const BADGE_CACHE_KEY = "/__badge-count";

/** Ambil jumlah notifikasi belum dibaca yang tersimpan. */
export async function getBadgeCount(): Promise<number> {
  try {
    const cache = await caches.open(BADGE_CACHE_NAME);
    const res = await cache.match(BADGE_CACHE_KEY);
    if (!res) return 0;
    const data = await res.json();
    return typeof data.count === "number" ? data.count : 0;
  } catch {
    return 0;
  }
}

/**
 * Simpan jumlah baru ke storage, lalu apply ke Badge API (icon app).
 * Kalau count 0, badge dihapus (clearAppBadge), bukan ditampilkan angka 0.
 */
export async function setBadgeCount(count: number): Promise<void> {
  const safeCount = Math.max(0, count);

  try {
    const cache = await caches.open(BADGE_CACHE_NAME);
    await cache.put(
      BADGE_CACHE_KEY,
      new Response(JSON.stringify({ count: safeCount }), {
        headers: { "Content-Type": "application/json" },
      })
    );
  } catch {
    // Storage gagal — tetap coba apply badge di bawah, tidak fatal.
  }

  await applyBadge(safeCount);
}

/** Tambah 1 ke counter (dipanggil tiap kali event `push` masuk). */
export async function incrementBadgeCount(): Promise<number> {
  const next = (await getBadgeCount()) + 1;
  await setBadgeCount(next);
  return next;
}

/**
 * Reset counter ke 0 dan hapus badge dari icon app.
 * Dipanggil saat user klik notifikasi, atau saat app dibuka/difokus lagi.
 */
export async function clearBadgeCount(): Promise<void> {
  await setBadgeCount(0);
}

async function applyBadge(count: number): Promise<void> {
  // Badging API: navigator.setAppBadge / clearAppBadge.
  // Didukung Chrome/Edge desktop & Android (app ter-install), belum di Firefox/Safari.
  const nav = self.navigator as Navigator & {
    setAppBadge?: (count?: number) => Promise<void>;
    clearAppBadge?: () => Promise<void>;
  };

  if (!("setAppBadge" in nav)) return;

  try {
    if (count > 0) {
      await nav.setAppBadge(count);
    } else if (nav.clearAppBadge) {
      await nav.clearAppBadge();
    }
  } catch {
    // Bisa reject kalau app belum dibuka dalam mode standalone — aman diabaikan.
  }
}