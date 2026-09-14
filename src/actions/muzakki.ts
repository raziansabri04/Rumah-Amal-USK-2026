'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getMuzakkis() {
  try {
    return await prisma.muzakki.findMany({
      orderBy: { nama: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching muzakkis:', error);
    return [];
  }
}

export async function getMuzakkiByNip(nip: string) {
  try {
    return await prisma.muzakki.findUnique({
      where: { nip },
    });
  } catch (error) {
    console.error('Error fetching muzakki by NIP:', error);
    return null;
  }
}

export async function createMuzakki(formData: FormData) {
  const nip = (formData.get('nip') as string)?.trim();
  const nama = (formData.get('nama') as string)?.trim();
  const npwp = (formData.get('npwp') as string)?.trim() || null;
  const alamat = (formData.get('alamat') as string)?.trim() || null;
  const unitKerja = (formData.get('unit_kerja') as string)?.trim() || (formData.get('unitKerja') as string)?.trim() || null;
  const noHp = (formData.get('no_hp') as string)?.trim() || (formData.get('noHp') as string)?.trim() || null;

  if (!nip || !nama) {
    throw new Error('NIP dan Nama Muzakki wajib diisi');
  }

  const existing = await prisma.muzakki.findUnique({ where: { nip } });
  if (existing) {
    throw new Error(`Muzakki dengan NIP ${nip} sudah ada`);
  }

  await prisma.muzakki.create({
    data: {
      nip,
      nama,
      npwp,
      alamat,
      unitKerja,
      noHp,
    },
  });

  revalidatePath('/admin/muzakki');
  return { success: true };
}

export async function updateMuzakki(oldNip: string, formData: FormData) {
  const nip = (formData.get('nip') as string)?.trim();
  const nama = (formData.get('nama') as string)?.trim();
  const npwp = (formData.get('npwp') as string)?.trim() || null;
  const alamat = (formData.get('alamat') as string)?.trim() || null;
  const unitKerja = (formData.get('unit_kerja') as string)?.trim() || (formData.get('unitKerja') as string)?.trim() || null;
  const noHp = (formData.get('no_hp') as string)?.trim() || (formData.get('noHp') as string)?.trim() || null;

  if (!nip || !nama) {
    throw new Error('NIP dan Nama Muzakki wajib diisi');
  }

  await prisma.muzakki.update({
    where: { nip: oldNip },
    data: {
      nip,
      nama,
      npwp,
      alamat,
      unitKerja,
      noHp,
    },
  });

  revalidatePath('/admin/muzakki');
  return { success: true };
}

export async function deleteMuzakki(nip: string) {
  if (!nip) {
    throw new Error('NIP muzakki wajib diisi');
  }

  await prisma.muzakki.delete({
    where: { nip },
  });

  revalidatePath('/admin/muzakki');
  return { success: true };
}
