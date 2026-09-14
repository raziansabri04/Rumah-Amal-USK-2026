'use client';

import { useEffect, useState, useRef } from 'react';
import { updateZakatAdmin, deleteZakat } from '@/actions/zakat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCoins,
  faSearch,
  faCheckCircle,
  faTimesCircle,
  faExternalLinkAlt,
  faEdit,
  faTrash,
  faFileArrowUp,
  faCommentDots,
  faTableList,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import CsvImportModal from '@/components/admin/CsvImportModal';
import AdminPagination from '@/components/admin/AdminPagination';
import PesanNoteModal from '@/components/admin/PesanNoteModal';
import DataZakatModal from '@/components/admin/DataZakatModal';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { formatThousand, parseRawNumber } from '@/lib/formatNumber';
import AdminToast, { ToastState } from '@/components/admin/AdminToast';

type MuzakkiInfo = {
  nip: string;
  nama: string;
  npwp: string | null;
  alamat: string | null;
  unitKerja: string | null;
  noHp: string | null;
};

type ZakatItem = {
  id: string;
  nama: string;
  nip: string | null;
  noHp: string | null;
  muzakki: MuzakkiInfo | null;
  tipePembayar: string;
  jenisZakat: string;
  sumberDana: string | null;
  jenisPerusahaan: string | null;
  jumlahZakat: number;
  buktiPembayaran: string | null;
  tanggal: string;
  pesan: string;
  status: string;
};

type Counts = { all: number; pending: number; lunas: number; ditolak: number };

function formatRupiah(angka: number) {
  return 'Rp ' + angka.toLocaleString('id-ID');
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    lunas: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    ditolak: 'bg-red-100 text-red-700 border-red-200',
  };
  const label: Record<string, string> = { lunas: 'Lunas', pending: 'Pending', ditolak: 'Ditolak' };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${map[status] || 'bg-gray-100 text-gray-500'}`}>
      {label[status] || status}
    </span>
  );
}

const ITEMS_PER_PAGE = 10;
const DEBOUNCE_MS = 400;

export default function AdminZakatPage() {
  const [data, setData] = useState<ZakatItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState<Counts>({ all: 0, pending: 0, lunas: 0, ditolak: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'lunas' | 'ditolak'>('all');
  const [filterJenis, setFilterJenis] = useState('all');
  const [availableJenis, setAvailableJenis] = useState<string[]>([]);
  const [filterUnitKerja, setFilterUnitKerja] = useState('all');
  const [availableUnitKerja, setAvailableUnitKerja] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<ZakatItem | null>(null);
  const [editNama, setEditNama] = useState('');
  const [editNip, setEditNip] = useState('');
  const [editJenis, setEditJenis] = useState('');
  const [editJumlah, setEditJumlah] = useState<number>(0);
  const [editStatus, setEditStatus] = useState('pending');
  const [editPesan, setEditPesan] = useState('');
  const [saving, setSaving] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [selectedPesan, setSelectedPesan] = useState<{
    nama: string;
    kategori: string;
    tanggal: string;
    pesan: string;
  } | null>(null);
  const [selectedZakatItem, setSelectedZakatItem] = useState<ZakatItem | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<ZakatItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const latestReqRef = useRef(0);
  // Keep latest values in refs to avoid stale closures in async functions
  const searchRef = useRef(search);
  const filterStatusRef = useRef(filterStatus);
  const filterJenisRef = useRef(filterJenis);
  const filterUnitKerjaRef = useRef(filterUnitKerja);
  const currentPageRef = useRef(currentPage);

  async function fetchData(
    page: number,
    searchVal: string,
    statusVal: string,
    jenisVal = filterJenisRef.current,
    unitKerjaVal = filterUnitKerjaRef.current
  ) {
    const reqId = ++latestReqRef.current;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(ITEMS_PER_PAGE),
        search: searchVal,
        status: statusVal,
        jenisZakat: jenisVal,
        unitKerja: unitKerjaVal,
      });
      const res = await fetch(`/api/admin/zakat?${params}`);
      const json = await res.json();
      if (reqId !== latestReqRef.current) return; // discard stale response
      setData(json.data || []);
      setTotalItems(json.total ?? 0);
      setTotalPages(json.totalPages ?? 1);
      setCounts(json.counts || { all: 0, pending: 0, lunas: 0, ditolak: 0 });
      if (json.availableJenis) {
        setAvailableJenis(json.availableJenis);
      }
      if (json.availableUnitKerja) {
        setAvailableUnitKerja(json.availableUnitKerja);
      }
    } finally {
      if (reqId === latestReqRef.current) setLoading(false);
    }
  }

  // Initial load
  useEffect(() => {
    fetchData(1, '', 'all', 'all', 'all');
  }, []);

  function handleSearchChange(val: string) {
    setSearch(val);
    searchRef.current = val;
    setCurrentPage(1);
    currentPageRef.current = 1;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchData(1, val, filterStatusRef.current, filterJenisRef.current, filterUnitKerjaRef.current);
    }, DEBOUNCE_MS);
  }

  function handleStatusChange(status: 'all' | 'pending' | 'lunas' | 'ditolak') {
    setFilterStatus(status);
    filterStatusRef.current = status;
    setCurrentPage(1);
    currentPageRef.current = 1;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    fetchData(1, searchRef.current, status, filterJenisRef.current, filterUnitKerjaRef.current);
  }

  function handleJenisChange(jenis: string) {
    setFilterJenis(jenis);
    filterJenisRef.current = jenis;
    setCurrentPage(1);
    currentPageRef.current = 1;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    fetchData(1, searchRef.current, filterStatusRef.current, jenis, filterUnitKerjaRef.current);
  }

  function handleUnitKerjaChange(unitKerja: string) {
    setFilterUnitKerja(unitKerja);
    filterUnitKerjaRef.current = unitKerja;
    setCurrentPage(1);
    currentPageRef.current = 1;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    fetchData(1, searchRef.current, filterStatusRef.current, filterJenisRef.current, unitKerja);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    currentPageRef.current = page;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    fetchData(page, searchRef.current, filterStatusRef.current, filterJenisRef.current, filterUnitKerjaRef.current);
  }

  async function handleAction(id: string, action: 'approve' | 'reject') {
    await fetch(`/api/admin/zakat/${id}/${action}`, { method: 'PATCH' });
    fetchData(currentPageRef.current, searchRef.current, filterStatusRef.current, filterJenisRef.current, filterUnitKerjaRef.current);
  }

  async function handleConfirmDelete() {
    if (!deleteConfirmItem) return;
    setIsDeleting(true);
    try {
      await deleteZakat(deleteConfirmItem.id);
      setToast({ message: 'Data zakat berhasil dihapus.', type: 'success' });
      fetchData(currentPageRef.current, searchRef.current, filterStatusRef.current, filterJenisRef.current, filterUnitKerjaRef.current);
    } catch (err: any) {
      setToast({ message: err.message || 'Gagal menghapus data zakat', type: 'error' });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmItem(null);
    }
  }

  function openEditModal(item: ZakatItem) {
    setEditingItem(item);
    setEditNama(item.nama);
    setEditNip(item.nip || '');
    setEditJenis(item.jenisZakat);
    setEditJumlah(item.jumlahZakat);
    setEditStatus(item.status);
    setEditPesan(item.pesan === '-' ? '' : item.pesan);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);
    try {
      await updateZakatAdmin(editingItem.id, {
        nama: editNama,
        nip: editNip,
        jenisZakat: editJenis,
        jumlahZakat: editJumlah,
        status: editStatus,
        pesan: editPesan,
      });
      setEditingItem(null);
      setToast({ message: 'Perubahan data zakat berhasil disimpan.', type: 'success' });
      fetchData(currentPageRef.current, searchRef.current, filterStatusRef.current, filterJenisRef.current, filterUnitKerjaRef.current);
    } catch (err: any) {
      setToast({ message: err.message || 'Gagal menyimpan perubahan', type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faCoins} className="text-[#063A1E] w-6 h-6" />
            Data Zakat
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Kelola &amp; verifikasi data pembayaran zakat dari Muzakki maupun Masyarakat USK.
          </p>
        </div>
        <button
          onClick={() => setIsCsvModalOpen(true)}
          className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#063A1E] border border-[#063A1E]/30 hover:border-[#063A1E] px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer shrink-0"
        >
          <FontAwesomeIcon icon={faFileArrowUp} className="w-3.5 h-3.5" />
          Import CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(
          [
            { key: 'all', label: 'Semua', color: 'bg-gray-100 text-gray-700' },
            { key: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-700' },
            { key: 'lunas', label: 'Lunas', color: 'bg-emerald-100 text-emerald-700' },
            { key: 'ditolak', label: 'Ditolak', color: 'bg-red-100 text-red-700' },
          ] as const
        ).map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => handleStatusChange(key)}
            className={`rounded-xl p-3 text-left transition-all border cursor-pointer ${filterStatus === key
              ? 'border-[#063A1E] shadow-sm ring-1 ring-[#063A1E]/20'
              : 'border-gray-100 hover:border-gray-200'
              } bg-white`}
          >
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</p>
            <p className={`text-xl font-black mt-0.5 px-2 py-0.5 rounded-lg inline-block ${color}`}>
              {counts[key]}
            </p>
          </button>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari nama, NIP, atau nama muzakki..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#063A1E] shadow-2xs transition-all"
          />
        </div>

        {/* Filter Jenis Zakat */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterJenis}
            onChange={(e) => handleJenisChange(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white text-gray-700 font-medium focus:outline-none focus:border-[#063A1E] shadow-2xs cursor-pointer capitalize"
          >
            <option value="all">Semua Jenis Zakat</option>
            {availableJenis.map((j) => (
              <option key={j} value={j} className="capitalize">
                Zakat {j}
              </option>
            ))}
          </select>

          {/* Filter Unit Kerja */}
          <select
            value={filterUnitKerja}
            onChange={(e) => handleUnitKerjaChange(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white text-gray-700 font-medium focus:outline-none focus:border-[#063A1E] shadow-2xs cursor-pointer max-w-xs truncate"
          >
            <option value="all">Semua Unit Kerja</option>
            {availableUnitKerja.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>



      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4 text-center">Muzakki</th>
                <th className="py-3.5 px-4 text-center">Jumlah Zakat</th>
                <th className="py-3.5 px-4 text-center">Data Zakat</th>
                <th className="py-3.5 px-4 text-center">Bukti</th>
                <th className="py-3.5 px-4 text-center">Pesan</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    <div className="w-5 h-5 border-2 border-[#063A1E] border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Muzakki — Nama + Tipe + NIP */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900 text-xs">{item.nama}</p>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded capitalize mt-1 inline-block">
                        {item.tipePembayar}
                      </span>
                      {item.nip && (
                        <span className="text-[10px] text-gray-500 font-mono">NIP: {item.nip}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-800 text-center">{formatRupiah(item.jumlahZakat)}</td>

                    {/* Data Zakat — Tombol Lihat */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedZakatItem(item)}
                        className="inline-flex items-center gap-1 text-[#063A1E] underline underline-offset-2 font-semibold hover:text-[#042814] cursor-pointer"
                      >
                        Lihat <FontAwesomeIcon icon={faTableList} className="w-2.5 h-2.5" />
                      </button>
                      <br />
                      <span className="font-semibold text-gray-500 text-[10px]">{item.tanggal}</span>
                    </td>

                    {/* Bukti */}
                    <td className="py-3.5 px-4 text-center">
                      {item.buktiPembayaran ? (
                        <a
                          href={item.buktiPembayaran}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#063A1E] underline underline-offset-2 font-semibold"
                        >
                          Lihat <FontAwesomeIcon icon={faExternalLinkAlt} className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* Pesan */}
                    <td className="py-3.5 px-4 text-center">
                      {item.pesan && item.pesan.trim() !== '' && item.pesan.trim() !== '-' ? (
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPesan({
                              nama: item.nama,
                              kategori: `Zakat ${item.jenisZakat}`,
                              tanggal: item.tanggal,
                              pesan: item.pesan,
                            })
                          }
                          className="inline-flex items-center gap-1 text-[#063A1E] underline underline-offset-2 font-semibold hover:text-[#042814] cursor-pointer"
                        >
                          Lihat <FontAwesomeIcon icon={faCommentDots} className="w-2.5 h-2.5" />
                        </button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Edit Data Zakat"
                        >
                          <FontAwesomeIcon icon={faEdit} className="w-3.5 h-3.5" />
                        </button>
                        {item.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction(item.id, 'approve')}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                              title="Approve (Lunas)"
                            >
                              <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAction(item.id, 'reject')}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Tolak"
                            >
                              <FontAwesomeIcon icon={faTimesCircle} className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setDeleteConfirmItem(item)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Hapus Data Zakat"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
          itemLabel="zakat"
        />
      </div>


      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#063A1E]/10 text-[#063A1E] flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={faCoins} className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 leading-tight">Edit Data Pembayaran Zakat</h3>
                  <p className="text-[11px] text-gray-500">Perbarui rincian data pembayaran dan status zakat</p>
                </div>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 flex items-center justify-center transition-colors cursor-pointer"
                title="Tutup"
              >
                <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nama Pembayar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editNama}
                    onChange={(e) => setEditNama(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#063A1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">NIP (Muzakki USK)</label>
                  <input
                    type="text"
                    value={editNip}
                    onChange={(e) => setEditNip(e.target.value)}
                    placeholder="Kosongkan jika umum"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#063A1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Jenis Zakat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editJenis}
                    onChange={(e) => setEditJenis(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#063A1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Jumlah Zakat (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formatThousand(editJumlah)}
                    onChange={(e) => setEditJumlah(Number(parseRawNumber(e.target.value)))}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#063A1E] font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Status Verifikasi</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#063A1E] bg-white font-semibold"
                  >
                    <option value="pending">Pending</option>
                    <option value="lunas">Lunas</option>
                    <option value="ditolak">Ditolak</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pesan / Catatan</label>
                  <textarea
                    rows={2}
                    value={editPesan}
                    onChange={(e) => setEditPesan(e.target.value)}
                    placeholder="Catatan atau pesan donatur..."
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#063A1E]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 mt-2 border-t border-gray-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#063A1E] hover:bg-[#042814] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Simpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onSuccess={() => fetchData(1, searchRef.current, filterStatusRef.current)}
        title="Import Zakat Muzakki"
        endpoint="/api/admin/import/zakat"
        requiredColumns={['nip', 'jumlah_zakat', 'jenis_zakat']}
        optionalColumns={['no_hp', 'sumber_dana', 'pesan', 'tanggal']}
        templateRows={[
          ['198501012010121001', '500000', 'profesi', '081200010001', 'gaji', '', '01/15/2025'],
          ['197803152005011002', '250000', 'maal', '081300020002', '', 'Zakat bulan Januari', '01/15/2025'],
        ]}
      />

      {/* Pesan Note Modal */}
      <PesanNoteModal
        isOpen={!!selectedPesan}
        onClose={() => setSelectedPesan(null)}
        nama={selectedPesan?.nama || ''}
        kategori={selectedPesan?.kategori || ''}
        tanggal={selectedPesan?.tanggal}
        pesan={selectedPesan?.pesan || ''}
      />

      {/* Data Zakat Modal */}
      <DataZakatModal
        isOpen={!!selectedZakatItem}
        onClose={() => setSelectedZakatItem(null)}
        item={selectedZakatItem}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmItem)}
        onClose={() => setDeleteConfirmItem(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Data Zakat?"
        message={`Apakah Anda yakin ingin menghapus data zakat atas nama "${deleteConfirmItem?.nama || ''}"? Data yang dihapus tidak dapat dikembalikan.`}
        confirmText="Hapus Data"
        loading={isDeleting}
      />

      {/* Toast Notification */}
      <AdminToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}