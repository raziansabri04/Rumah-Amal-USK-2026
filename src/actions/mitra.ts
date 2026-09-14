'use server';

import prisma from '@/lib/prisma';
import { deleteStorageFileByUrl } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function getPaginatedMitra(page: number = 1, limit: number = 5, search: string = '') {
  const skip = (page - 1) * limit;

  const where: any = search
    ? { nama: { contains: search, mode: 'insensitive' as const } }
    : {};

  const [items, totalCount] = await Promise.all([
    prisma.mitra.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.mitra.count({ where }),
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

export async function addMitra(formData: FormData) {
  const nama = (formData.get('nama') as string).trim();
  const imageUrl = (formData.get('logoUrl') as string | null)?.trim() || (formData.get('imageUrl') as string | null)?.trim() || null;

  if (!nama || !imageUrl) {
    throw new Error('Nama mitra dan Logo wajib diisi');
  }

  const item = await prisma.mitra.create({
    data: {
      nama,
      imageUrl,
    },
  });

  revalidatePath('/admin/mitra');
  revalidatePath('/upload/mitra');
  revalidatePath('/');
  return item;
}

export async function updateMitra(formData: FormData) {
  const id = formData.get('id') as string;
  const nama = (formData.get('nama') as string).trim();
  const imageUrl = (formData.get('logoUrl') as string | null)?.trim() || (formData.get('imageUrl') as string | null)?.trim() || null;

  if (!id || !nama || !imageUrl) {
    throw new Error('Data mitra tidak lengkap');
  }

  const existingMitra = await prisma.mitra.findUnique({
    where: { id },
    select: { imageUrl: true },
  });

  if (existingMitra?.imageUrl && existingMitra.imageUrl !== imageUrl) {
    await deleteStorageFileByUrl(existingMitra.imageUrl);
  }

  const item = await prisma.mitra.update({
    where: { id },
    data: {
      nama,
      imageUrl,
    },
  });

  revalidatePath('/admin/mitra');
  revalidatePath('/upload/mitra');
  revalidatePath('/');
  return item;
}

export async function deleteMitra(id: string) {
  const existing = await prisma.mitra.findUnique({
    where: { id },
    select: { imageUrl: true },
  });

  if (existing?.imageUrl) {
    await deleteStorageFileByUrl(existing.imageUrl);
  }

  await prisma.mitra.delete({ where: { id } });
  revalidatePath('/admin/mitra');
  revalidatePath('/upload/mitra');
  revalidatePath('/');
}
