import { getProgramBantuanList } from '@/actions/pendaftaran-admin';
import PendaftaranClient from './PendaftaranClient';

export const dynamic = 'force-dynamic';

export default async function AdminPendaftaranPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const search = (searchParams.search as string) || '';
  const status = (searchParams.status as string) || 'all';

  const res = await getProgramBantuanList(search, status);
  const programs = res.success && res.data ? res.data : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PendaftaranClient
        initialPrograms={programs}
        initialSearch={search}
        initialStatus={status}
      />
    </div>
  );
}
