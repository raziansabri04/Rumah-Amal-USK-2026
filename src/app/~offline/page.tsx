export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f7f6] text-center p-6">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#0a3d2a]/10">
        <span className="text-3xl">📡</span>
      </div>
      <h1 className="text-2xl font-bold text-[#0a3d2a]">Kamu Sedang Offline</h1>
      <p className="mt-2 max-w-md text-gray-500">
        Halaman ini belum tersimpan di perangkatmu. Coba periksa koneksi internet dan muat ulang.
      </p>
    </div>
  );
}