"use server";

import { auth } from "@/lib/auth";
import { broadcastPushNotification } from "@/lib/push-broadcast";

export type ManualPushResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

const MAX_TITLE = 65;
const MAX_BODY = 178;

function isValidTarget(url: string) {
  // Path internal ("/pengumuman") atau URL http(s) penuh
  if (url.startsWith("/") && !url.startsWith("//")) return true;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export async function sendManualNotification(input: {
  title: string;
  body: string;
  url: string;
}): Promise<ManualPushResult> {
  // Guard yang sama dengan /api/push/send: hanya role admin
  const session = await auth();
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || userRole !== "admin") {
    return { ok: false, error: "Sesi admin tidak valid. Silakan login ulang." };
  }

  const title = input.title.trim();
  const body = input.body.trim();
  const url = input.url.trim() || "/";

  if (!title) return { ok: false, error: "Judul wajib diisi." };
  if (!body) return { ok: false, error: "Isi notifikasi wajib diisi." };
  if (title.length > MAX_TITLE)
    return { ok: false, error: `Judul maksimal ${MAX_TITLE} karakter.` };
  if (body.length > MAX_BODY)
    return { ok: false, error: `Isi maksimal ${MAX_BODY} karakter.` };
  if (!isValidTarget(url))
    return {
      ok: false,
      error:
        "Tautan harus berupa path seperti /pengumuman atau URL lengkap (https://...).",
    };

  try {
    const { sent, failed, total } = await broadcastPushNotification({
      title,
      body,
      url,
    });

    if (total === 0) {
      return {
        ok: false,
        error: "Belum ada pelanggan yang mengaktifkan notifikasi.",
      };
    }

    const failedNote = failed > 0 ? ` ${failed} perangkat gagal menerima.` : "";
    return {
      ok: true,
      message: `Notifikasi terkirim ke ${sent} dari ${total} perangkat.${failedNote}`,
    };
  } catch (err) {
    console.error("sendManualNotification gagal:", err);
    return {
      ok: false,
      error: "Gagal mengirim notifikasi. Coba lagi beberapa saat.",
    };
  }
}