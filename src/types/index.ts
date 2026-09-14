export type TipePembayar = 'muzakki usk' | 'masyarakat';
export type StatusPembayaran = 'pending' | 'lunas' | 'ditolak';

export type JenisZakat =
  | 'maal'
  | 'emas'
  | 'profesi'
  | 'perniagaan'
  | 'perusahaan'
  | 'pertanian'
  | 'peternakan';

export type JenisTanamanZakat = 'padi' | 'jagung' | 'gandum' | 'kurma';
export type JenisPengairan = 'irigasi' | 'hujan_sungai';
export type JenisTernak = 'kambing' | 'sapi_kerbau';

export type SumberDana =
  | 'remon'
  | 'serdos'
  | 'penghasilan_bulanan'
  | 'sertifikasi_profesor'
  | 'seluruh_dana';

export type JenisPerusahaan = 'dagang_industri' | 'jasa';

export type JenisInfaq =
  | 'umum'
  | 'pendidikan'
  | 'kemanusiaan'
  | 'pembangunan';

export interface Zakat {
  id: string;
  tipe_pembayar: TipePembayar;
  jenis_zakat: JenisZakat;
  sumber_dana?: string | null;
  jenis_perusahaan?: string | null;
  jumlah_zakat: number;
  nama: string;
  nip?: string | null;
  email?: string | null;
  alamat?: string | null;
  no_hp?: string | null;
  is_hamba_allah: boolean;
  bersedia_dihubungi: boolean;
  pesan?: string | null;
  bukti_pembayaran?: string | null;
  setuju_terms: boolean;
  status: StatusPembayaran;
  created_at: Date;
  updated_at: Date;
}

export interface Infaq {
  id: string;
  tipe_pembayar: TipePembayar;
  jenis_infaq: JenisInfaq;
  jumlah_infaq: number;
  nama: string;
  nip?: string | null;
  email?: string | null;
  alamat?: string | null;
  no_hp?: string | null;
  is_hamba_allah: boolean;
  bersedia_dihubungi: boolean;
  pesan?: string | null;
  bukti_pembayaran?: string | null;
  setuju_terms: boolean;
  status: StatusPembayaran;
  created_at: Date;
  updated_at: Date;
}

export interface ZakatFormPayload {
  tipe_pembayar: TipePembayar;
  jenis_zakat: JenisZakat;
  sumber_dana?: string;
  jenis_perusahaan?: string;
  jumlah_zakat: number;
  nama: string;
  nip?: string;
  email?: string;
  alamat?: string;
  no_hp?: string;
  is_hamba_allah: boolean;
  bersedia_dihubungi: boolean;
  pesan?: string;
  setuju_terms: boolean;
}

export interface InfaqFormPayload {
  tipe_pembayar: TipePembayar;
  jenis_infaq: JenisInfaq;
  jumlah_infaq: number;
  nama: string;
  nip?: string;
  email?: string;
  alamat?: string;
  no_hp?: string;
  is_hamba_allah: boolean;
  bersedia_dihubungi: boolean;
  pesan?: string;
  setuju_terms: boolean;
}

export interface KalkulatorField {
  name: string;
  label: string;
}

export interface KalkulatorPayload {
  jenis_zakat: JenisZakat;
  jenis_perusahaan?: JenisPerusahaan;
  [key: string]: string | number | undefined;
}

export interface KalkulatorResult {
  mencapai_nisab: boolean;
  jumlah_zakat: number;
  jenis_zakat: JenisZakat;
  pesan?: string;
  /** Deskripsi teks output zakat peternakan, misal: '2 ekor anak sapi umur 1–2 tahun' */
  pesan_ternak?: string;
  /** Untuk zakat pertanian: hasil zakat dalam kg */
  jumlah_zakat_kg?: number;
}

export interface RiwayatZakatItem {
  id: string;
  jenis_zakat: string;
  jumlah_zakat: number;
  status: StatusPembayaran;
  created_at: Date;
}

export interface RiwayatInfaqItem {
  id: string;
  jenis_infaq: string;
  jumlah_infaq: number;
  status: StatusPembayaran;
  created_at: Date;
}

export interface RiwayatResult {
  nip: string;
  nama?: string;
  riwayatZakat: RiwayatZakatItem[];
  riwayatInfaq: RiwayatInfaqItem[];
}

export interface DashboardStats {
  totalZakat: number;
  totalInfaq: number;
  pendingZakat: number;
  pendingInfaq: number;
}

export interface GrafikBulanan {
  bulan: string;
  total: number;
}

export interface GrafikJenis {
  jenis_zakat: string;
  total: number;
}
