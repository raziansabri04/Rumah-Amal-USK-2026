import { NextRequest, NextResponse } from 'next/server';
import { addProgram } from '@/actions/program';
import prisma from '@/lib/prisma';
import { autoTranslateAll } from '@/lib/translate';
import { revalidatePath } from 'next/cache';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      let { title, titleAr, titleEn, category, excerpt, excerptAr, excerptEn, coverImageUrl, content, contentAr, contentEn, publishedAt, published } = body;

      if (!title || !content) {
        return NextResponse.json(
          { error: 'Judul dan konten program wajib diisi.' },
          { status: 400 }
        );
      }

      if (!titleEn || !titleAr || !contentEn || !contentAr || !excerptEn || !excerptAr) {
        try {
          const translated = await autoTranslateAll({
            title,
            excerpt: excerpt || '',
            content,
          });
          if (!titleEn) titleEn = translated.titleEn || null;
          if (!titleAr) titleAr = translated.titleAr || null;
          if (!excerptEn) excerptEn = translated.excerptEn || null;
          if (!excerptAr) excerptAr = translated.excerptAr || null;
          if (!contentEn) contentEn = translated.contentEn || null;
          if (!contentAr) contentAr = translated.contentAr || null;
        } catch (err) {
          console.error('Auto translate API program upload error:', err);
        }
      }

      let slug = generateSlug(title);
      const existing = await prisma.program.findUnique({ where: { slug } });
      if (existing) {
        slug = `${slug}-${Date.now()}`;
      }

      const program = await prisma.program.create({
        data: {
          title,
          titleAr: titleAr || null,
          titleEn: titleEn || null,
          slug,
          category: category || 'PENDIDIKAN',
          excerpt: excerpt || null,
          excerptAr: excerptAr || null,
          excerptEn: excerptEn || null,
          coverImageUrl: coverImageUrl || null,
          content,
          contentAr: contentAr || null,
          contentEn: contentEn || null,
          published: published ?? true,
          publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        },
      });

      revalidatePath('/program');
      revalidatePath('/upload/program');

      return NextResponse.json({ success: true, program });
    }

    // Default FormData handler
    const formData = await request.formData();
    const program = await addProgram(formData);
    return NextResponse.json({ success: true, program });
  } catch (error) {
    console.error('Error uploading program:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Gagal membuat program' },
      { status: 500 }
    );
  }
}
