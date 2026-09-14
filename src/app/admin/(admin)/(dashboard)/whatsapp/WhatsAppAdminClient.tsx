'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import {
  faCheckCircle,
  faCircleNotch,
  faPaperPlane,
  faRightFromBracket,
  faInfoCircle,
  faShieldHalved,
  faRotateRight,
  faQrcode,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from '@/components/admin/ConfirmModal';
import AdminToast, { ToastState } from '@/components/admin/AdminToast';

type GatewayStatus = {
  status: 'connected' | 'connecting' | 'disconnected' | 'offline';
  qrImage?: string | null;
  connectedUser?: string | null;
  error?: string;
};

export default function WhatsAppAdminClient() {
  const [data, setData] = useState<GatewayStatus>({ status: 'connecting' });
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState(
    "Assalamu'alaikum, ini uji coba pesan dari WhatsApp Gateway Rumah Amal USK."
  );
  const [sendingTest, setSendingTest] = useState(false);
  const [testSuccessMsg, setTestSuccessMsg] = useState('');
  const [testErrorMsg, setTestErrorMsg] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  async function fetchStatus() {
    try {
      const res = await fetch('/api/admin/whatsapp/status', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setData({ status: 'offline', error: 'Service Gateway tidak aktif.' });
      }
    } catch {
      setData({ status: 'offline', error: 'Gagal menghubungi service gateway.' });
    }
  }

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  async function handleConfirmLogout() {
    setLoggingOut(true);
    try {
      const res = await fetch('/api/admin/whatsapp/logout', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setData({ status: 'connecting', qrImage: null });
        setToast({ message: 'Sesi WhatsApp berhasil diputuskan.', type: 'success' });
        fetchStatus();
      } else {
        setToast({ message: json.error || 'Gagal logout', type: 'error' });
      }
    } catch (err: any) {
      setToast({ message: 'Error: ' + err.message, type: 'error' });
    } finally {
      setLoggingOut(false);
      setIsLogoutConfirmOpen(false);
    }
  }

  async function handleTestSend(e: React.FormEvent) {
    e.preventDefault();
    if (!testPhone.trim() || !testMessage.trim()) return;

    setSendingTest(true);
    setTestSuccessMsg('');
    setTestErrorMsg('');

    try {
      const res = await fetch('/api/admin/whatsapp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: testPhone.trim(),
          message: testMessage.trim(),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setTestSuccessMsg(`Pesan berhasil terkirim ke +${testPhone}!`);
        setTimeout(() => setTestSuccessMsg(''), 4000);
      } else {
        setTestErrorMsg(json.error || 'Gagal mengirim pesan uji coba.');
      }
    } catch (err: any) {
      setTestErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setSendingTest(false);
    }
  }

  const isConnected = data.status === 'connected';
  const isConnecting = data.status === 'connecting' || (data.status === 'disconnected' && Boolean(data.qrImage));
  const isOffline = data.status === 'offline';

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center text-2xl shrink-0">
            <FontAwesomeIcon icon={faWhatsapp} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
              WhatsApp Gateway Server
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Kelola koneksi bot WhatsApp resmi Rumah Amal USK untuk pengiriman OTP verifikasi donatur.
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE & TERHUBUNG
            </span>
          ) : isConnecting ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              <FontAwesomeIcon icon={faQrcode} className="w-3 h-3" />
              MENUNGGU SCAN QR
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
              <FontAwesomeIcon icon={faExclamationTriangle} className="w-3 h-3" />
              GATEWAY OFFLINE
            </span>
          )}
        </div>
      </div>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Status Koneksi & QR Code Scan */}
        <div className={`${isConnected ? 'lg:col-span-6' : 'lg:col-span-12'} bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between`}>
          <div>
            <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2 mb-1">
              <FontAwesomeIcon icon={faShieldHalved} className="text-[#0b6330]" />
              Status Perangkat WhatsApp
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Autentikasi multi-device WhatsApp resmi Rumah Amal USK.
            </p>

            {isOffline && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold space-y-2">
                <p className="font-bold flex items-center gap-2">
                  <FontAwesomeIcon icon={faExclamationTriangle} /> Service WhatsApp Gateway Sedang Offline
                </p>
                <p className="text-[11px] text-red-600 leading-relaxed">
                  Pastikan background service di folder <code className="bg-red-100 px-1 py-0.5 rounded font-mono">services/wa-gateway</code> sudah dijalankan dengan perintah <code className="bg-red-100 px-1 py-0.5 rounded font-mono">npm start</code>.
                </p>
              </div>
            )}

            {isConnecting && (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                {data.qrImage ? (
                  <div className="bg-white p-3 rounded-2xl shadow-md border-2 border-dashed border-gray-300 inline-block mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.qrImage}
                      alt="WhatsApp QR Code"
                      className="w-64 h-64 rounded-xl object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-64 h-64 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-2 mb-4">
                    <FontAwesomeIcon icon={faCircleNotch} className="animate-spin text-2xl text-[#0b6330]" />
                    <span className="text-xs font-bold">Membuat QR Code...</span>
                  </div>
                )}

                <p className="text-xs font-bold text-gray-700 mb-4">
                  Arahkan kamera WhatsApp smartphone Anda ke QR Code di atas
                </p>

                <div className="w-full text-left bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-2">
                  <p className="font-bold text-[#0b6330]">📱 Langkah Menautkan Perangkat:</p>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                    <li>Buka aplikasi <strong>WhatsApp</strong> di smartphone nomor resmi Rumah Amal.</li>
                    <li>Buka menu <strong>Perangkat Tertaut (Linked Devices)</strong>.</li>
                    <li>Ketuk <strong>Tautkan Perangkat (Link a Device)</strong>, lalu scan QR Code di atas.</li>
                  </ol>
                </div>
              </div>
            )}

            {isConnected && (
              <div className="py-6 flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center text-4xl shadow-inner border border-[#25D366]/30">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">
                    WhatsApp Berhasil Terhubung
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Nomor WhatsApp Resmi yang Aktif:
                  </p>
                  <p className="text-lg font-black font-mono text-[#0b6330] mt-1 bg-emerald-50 px-4 py-1.5 rounded-xl border border-emerald-200 inline-block">
                    +{data.connectedUser || 'Terhubung'}
                  </p>
                </div>

                <div className="w-full bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 text-emerald-800 text-[11px] text-left">
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-1.5" />
                  Bot WhatsApp siap mengirimkan kode OTP secara otomatis ke donatur yang meminta verifikasi di halaman publik riwayat.
                </div>
              </div>
            )}
          </div>

          {isConnected && (
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                disabled={loggingOut}
                onClick={() => setIsLogoutConfirmOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all border border-red-200 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <FontAwesomeIcon icon={loggingOut ? faCircleNotch : faRightFromBracket} className={loggingOut ? 'animate-spin' : ''} />
                <span>{loggingOut ? 'Memutuskan...' : 'Putuskan Sesi WhatsApp (Logout)'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Uji Coba Kirim Pesan Langsung */}
        {isConnected && (
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-100 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2 mb-1">
                <FontAwesomeIcon icon={faPaperPlane} className="text-[#0b6330]" />
                Uji Coba Pengiriman Pesan
              </h2>
              <p className="text-xs text-gray-500 mb-5">
                Kirim pesan uji coba ke nomor tujuan untuk memastikan pesan terkirim dengan sempurna.
              </p>

              <form onSubmit={handleTestSend} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nomor WhatsApp Tujuan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="Contoh: 081234567890 atau 6281234567890"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0b6330] bg-gray-50/50 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Isi Pesan Teks <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 text-xs focus:outline-none focus:border-[#0b6330] bg-gray-50/50 focus:bg-white transition-all font-medium leading-relaxed"
                  />
                </div>

                {testSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>{testSuccessMsg}</span>
                  </div>
                )}

                {testErrorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    <span>{testErrorMsg}</span>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={sendingTest || !testPhone.trim()}
                    className="bg-[#0b6330] hover:bg-[#074722] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {sendingTest ? (
                      <>
                        <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
                        Mengirim Pesan...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPaperPlane} />
                        Kirim Pesan Uji Coba
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 text-gray-400 text-[11px] flex items-center justify-between">
              <span>Port: 3001 (Microservice)</span>
              <span>Protokol: Baileys Multi-Device</span>
            </div>
          </div>
        )}
      </div>
      {/* Confirm Logout Modal */}
      <ConfirmModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Putuskan Sesi WhatsApp?"
        message="Apakah Anda yakin ingin memutuskan sesi WhatsApp ini? Anda perlu melakukan scan QR Code ulang untuk menghubungkan kembali."
        confirmText="Ya, Putuskan Sesi"
        loading={loggingOut}
      />

      {/* Toast Notification */}
      <AdminToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
