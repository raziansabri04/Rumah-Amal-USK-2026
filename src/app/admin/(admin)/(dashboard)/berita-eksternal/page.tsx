import { getNewsLinks } from '@/actions/berita-eksternal';
import BeritaEksternalClient from './BeritaEksternalClient';

export const dynamic = 'force-dynamic';

export default async function AdminBeritaEksternalPage(
  props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }
) {
  const searchParams = await props.searchParams;
  const page = parseInt((searchParams.page as string) || '1', 10);
  const search = (searchParams.search as string) || '';
  const limit = 8;

  const { items, totalCount, totalPages, activeCount, inactiveCount } = await getNewsLinks(page, limit, search);

  const serialised = items.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-[#000]">Berita Eksternal</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tambah dan kelola berita dari media eksternal untuk ditampilkan di halaman publik
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

      <BeritaEksternalClient
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

