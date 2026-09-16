import { NextRequest, NextResponse } from "next/server";
import { sendPushToSubscription, type PushPayload } from "@/lib/webpush";
import {
  getAllSubscriptions,
  removeSubscription,
} from "@/actions/push-subscription";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // --- Guard: cuma admin yang boleh trigger kirim notifikasi manual ---
  // Endpoint ini juga bisa dipanggil dari trigger otomatis internal (server-side),
  // jadi kalau nanti dipanggil bukan dari request browser admin, sesuaikan
  // pengecekannya (misal pakai secret header internal, bukan session).
  const session = await auth();
  const userRole = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || userRole !== "admin") {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  let body: Partial<PushPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Body harus JSON valid" },
      { status: 400 }
    );
  }

  const { title, body: message, url } = body;

  if (!title || !message) {
    return NextResponse.json(
      { success: false, error: "Field 'title' dan 'body' wajib diisi" },
      { status: 400 }
    );
  }

  const payload: PushPayload = { title, body: message, url };

  const subscriptions = await getAllSubscriptions();

  if (subscriptions.length === 0) {
    return NextResponse.json({
      success: true,
      sent: 0,
      failed: 0,
      message: "Tidak ada subscription yang terdaftar",
    });
  }

  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      const result = await sendPushToSubscription(
        { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
        payload
      );

      if (!result.success) {
        // web-push melempar error dengan `statusCode` 404/410 kalau
        // subscription sudah tidak valid lagi (device uninstall / unsubscribe
        // di browser). Bersihkan dari database supaya tidak terus dicoba.
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
  const failed = results.length - sent;

  return NextResponse.json({
    success: true,
    sent,
    failed,
    total: subscriptions.length,
  });
}