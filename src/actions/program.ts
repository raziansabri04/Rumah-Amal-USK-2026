'use server';

import prisma from '@/lib/prisma';
import { deleteStorageFileByUrl } from '@/lib/supabase';
import { autoTranslateAll } from '@/lib/translate';
import { revalidatePath } from 'next/cache';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100);
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let counter = 1;
  while (true) {
    const existing = await prisma.program.findFirst({
      where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    });
    if (!existing) break;
    slug = `${base}-${counter++}`;
  }
  return slug;
}

export async function getPrograms(category?: string) {
  const whereCondition: { category?: string } = {};
  if (category && category.toUpperCase() !== 'SEMUA') {
    whereCondition.category = category;
  }

  return await prisma.program.findMany({
    where: whereCondition,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getActivePrograms(category?: string) {
  const whereCondition: { published: boolean; category?: string } = { published: true };
  if (category && category.toUpperCase() !== 'SEMUA') {
    whereCondition.category = category;
  }

  return await prisma.program.findMany({
    where: whereCondition,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProgramBySlug(slug: string) {
  return await prisma.program.findUnique({
    where: { slug },
  });
}

export async function getPaginatedPrograms(page: number = 1, limit: number = 5, search: string = '') {
  const skip = (page - 1) * limit;

  const where: any = search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { category: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [items, totalCount, publishedCount, draftCount] = await Promise.all([
    prisma.program.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        titleAr: true,
        titleEn: true,
        slug: true,
        excerpt: true,
        excerptAr: true,
        excerptEn: true,
        category: true,
        coverImageUrl: true,
        published: true,
        publishedAt: true,
        content: true,
        contentAr: true,
        contentEn: true,
        createdAt: true,
      },
    }),
    prisma.program.count({ where }),
    prisma.program.count({ where: { ...where, published: true } }),
    prisma.program.count({ where: { ...where, published: false } }),
  ]);

  const totalPages = Math.ceil(totalCount / limit) || 1;

  return {
    items,
    totalCount,
    totalPages,
    publishedCount,
    draftCount,
    page,
    limit,
  };
}

export async function addProgram(formData: FormData) {
  const title = (formData.get('title') as string).trim();
  let titleAr = (formData.get('titleAr') as string | null)?.trim() || null;
  let titleEn = (formData.get('titleEn') as string | null)?.trim() || null;
  const category = (formData.get('category') as string | null)?.trim() || 'PENDIDIKAN';
  const excerpt = (formData.get('excerpt') as string | null)?.trim() || null;
  let excerptAr = (formData.get('excerptAr') as string | null)?.trim() || null;
  let excerptEn = (formData.get('excerptEn') as string | null)?.trim() || null;
  const coverImageUrl = (formData.get('coverImageUrl') as string | null)?.trim() || null;
  const content = (formData.get('content') as string | null)?.trim() || '';
  let contentAr = (formData.get('contentAr') as string | null)?.trim() || null;
  let contentEn = (formData.get('contentEn') as string | null)?.trim() || null;
  const publishedAtRaw = formData.get('publishedAt') as string | null;
  const published = formData.get('published') === '1';

  if (!title) throw new Error('Judul program tidak boleh kosong.');

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
      console.error('Auto translate program error:', err);
    }
  }

  const baseSlug = generateSlug(title);
  const slug = await uniqueSlug(baseSlug);

  const program = await prisma.program.create({
    data: {
      title,
      titleAr,
      titleEn,
      slug,
      category,
      excerpt,
      excerptAr,
      excerptEn,
      coverImageUrl,
      content,
      contentAr,
      contentEn,
      published,
      publishedAt: publishedAtRaw ? new Date(publishedAtRaw) : new Date(),
    },
  });

  revalidatePath('/admin/program');
  revalidatePath('/program');
  revalidatePath('/');
  return program;
}

export async function updateProgram(formData: FormData) {
  const id = formData.get('id') as string;
  const title = (formData.get('title') as string).trim();
  let titleAr = (formData.get('titleAr') as string | null)?.trim() || null;
  let titleEn = (formData.get('titleEn') as string | null)?.trim() || null;
  const category = (formData.get('category') as string | null)?.trim() || 'PENDIDIKAN';
  const excerpt = (formData.get('excerpt') as string | null)?.trim() || null;
  let excerptAr = (formData.get('excerptAr') as string | null)?.trim() || null;
  let excerptEn = (formData.get('excerptEn') as string | null)?.trim() || null;
  const coverImageUrl = (formData.get('coverImageUrl') as string | null)?.trim() || null;
  const content = (formData.get('content') as string | null)?.trim() || '';
  let contentAr = (formData.get('contentAr') as string | null)?.trim() || null;
  let contentEn = (formData.get('contentEn') as string | null)?.trim() || null;
  const publishedAtRaw = formData.get('publishedAt') as string | null;
  const published = formData.get('published') === '1';

  if (!id || !title) throw new Error('ID dan judul program tidak boleh kosong.');

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
      console.error('Auto translate program update error:', err);
    }
  }

  const existingProgram = await prisma.program.findUnique({
    where: { id },
    select: { coverImageUrl: true },
  });

  if (
    existingProgram?.coverImageUrl &&
    existingProgram.coverImageUrl !== coverImageUrl
  ) {
    await deleteStorageFileByUrl(existingProgram.coverImageUrl);
  }

  const baseSlug = generateSlug(title);
  const slug = await uniqueSlug(baseSlug, id);

  const program = await prisma.program.update({
    where: { id },
    data: {
      title,
      titleAr,
      titleEn,
      slug,
      category,
      excerpt,
      excerptAr,
      excerptEn,
      coverImageUrl,
      content,
      contentAr,
      contentEn,
      published,
      publishedAt: publishedAtRaw ? new Date(publishedAtRaw) : undefined,
    },
  });

  revalidatePath('/admin/program');
  revalidatePath('/program');
  revalidatePath('/');
  return program;
}

export async function deleteProgram(id: string) {
  const existing = await prisma.program.findUnique({
    where: { id },
    select: { coverImageUrl: true },
  });

  if (existing?.coverImageUrl) {
    await deleteStorageFileByUrl(existing.coverImageUrl);
  }

  await prisma.program.delete({ where: { id } });
  revalidatePath('/admin/program');
  revalidatePath('/program');
  revalidatePath('/');
}

export async function toggleProgramPublished(id: string, currentPublished: boolean) {
  await prisma.program.update({
    where: { id },
    data: { published: !currentPublished },
  });
  revalidatePath('/admin/program');
  revalidatePath('/program');
  revalidatePath('/');
}
