import SendNotificationForm from '@/components/admin/SendNotificationForm';

export const metadata = { title: 'Kirim Notifikasi | Admin' };

export default function AdminNotifikasiPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-[#000]">Notifikasi</h1>
        <p className="text-sm text-gray-500 mt-1">
          Kirim pesan langsung ke semua pelanggan yang mengaktifkan notifikasi.
          Pengumuman yang tayang tetap terkirim otomatis.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <SendNotificationForm />
      </div>
    </div>
  );
}