import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface RekapRow {
  nip: string;
  tahun_rekap: string | number;
  file_url: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rows: RekapRow[] = body.rows;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'Data tidak valid atau kosong' }, { status: 400 });
    }

    const errors: { row: number; nip: string; message: string }[] = [];
    let inserted = 0;

    const BATCH_SIZE = 100;

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);

      // Batch lookup muzakki untuk validasi FK
      const nips = [...new Set(batch.map((r) => r.nip?.toString().trim()).filter(Boolean))];
      const muzakkis = await prisma.muzakki.findMany({
        where: { nip: { in: nips } },
        select: { nip: true },
      });
      const muzakkiSet = new Set(muzakkis.map((d) => d.nip));

      const validRows: Prisma.RekapZakatCreateManyInput[] = [];

      for (let j = 0; j < batch.length; j++) {
        const rowIndex = i + j + 2;
        const row = batch[j];

        const nip = row.nip?.toString().trim();
        const tahunRekap = row.tahun_rekap?.toString().trim();
        const fileUrl = row.file_url?.toString().trim();

        if (!nip) {
          errors.push({ row: rowIndex, nip: '-', message: 'Kolom nip wajib diisi' });
          continue;
        }
        if (!tahunRekap) {
          errors.push({ row: rowIndex, nip, message: 'Kolom tahun_rekap wajib diisi' });
          continue;
        }
        if (!fileUrl) {
          errors.push({ row: rowIndex, nip, message: 'Kolom file_url wajib diisi' });
          continue;
        }

        if (!muzakkiSet.has(nip)) {
          errors.push({ row: rowIndex, nip, message: 'NIP tidak ditemukan di Master Data Muzakki' });
          continue;
        }

        validRows.push({
          muzakkiNIP: nip,
          tahunRekap,
          fileUrl,
        });
      }

      if (validRows.length > 0) {
        await prisma.rekapZakat.createMany({ data: validRows });
        inserted += validRows.length;
      }
    }

    return NextResponse.json({ inserted, errors });
  } catch (err: unknown) {
    console.error('Import rekap zakat error:', err);
    return NextResponse.json({ error: 'Gagal memproses file CSV' }, { status: 500 });
  }
}
