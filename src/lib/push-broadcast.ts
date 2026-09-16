import { sendPushToSubscription, type PushPayload } from "@/lib/webpush";
import {
  getAllSubscriptions,
  removeSubscription,
} from "@/actions/push-subscription";

export type BroadcastResult = {
  sent: number;
  failed: number;
  total: number;
};

/**
 * Kirim push notification ke SEMUA subscription yang terdaftar (broadcast).
 * Dipakai oleh:
 * - /api/push/send (trigger manual dari admin)
 * - server actions yang butuh notifikasi otomatis (mis. publish pengumuman)
 *
 * Subscription yang sudah tidak valid (404/410 dari push service, artinya
 * device sudah uninstall/unsubscribe) otomatis dibersihkan dari database.
 */
export async function broadcastPushNotification(
  payload: PushPayload
): Promise<BroadcastResult> {
  const subscriptions = await getAllSubscriptions();

  if (subscriptions.length === 0) {
    return { sent: 0, failed: 0, total: 0 };
  }

  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      const result = await sendPushToSubscription(
        { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
        payload
      );

      if (!result.success) {
        const statusCode = (result.error as { statusCode?: number })
          ?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await removeSubscription(sub.endpoint);
        }
      }

      return result;
    })
  );

  const sent = results.filter(
    (r) => r.status === "fulfilled" && r.value.success
  ).length;

  return { sent, failed: results.length - sent, total: subscriptions.length };
}