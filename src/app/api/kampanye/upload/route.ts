import { NextRequest, NextResponse } from 'next/server';
import { addKampanye } from '@/actions/kampanye';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    await addKampanye(formData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error uploading kampanye:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Gagal mengupload kampanye' },
      { status: 500 }
    );
  }
}
