import { getNisabConfig } from '@/actions/nisab';
import NisabClient from './NisabClient';

export default async function AdminNisabPage() {
  const config = await getNisabConfig();

  return <NisabClient initialData={config} />;
}
