"use client";

import { useState, useTransition } from "react";
import { sendManualNotification } from "@/actions/push-manual";

const MAX_TITLE = 65;
const MAX_BODY = 178;

export default function SendNotificationForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/");
  const [confirming, setConfirming] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const canSubmit = title.trim().length > 0 && body.trim().length > 0 && !pending;

  function reset() {
    setTitle("");
    setBody("");
    setUrl("/");
  }

  function handleSend() {
    setFeedback(null);
    startTransition(async () => {
      const res = await sendManualNotification({ title, body, url });
      setConfirming(false);
      if (res.ok) {
        setFeedback({ ok: true, text: res.message });
        reset();
      } else {
        setFeedback({ ok: false, text: res.error });
      }
    });
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0a3d2a] focus:ring-2 focus:ring-[#0a3d2a]/20";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-5">
        <div>
          <label htmlFor="push-title" className="mb-1 block text-sm font-medium text-gray-800">
            Judul
          </label>
          <input
            id="push-title"
            className={inputClass}
            value={title}
            maxLength={MAX_TITLE}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Jadwal Kajian Jumat Malam"
          />
          <p className="mt-1 text-right text-xs text-gray-500">
            {title.length}/{MAX_TITLE}
          </p>
        </div>

        <div>
          <label htmlFor="push-body" className="mb-1 block text-sm font-medium text-gray-800">
            Isi notifikasi
          </label>
          <textarea
            id="push-body"
            className={inputClass}
            rows={4}
            value={body}
            maxLength={MAX_BODY}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Tulis pesan singkat yang langsung ke inti."
          />
          <p className="mt-1 text-right text-xs text-gray-500">
            {body.length}/{MAX_BODY}
          </p>
        </div>

        <div>
          <label htmlFor="push-url" className="mb-1 block text-sm font-medium text-gray-800">
            Halaman tujuan saat notifikasi diketuk
          </label>
          <input
            id="push-url"
            className={inputClass}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/pengumuman"
          />
          <p className="mt-1 text-xs text-gray-500">
            Isi path seperti <code>/pengumuman</code> atau <code>/kalkulator-zakat</code>.
          </p>
        </div>

        {feedback && (
          <div
            role="status"
            className={`rounded-lg px-4 py-3 text-sm ${
              feedback.ok
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {feedback.text}
          </div>
        )}

        {!confirming ? (
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => setConfirming(true)}
            className="rounded-lg bg-[#0a3d2a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d4d35] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Kirim notifikasi
          </button>
        ) : (
          <div className="rounded-lg border border-[#ffc800] bg-[#fff8dc] p-4">
            <p className="text-sm text-gray-800">
              Notifikasi ini akan langsung diterima semua pelanggan dan tidak bisa
              ditarik kembali. Lanjutkan?
            </p>
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                disabled={pending}
                onClick={handleSend}
                className="rounded-lg bg-[#0a3d2a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0d4d35] disabled:opacity-60"
              >
                {pending ? "Mengirim..." : "Ya, kirim sekarang"}
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => setConfirming(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-white disabled:opacity-60"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pratinjau seperti tampilan notifikasi di HP */}
      <aside aria-label="Pratinjau notifikasi">
        <p className="mb-2 text-sm font-medium text-gray-800">Pratinjau</p>
        <div className="rounded-2xl bg-gray-100 p-4">
          <div className="flex gap-3 rounded-xl bg-white p-3 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-192.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-lg"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                {title || "Judul notifikasi"}
              </p>
              <p className="mt-0.5 line-clamp-3 break-words text-sm text-gray-600">
                {body || "Isi notifikasi akan tampil di sini."}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}