"use client";

import { useBadgeSync } from "@/hooks/use-badge-sync";

/**
 * Pembungkus client kecil supaya hook `useBadgeSync` bisa dipasang di
 * layout server component. Tidak merender apa pun.
 * Efeknya: badge di icon app di-reset saat app/tab dibuka atau kembali terlihat.
 */
export default function BadgeSync() {
  useBadgeSync();
  return null;
}