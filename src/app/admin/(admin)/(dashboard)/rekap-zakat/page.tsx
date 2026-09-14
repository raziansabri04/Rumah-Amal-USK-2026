'use client';

import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileText,
  faSearch,
  faExternalLinkAlt,
  faTrash,
  faEdit,
  faXmark,
  faFileArrowUp,
} from '@fortawesome/free-solid-svg-icons';
import CsvImportModal from '@/components/admin/CsvImportModal';
import AdminPagination from '@/components/admin/AdminPagination';
import ConfirmModal from '@/components/admin/ConfirmModal';
import AdminToast, { ToastState } from '@/components/admin/AdminToast';

type RekapItem = {
  id: string;
  muzakkiNIP: string;
  muzakki: { nama: string; unitKerja: string | null } | null;
  tahunRekap: string;
  fileUrl: string;
  createdAt: string;
};

const ITEMS_PER_PAGE = 10;
const DEBOUNCE_MS = 400;

export default function AdminRekapZakatPage() {
  const [data, setData] = useState<RekapItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterUnitKerja, setFilterUnitKerja] = useState('all');
  const [availableUnitKerja, setAvailableUnitKerja] = useState<string[]>([]);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingItem, setEditingItem] = useState<RekapItem | null>(null);
  const [editNip, setEditNip] = useState('');
  const [editTahun, setEditTahun] = useState('');
  const [editFileUrl, setEditFileUrl] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<RekapItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const latestReqRef = useRef(0);
  const searchRef = useRef(search);
  const filterUnitKerjaRef = useRef(filterUnitKerja);

  async function loadData(page = currentPage, searchVal = searchRef.current, unitKerjaVal = filterUnitKerjaRef.current) {
    const reqId = ++latestReqRef.current;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(ITEMS_PER_PAGE),
        search: searchVal,
        unitKerja: unitKerjaVal,
      });
      const res = await fetch(`/api/admin/rekap-zakat?${params}`);
      if (res.ok) {
        const json = await res.json();
        if (reqId !== latestReqRef.current) return;
        setData(json.data || []);
        setTotalItems(json.total ?? 0);
        setTotalPages(json.totalPages ?? 1);
        if (json.availableUnitKerja) {
          setAvailableUnitKerja(json.availableUnitKerja);
        }
      }
    } catch (err) {
      console.error('Error loading rekap zakat:', err);
    } finally {
      if (reqId === latestReqRef.current) setLoading(false);
    }
  }

  useEffect(() => {
    loadData(1, '', 'all');
  }, []);

  function handleSearchChange(val: string) {
    setSearch(val);
    searchRef.current = val;
    setCurrentPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadData(1, val, filterUnitKerjaRef.current);
    }, DEBOUNCE_MS);
  }

  function handleUnitKerjaChange(val: string) {
    setFilterUnitKerja(val);
    filterUnitKerjaRef.current = val;
    setCurrentPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    loadData(1, searchRef.current, val);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    loadData(page, searchRef.current, filterUnitKerjaRef.current);
  }

  function openEditModal(item: RekapItem) {
    setEditingItem(item);
    setEditNip(item.muzakkiNIP);
    setEditTahun(item.tahunRekap);
    setEditFileUrl(item.fileUrl);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/admin/rekap-zakat/${editingItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          muzakkiNIP: editNip,
          tahunRekap: editTahun,
          fileUrl: editFileUrl,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ message: 'Data rekap zakat berhasil diperbarui.', type: 'success' });
        setEditingItem(null);
        loadData(currentPage, searchRef.current, filterUnitKerjaRef.current);
      } else {
        setToast({ message: data.error || 'Gagal memperbarui data rekap zakat.', type: 'error' });
      }
    } catch {
      setToast({ message: 'Terjadi kesalahan sistem.', type: 'error' });
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteConfirmItem) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/rekap-zakat/${deleteConfirmItem.id}`, { method: 'DELETE' });
      if (res.ok) {
        setToast({ message: 'Data rekap zakat berhasil dihapus.', type: 'success' });
        loadData(currentPage, searchRef.current, filterUnitKerjaRef.current);
      } else {
        setToast({ message: 'Gagal menghapus data rekap zakat.', type: 'error' });
      }
    } catch {
      setToast({ message: 'Terjadi kesalahan sistem.', type: 'error' });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmItem(null);
    }
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faFileText} className="text-[#063A1E] w-6 h-6" />
            Rekap Zakat
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Kelola rekap tahunan zakat muzakki — link file PDF/Drive per NIP per tahun.
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

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari NIP, nama muzakki, atau tahun..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#063A1E] shadow-2xs transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
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
                <th className="py-3.5 px-4">Muzakki</th>
                <th className="py-3.5 px-4">Unit Kerja</th>
                <th className="py-3.5 px-4">Tahun Rekap</th>
                <th className="py-3.5 px-4">File Rekap</th>
                <th className="py-3.5 px-4">Tanggal Input</th>
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
                    Tidak ada data rekap zakat ditemukan.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Muzakki — Nama + NIP */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900 text-xs">
                        {item.muzakki?.nama || <span className="text-gray-400 font-normal italic">—</span>}
                      </p>
                      <span className="text-[10px] text-gray-500 font-mono inline-block mt-0.5">
                        NIP: {item.muzakkiNIP}
                      </span>
                    </td>
                    {/* Unit Kerja Lengkap */}
                    <td className="py-3.5 px-4 text-gray-700 whitespace-normal">
                      {item.muzakki?.unitKerja || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block bg-[#063A1E]/10 text-[#063A1E] font-bold px-2.5 py-1 rounded-lg text-[10px]">
                        {item.tahunRekap}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#063A1E] underline underline-offset-2 font-semibold hover:text-emerald-700 transition-colors"
                      >
                        Buka File <FontAwesomeIcon icon={faExternalLinkAlt} className="w-2.5 h-2.5" />
                      </a>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{item.createdAt}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Edit Rekap Zakat"
                        >
                          <FontAwesomeIcon icon={faEdit} className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmItem(item)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Hapus Rekap Zakat"
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
          itemLabel="rekap zakat"
        />
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#063A1E]/10 text-[#063A1E] flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={faFileText} className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 leading-tight">Edit Rekap Zakat Muzakki</h3>
                  <p className="text-[11px] text-gray-500">Perbarui NIP, tahun rekap, atau link dokumen PDF/Drive</p>
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
                    NIP Muzakki <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editNip}
                    onChange={(e) => setEditNip(e.target.value)}
                    placeholder="Contoh: 198501012010121001"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#063A1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tahun Rekap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editTahun}
                    onChange={(e) => setEditTahun(e.target.value)}
                    placeholder="Contoh: 2024"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#063A1E]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    URL File Rekap (PDF / Drive) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={editFileUrl}
                    onChange={(e) => setEditFileUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
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
                  disabled={savingEdit}
                  className="px-5 py-2 bg-[#063A1E] hover:bg-[#042814] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {savingEdit ? 'Menyimpan...' : 'Simpan Perubahan'}
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
        onSuccess={() => loadData(1, searchRef.current)}
        title="Import Rekap Zakat"
        endpoint="/api/admin/import/rekap-zakat"
        requiredColumns={['nip', 'tahun_rekap', 'file_url']}
        optionalColumns={[]}
        templateRows={[
          ['198501012010121001', '2024', 'https://drive.google.com/file/d/example1'],
          ['197803152005011002', '2024', 'https://drive.google.com/file/d/example2'],
        ]}
      />
      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmItem)}
        onClose={() => setDeleteConfirmItem(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Rekap Zakat?"
        message={`Apakah Anda yakin ingin menghapus data rekap zakat tahun ${deleteConfirmItem?.tahunRekap || ''} NIP ${deleteConfirmItem?.muzakkiNIP || ''}? Data yang dihapus tidak dapat dikembalikan.`}
        confirmText="Hapus Rekap"
        loading={isDeleting}
      />

      {/* Toast Notification */}
      <AdminToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
