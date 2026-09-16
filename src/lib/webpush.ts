import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

export async function sendPushToSubscription(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: PushPayload
) {
  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.p256dh,
      auth: subscription.auth,
    },
  };

  try {
    await webpush.sendNotification(pushSubscription, JSON.stringify(payload));
    return { success: true };
  } catch (error) {
    console.error("Gagal kirim push notification:", error);
    return { success: false, error };
  }
}