import { NextRequest, NextResponse } from "next/server";
import type { PushPayload } from "@/lib/webpush";
import { auth } from "@/lib/auth";
import { broadcastPushNotification } from "@/lib/push-broadcast";

export async function POST(request: NextRequest) {
  // --- Guard: cuma admin yang boleh trigger kirim notifikasi manual ---
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
  const result = await broadcastPushNotification(payload);

  return NextResponse.json({ success: true, ...result });
}