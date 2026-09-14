import { getStrukturOrganisasi } from '@/actions/struktur-organisasi';
import StrukturOrganisasiClient from './StrukturOrganisasiClient';

export default async function AdminStrukturOrganisasiPage() {
  const data = await getStrukturOrganisasi();

  return <StrukturOrganisasiClient initialData={data} />;
}
