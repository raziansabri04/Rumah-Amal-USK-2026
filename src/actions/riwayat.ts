'use server';

import { prisma } from '@/lib/prisma';
import { createAndSendOtp, verifyOtp, RequestOtpResult } from '@/lib/otp/otp-service';

/**
 * Request WhatsApp OTP for a given NIP.
 * Looks up Muzakki in DB and sends 6-digit OTP to the registered phone number via WhatsApp.
 */
export async function requestRiwayatOtp(
  nip: string
): Promise<RequestOtpResult> {
  const cleanNip = nip.trim();

  if (!cleanNip) {
    throw new Error('NIP / NIDN wajib diisi.');
  }

  const muzakki = await prisma.muzakki.findUnique({
    where: { nip: cleanNip },
  });

  if (!muzakki) {
    throw new Error(
      'NIP / NIDN tidak terdaftar pada data muzakki USK. Silakan periksa kembali atau hubungi Rumah Amal USK.'
    );
  }

  if (!muzakki.noHp || !muzakki.noHp.trim()) {
    throw new Error(
      'Nomor WhatsApp belum terdaftar untuk NIP ini di database. Silakan hubungi admin Rumah Amal USK untuk mendaftarkan nomor WhatsApp Anda.'
    );
  }

  return await createAndSendOtp(cleanNip, muzakki.noHp, 'whatsapp');
}

/**
 * Verify OTP and fetch full Riwayat (Zakat, Infaq, Rekap Zakat) for the NIP.
 */
export async function verifyRiwayatOtpAndFetch(nip: string, otp: string) {
  const cleanNip = nip.trim();
  const cleanOtp = otp.trim();

  if (!cleanNip) {
    throw new Error('NIP / NIDN wajib diisi.');
  }

  // 1. Verify OTP
  await verifyOtp(cleanNip, cleanOtp);

  // 2. Fetch Muzakki data
  const muzakki = await prisma.muzakki.findUnique({
    where: { nip: cleanNip },
  });

  // 3. Fetch Zakat history
  const riwayatZakat = await prisma.zakat.findMany({
    where: { nip: cleanNip },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      jenisZakat: true,
      jumlahZakat: true,
      sumberDana: true,
      status: true,
      createdAt: true,
    },
  });

  // 4. Fetch Infaq history
  const riwayatInfaq = await prisma.infaq.findMany({
    where: { nip: cleanNip },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      jenisInfaq: true,
      jumlahInfaq: true,
      status: true,
      createdAt: true,
      kampanye: {
        select: { judul: true },
      },
    },
  });

  // 5. Fetch Rekap Zakat Tahunan (PDF files)
  const rekapZakatList = await prisma.rekapZakat.findMany({
    where: { muzakkiNIP: cleanNip },
    orderBy: { tahunRekap: 'desc' },
    select: {
      id: true,
      tahunRekap: true,
      fileUrl: true,
      createdAt: true,
    },
  });

  // Fallback nama jika di Muzakki null
  const zakatWithNama = await prisma.zakat.findFirst({
    where: { nip: cleanNip },
    select: { nama: true },
  });

  const infaqWithNama = await prisma.infaq.findFirst({
    where: { nip: cleanNip },
    select: { nama: true },
  });

  const nama = muzakki?.nama || zakatWithNama?.nama || infaqWithNama?.nama || null;

  const totalZakatLunas = riwayatZakat
    .filter((z) => z.status === 'lunas')
    .reduce((acc, z) => acc + (z.jumlahZakat || 0), 0);

  const totalInfaqLunas = riwayatInfaq
    .filter((i) => i.status === 'lunas')
    .reduce((acc, i) => acc + (i.jumlahInfaq || 0), 0);

  return {
    nip: cleanNip,
    nama,
    unitKerja: muzakki?.unitKerja || null,
    totalZakatLunas,
    totalInfaqLunas,
    riwayatZakat: riwayatZakat.map((z) => ({
      id: z.id,
      jenis_zakat: z.jenisZakat,
      jumlah_zakat: z.jumlahZakat,
      sumber_dana: z.sumberDana,
      status: z.status as 'pending' | 'lunas' | 'ditolak',
      created_at: z.createdAt,
    })),
    rekapZakat: rekapZakatList.map((r) => ({
      id: r.id,
      tahunRekap: r.tahunRekap,
      fileUrl: r.fileUrl,
      createdAt: r.createdAt,
    })),
    riwayatInfaq: riwayatInfaq.map((i) => ({
      id: i.id,
      jenis_infaq: i.jenisInfaq,
      kampanye_judul: i.kampanye?.judul || null,
      jumlah_infaq: i.jumlahInfaq,
      status: i.status as 'pending' | 'lunas' | 'ditolak',
      created_at: i.createdAt,
    })),
  };
}

export async function cariRiwayatByEmail(email: string) {
  const cleanEmail = email.trim().toLowerCase();

  const riwayatZakat = await prisma.zakat.findMany({
    where: { email: cleanEmail },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      jenisZakat: true,
      jumlahZakat: true,
      sumberDana: true,
      status: true,
      createdAt: true,
      nama: true,
    },
  });

  const riwayatInfaq = await prisma.infaq.findMany({
    where: { email: cleanEmail },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      jenisInfaq: true,
      jumlahInfaq: true,
      status: true,
      createdAt: true,
      nama: true,
      kampanye: {
        select: { judul: true },
      },
    },
  });

  const nama =
    riwayatZakat[0]?.nama || riwayatInfaq[0]?.nama || null;

  const totalZakatLunas = riwayatZakat
    .filter((z) => z.status === 'lunas')
    .reduce((acc, z) => acc + (z.jumlahZakat || 0), 0);

  const totalInfaqLunas = riwayatInfaq
    .filter((i) => i.status === 'lunas')
    .reduce((acc, i) => acc + (i.jumlahInfaq || 0), 0);

  return {
    email: cleanEmail,
    nama,
    totalZakatLunas,
    totalInfaqLunas,
    riwayatZakat: riwayatZakat.map((z) => ({
      id: z.id,
      jenis_zakat: z.jenisZakat,
      jumlah_zakat: z.jumlahZakat,
      sumber_dana: z.sumberDana,
      status: z.status as 'pending' | 'lunas' | 'ditolak',
      created_at: z.createdAt,
    })),
    riwayatInfaq: riwayatInfaq.map((i) => ({
      id: i.id,
      jenis_infaq: i.jenisInfaq,
      kampanye_judul: i.kampanye?.judul || null,
      jumlah_infaq: i.jumlahInfaq,
      status: i.status as 'pending' | 'lunas' | 'ditolak',
      created_at: i.createdAt,
    })),
  };
}
