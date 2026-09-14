'use server';

import { prisma } from '@/lib/prisma';
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
    const existing = await prisma.announcement.findFirst({
      where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    });
    if (!existing) break;
    slug = `${base}-${counter++}`;
  }
  return slug;
}

export async function getAnnouncements(page: number = 1, limit: number = 5, search: string = '') {
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
    prisma.announcement.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        titleAr: true,
        titleEn: true,
        slug: true,
        excerpt: true,
        category: true,
        coverImageUrl: true,
        published: true,
        publishedAt: true,
        viewsCount: true,
        content: true,
        contentAr: true,
        contentEn: true,
        createdAt: true,
      },
    }),
    prisma.announcement.count({ where }),
    prisma.announcement.count({ where: { ...where, published: true } }),
    prisma.announcement.count({ where: { ...where, published: false } }),
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

export async function addAnnouncement(formData: FormData) {
  const title = (formData.get('title') as string).trim();
  let titleAr = (formData.get('titleAr') as string | null)?.trim() || null;
  let titleEn = (formData.get('titleEn') as string | null)?.trim() || null;
  const excerpt = (formData.get('excerpt') as string | null)?.trim() || null;
  const category = (formData.get('category') as string | null)?.trim() || 'Umum';
  const coverImageUrl = (formData.get('coverImageUrl') as string | null)?.trim() || null;
  const content = (formData.get('content') as string | null)?.trim() || '';
  let contentAr = (formData.get('contentAr') as string | null)?.trim() || null;
  let contentEn = (formData.get('contentEn') as string | null)?.trim() || null;
  const publishedAtRaw = formData.get('publishedAt') as string | null;
  const published = formData.get('published') === '1';

  if (!title) throw new Error('Judul tidak boleh kosong.');

  if (!titleEn || !titleAr || !contentEn || !contentAr) {
    try {
      const translated = await autoTranslateAll({
        title,
        excerpt: excerpt || '',
        content,
      });
      if (!titleEn) titleEn = translated.titleEn || null;
      if (!titleAr) titleAr = translated.titleAr || null;
      if (!contentEn) contentEn = translated.contentEn || null;
      if (!contentAr) contentAr = translated.contentAr || null;
    } catch (err) {
      console.error('Auto translate announcement error:', err);
    }
  }

  const baseSlug = generateSlug(title);
  const slug = await uniqueSlug(baseSlug);

  await prisma.announcement.create({
    data: {
      title,
      titleAr,
      titleEn,
      slug,
      excerpt,
      category,
      coverImageUrl,
      content,
      contentAr,
      contentEn,
      published,
      publishedAt: publishedAtRaw ? new Date(publishedAtRaw) : new Date(),
    },
  });

  revalidatePath('/admin/pengumuman');
  revalidatePath('/');
}

export async function updateAnnouncement(formData: FormData) {
  const id = formData.get('id') as string;
  const title = (formData.get('title') as string).trim();
  let titleAr = (formData.get('titleAr') as string | null)?.trim() || null;
  let titleEn = (formData.get('titleEn') as string | null)?.trim() || null;
  const excerpt = (formData.get('excerpt') as string | null)?.trim() || null;
  const category = (formData.get('category') as string | null)?.trim() || 'Umum';
  const coverImageUrl = (formData.get('coverImageUrl') as string | null)?.trim() || null;
  const content = (formData.get('content') as string | null)?.trim() || '';
  let contentAr = (formData.get('contentAr') as string | null)?.trim() || null;
  let contentEn = (formData.get('contentEn') as string | null)?.trim() || null;
  const publishedAtRaw = formData.get('publishedAt') as string | null;
  const published = formData.get('published') === '1';

  if (!id || !title) throw new Error('ID dan judul tidak boleh kosong.');

  if (!titleEn || !titleAr || !contentEn || !contentAr) {
    try {
      const translated = await autoTranslateAll({
        title,
        excerpt: excerpt || '',
        content,
      });
      if (!titleEn) titleEn = translated.titleEn || null;
      if (!titleAr) titleAr = translated.titleAr || null;
      if (!contentEn) contentEn = translated.contentEn || null;
      if (!contentAr) contentAr = translated.contentAr || null;
    } catch (err) {
      console.error('Auto translate announcement update error:', err);
    }
  }

  // Ambil data pengumuman saat ini untuk cek apakah cover diganti
  const existingAnnouncement = await prisma.announcement.findUnique({
    where: { id },
    select: { coverImageUrl: true },
  });

  if (
    existingAnnouncement?.coverImageUrl &&
    existingAnnouncement.coverImageUrl !== coverImageUrl
  ) {
    await deleteStorageFileByUrl(existingAnnouncement.coverImageUrl);
  }

  const baseSlug = generateSlug(title);
  const slug = await uniqueSlug(baseSlug, id);

  await prisma.announcement.update({
    where: { id },
    data: {
      title,
      titleAr,
      titleEn,
      slug,
      excerpt,
      category,
      coverImageUrl,
      content,
      contentAr,
      contentEn,
      published,
      publishedAt: publishedAtRaw ? new Date(publishedAtRaw) : undefined,
    },
  });

  revalidatePath('/admin/pengumuman');
  revalidatePath('/');
}

export async function deleteAnnouncement(id: string) {
  const existing = await prisma.announcement.findUnique({
    where: { id },
    select: { coverImageUrl: true },
  });

  if (existing?.coverImageUrl) {
    await deleteStorageFileByUrl(existing.coverImageUrl);
  }

  await prisma.announcement.delete({ where: { id } });
  revalidatePath('/admin/pengumuman');
  revalidatePath('/');
}

export async function toggleAnnouncementPublished(id: string, currentPublished: boolean) {
  await prisma.announcement.update({
    where: { id },
    data: { published: !currentPublished },
  });
  revalidatePath('/admin/pengumuman');
  revalidatePath('/');
}
