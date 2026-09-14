import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const gatewayUrl = process.env.WA_SELF_HOSTED_URL || 'http://localhost:3001';

  try {
    const body = await req.json();
    const { phone, message } = body;

    if (!phone || !message) {
      return NextResponse.json(
        { success: false, error: 'Nomor HP dan pesan wajib diisi.' },
        { status: 400 }
      );
    }

    const res = await fetch(`${gatewayUrl.replace(/\/$/, '')}/send-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, message }),
    });

    const json = await res.json();
    if (res.ok && json.success) {
      return NextResponse.json(json);
    }

    return NextResponse.json(
      { success: false, error: json.error || 'Gagal mengirim pesan dari gateway.' },
      { status: res.status || 500 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal menghubungi gateway.' },
      { status: 500 }
    );
  }
}
