"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faXmark,
  faSpinner,
  faCircleCheck,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { saveSubscription } from "@/actions/push-subscription";
import {
  PUSH_OPT_OUT_KEY,
  PUSH_STATUS_EVENT,
  pushSupported,
  urlBase64ToUint8Array,
} from "@/lib/push-client";

// Berapa lama banner "istirahat" setelah user klik "Nanti Saja"
// sebelum ditawarkan lagi lewat banner penuh. Sebelum itu, tetap
// ada tombol bell mengambang supaya user tetap punya jalan untuk
// mengaktifkan notifikasi kapan saja tanpa harus nunggu.
const SNOOZE_DAYS = 7;
const DISMISS_KEY = "ra-push-banner-dismissed-at";

// Jeda sebelum banner/bell ditampilkan ke user, biar tidak langsung
// "menyerbu" begitu halaman dibuka.
const SHOW_DELAY_MS = 4000;

type BannerState = "hidden" | "banner" | "bell";
type FeedbackState = "idle" | "loading" | "success" | "error";

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  const displayModeStandalone = window.matchMedia(
    "(display-mode: standalone)"
  ).matches;
  // iOS Safari (Add to Home Screen) tidak mendukung display-mode media query,
  // tapi expose navigator.standalone
  const iosStandalone = (window.navigator as unknown as { standalone?: boolean })
    .standalone;
  return displayModeStandalone || iosStandalone === true;
}

export default function PushNotificationBanner() {
  const [state, setState] = useState<BannerState>("hidden");
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // FIX #1: ref buat nyimpen timeout ID, supaya bisa di-clear kalau
  // komponen unmount sebelum timeout selesai jalan (mencegah warning
  // "Can't perform a React state update on an unmounted component").
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ref buat timeout delay kemunculan banner/bell pertama kali.
  const showDelayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isStandaloneMode() || !pushSupported()) return;

    const permission = Notification.permission;

    if (permission === "denied") {
      // Browser sudah memblokir - JS tidak bisa memunculkan prompt lagi,
      // jadi jangan ganggu user dengan banner/bell yang tidak bisa dipakai.
      setState("hidden");
      return;
    }

    if (permission === "granted") {
      // Sudah diizinkan sebelumnya - pastikan subscription masih ada di
      // browser & tersimpan di server. Kalau hilang (mis. cache dibersihkan),
      // subscribe ulang secara diam-diam tanpa menampilkan banner.
      // Kecuali user sengaja mematikannya lewat toggle di footer: izin browser
      // tetap "granted" setelah unsubscribe, jadi hormati pilihan itu.
      if (localStorage.getItem(PUSH_OPT_OUT_KEY) !== "1") {
        syncExistingSubscription();
      }
      setState("hidden");
      return;
    }

    // permission === "default" -> belum pernah diputuskan.
    // Tunda kemunculan banner/bell beberapa detik biar tidak langsung
    // muncul begitu halaman kebuka.
    showDelayTimeoutRef.current = setTimeout(() => {
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      if (!dismissedAt) {
        setState("banner");
        return;
      }

      const daysSinceDismiss =
        (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
      setState(daysSinceDismiss >= SNOOZE_DAYS ? "banner" : "bell");
    }, SHOW_DELAY_MS);
  }, []);

  // Cleanup timeout delay kalau komponen unmount sebelum delay selesai
  useEffect(() => {
    return () => {
      if (showDelayTimeoutRef.current) clearTimeout(showDelayTimeoutRef.current);
    };
  }, []);

  // Kalau notifikasi diaktifkan/dimatikan lewat NotificationToggle di footer
  // saat banner belum/sedang tampil, sembunyikan banner (izin sudah diputuskan).
  useEffect(() => {
    const handleStatusChange = () => {
      if (!pushSupported() || Notification.permission === "default") return;
      if (showDelayTimeoutRef.current) clearTimeout(showDelayTimeoutRef.current);
      setState("hidden");
    };
    window.addEventListener(PUSH_STATUS_EVENT, handleStatusChange);
    return () => window.removeEventListener(PUSH_STATUS_EVENT, handleStatusChange);
  }, []);

  // FIX #1: cleanup timeout kalau komponen unmount duluan
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    };
  }, []);

  const syncExistingSubscription = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existing = await registration.pushManager.getSubscription();
      if (existing) return;

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) return;

      const newSub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
      const json = newSub.toJSON();
      if (json.endpoint && json.keys?.p256dh && json.keys?.auth) {
        await saveSubscription({
          endpoint: json.endpoint,
          p256dh: json.keys.p256dh,
          auth: json.keys.auth,
        });
      }
    } catch (err) {
      // Diam-diam gagal saja - ini proses sinkronisasi latar belakang,
      // bukan aksi yang diminta user secara langsung.
      console.error("Gagal sinkronisasi push subscription:", err);
    }
  }, []);

  const handleActivate = useCallback(async () => {
    setFeedback("loading");
    setErrorMessage(null);

    try {
      const permission = await Notification.requestPermission();

      // FIX #2: pisahkan "denied" (permanen) dari hasil non-granted lainnya (snooze biasa)
      if (permission === "denied") {
        // Browser yang blokir permanen - JS gak bisa munculin dialog ini lagi,
        // jadi sembunyikan seterusnya (beda case sama snooze biasa).
        localStorage.setItem(DISMISS_KEY, String(Date.now()));
        setState("hidden");
        return;
      }

      if (permission !== "granted") {
        // Dialog cuma ke-dismiss / hasil ambigu lainnya - masih mungkin
        // user berubah pikiran, jadi snooze biasa aja (muncul lagi lewat bell).
        localStorage.setItem(DISMISS_KEY, String(Date.now()));
        setState("bell");
        setFeedback("idle");
        return;
      }

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        throw new Error("VAPID public key belum dikonfigurasi");
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      const json = subscription.toJSON();
      if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
        throw new Error("Data subscription tidak lengkap");
      }

      await saveSubscription({
        endpoint: json.endpoint,
        p256dh: json.keys.p256dh,
        auth: json.keys.auth,
      });

      localStorage.removeItem(DISMISS_KEY);
      localStorage.removeItem(PUSH_OPT_OUT_KEY);
      // Beri tahu NotificationToggle di footer supaya status-nya ikut berubah
      window.dispatchEvent(new Event(PUSH_STATUS_EVENT));
      setFeedback("success");
      // FIX #1: simpan timeout ID ke ref, bukan langsung setTimeout lepas
      successTimeoutRef.current = setTimeout(() => setState("hidden"), 1800);
    } catch (err) {
      console.error("Gagal mengaktifkan notifikasi:", err);
      setFeedback("error");
      setErrorMessage("Gagal mengaktifkan notifikasi. Coba lagi nanti.");
    }
  }, []);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setState("bell");
    setFeedback("idle");
  }, []);

  const handleReopen = useCallback(() => {
    setState("banner");
    setFeedback("idle");
  }, []);

  if (state === "hidden") return null;

  if (state === "bell") {
    return (
      <button
        onClick={handleReopen}
        aria-label="Aktifkan notifikasi"
        className="fixed bottom-5 left-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#0a3d2a] text-[#f0a500] shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <FontAwesomeIcon icon={faBell} className="text-lg" />
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={handleDismiss}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-[#0a3d2a] p-5 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0a500]/15">
            <FontAwesomeIcon icon={faBell} className="text-[#f0a500]" />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold">Aktifkan Notifikasi</p>
            <p className="mt-1 text-xs text-white/80">
              Dapatkan pemberitahuan langsung untuk pengumuman dan berita
              terbaru dari Rumah Amal Masjid Jamik USK.
            </p>

            {feedback === "error" && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-red-300">
                <FontAwesomeIcon icon={faCircleExclamation} />
                {errorMessage}
              </p>
            )}
            {feedback === "success" && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-300">
                <FontAwesomeIcon icon={faCircleCheck} />
                Notifikasi aktif!
              </p>
            )}

            <div className="mt-3 flex gap-2">
              <button
                onClick={handleActivate}
                disabled={feedback === "loading" || feedback === "success"}
                className="flex items-center gap-1.5 rounded-lg bg-[#f0a500] px-3 py-1.5 text-xs font-semibold text-[#0a3d2a] transition-colors hover:bg-[#f0a500]/90 disabled:opacity-70"
              >
                {feedback === "loading" && (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                )}
                Aktifkan
              </button>
              <button
                onClick={handleDismiss}
                disabled={feedback === "loading"}
                className="rounded-lg border border-white/25 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white hover:border-white/40 disabled:opacity-50"
              >
                Nanti Saja
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            aria-label="Tutup"
            className="shrink-0 text-white/50 transition-colors hover:text-white"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </div>
    </div>
  );
}