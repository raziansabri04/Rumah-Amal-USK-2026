'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ConfirmModal from '@/components/admin/ConfirmModal';

interface NewsLinkItem {
  id: string;
  url: string;
  title: string;
  image: string | null;
  description: string | null;
  source: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PreviewData {
  url: string;
  title: string;
  image: string | null;
  description: string | null;
  source: string | null;
}

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

interface BeritaEksternalClientProps {
  initialData: NewsLinkItem[];
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  activeCount?: number;
  inactiveCount?: number;
  initialSearch?: string;
}

function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold transition-all animate-in slide-in-from-top-2 duration-300 ${
        toast.type === 'success'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : 'bg-red-50 border-red-200 text-red-800'
      }`}
    >
      <span>
        {toast.type === 'success' ? '✓' : '✕'}
      </span>
      <span>{toast.message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 cursor-pointer text-lg leading-none">
        ×
      </button>
    </div>
  );
}

function ImagePlaceholder() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 gap-2">
      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span className="text-xs text-gray-400 font-medium">Tidak ada gambar</span>
    </div>
  );
}

const DEBOUNCE_MS = 400;

export default function BeritaEksternalClient({
  initialData,
  currentPage = 1,
  totalPages = 1,
  totalCount = initialData.length,
  activeCount = initialData.filter((d) => d.isActive).length,
  inactiveCount = initialData.filter((d) => !d.isActive).length,
  initialSearch = "",
}: BeritaEksternalClientProps) {
  const router = useRouter();
  const [items, setItems] = useState<NewsLinkItem[]>(initialData);

  useEffect(() => {
    setItems(initialData);
  }, [initialData]);

  const [search, setSearch] = useState(initialSearch);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (val) params.set("search", val);
      params.set("page", "1");
      router.push(`/admin/berita-eksternal?${params.toString()}`);
    }, DEBOUNCE_MS);
  };

  const [urlInput, setUrlInput] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [previewError, setPreviewError] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [savingNew, setSavingNew] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<NewsLinkItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [editingModalItem, setEditingModalItem] = useState<NewsLinkItem | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDesc, setModalDesc] = useState('');
  const [modalImage, setModalImage] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  function openEditModal(item: NewsLinkItem) {
    setEditingModalItem(item);
    setModalTitle(item.title);
    setModalDesc(item.description || '');
    setModalImage(item.image || '');
  }

  async function handleSaveModalEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingModalItem) return;
    if (!modalTitle.trim()) {
      showToast('Judul berita tidak boleh kosong.', 'error');
      return;
    }
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/admin/news-link/${editingModalItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: modalTitle.trim(),
          description: modalDesc.trim() || null,
          image: modalImage.trim() || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === editingModalItem.id
              ? {
                  ...i,
                  title: modalTitle.trim(),
                  description: modalDesc.trim() || null,
                  image: modalImage.trim() || null,
                }
              : i
          )
        );
        showToast('Berita berhasil diperbarui.', 'success');
        setEditingModalItem(null);
        router.refresh();
      } else {
        showToast(data.error || 'Gagal memperbarui berita.', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan sistem.', 'error');
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleFetchPreview() {
    if (!urlInput.trim()) return;
    setLoadingPreview(true);
    setPreview(null);
    setPreviewError('');

    try {
      const res = await fetch('/api/admin/news-link/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPreviewError(data.error || 'Gagal mengambil preview.');
      } else {
        setPreview(data.preview);
        setEditTitle(data.preview.title || '');
        setEditDesc(data.preview.description || '');
      }
    } catch {
      setPreviewError('Terjadi kesalahan jaringan. Coba lagi.');
    } finally {
      setLoadingPreview(false);
    }
  }

  function handleReset() {
    setUrlInput('');
    setPreview(null);
    setPreviewError('');
    setEditTitle('');
    setEditDesc('');
  }

  async function handleSave() {
    if (!preview || !editTitle.trim()) return;
    setSavingNew(true);
    try {
      const res = await fetch('/api/admin/news-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: preview.url,
          title: editTitle.trim(),
          image: preview.image,
          description: editDesc.trim() || null,
          source: preview.source,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Gagal menyimpan.', 'error');
      } else {
        setItems((prev) => [data.newsLink, ...prev]);
        showToast('Berita berhasil ditambahkan!', 'success');
        handleReset();
        router.refresh();
      }
    } catch {
      showToast('Terjadi kesalahan. Coba lagi.', 'error');
    } finally {
      setSavingNew(false);
    }
  }

  async function handleToggleActive(item: NewsLinkItem) {
    setTogglingId(item.id);
    try {
      const res = await fetch(`/api/admin/news-link/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      const data = await res.json();
      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isActive: !item.isActive } : i))
        );
        showToast(
          !item.isActive ? 'Berita diaktifkan.' : 'Berita dinonaktifkan.',
          'success'
        );
        router.refresh();
      } else {
        showToast(data.error || 'Gagal mengubah status.', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan.', 'error');
    } finally {
      setTogglingId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteConfirmItem) return;
    const id = deleteConfirmItem.id;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/news-link/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        showToast('Berita berhasil dihapus.', 'success');
        router.refresh();
      } else {
        const data = await res.json();
        showToast(data.error || 'Gagal menghapus.', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan.', 'error');
    } finally {
      setDeletingId(null);
      setDeleteConfirmItem(null);
    }
  }

  return (
    <>
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

      {/* ===== Form Tambah Berita ===== */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
        <h2 className="text-base font-black text-gray-800">Tambah Berita Eksternal</h2>

        {/* URL Input */}
        <div className="flex gap-3">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFetchPreview()}
            placeholder="Paste URL berita di sini..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#063A1E]/20 focus:border-[#063A1E] transition-all"
            disabled={loadingPreview}
          />
          <button
            onClick={handleFetchPreview}
            disabled={loadingPreview || !urlInput.trim()}
            className="px-5 py-2.5 bg-[#063A1E] hover:bg-[#0b5c30] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            {loadingPreview ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Mengambil...
              </>
            ) : (
              'Ambil Preview'
            )}
          </button>
        </div>

        {/* Error state */}
        {previewError && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-bold text-red-800">Gagal Mengambil Preview</p>
              <p className="text-xs text-red-600 mt-0.5">{previewError}</p>
            </div>
            <button onClick={() => setPreviewError('')} className="text-red-400 hover:text-red-600 text-sm font-bold cursor-pointer">
              ×
            </button>
          </div>
        )}

        {/* Preview Card (Form simpan berita) */}
        {preview && (
          <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Preview Metadata — Silakan Periksa & Edit jika Perlu
              </span>
              <button
                onClick={handleReset}
                className="text-xs text-gray-400 hover:text-gray-600 font-semibold cursor-pointer"
              >
                Reset
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Image Preview */}
              <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 relative">
                {preview.image ? (
                  <img
                    src={preview.image}
                    alt={preview.title}
                    className="w-full h-full object-cover"
                    onError={() => setPreview((p) => (p ? { ...p, image: null } : null))}
                  />
                ) : (
                  <ImagePlaceholder />
                )}
                {preview.source && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[10px] font-bold rounded-md backdrop-blur-xs">
                    {preview.source}
                  </span>
                )}
              </div>

              {/* Editable Fields */}
              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Judul Berita <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#063A1E]/20 focus:border-[#063A1E] transition-all"
                    placeholder="Judul berita..."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Deskripsi
                  </label>
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#063A1E]/20 focus:border-[#063A1E] transition-all"
                    placeholder="Deskripsi singkat..."
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleSave}
                    disabled={savingNew || !editTitle.trim()}
                    className="flex-1 py-2.5 bg-[#063A1E] hover:bg-[#0b5c30] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {savingNew ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Menyimpan...
                      </>
                    ) : (
                      'Simpan Berita'
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== Daftar Berita Tersimpan ===== */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-black text-gray-800">
              Daftar Berita ({totalCount})
            </h2>
            <span className="text-xs text-gray-400 font-medium">
              {activeCount} aktif · {inactiveCount} nonaktif
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari berita eksternal…"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#063A1E] bg-gray-50/60 placeholder-gray-400 transition-all"
            />
            {search && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <div className="flex flex-col items-center gap-2">
              <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0014.586 3H5" />
              </svg>
              <p className="text-sm font-semibold">{search ? "Tidak ada berita yang cocok" : "Belum ada berita ditambahkan"}</p>
              {search && <p className="text-xs text-gray-300">Coba gunakan kata kunci pencarian yang lain.</p>}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {items.map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-5 hover:bg-gray-50/60 transition-colors">
                {/* Thumbnail */}
                <div className="relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImagePlaceholder />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {item.source && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-md uppercase tracking-wide flex-shrink-0">
                        {item.source}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md flex-shrink-0 ${
                        item.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}
                    >
                      {item.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
                  )}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-blue-500 hover:underline mt-0.5 block truncate"
                  >
                    {item.url}
                  </a>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Toggle aktif/nonaktif */}
                  <button
                    onClick={() => handleToggleActive(item)}
                    disabled={togglingId === item.id}
                    title={item.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all cursor-pointer disabled:opacity-50 ${
                      item.isActive
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                        : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    {togglingId === item.id ? (
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.isActive ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'} />
                      </svg>
                    )}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => openEditModal(item)}
                    title="Edit Berita"
                    className="w-8 h-8 rounded-xl flex items-center justify-center border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  {/* Hapus */}
                  <button
                    onClick={() => setDeleteConfirmItem(item)}
                    disabled={deletingId === item.id}
                    title="Hapus"
                    className="w-8 h-8 rounded-xl flex items-center justify-center border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {deletingId === item.id ? (
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== Pagination Bar ===== */}
        {totalCount > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 font-medium">
              Menampilkan <span className="font-bold text-gray-700">{items.length}</span> dari <span className="font-bold text-gray-700">{totalCount}</span> berita
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                {currentPage > 1 ? (
                  <Link
                    href={`/admin/berita-eksternal?page=${currentPage - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                    className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg transition-colors shadow-2xs"
                  >
                    « Prev
                  </Link>
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
                      <Link
                        key={p}
                        href={`/admin/berita-eksternal?page=${p}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${isActive
                          ? "bg-[#063A1E] text-white shadow-xs"
                          : "bg-white border border-gray-200 hover:bg-gray-100 text-gray-700"
                          }`}
                      >
                        {p}
                      </Link>
                    );
                  })}
                </div>

                {currentPage < totalPages ? (
                  <Link
                    href={`/admin/berita-eksternal?page=${currentPage + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                    className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg transition-colors shadow-2xs"
                  >
                    Next »
                  </Link>
                ) : (
                  <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-300 text-xs font-bold rounded-lg cursor-not-allowed">
                    Next »
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>Aktif: <span className="text-emerald-600 font-bold">{activeCount}</span></span>
              <span className="text-gray-200">|</span>
              <span>Nonaktif: <span className="text-gray-600 font-bold">{inactiveCount}</span></span>
            </div>
          </div>
        )}
      </div>

      {/* MODAL EDIT BERITA */}
      {editingModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-gray-800 text-base">Edit Berita Eksternal</h3>
              <button
                onClick={() => setEditingModalItem(null)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-lg cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveModalEdit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Judul Berita <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#063A1E]/20 focus:border-[#063A1E]"
                  placeholder="Judul berita..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={3}
                  value={modalDesc}
                  onChange={(e) => setModalDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#063A1E]/20 focus:border-[#063A1E]"
                  placeholder="Deskripsi singkat berita..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  URL Gambar / Thumbnail
                </label>
                <input
                  type="url"
                  value={modalImage}
                  onChange={(e) => setModalImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#063A1E]/20 focus:border-[#063A1E]"
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>

              {modalImage && (
                <div>
                  <p className="text-xs font-bold text-gray-600 mb-1.5">Preview Gambar</p>
                  <div className="w-full h-36 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={modalImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => showToast('Gagal memuat URL gambar preview.', 'error')}
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingModalItem(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingEdit || !modalTitle.trim()}
                  className="px-6 py-2 text-xs font-bold text-white bg-[#063A1E] hover:bg-[#0b5c30] rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {savingEdit ? 'Menyimpan…' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmItem)}
        onClose={() => setDeleteConfirmItem(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Berita Eksternal?"
        message={`Apakah Anda yakin ingin menghapus "${deleteConfirmItem?.title || 'berita ini'}"? Data yang dihapus tidak dapat dikembalikan.`}
        confirmText="Hapus Berita"
        loading={Boolean(deletingId)}
      />
    </>
  );
}
