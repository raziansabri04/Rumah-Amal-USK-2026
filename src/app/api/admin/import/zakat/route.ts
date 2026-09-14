import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface ZakatRow {
  nip: string;
  jumlah_zakat: string | number;
  jenis_zakat: string;
  no_hp?: string;
  sumber_dana?: string;
  pesan?: string;
  tanggal?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rows: ZakatRow[] = body.rows;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'Data tidak valid atau kosong' }, { status: 400 });
    }

    const errors: { row: number; nip: string; message: string }[] = [];
    let inserted = 0;

    const BATCH_SIZE = 100;

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);

      // Kumpulkan semua NIP unik dalam batch untuk lookup sekaligus
      const nips = [...new Set(batch.map((r) => r.nip?.toString().trim()).filter(Boolean))];
      const muzakkis = await prisma.muzakki.findMany({
        where: { nip: { in: nips } },
        select: { nip: true, nama: true, alamat: true },
      });
      const muzakkiMap = new Map(muzakkis.map((d) => [d.nip, d]));

      const validRows: Prisma.ZakatCreateManyInput[] = [];

      for (let j = 0; j < batch.length; j++) {
        const rowIndex = i + j + 2;
        const row = batch[j];

        const nip = row.nip?.toString().trim();
        const jenisZakat = row.jenis_zakat?.toString().trim();
        const jumlahZakat = parseFloat(row.jumlah_zakat?.toString().replace(/[^0-9.]/g, '') || '0');

        if (!nip) {
          errors.push({ row: rowIndex, nip: '-', message: 'Kolom nip wajib diisi' });
          continue;
        }
        if (!jenisZakat) {
          errors.push({ row: rowIndex, nip, message: 'Kolom jenis_zakat wajib diisi' });
          continue;
        }
        if (!jumlahZakat || jumlahZakat <= 0) {
          errors.push({ row: rowIndex, nip, message: 'jumlah_zakat tidak valid (harus angka > 0)' });
          continue;
        }

        const muzakki = muzakkiMap.get(nip);
        if (!muzakki) {
          errors.push({ row: rowIndex, nip, message: `NIP tidak ditemukan di Master Data Muzakki` });
          continue;
        }

        // Parse tanggal jika ada, fallback ke now()
        let createdAt: Date | undefined = undefined;
        if (row.tanggal) {
          const parsed = new Date(row.tanggal.toString().trim());
          if (!isNaN(parsed.getTime())) createdAt = parsed;
        }

        validRows.push({
          tipePembayar: 'muzakki usk',
          jenisZakat,
          sumberDana: row.sumber_dana?.toString().trim() || null,
          jumlahZakat,
          nama: muzakki.nama,
          nip,
          noHp: row.no_hp?.toString().trim() || null,
          alamat: muzakki.alamat || null,
          isHambaAllah: false,
          bersediaDihubungi: false,
          pesan: row.pesan?.toString().trim() || null,
          setujuTerms: true,
          status: 'lunas',
          ...(createdAt && { createdAt }),
        });
      }

      if (validRows.length > 0) {
        await prisma.zakat.createMany({ data: validRows });
        inserted += validRows.length;
      }
    }

    return NextResponse.json({ inserted, errors });
  } catch (err: unknown) {
    console.error('Import zakat error:', err);
    return NextResponse.json({ error: 'Gagal memproses file CSV' }, { status: 500 });
  }
}
