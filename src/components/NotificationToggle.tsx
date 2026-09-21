"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBellSlash,
  faSpinner,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import {
  removeSubscription,
  saveSubscription,
} from "@/actions/push-subscription";
import {
  PUSH_OPT_OUT_KEY,
  PUSH_STATUS_EVENT,
  pushSupported,
  urlBase64ToUint8Array,
} from "@/lib/push-client";

type Lang = "id" | "en" | "ar";

// "checking"    : belum tahu statusnya (render null, hindari mismatch hydration)
// "unsupported" : browser tidak mendukung push, atau service worker tidak aktif
// "on" / "off"  : ada / tidak ada subscription aktif di browser ini
// "denied"      : izin diblokir di browser, tidak bisa diminta ulang lewat kode
type Status = "checking" | "unsupported" | "on" | "off" | "denied";

// Kalau service worker tidak pernah aktif (mis. dev mode), navigator.serviceWorker.ready
// tidak akan resolve. Setelah jeda ini toggle disembunyikan.
const READY_TIMEOUT_MS = 5000;

const TEXT: Record<
  Lang,
  { label: string; on: string; off: string; denied: string; error: string }
> = {
  id: {
    label: "Notifikasi",
    on: "Aktif di perangkat ini",
    off: "Nonaktif di perangkat ini",
    denied: "Diblokir. Aktifkan lewat pengaturan situs di browser.",
    error: "Gagal memperbarui notifikasi. Coba lagi nanti.",
  },
  en: {
    label: "Notifications",
    on: "On for this device",
    off: "Off for this device",
    denied: "Blocked. Turn them on in your browser's site settings.",
    error: "Couldn't update notifications. Try again later.",
  },
  ar: {
    label: "الإشعارات",
    on: "مفعّلة على هذا الجهاز",
    off: "متوقفة على هذا الجهاز",
    denied: "محظورة. فعّلها من إعدادات الموقع في المتصفح.",
    error: "تعذّر تحديث الإشعارات. حاول مرة أخرى لاحقًا.",
  },
};

export default function NotificationToggle({ lang = "id" }: { lang?: Lang }) {
  const [status, setStatus] = useState<Status>("checking");
  const [busy, setBusy] = useState(false);
  const [hasError, setHasError] = useState(false);

  const labelId = useId();
  const descId = useId();

  const t = TEXT[lang] ?? TEXT.id;

  const readStatus = useCallback(async (): Promise<Status> => {
    if (!pushSupported()) return "unsupported";
    if (Notification.permission === "denied") return "denied";

    try {
      const registration = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), READY_TIMEOUT_MS)
        ),
      ]);
      if (!registration) return "unsupported";

      const subscription = await registration.pushManager.getSubscription();
      return subscription && Notification.permission === "granted"
        ? "on"
        : "off";
    } catch (err) {
      console.error("Gagal membaca status notifikasi:", err);
      return "unsupported";
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      const next = await readStatus();
      if (!cancelled) setStatus(next);
    };

    refresh();

    // Focus: user mungkin baru mengubah izin lewat pengaturan browser/HP.
    // Event kustom: banner opt-in baru saja mengaktifkan notifikasi.
    window.addEventListener("focus", refresh);
    window.addEventListener(PUSH_STATUS_EVENT, refresh);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", refresh);
      window.removeEventListener(PUSH_STATUS_EVENT, refresh);
    };
  }, [readStatus]);

  const handleToggle = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setHasError(false);

    try {
      if (status === "on") {
        // ---- Matikan ----
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          const endpoint = subscription.endpoint;
          await subscription.unsubscribe();
          try {
            await removeSubscription(endpoint);
          } catch (err) {
            // Subscription di browser sudah dicabut. Record yatim di DB akan
            // dibersihkan otomatis oleh push-broadcast saat push berikutnya gagal.
            console.error("Gagal menghapus subscription di server:", err);
          }
        }

        localStorage.setItem(PUSH_OPT_OUT_KEY, "1");
        setStatus("off");
      } else if (status === "off") {
        // ---- Nyalakan ----
        // requestPermission harus dipanggil langsung dari klik user, sebelum
        // await lain. Kalau izin sudah "granted" fungsi ini langsung resolve.
        const permission = await Notification.requestPermission();

        if (permission === "denied") {
          setStatus("denied");
          return;
        }
        if (permission !== "granted") return; // dialog ditutup tanpa memilih

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

        localStorage.removeItem(PUSH_OPT_OUT_KEY);
        setStatus("on");
      }

      // Beri tahu banner (kalau sedang tampil) supaya ikut menyesuaikan.
      window.dispatchEvent(new Event(PUSH_STATUS_EVENT));
    } catch (err) {
      console.error("Gagal mengubah status notifikasi:", err);
      setHasError(true);
    } finally {
      setBusy(false);
    }
  }, [busy, status]);

  if (status === "checking" || status === "unsupported") return null;

  const isOn = status === "on";
  const isDenied = status === "denied";
  const description = isDenied ? t.denied : isOn ? t.on : t.off;

  return (
    <div className="w-full max-w-xs">
      <div className="flex items-center gap-3 rounded-xl border border-white/20 px-3.5 py-3">
        <FontAwesomeIcon
          icon={isOn ? faBell : faBellSlash}
          className="w-5 shrink-0 text-lg text-white"
        />

        <div className="min-w-0 flex-1">
          <p id={labelId} className="text-[14px] font-bold leading-tight text-white">
            {t.label}
          </p>
          <p
            id={descId}
            className="mt-0.5 flex items-center gap-1.5 text-[12px] leading-snug text-gray-300"
          >
            {busy && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
            {description}
          </p>
        </div>

        {/* dir="ltr" supaya knob bergerak konsisten juga saat footer RTL (Arab) */}
        <button
          type="button"
          role="switch"
          dir="ltr"
          aria-checked={isOn}
          aria-labelledby={labelId}
          aria-describedby={descId}
          aria-busy={busy}
          disabled={busy || isDenied}
          onClick={handleToggle}
          className={`relative h-[26px] w-[46px] shrink-0 rounded-full border-[1.5px] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffc800] disabled:cursor-not-allowed ${
            isOn ? "border-[#ffc800] bg-[#ffc800]" : "border-white/50 bg-transparent"
          } ${isDenied ? "opacity-40" : busy ? "opacity-70" : ""}`}
        >
          <span
            className={`absolute left-[2px] top-[2px] h-[19px] w-[19px] rounded-full transition-transform duration-200 ${
              isOn ? "translate-x-[20px] bg-[#002B14]" : "translate-x-0 bg-white/75"
            }`}
          />
        </button>
      </div>

      {hasError && (
        <p
          role="alert"
          className="mt-2 flex items-center gap-1.5 text-xs text-red-300"
        >
          <FontAwesomeIcon icon={faCircleExclamation} />
          {t.error}
        </p>
      )}
    </div>
  );
}