'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { deleteDocumentAction, updateDocumentAction } from '@/actions/dokumen';
import ConfirmModal from '@/components/admin/ConfirmModal';
import AdminToast, { ToastState } from '@/components/admin/AdminToast';

type DocumentRow = {
  id: string;
  judul: string;
  imageUrl: string | null;
  pdfUrl: string;
  createdAt: Date;
};

interface DokumenClientProps {
  initialData: DocumentRow[];
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
}

const DEFAULT_COVER = '/cover/Cover Doc RA.jpeg';
const ITEMS_PER_PAGE = 8;
const DEBOUNCE_MS = 400;

function formatTanggal(date: Date | null) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function DokumenClient({
  initialData,
  currentPage: initPage = 1,
  totalPages: initTotalPages = 1,
  totalCount: initTotalCount = initialData.length,
}: DokumenClientProps) {
  const router = useRouter();
  const [data, setData] = useState<DocumentRow[]>(initialData);
  const [currentPage, setCurrentPage] = useState(initPage);
  const [totalPages, setTotalPages] = useState(initTotalPages);
  const [totalCount, setTotalCount] = useState(initTotalCount);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DocumentRow | null>(null);

  const [judul, setJudul] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const latestReqRef = useRef(0);
  const searchRef = useRef(search);

  async function fetchData(page = currentPage, searchVal = searchRef.current) {
    const reqId = ++latestReqRef.current;
    setIsFetching(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(ITEMS_PER_PAGE),
        search: searchVal,
      });
      const res = await fetch(`/api/documents?${params}`);
      if (res.ok) {
        const json = await res.json();
        if (reqId !== latestReqRef.current) return;
        setData(json.documents || []);
        setTotalCount(json.pagination?.total ?? 0);
        setTotalPages(json.pagination?.totalPages ?? 1);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      if (reqId === latestReqRef.current) setIsFetching(false);
    }
  }

  function handleSearchChange(val: string) {
    setSearch(val);
    searchRef.current = val;
    setCurrentPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchData(1, val);
    }, DEBOUNCE_MS);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    fetchData(page, searchRef.current);
  }

  const openAdd = () => {
    setEditingItem(null);
    setJudul('');
    setDriveUrl('');
    setIsAddModalOpen(true);
  };

  const openEdit = (item: DocumentRow) => {
    setEditingItem(item);
    setJudul(item.judul);
    setDriveUrl(item.pdfUrl);
    setIsAddModalOpen(true);
  };

  const handleSubmitDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim()) { setToast({ message: 'Judul dokumen wajib diisi.', type: 'error' }); return; }
    if (!driveUrl.trim()) { setToast({ message: 'Link Google Drive wajib diisi.', type: 'error' }); return; }

    setUploading(true);
    if (editingItem) {
      try {
        await updateDocumentAction(editingItem.id, {
          judul: judul.trim(),
          pdfUrl: driveUrl.trim(),
        });
        setIsAddModalOpen(false);
        setEditingItem(null);
        setJudul('');
        setDriveUrl('');
        setToast({ message: 'Dokumen berhasil diperbarui.', type: 'success' });
        fetchData(currentPage, searchRef.current);
        router.refresh();
      } catch (err) {
        setToast({ message: `Gagal mengedit dokumen: ${(err as Error).message}`, type: 'error' });
      } finally {
        setUploading(false);
      }
      return;
    }

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          judul: judul.trim(),
          pdfUrl: driveUrl.trim(),
          coverUrl: DEFAULT_COVER,
        }),
      });
      const resData = await res.json();
      if (!res.ok || !resData.success) {
        setToast({ message: resData.error ?? 'Gagal menambahkan dokumen', type: 'error' });
        setUploading(false);
        return;
      }

      setIsAddModalOpen(false);
      setJudul('');
      setDriveUrl('');
      setToast({ message: 'Dokumen baru berhasil ditambahkan.', type: 'success' });
      fetchData(1, searchRef.current);
      router.refresh();
    } catch (err) {
      setToast({ message: `Koneksi gagal: ${(err as Error).message}`, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await deleteDocumentAction(deleteConfirmId);
      setToast({ message: 'Dokumen berhasil dihapus.', type: 'success' });
      fetchData(currentPage, searchRef.current);
      router.refresh();
    } catch (err: any) {
      setToast({ message: err.message || 'Gagal menghapus dokumen.', type: 'error' });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-gray-100">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text" placeholder="Cari dokumen…" value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#005621] bg-gray-50/60 placeholder-gray-400"
            />
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#005621] hover:bg-[#004219] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Tambah Dokumen
          </button>
        </div>

        {/* Card Grid */}
        <div className="p-5">
          {isFetching ? (
            <div className="py-16 text-center text-gray-400">
              <div className="w-6 h-6 border-2 border-[#005621] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : data.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <div className="flex flex-col items-center gap-2">
                <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm font-semibold">{search ? 'Tidak ada yang cocok' : 'Belum ada dokumen'}</p>
                {!search && <p className="text-xs text-gray-300">Klik &quot;Tambah Dokumen&quot; untuk menambahkan link dokumen baru.</p>}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {data.map((item) => (
                <div key={item.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                  {/* Cover Image */}
                  <div className="relative h-36 bg-gradient-to-br from-blue-50 to-blue-100 shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl || DEFAULT_COVER}
                      alt={item.judul}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-3 flex flex-col flex-1 gap-2">
                    <p className="font-bold text-gray-800 text-xs leading-snug line-clamp-2">{item.judul}</p>
                    <p className="text-[10px] text-gray-400 mt-auto">{formatTanggal(item.createdAt)}</p>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-gray-50">
                      <a
                        href={item.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold transition-colors inline-flex items-center justify-center gap-1"
                      >
                        Buka ↗
                      </a>
                      <button
                        onClick={() => openEdit(item)}
                        title="Edit"
                        className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        title="Hapus"
                        className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {totalCount > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 font-medium">
              Menampilkan <span className="font-bold text-gray-700">{data.length}</span> dari <span className="font-bold text-gray-700">{totalCount}</span> dokumen
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                {currentPage > 1 ? (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg transition-colors shadow-2xs cursor-pointer"
                  >
                    « Prev
                  </button>
                ) : (
                  <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-300 text-xs font-bold rounded-lg cursor-not-allowed">
                    « Prev
                  </span>
                )}

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    const isActive = p === currentPage;
                    const showPage =
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - currentPage) <= 1;

                    if (!showPage) {
                      if (p === 2 && currentPage > 3) {
                        return <span key="ellipsis-start" className="text-xs text-gray-400 px-1">...</span>;
                      }
                      if (p === totalPages - 1 && currentPage < totalPages - 2) {
                        return <span key="ellipsis-end" className="text-xs text-gray-400 px-1">...</span>;
                      }
                      return null;
                    }

                    return (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer ${isActive
                          ? 'bg-[#005621] text-white shadow-xs'
                          : 'bg-white border border-gray-200 hover:bg-gray-100 text-gray-700'
                          }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                {currentPage < totalPages ? (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg transition-colors shadow-2xs cursor-pointer"
                  >
                    Next »
                  </button>
                ) : (
                  <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-300 text-xs font-bold rounded-lg cursor-not-allowed">
                    Next »
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL TAMBAH DOKUMEN */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base">{editingItem ? "Edit Dokumen" : "Tambah Dokumen Baru"}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-lg cursor-pointer">×</button>
            </div>

            <form onSubmit={handleSubmitDocument} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Judul Dokumen <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Laporan Tahunan Rumah Amal 2025"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#005621]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Link Google Drive <span className="text-red-500">*</span></label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/..."
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#005621]"
                />
                <p className="mt-1.5 text-[11px] text-gray-400">Pastikan link Google Drive sudah diatur ke &quot;Anyone with the link can view&quot;</p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer">
                  Batal
                </button>
                <button type="submit" disabled={uploading} className="px-6 py-2 text-xs font-bold text-white bg-[#005621] hover:bg-[#004219] rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5">
                  {uploading ? "Menyimpan…" : <><FontAwesomeIcon icon={faSave} /> {editingItem ? "Simpan Perubahan" : "Simpan Dokumen"}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Dokumen?"
        message="Apakah Anda yakin ingin menghapus dokumen ini? Data yang dihapus tidak dapat dikembalikan."
        confirmText="Hapus Dokumen"
        loading={isDeleting}
      />

      {/* Toast Notification */}
      <AdminToast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
