import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface MuzakkiRow {
  nip: string;
  nama: string;
  npwp?: string;
  alamat?: string;
  unit_kerja?: string;
  unitKerja?: string;
  no_hp?: string;
  noHp?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rows: MuzakkiRow[] = body.rows;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'Data tidak valid atau kosong' }, { status: 400 });
    }

    const errors: { row: number; nip: string; message: string }[] = [];
    let inserted = 0;
    let updated = 0;

    // Proses dalam batch untuk menghindari timeout
    const BATCH_SIZE = 100;
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);

      for (let j = 0; j < batch.length; j++) {
        const rowIndex = i + j + 2; // +2: baris 1 = header, baris 2 = data pertama
        const row = batch[j];

        const nip = row.nip?.toString().trim();
        const nama = row.nama?.toString().trim();

        if (!nip || !nama) {
          errors.push({ row: rowIndex, nip: nip || '-', message: 'Kolom nip dan nama wajib diisi' });
          continue;
        }

        const newNpwp = row.npwp?.toString().trim();
        const newAlamat = row.alamat?.toString().trim();
        const newUnitKerja = (row.unit_kerja || row.unitKerja)?.toString().trim();
        const newNoHp = (row.no_hp || row.noHp)?.toString().trim();

        try {
          const existing = await prisma.muzakki.findUnique({ where: { nip } });

          if (existing) {
            // Jika kolom CSV baru kosong, tetapi data lama di DB ada, jangan timpa dengan kosong
            const npwpToSave = newNpwp && newNpwp !== '' ? newNpwp : existing.npwp;
            const alamatToSave = newAlamat && newAlamat !== '' ? newAlamat : existing.alamat;
            const unitKerjaToSave = newUnitKerja && newUnitKerja !== '' ? newUnitKerja : existing.unitKerja;
            const noHpToSave = newNoHp && newNoHp !== '' ? newNoHp : existing.noHp;

            await prisma.muzakki.update({
              where: { nip },
              data: {
                nama,
                npwp: npwpToSave,
                alamat: alamatToSave,
                unitKerja: unitKerjaToSave,
                noHp: noHpToSave,
              },
            });
            updated++;
          } else {
            await prisma.muzakki.create({
              data: {
                nip,
                nama,
                npwp: newNpwp || null,
                alamat: newAlamat || null,
                unitKerja: newUnitKerja || null,
                noHp: newNoHp || null,
              },
            });
            inserted++;
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Gagal menyimpan data';
          errors.push({ row: rowIndex, nip, message });
        }
      }
    }

    return NextResponse.json({ inserted, updated, errors });
  } catch (err: unknown) {
    console.error('Import muzakki error:', err);
    return NextResponse.json({ error: 'Gagal memproses file CSV' }, { status: 500 });
  }
}
