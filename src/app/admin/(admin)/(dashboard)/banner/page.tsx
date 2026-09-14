import prisma, { getPrismaInstance } from '@/lib/prisma';
import BannerClient from './BannerClient';

export const dynamic = 'force-dynamic';

export default async function AdminBannerPage() {
  const client = (prisma.banner ? prisma : getPrismaInstance()) as any;
  const banners = client.banner?.findMany
    ? await client.banner.findMany({
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' },
        ],
      })
    : [];

  const serialised = (banners as any[]).map((b: any) => ({
    ...b,
    createdAt: b.createdAt instanceof Date ? b.createdAt.toISOString() : b.createdAt,
  }));

  const activeCount = (banners as any[]).filter((b: any) => b.isActive).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-[#000]">Banner Hero Beranda</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola gambar banner khusus dan link promosi yang tampil di slider utama Beranda
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100">
            {activeCount} Banner Aktif
          </span>
        </div>
      </div>

      <BannerClient initialData={serialised} />
    </div>
  );
}
