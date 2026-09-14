'use server';

import prisma from '@/lib/prisma';
import { deleteStorageFileByUrl } from '@/lib/supabase';
import { autoTranslateAll } from '@/lib/translate';
import { revalidatePath } from 'next/cache';

export async function getPaginatedDocuments(page: number = 1, limit: number = 5) {
  const skip = (page - 1) * limit;

  const [items, totalCount] = await Promise.all([
    prisma.document.findMany({
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.document.count(),
  ]);

  const totalPages = Math.ceil(totalCount / limit) || 1;

  return {
    items,
    totalCount,
    totalPages,
    page,
    limit,
  };
}

export async function deleteDocumentAction(id: string) {
  const existing = await prisma.document.findUnique({
    where: { id },
    select: { imageUrl: true, pdfUrl: true },
  });

  if (existing?.imageUrl) {
    await deleteStorageFileByUrl(existing.imageUrl);
  }
  if (existing?.pdfUrl) {
    await deleteStorageFileByUrl(existing.pdfUrl);
  }

  await prisma.document.delete({ where: { id } });
  revalidatePath('/admin/dokumen');
  revalidatePath('/dokumen');
  revalidatePath('/');
}

export async function updateDocumentAction(id: string, data: { judul: string; judulEn?: string; judulAr?: string; pdfUrl: string; imageUrl?: string }) {
  let { judulEn, judulAr } = data;

  if (!judulEn || !judulAr) {
    try {
      const translated = await autoTranslateAll({ title: data.judul });
      if (!judulEn) judulEn = translated.titleEn || undefined;
      if (!judulAr) judulAr = translated.titleAr || undefined;
    } catch (err) {
      console.error('Auto translate document action error:', err);
    }
  }

  const existing = await prisma.document.findUnique({
    where: { id },
    select: { imageUrl: true, pdfUrl: true },
  });

  if (existing?.pdfUrl && data.pdfUrl && existing.pdfUrl !== data.pdfUrl) {
    await deleteStorageFileByUrl(existing.pdfUrl);
  }
  if (existing?.imageUrl && data.imageUrl && existing.imageUrl !== data.imageUrl) {
    await deleteStorageFileByUrl(existing.imageUrl);
  }

  await prisma.document.update({
    where: { id },
    data: {
      judul: data.judul,
      ...(judulEn !== undefined && { judulEn: judulEn || null }),
      ...(judulAr !== undefined && { judulAr: judulAr || null }),
      pdfUrl: data.pdfUrl,
      ...(data.imageUrl && { imageUrl: data.imageUrl }),
    },
  });
  revalidatePath('/admin/dokumen');
  revalidatePath('/dokumen');
  revalidatePath('/');
}
