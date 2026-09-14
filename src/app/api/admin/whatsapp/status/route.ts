import { NextResponse } from 'next/server';

export async function GET() {
  const gatewayUrl = process.env.WA_SELF_HOSTED_URL || 'http://localhost:3001';

  try {
    const res = await fetch(`${gatewayUrl.replace(/\/$/, '')}/status`, {
      cache: 'no-store',
    });

    if (res.ok) {
      const json = await res.json();
      return NextResponse.json(json);
    }

    return NextResponse.json({
      status: 'offline',
      error: 'WhatsApp Gateway service tidak merespon.',
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'offline',
      error: 'Gagal terhubung ke WhatsApp Gateway service di port 3001. Pastikan service sudah dijalankan.',
    });
  }
}
