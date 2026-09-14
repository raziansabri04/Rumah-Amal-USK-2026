import { NextResponse } from 'next/server';
import { getActiveKampanye } from '@/actions/kampanye';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const kampanyes = await getActiveKampanye();
    return NextResponse.json({ kampanyes });
  } catch (error) {
    console.error('API Kampanye GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}
