import { KalkulatorPayload, KalkulatorResult, JenisZakat } from '@/types';

export interface NisabConfigInput {
  hargaEmasPerGram?: number;
  nisabEmasGram?: number;
  nisabProfesiBulan?: number;
}

export function hitungZakat(
  payload: KalkulatorPayload,
  config?: NisabConfigInput
): KalkulatorResult {
  const { jenis_zakat } = payload;

  const hargaEmasPerGram = config?.hargaEmasPerGram ?? 2_600_000;
  const nisabEmasGram = config?.nisabEmasGram ?? 94;
  const nisabProfesiBulan = config?.nisabProfesiBulan ?? 13_000_000;

  // Nisab Maal, Emas, Perniagaan, Perusahaan didasarkan pada Nisab Emas
  const nisabMaalRupiah = nisabEmasGram * hargaEmasPerGram;

  switch (jenis_zakat as JenisZakat) {
    case 'maal': {
      const totalHarta = Number(payload.total_harta || 0);
      const totalHutang = Number(payload.total_hutang || 0);
      const kebutuhan = Number(payload.total_kebutuhan || 0);
      const hartaBersih = totalHarta - totalHutang - kebutuhan;
      const mencapaiNisab = hartaBersih >= nisabMaalRupiah;
      return {
        mencapai_nisab: mencapaiNisab,
        jumlah_zakat: mencapaiNisab ? hartaBersih * 0.025 : 0,
        jenis_zakat: 'maal',
      };
    }

    case 'emas': {
      const beratEmas = Number(payload.berat_emas_gram || 0);
      const mencapaiNisab = beratEmas >= nisabEmasGram;
      const nilaiEmas = beratEmas * hargaEmasPerGram;
      return {
        mencapai_nisab: mencapaiNisab,
        jumlah_zakat: mencapaiNisab ? nilaiEmas * 0.025 : 0,
        jenis_zakat: 'emas',
      };
    }

    case 'profesi': {
      const penghasilan = Number(payload.penghasilan_bulan || 0);
      const bonus = Number(payload.bonus_tunjangan || 0);
      const hutang = Number(payload.total_hutang || 0);
      const kebutuhan = Number(payload.total_kebutuhan || 0);
      const totalPenghasilan = (penghasilan + bonus) - hutang - kebutuhan;
      const mencapaiNisab = totalPenghasilan >= nisabProfesiBulan;
      return {
        mencapai_nisab: mencapaiNisab,
        jumlah_zakat: mencapaiNisab ? totalPenghasilan * 0.025 : 0,
        jenis_zakat: 'profesi',
      };
    }

    case 'perniagaan': {
      const modal = Number(payload.modal_usaha || 0);
      const keuntungan = Number(payload.keuntungan || 0);
      const hutang = Number(payload.hutang_jangka_pendek || 0);
      const asetBersih = modal + keuntungan - hutang;
      const mencapaiNisab = asetBersih >= nisabMaalRupiah;
      return {
        mencapai_nisab: mencapaiNisab,
        jumlah_zakat: mencapaiNisab ? asetBersih * 0.025 : 0,
        jenis_zakat: 'perniagaan',
      };
    }

    case 'perusahaan': {
      if (payload.jenis_perusahaan === 'dagang_industri') {
        const asetLancar = Number(payload.aset_lancar || 0);
        const hutangLancar = Number(payload.hutang_lancar || 0);
        const asetBersih = asetLancar - hutangLancar;
        const mencapaiNisab = asetBersih >= nisabMaalRupiah;
        return {
          mencapai_nisab: mencapaiNisab,
          jumlah_zakat: mencapaiNisab ? asetBersih * 0.025 : 0,
          jenis_zakat: 'perusahaan',
        };
      } else {
        // jasa
        const laba = Number(payload.laba_sebelum_pajak || 0);
        const mencapaiNisab = laba >= nisabMaalRupiah;
        return {
          mencapai_nisab: mencapaiNisab,
          jumlah_zakat: mencapaiNisab ? laba * 0.1 : 0,
          jenis_zakat: 'perusahaan',
        };
      }
    }

    default:
      return {
        mencapai_nisab: false,
        jumlah_zakat: 0,
        jenis_zakat: jenis_zakat as JenisZakat,
      };
  }
}

// ---------------------------------------------------------------------------
// Zakat Pertanian
// ---------------------------------------------------------------------------
export const NISAB_PERTANIAN_MAP: Record<string, number> = {
  padi: 653,
  jagung: 653,
  kurma: 653,
  gandum: 653,
};

export function hitungZakatPertanian(params: {
  jumlah_panen_kg: number;
  jenis_pengairan: 'irigasi' | 'hujan_sungai';
  jenis_tanaman?: string;
}): KalkulatorResult {
  const { jumlah_panen_kg, jenis_pengairan, jenis_tanaman } = params;
  const tarif = jenis_pengairan === 'hujan_sungai' ? 0.1 : 0.05;
  const nisab = (jenis_tanaman && NISAB_PERTANIAN_MAP[jenis_tanaman]) ? NISAB_PERTANIAN_MAP[jenis_tanaman] : 653;
  const mencapai_nisab = jumlah_panen_kg >= nisab;
  const jumlah_zakat_kg = mencapai_nisab ? jumlah_panen_kg * tarif : 0;
  return {
    mencapai_nisab,
    jumlah_zakat: 0, // tidak dihitung dalam rupiah
    jumlah_zakat_kg,
    jenis_zakat: 'pertanian',
  };
}

// ---------------------------------------------------------------------------
// Zakat Peternakan — Kambing/Domba
// ---------------------------------------------------------------------------
function hitungZakatKambing(
  jumlah: number,
  lang: 'id' | 'en' | 'ar' = 'id'
): { mencapai_nisab: boolean; pesan_ternak: string } {
  if (jumlah < 40) return { mencapai_nisab: false, pesan_ternak: '' };

  let ekor: number;
  if (jumlah <= 120) {
    ekor = 1;
  } else if (jumlah <= 200) {
    ekor = 2;
  } else if (jumlah <= 299) {
    ekor = 3;
  } else {
    // Setiap 100 ekor = 1 ekor kambing, dimulai dari 300
    ekor = Math.floor(jumlah / 100);
  }

  let pesan = `${ekor} ekor kambing`;
  if (lang === 'en') {
    pesan = `${ekor} ${ekor === 1 ? 'goat/sheep' : 'goats/sheep'}`;
  } else if (lang === 'ar') {
    if (ekor === 1) pesan = 'شاة واحدة';
    else if (ekor === 2) pesan = 'شاتان';
    else if (ekor >= 3 && ekor <= 10) pesan = `${ekor} شياه`;
    else pesan = `${ekor} رأس من الغنم/الماعز`;
  }

  return { mencapai_nisab: true, pesan_ternak: pesan };
}

// ---------------------------------------------------------------------------
// Zakat Peternakan — Sapi/Kerbau
// ---------------------------------------------------------------------------
function hitungZakatSapiKerbau(
  jumlah: number,
  lang: 'id' | 'en' | 'ar' = 'id'
): { mencapai_nisab: boolean; pesan_ternak: string } {
  if (jumlah < 30) return { mencapai_nisab: false, pesan_ternak: '' };

  // Tabel eksplisit 30–119
  const tabelEksplisit: Array<{ min: number; max: number; id: string; en: string; ar: string }> = [
    {
      min: 30, max: 39,
      id: '1 ekor anak sapi/kerbau umur 1–2 tahun',
      en: '1 calf/buffalo (1–2 years old)',
      ar: 'عجل تبيع (بعمر سنة إلى سنتين)'
    },
    {
      min: 40, max: 59,
      id: '1 ekor anak sapi/kerbau umur 2–3 tahun',
      en: '1 calf/buffalo (2–3 years old)',
      ar: 'مسنة (بعمر سنتين إلى ٣ سنوات)'
    },
    {
      min: 60, max: 69,
      id: '2 ekor anak sapi/kerbau umur 1–2 tahun',
      en: '2 calves/buffalos (1–2 years old)',
      ar: 'تبيعان (بعمر سنة إلى سنتين)'
    },
    {
      min: 70, max: 79,
      id: '1 ekor umur 2–3 tahun + 1 ekor umur 1–2 tahun',
      en: '1 head (2–3 yrs) + 1 head (1–2 yrs)',
      ar: 'مسنة واحدة + تبيع واحد'
    },
    {
      min: 80, max: 89,
      id: '2 ekor anak sapi/kerbau umur 2–3 tahun',
      en: '2 calves/buffalos (2–3 years old)',
      ar: 'مسنتان (بعمر سنتين إلى ٣ سنوات)'
    },
    {
      min: 90, max: 99,
      id: '3 ekor anak sapi/kerbau umur 1–2 tahun',
      en: '3 calves/buffalos (1–2 years old)',
      ar: 'ثلاثة أتبعة (بعمر سنة إلى سنتين)'
    },
    {
      min: 100, max: 109,
      id: '1 ekor umur 2–3 tahun + 2 ekor umur 1–2 tahun',
      en: '1 head (2–3 yrs) + 2 head (1–2 yrs)',
      ar: 'مسنة واحدة + تبيعان'
    },
    {
      min: 110, max: 119,
      id: '2 ekor umur 2–3 tahun + 1 ekor umur 1–2 tahun',
      en: '2 head (2–3 yrs) + 1 head (1–2 yrs)',
      ar: 'مسنتان + تبيع واحد'
    },
  ];

  const cocok = tabelEksplisit.find((r) => jumlah >= r.min && jumlah <= r.max);
  if (cocok) return { mencapai_nisab: true, pesan_ternak: cocok[lang] || cocok.id };

  // Kaidah untuk >= 120: setiap 30 = 1 ekor (1–2 thn), setiap 40 = 1 ekor (2–3 thn)
  let bestTotal = -1;
  let part2to3 = 0;
  let part1to2 = 0;
  for (let a = 0; a * 30 <= jumlah; a++) {
    for (let b = 0; a * 30 + b * 40 <= jumlah; b++) {
      const used = a * 30 + b * 40;
      if (used > bestTotal && used <= jumlah) {
        bestTotal = used;
        part1to2 = a;
        part2to3 = b;
      }
    }
  }

  const parts: string[] = [];
  if (lang === 'en') {
    if (part2to3 > 0) parts.push(`${part2to3} head (2–3 yrs)`);
    if (part1to2 > 0) parts.push(`${part1to2} head (1–2 yrs)`);
    return { mencapai_nisab: true, pesan_ternak: parts.join(' + ') || `${Math.floor(jumlah / 30)} head (1–2 yrs)` };
  } else if (lang === 'ar') {
    if (part2to3 > 0) parts.push(part2to3 === 1 ? 'مسنة واحدة' : part2to3 === 2 ? 'مسنتان' : `${part2to3} مسنات`);
    if (part1to2 > 0) parts.push(part1to2 === 1 ? 'تبيع واحد' : part1to2 === 2 ? 'تبيعان' : `${part1to2} أتبعة`);
    return { mencapai_nisab: true, pesan_ternak: parts.join(' + ') || `${Math.floor(jumlah / 30)} تبيع` };
  } else {
    if (part2to3 > 0) parts.push(`${part2to3} ekor umur 2–3 tahun`);
    if (part1to2 > 0) parts.push(`${part1to2} ekor umur 1–2 tahun`);
    return { mencapai_nisab: true, pesan_ternak: parts.join(' + ') || `${Math.floor(jumlah / 30)} ekor umur 1–2 tahun` };
  }
}

export function hitungZakatPeternakan(params: {
  jumlah_ternak: number;
  jenis_ternak: 'kambing' | 'sapi_kerbau';
  lang?: 'id' | 'en' | 'ar';
}): KalkulatorResult {
  const { jumlah_ternak, jenis_ternak, lang = 'id' } = params;
  const hasil =
    jenis_ternak === 'kambing'
      ? hitungZakatKambing(jumlah_ternak, lang)
      : hitungZakatSapiKerbau(jumlah_ternak, lang);
  return {
    mencapai_nisab: hasil.mencapai_nisab,
    jumlah_zakat: 0,
    pesan_ternak: hasil.pesan_ternak,
    jenis_zakat: 'peternakan',
  };
}

export function formatRupiah(angka: number): string {
  return 'Rp ' + Number(angka).toLocaleString('id-ID');
}
