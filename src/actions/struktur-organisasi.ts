'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const DEFAULT_IMAGE_URL = '/profil/struktur-organisasi.png';

export async function getStrukturOrganisasi() {
  try {
    const config = await prisma.strukturOrganisasi.findUnique({
      where: { id: 'default' },
    });

    if (!config || !config.imageUrl) {
      return {
        id: 'default',
        imageUrl: DEFAULT_IMAGE_URL,
        updatedAt: new Date(),
      };
    }

    return {
      id: config.id,
      imageUrl: config.imageUrl,
      updatedAt: config.updatedAt,
    };
  } catch (error) {
    console.error('Error fetching struktur organisasi:', error);
    return {
      id: 'default',
      imageUrl: DEFAULT_IMAGE_URL,
      updatedAt: new Date(),
    };
  }
}

export async function updateStrukturOrganisasi(imageUrl: string) {
  try {
    const urlToSave = imageUrl?.trim() || DEFAULT_IMAGE_URL;

    const updated = await prisma.strukturOrganisasi.upsert({
      where: { id: 'default' },
      update: { imageUrl: urlToSave },
      create: { id: 'default', imageUrl: urlToSave },
    });

    revalidatePath('/profil/struktur-organisasi');
    revalidatePath('/admin/struktur-organisasi');
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating struktur organisasi:', error);
    return { success: false, error: error.message || 'Gagal menyimpan struktur organisasi.' };
  }
}

export async function resetStrukturOrganisasi() {
  try {
    await prisma.strukturOrganisasi.deleteMany({
      where: { id: 'default' },
    });

    revalidatePath('/profil/struktur-organisasi');
    revalidatePath('/admin/struktur-organisasi');
    return { success: true, imageUrl: DEFAULT_IMAGE_URL };
  } catch (error: any) {
    console.error('Error resetting struktur organisasi:', error);
    return { success: false, error: error.message || 'Gagal menghapus gambar custom.' };
  }
}
