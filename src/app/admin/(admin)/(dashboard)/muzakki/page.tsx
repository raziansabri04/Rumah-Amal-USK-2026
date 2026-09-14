import { getMuzakkis } from '@/actions/muzakki';
import MuzakkiClient from './MuzakkiClient';

export default async function AdminMuzakkiPage() {
  const muzakkis = await getMuzakkis();

  return <MuzakkiClient initialData={muzakkis} />;
}
