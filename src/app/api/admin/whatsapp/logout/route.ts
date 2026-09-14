import { NextResponse } from 'next/server';

export async function POST() {
  const gatewayUrl = process.env.WA_SELF_HOSTED_URL || 'http://localhost:3001';

  try {
    const res = await fetch(`${gatewayUrl.replace(/\/$/, '')}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      const json = await res.json();
      return NextResponse.json(json);
    }

    return NextResponse.json(
      { success: false, error: 'Gagal memutuskan sesi di gateway.' },
      { status: 500 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal menghubungi gateway.' },
      { status: 500 }
    );
  }
}
