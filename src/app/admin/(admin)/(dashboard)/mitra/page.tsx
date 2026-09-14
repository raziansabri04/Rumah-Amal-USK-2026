import { getPaginatedMitra } from '@/actions/mitra';
import MitraClient from './MitraClient';

export const dynamic = 'force-dynamic';

export default async function AdminMitraPage(
  props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }
) {
  const searchParams = await props.searchParams;
  const page = parseInt((searchParams.page as string) || '1', 10);
  const search = (searchParams.search as string) || '';
  const limit = 5;

  const { items, totalCount, totalPages } = await getPaginatedMitra(page, limit, search);

  const serialised = items.map((a: any) => ({
    ...a,
    createdAt: new Date(a.createdAt),
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-[#000]">Mitra & Kerjasama</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola daftar logo mitra strategis dan lembaga mitra Rumah Amal USK
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100">
            {totalCount} Mitra Aktif
          </span>
        </div>
      </div>

      <MitraClient
        initialData={serialised}
        currentPage={page}
        totalPages={totalPages}
        totalCount={totalCount}
        initialSearch={search}
      />
    </div>
  );
}
