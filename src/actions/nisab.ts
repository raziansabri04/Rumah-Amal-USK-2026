'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getNisabConfig() {
  try {
    let config = await prisma.nisabConfig.findUnique({
      where: { id: 'default' },
    });

    if (!config) {
      config = await prisma.nisabConfig.create({
        data: {
          id: 'default',
          hargaEmasPerGram: 2500000,
          nisabEmasGram: 94,
          nisabProfesiBulan: 13000000,
          aturanQanun: 'Qanun Aceh No. 10/2018 tentang Baitul Mal',
          skNisabProfesi: 'SK DPS BMA No. 04/KTPS/2025',
        },
      });
    }

    return config;
  } catch (error) {
    console.error('Error fetching nisab config:', error);
    // Return fallback config if DB error
    return {
      id: 'default',
      hargaEmasPerGram: 2500000,
      nisabEmasGram: 94,
      nisabProfesiBulan: 13000000,
      aturanQanun: 'Qanun Aceh No. 10/2018 tentang Baitul Mal',
      skNisabProfesi: 'SK DPS BMA No. 04/KTPS/2025',
      updatedAt: new Date(),
    };
  }
}

export async function updateNisabConfig(data: {
  hargaEmasPerGram: number;
  nisabEmasGram: number;
  nisabProfesiBulan: number;
  aturanQanun: string;
  skNisabProfesi: string;
}) {
  try {
    const updated = await prisma.nisabConfig.upsert({
      where: { id: 'default' },
      update: {
        hargaEmasPerGram: Number(data.hargaEmasPerGram),
        nisabEmasGram: Number(data.nisabEmasGram),
        nisabProfesiBulan: Number(data.nisabProfesiBulan),
        aturanQanun: data.aturanQanun?.trim() || 'Qanun Aceh No. 10/2018 tentang Baitul Mal',
        skNisabProfesi: data.skNisabProfesi?.trim() || 'SK DPS BMA No. 04/KTPS/2025',
      },
      create: {
        id: 'default',
        hargaEmasPerGram: Number(data.hargaEmasPerGram),
        nisabEmasGram: Number(data.nisabEmasGram),
        nisabProfesiBulan: Number(data.nisabProfesiBulan),
        aturanQanun: data.aturanQanun?.trim() || 'Qanun Aceh No. 10/2018 tentang Baitul Mal',
        skNisabProfesi: data.skNisabProfesi?.trim() || 'SK DPS BMA No. 04/KTPS/2025',
      },
    });

    revalidatePath('/admin/nisab');
    revalidatePath('/kalkulator');
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('Error updating nisab config:', error);
    return { success: false, error: error.message || 'Gagal menyimpan pengaturan nisab' };
  }
}
