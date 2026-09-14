'use server';

import prisma from '@/lib/prisma';
import { deleteStorageFileByUrl } from '@/lib/supabase';
import { autoTranslateAll } from '@/lib/translate';
import { revalidatePath } from 'next/cache';

export async function getKampanye() {
  return await prisma.kampanye.findMany({
    orderBy: { updatedAt: 'desc' },
  });
}

export async function getActiveKampanye() {
  return await prisma.kampanye.findMany({
    where: { isActive: true },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function getPaginatedKampanye(page: number = 1, limit: number = 5, search: string = '') {
  const skip = (page - 1) * limit;

  const where: any = search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [items, totalCount, activeCount, inactiveCount] = await Promise.all([
    prisma.kampanye.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.kampanye.count({ where }),
    prisma.kampanye.count({ where: { ...where, isActive: true } }),
    prisma.kampanye.count({ where: { ...where, isActive: false } }),
  ]);

  const totalPages = Math.ceil(totalCount / limit) || 1;

  return {
    items,
    totalCount,
    totalPages,
    activeCount,
    inactiveCount,
    page,
    limit,
  };
}

export async function addKampanye(formData: FormData) {
  const judul = (formData.get('judul') as string).trim();
  let judulAr = (formData.get('judulAr') as string | null)?.trim() || null;
  let judulEn = (formData.get('judulEn') as string | null)?.trim() || null;
  const deskripsi = (formData.get('deskripsi') as string | null)?.trim() || null;
  let deskripsiAr = (formData.get('deskripsiAr') as string | null)?.trim() || null;
  let deskripsiEn = (formData.get('deskripsiEn') as string | null)?.trim() || null;
  const targetDanaStr = formData.get('targetDana') as string;
  const targetDana = targetDanaStr ? Number(targetDanaStr) : null;
  const terkumpulStr = formData.get('terkumpul') as string;
  const terkumpul = terkumpulStr ? Number(terkumpulStr) : 0;
  const tanggalSelesaiStr = formData.get('tanggalSelesai') as string;
  const tanggalSelesai = tanggalSelesaiStr ? new Date(tanggalSelesaiStr) : null;
  const isActive = formData.get('isActive') === '1' || formData.get('published') === '1';
  const imageUrl = (formData.get('imageUrl') as string | null)?.trim() || null;

  if (!judul) {
    throw new Error('Judul kampanye wajib diisi');
  }

  if (!judulEn || !judulAr || (deskripsi && (!deskripsiEn || !deskripsiAr))) {
    try {
      const translated = await autoTranslateAll({
        title: judul,
        content: deskripsi || '',
      });
      if (!judulEn) judulEn = translated.titleEn || null;
      if (!judulAr) judulAr = translated.titleAr || null;
      if (deskripsi) {
        if (!deskripsiEn) deskripsiEn = translated.contentEn || null;
        if (!deskripsiAr) deskripsiAr = translated.contentAr || null;
      }
    } catch (err) {
      console.error('Auto translate kampanye error:', err);
    }
  }

  await prisma.kampanye.create({
    data: {
      judul,
      judulAr,
      judulEn,
      deskripsi,
      deskripsiAr,
      deskripsiEn,
      imageUrl: imageUrl || '',
      targetDana,
      terkumpul,
      tanggalSelesai,
      isActive,
    },
  });

  revalidatePath('/admin/kampanye');
  revalidatePath('/upload/kampanye');
  revalidatePath('/kampanye');
  revalidatePath('/infaq');
  revalidatePath('/');
}

export async function updateKampanye(formData: FormData) {
  const id = formData.get('id') as string;
  const judul = (formData.get('judul') as string).trim();
  let judulAr = (formData.get('judulAr') as string | null)?.trim() || null;
  let judulEn = (formData.get('judulEn') as string | null)?.trim() || null;
  const deskripsi = (formData.get('deskripsi') as string | null)?.trim() || null;
  let deskripsiAr = (formData.get('deskripsiAr') as string | null)?.trim() || null;
  let deskripsiEn = (formData.get('deskripsiEn') as string | null)?.trim() || null;
  const targetDanaStr = formData.get('targetDana') as string;
  const targetDana = targetDanaStr ? Number(targetDanaStr) : null;
  const terkumpulStr = formData.get('terkumpul') as string;
  const terkumpul = terkumpulStr ? Number(terkumpulStr) : undefined;
  const tanggalSelesaiStr = formData.get('tanggalSelesai') as string;
  const tanggalSelesai = tanggalSelesaiStr ? new Date(tanggalSelesaiStr) : null;
  const isActive = formData.get('isActive') === '1' || formData.get('published') === '1';
  const imageUrl = (formData.get('imageUrl') as string | null)?.trim() || null;

  if (!id || !judul) {
    throw new Error('ID dan judul kampanye wajib diisi');
  }

  if (!judulEn || !judulAr || (deskripsi && (!deskripsiEn || !deskripsiAr))) {
    try {
      const translated = await autoTranslateAll({
        title: judul,
        content: deskripsi || '',
      });
      if (!judulEn) judulEn = translated.titleEn || null;
      if (!judulAr) judulAr = translated.titleAr || null;
      if (deskripsi) {
        if (!deskripsiEn) deskripsiEn = translated.contentEn || null;
        if (!deskripsiAr) deskripsiAr = translated.contentAr || null;
      }
    } catch (err) {
      console.error('Auto translate kampanye update error:', err);
    }
  }

  const existingKampanye = await prisma.kampanye.findUnique({
    where: { id },
    select: { imageUrl: true },
  });

  if (
    existingKampanye?.imageUrl &&
    imageUrl &&
    existingKampanye.imageUrl !== imageUrl
  ) {
    await deleteStorageFileByUrl(existingKampanye.imageUrl);
  }

  await prisma.kampanye.update({
    where: { id },
    data: {
      judul,
      judulAr,
      judulEn,
      deskripsi,
      deskripsiAr,
      deskripsiEn,
      ...(imageUrl && { imageUrl }),
      targetDana,
      ...(terkumpul !== undefined && { terkumpul }),
      tanggalSelesai,
      isActive,
    },
  });

  revalidatePath('/admin/kampanye');
  revalidatePath('/upload/kampanye');
  revalidatePath('/kampanye');
  revalidatePath('/infaq');
  revalidatePath('/');
}

export async function deleteKampanye(id: string) {
  const existing = await prisma.kampanye.findUnique({
    where: { id },
    select: { imageUrl: true },
  });

  if (existing?.imageUrl) {
    await deleteStorageFileByUrl(existing.imageUrl);
  }

  await prisma.kampanye.delete({
    where: { id },
  });
  revalidatePath('/admin/kampanye');
  revalidatePath('/upload/kampanye');
  revalidatePath('/kampanye');
  revalidatePath('/infaq');
  revalidatePath('/');
}

export async function toggleKampanyeStatus(id: string, currentStatus: boolean) {
  await prisma.kampanye.update({
    where: { id },
    data: { isActive: !currentStatus },
  });
  revalidatePath('/admin/kampanye');
  revalidatePath('/upload/kampanye');
  revalidatePath('/kampanye');
  revalidatePath('/infaq');
  revalidatePath('/');
}
