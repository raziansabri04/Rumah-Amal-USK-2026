// Helper push notification sisi client yang dipakai bersama oleh
// PushNotificationBanner dan NotificationToggle.

// Ditandai "1" saat user mematikan notifikasi lewat toggle di footer.
// Izin browser tetap "granted" setelah unsubscribe, jadi tanpa penanda ini
// banner akan subscribe ulang diam-diam di kunjungan berikutnya.
export const PUSH_OPT_OUT_KEY = "ra-push-opted-out";

// Event window untuk mensinkronkan banner dan toggle dalam satu halaman.
export const PUSH_STATUS_EVENT = "ra-push-status-change";

// Konversi VAPID public key (base64url) ke Uint8Array untuk pushManager.subscribe
export function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function pushSupported() {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}