import { getAnnouncements } from '@/actions/pengumuman';
import PengumumanClient from './PengumumanClient';

export const dynamic = 'force-dynamic';

export default async function AdminPengumumanPage(
  props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }
) {
  const searchParams = await props.searchParams;
  const page = parseInt((searchParams.page as string) || '1', 10);
  const search = (searchParams.search as string) || '';
  const limit = 8;

  const { items, totalCount, totalPages, publishedCount, draftCount } = await getAnnouncements(page, limit, search);

  // Serialise Dates untuk props client component
  const serialised = items.map((a: any) => ({
    ...a,
    publishedAt: a.publishedAt ? new Date(a.publishedAt) : null,
    createdAt: new Date(a.createdAt),
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-[#000]">Pengumuman</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola daftar pengumuman yang ditampilkan kepada publik
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100">
            {publishedCount} Tayang
          </span>
          <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl border border-gray-200">
            {draftCount} Draft
          </span>
        </div>
      </div>

      <PengumumanClient
        initialData={serialised}
        currentPage={page}
        totalPages={totalPages}
        totalCount={totalCount}
        publishedCount={publishedCount}
        draftCount={draftCount}
        initialSearch={search}
      />
    </div>
  );
}
