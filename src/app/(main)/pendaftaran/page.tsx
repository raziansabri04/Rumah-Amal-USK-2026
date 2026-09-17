import { Metadata } from 'next';
import { getActivePrograms } from '@/actions/pendaftaran-publik';
import PendaftaranKatalogClient from './PendaftaranKatalogClient';

export const metadata: Metadata = {
  title: 'Pendaftaran Beasiswa & Bantuan | Rumah Amal USK',
  description: 'Daftar program bantuan dan beasiswa terbuka di Rumah Amal Masjid Jamik Universitas Syiah Kuala.',
};

// Cache katalog publik selama 60 detik (ISR) agar respon instan, dan otomatis invalidasi saat admin mengubah program
export const revalidate = 60;

export default async function PendaftaranPage() {
  const result = await getActivePrograms();
  const programs = result.success && result.data ? result.data : [];

  return <PendaftaranKatalogClient initialPrograms={programs} />;
}
