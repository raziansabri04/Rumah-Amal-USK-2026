import { NextRequest, NextResponse } from 'next/server';
import { autoTranslate, autoTranslateAll } from '@/lib/translate';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, excerpt, content, targetLang } = body;

    // Single item translation request
    if (targetLang && (title || excerpt || content)) {
      const result: Record<string, string> = {};
      if (title) result.title = await autoTranslate(title, targetLang);
      if (excerpt) result.excerpt = await autoTranslate(excerpt, targetLang);
      if (content) result.content = await autoTranslate(content, targetLang);
      return NextResponse.json(result);
    }

    // Full EN + AR translation request
    const translations = await autoTranslateAll({ title, excerpt, content });
    return NextResponse.json(translations);
  } catch (error) {
    console.error('API Translate POST Error:', error);
    return NextResponse.json(
      { error: 'Gagal melakukan penerjemahan otomatis.' },
      { status: 500 }
    );
  }
}
