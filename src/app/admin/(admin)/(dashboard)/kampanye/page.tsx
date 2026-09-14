import { getPaginatedKampanye } from '@/actions/kampanye';
import KampanyeClient from './KampanyeClient';

export const dynamic = 'force-dynamic';

export default async function AdminKampanyePage(
  props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }
) {
  const searchParams = await props.searchParams;
  const page = parseInt((searchParams.page as string) || '1', 10);
  const search = (searchParams.search as string) || '';
  const limit = 8;

  const { items, totalCount, totalPages, activeCount, inactiveCount } = await getPaginatedKampanye(page, limit, search);

  const serialised = items.map((a: any) => ({
    ...a,
    tanggalSelesai: a.tanggalSelesai ? new Date(a.tanggalSelesai) : null,
    createdAt: new Date(a.createdAt),
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-[#000]">Kampanye Donasi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola daftar program kampanye penggalangan dana Rumah Amal USK
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100">
            {activeCount} Aktif
          </span>
          <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl border border-gray-200">
            {inactiveCount} Nonaktif
          </span>
        </div>
      </div>

      <KampanyeClient
        initialData={serialised}
        currentPage={page}
        totalPages={totalPages}
        totalCount={totalCount}
        activeCount={activeCount}
        inactiveCount={inactiveCount}
        initialSearch={search}
      />
    </div>
  );
}
