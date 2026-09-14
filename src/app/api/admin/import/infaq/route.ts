import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface InfaqRow {
  nip: string;
  jumlah_infaq: string | number;
  jenis_infaq: string;
  nama_kampanye?: string;
  kampanye_id?: string;
  no_hp?: string;
  pesan?: string;
  tanggal?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rows: InfaqRow[] = body.rows;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'Data tidak valid atau kosong' }, { status: 400 });
    }

    const errors: { row: number; nip: string; message: string }[] = [];
    let inserted = 0;

    // Load list of all active/existing Kampanyes for matching by ID or Title
    const allKampanyes = await prisma.kampanye.findMany({
      select: { id: true, judul: true },
    });

    const kampanyeMap = new Map<string, { id: string; judul: string }>();
    allKampanyes.forEach((k) => {
      kampanyeMap.set(k.id.toLowerCase(), k);
      kampanyeMap.set(k.judul.trim().toLowerCase(), k);
    });

    const BATCH_SIZE = 100;

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);

      // Batch lookup muzakki
      const nips = [...new Set(batch.map((r) => r.nip?.toString().trim()).filter(Boolean))];
      const muzakkis = await prisma.muzakki.findMany({
        where: { nip: { in: nips } },
        select: { nip: true, nama: true, alamat: true },
      });
      const muzakkiMap = new Map(muzakkis.map((d) => [d.nip, d]));

      const validRows: Prisma.InfaqCreateManyInput[] = [];
      const kampanyeIncrements = new Map<string, number>();

      for (let j = 0; j < batch.length; j++) {
        const rowIndex = i + j + 2;
        const row = batch[j];

        const nip = row.nip?.toString().trim();
        let jenisInfaq = row.jenis_infaq?.toString().trim();
        const namaKampanye = row.nama_kampanye?.toString().trim() || row.kampanye_id?.toString().trim();
        const jumlahInfaq = parseFloat(row.jumlah_infaq?.toString().replace(/[^0-9.]/g, '') || '0');

        if (!nip) {
          errors.push({ row: rowIndex, nip: '-', message: 'Kolom nip wajib diisi' });
          continue;
        }
        if (!jenisInfaq && !namaKampanye) {
          errors.push({ row: rowIndex, nip, message: 'Kolom jenis_infaq atau nama_kampanye wajib diisi' });
          continue;
        }
        if (!jumlahInfaq || jumlahInfaq <= 0) {
          errors.push({ row: rowIndex, nip, message: 'jumlah_infaq tidak valid (harus angka > 0)' });
          continue;
        }

        const muzakki = muzakkiMap.get(nip);
        if (!muzakki) {
          errors.push({ row: rowIndex, nip, message: 'NIP tidak ditemukan di Master Data Muzakki' });
          continue;
        }

        let kampanyeId: string | null = null;

        // 1. Try matching via nama_kampanye / kampanye_id column
        if (namaKampanye) {
          const matched = kampanyeMap.get(namaKampanye.toLowerCase());
          if (matched) {
            kampanyeId = matched.id;
            if (!jenisInfaq) {
              jenisInfaq = matched.judul;
            }
          }
        }

        // 2. If not matched, try matching if jenis_infaq text is identical to a Kampanye title or ID
        if (!kampanyeId && jenisInfaq) {
          const matched = kampanyeMap.get(jenisInfaq.toLowerCase());
          if (matched) {
            kampanyeId = matched.id;
            jenisInfaq = matched.judul; // Standardize to campaign official title
          }
        }

        let createdAt: Date | undefined = undefined;
        if (row.tanggal) {
          const parsed = new Date(row.tanggal.toString().trim());
          if (!isNaN(parsed.getTime())) createdAt = parsed;
        }

        validRows.push({
          tipePembayar: 'muzakki usk',
          jenisInfaq: jenisInfaq || 'Infak Umum',
          kampanyeId: kampanyeId || null,
          jumlahInfaq,
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

        if (kampanyeId) {
          const current = kampanyeIncrements.get(kampanyeId) || 0;
          kampanyeIncrements.set(kampanyeId, current + jumlahInfaq);
        }
      }

      if (validRows.length > 0) {
        await prisma.infaq.createMany({ data: validRows });
        inserted += validRows.length;

        // Update total terkumpul on kampanye
        for (const [kId, inc] of kampanyeIncrements.entries()) {
          await prisma.kampanye.update({
            where: { id: kId },
            data: { terkumpul: { increment: inc } },
          });
        }
      }
    }

    return NextResponse.json({ inserted, errors });
  } catch (err: unknown) {
    console.error('Import infaq error:', err);
    return NextResponse.json({ error: 'Gagal memproses file CSV' }, { status: 500 });
  }
}
