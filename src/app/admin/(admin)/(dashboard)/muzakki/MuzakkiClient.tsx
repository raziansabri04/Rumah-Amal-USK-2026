'use client';

import { useState, useEffect, useRef } from 'react';
import { createMuzakki, updateMuzakki, deleteMuzakki } from '@/actions/muzakki';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faEdit, faTrash, faUserTie, faFileArrowUp, faPhone } from '@fortawesome/free-solid-svg-icons';
import CsvImportModal from '@/components/admin/CsvImportModal';
import AdminPagination from '@/components/admin/AdminPagination';
import ConfirmModal from '@/components/admin/ConfirmModal';
import AdminToast, { ToastState } from '@/components/admin/AdminToast';

type MuzakkiItem = {
  nip: string;
  nama: string;
  npwp: string | null;
  alamat: string | null;
  unitKerja: string | null;
  noHp: string | null;
  createdAt: Date;
};

const ITEMS_PER_PAGE = 10;
const DEBOUNCE_MS = 400;

export default function MuzakkiClient({ initialData }: { initialData?: MuzakkiItem[] }) {
  const [data, setData] = useState<MuzakkiItem[]>(initialData || []);
  const [totalItems, setTotalItems] = useState(initialData?.length || 0);
  const [totalPages, setTotalPages] = useState(Math.ceil((initialData?.length || 0) / ITEMS_PER_PAGE) || 1);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState('');
  const [filterUnitKerja, setFilterUnitKerja] = useState('all');
  const [availableUnitKerja, setAvailableUnitKerja] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [editingMuzakki, setEditingMuzakki] = useState<MuzakkiItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmNip, setDeleteConfirmNip] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Form states
  const [nip, setNip] = useState('');
  const [nama, setNama] = useState('');
  const [npwp, setNpwp] = useState('');
  const [alamat, setAlamat] = useState('');
  const [unitKerja, setUnitKerja] = useState('');
  const [noHp, setNoHp] = useState('');

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const latestReqRef = useRef(0);
  const searchRef = useRef(search);
  const filterUnitKerjaRef = useRef(filterUnitKerja);

  async function fetchData(page = currentPage, searchVal = searchRef.current, unitKerjaVal = filterUnitKerjaRef.current) {
    const reqId = ++latestReqRef.current;
    setIsFetching(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(ITEMS_PER_PAGE),
        search: searchVal,
        unitKerja: unitKerjaVal,
      });
      const res = await fetch(`/api/admin/muzakki?${params}`);
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
      console.error('Error fetching muzakki:', err);
    } finally {
      if (reqId === latestReqRef.current) setIsFetching(false);
    }
  }

  useEffect(() => {
    fetchData(1, '', 'all');
  }, []);

  function handleSearchChange(val: string) {
    setSearch(val);
    searchRef.current = val;
    setCurrentPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchData(1, val, filterUnitKerjaRef.current);
    }, DEBOUNCE_MS);
  }

  function handleUnitKerjaChange(val: string) {
    setFilterUnitKerja(val);
    filterUnitKerjaRef.current = val;
    setCurrentPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    fetchData(1, searchRef.current, val);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    fetchData(page, searchRef.current, filterUnitKerjaRef.current);
  }

  function openAddModal() {
    setEditingMuzakki(null);
    setNip('');
    setNama('');
    setNpwp('');
    setAlamat('');
    setUnitKerja('');
    setNoHp('');
    setErrorMsg('');
    setIsModalOpen(true);
  }

  function openEditModal(item: MuzakkiItem) {
    setEditingMuzakki(item);
    setNip(item.nip);
    setNama(item.nama);
    setNpwp(item.npwp || '');
    setAlamat(item.alamat || '');
    setUnitKerja(item.unitKerja || '');
    setNoHp(item.noHp || '');
    setErrorMsg('');
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('nip', nip);
    formData.append('nama', nama);
    formData.append('npwp', npwp);
    formData.append('alamat', alamat);
    formData.append('unit_kerja', unitKerja);
    formData.append('no_hp', noHp);

    try {
      if (editingMuzakki) {
        await updateMuzakki(editingMuzakki.nip, formData);
      } else {
        await createMuzakki(formData);
      }
      setIsModalOpen(false);
      setToast({ message: editingMuzakki ? "Data muzakki berhasil diperbarui." : "Muzakki baru berhasil ditambahkan.", type: "success" });
      fetchData(currentPage, searchRef.current, filterUnitKerjaRef.current);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan data muzakki');
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteConfirmNip) return;
    setIsDeleting(true);
    try {
      await deleteMuzakki(deleteConfirmNip);
      setToast({ message: "Data muzakki berhasil dihapus.", type: "success" });
      fetchData(currentPage, searchRef.current, filterUnitKerjaRef.current);
    } catch (err: any) {
      setToast({ message: err.message || "Gagal menghapus data muzakki", type: "error" });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmNip(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faUserTie} className="text-[#063A1E] w-6 h-6" />
            Data Muzakki USK
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Kelola data Master Muzakki USK (NIP, NPWP, No. HP, Alamat, Unit Kerja) untuk relasi Zakat dan Infaq.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#063A1E] border border-[#063A1E]/30 hover:border-[#063A1E] px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0"
          >
            <FontAwesomeIcon icon={faFileArrowUp} className="w-3.5 h-3.5" />
            Import CSV
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 bg-[#063A1E] hover:bg-[#042814] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0"
          >
            <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
            Tambah Muzakki
          </button>
        </div>
      </div>

      {/* Search Bar & Filter Unit Kerja */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari berdasarkan NIP, Nama, No. HP, atau Unit Kerja..."
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
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-bold text-[10px]">
                <th className="py-2.5 px-2.5 whitespace-nowrap">Muzakki</th>
                <th className="py-2.5 px-2.5 whitespace-nowrap">NPWP/No. HP</th>
                <th className="py-2.5 px-2.5 whitespace-nowrap">Unit Kerja</th>
                <th className="py-2.5 px-2.5 whitespace-nowrap">Alamat</th>
                <th className="py-2.5 px-2 text-center whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[11px]">
              {isFetching ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    <div className="w-5 h-5 border-2 border-[#063A1E] border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    Belum ada data muzakki ditemukan.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.nip} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900 text-xs">{item.nama}</p>
                      {item.nip && (
                        <span className="text-[10px] text-gray-500 font-mono">NIP: {item.nip}</span>
                      )}
                    </td>

                    <td className="py-2.5 px-2.5 text-gray-700 font-mono whitespace-nowrap">
                      <span className=''>{item.npwp || '-'}</span>
                      <br />
                      {item.noHp ? (
                        <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                          <FontAwesomeIcon icon={faPhone} className="text-emerald-600 text-[9px]" />
                          {item.noHp}
                        </span>
                      ) : (
                        <span className="text-gray-400 font-normal">-</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2.5 text-gray-700" title={item.unitKerja || ''}>
                      {item.unitKerja || '-'}
                    </td>
                    <td className="py-2.5 px-2.5 text-gray-600" title={item.alamat || ''}>
                      {item.alamat || '-'}
                    </td>
                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1 rounded text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Edit Muzakki"
                        >
                          <FontAwesomeIcon icon={faEdit} className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmNip(item.nip)}
                          className="p-1 rounded text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Hapus Muzakki"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
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
          itemLabel="muzakki"
        />
      </div>

      {/* Modal Form Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <h3 className="font-bold text-sm text-gray-900">
                {editingMuzakki ? 'Edit Data Muzakki' : 'Tambah Data Muzakki Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto">
              {errorMsg && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    NIP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingMuzakki}
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="Contoh: 198501012010121001"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#063A1E] disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Dr. Ir. Ahmad Subagyo, M.T."
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#063A1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">No. HP / WhatsApp</label>
                  <input
                    type="text"
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#063A1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">NPWP</label>
                  <input
                    type="text"
                    value={npwp}
                    onChange={(e) => setNpwp(e.target.value)}
                    placeholder="Contoh: 12.345.678.9-012.000"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#063A1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Unit Kerja / Fakultas / Prodi</label>
                  <input
                    type="text"
                    value={unitKerja}
                    onChange={(e) => setUnitKerja(e.target.value)}
                    placeholder="Contoh: Fakultas Teknik / Informatika"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#063A1E]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Alamat</label>
                  <textarea
                    rows={2}
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder="Alamat domisili muzakki"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#063A1E]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 mt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#063A1E] hover:bg-[#042814] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Simpan...' : 'Simpan Data'}
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
        onSuccess={() => fetchData(1, searchRef.current)}
        title="Import Data Muzakki"
        endpoint="/api/admin/import/muzakki"
        requiredColumns={['nip', 'nama']}
        optionalColumns={['npwp', 'alamat', 'unit_kerja', 'no_hp']}
        templateRows={[
          ['198501012010121001', 'Dr. Ahmad Subagyo, M.T.', '12.345.678.9-012.000', 'Jl. Kampus No.1 Banda Aceh', 'Fakultas Teknik', '081234567890'],
          ['197803152005011002', 'Prof. Dr. Siti Rahma, M.Sc.', '', 'Jl. Darussalam No.5', 'Fakultas MIPA', '085298765432'],
        ]}
      />
      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmNip)}
        onClose={() => setDeleteConfirmNip(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Data Muzakki?"
        message={`Apakah Anda yakin ingin menghapus data muzakki dengan NIP ${deleteConfirmNip}? Data yang dihapus tidak dapat dikembalikan.`}
        confirmText="Hapus Muzakki"
        loading={isDeleting}
      />

      {/* Toast Notification */}
      <AdminToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
