"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faSync, faSpinner, faSave } from "@fortawesome/free-solid-svg-icons";
import { addNewsletter, updateNewsletter, deleteNewsletter } from "@/actions/newsletter";
import ConfirmModal from "@/components/admin/ConfirmModal";
import AdminToast, { ToastState } from "@/components/admin/AdminToast";

type NewsletterRow = {
  id: string;
  judul: string;
  imageUrl: string;
  tanggal: Date;
  createdAt: Date;
};

interface NewsletterClientProps {
  initialData: NewsletterRow[];
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  initialSearch?: string;
}

function formatTanggal(date: Date | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

const DEBOUNCE_MS = 400;

export default function NewsletterClient({
  initialData,
  currentPage = 1,
  totalPages = 1,
  totalCount = initialData.length,
  initialSearch = "",
}: NewsletterClientProps) {
  const router = useRouter();
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsletterRow | null>(null);
  const [previewingItem, setPreviewingItem] = useState<NewsletterRow | null>(null);

  const [judulInput, setJudulInput] = useState("");
  const [tanggalInput, setTanggalInput] = useState(new Date().toISOString().slice(0, 10));
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [deleteConfirmItem, setDeleteConfirmItem] = useState<NewsletterRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);


  const filtered = data;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (val) params.set("search", val);
      params.set("page", "1");
      router.push(`/admin/newsletter?${params.toString()}`);
    }, DEBOUNCE_MS);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", "Newsletter");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json();
        setToast({ message: `Upload gagal: ${err.error}`, type: "error" });
        return;
      }
      const result = await res.json();
      setImagePreview(result.url);
      setToast({ message: "Gambar newsletter berhasil diupload.", type: "success" });
    } catch (err) {
      setToast({ message: `Kesalahan: ${(err as Error).message}`, type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imagePreview) {
      setToast({ message: "Gambar E-Buletin / Newsletter wajib diunggah.", type: "error" });
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("judul", judulInput.trim());
      fd.append("tanggal", tanggalInput);
      fd.append("imageUrl", imagePreview);

      const result = await addNewsletter(fd);
      if (!result.success) {
        setToast({ message: result.error || "Gagal menyimpan Newsletter", type: "error" });
        return;
      }

      setIsAddModalOpen(false);
      setJudulInput("");
      setImagePreview("");
      setToast({ message: "Newsletter baru berhasil disimpan.", type: "success" });
      router.refresh();
    } catch (err: any) {
      setToast({ message: err.message || "Gagal menyimpan", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const openEditModal = (item: NewsletterRow) => {
    setEditingItem(item);
    setJudulInput(item.judul);
    setTanggalInput(new Date(item.tanggal).toISOString().slice(0, 10));
    setImagePreview(item.imageUrl);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!imagePreview) {
      setToast({ message: "Gambar E-Buletin / Newsletter wajib diunggah.", type: "error" });
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("judul", judulInput.trim());
      fd.append("tanggal", tanggalInput);
      fd.append("imageUrl", imagePreview);

      const result = await updateNewsletter(editingItem.id, fd);
      if (!result.success) {
        setToast({ message: result.error || "Gagal memperbarui Newsletter", type: "error" });
        return;
      }

      setIsEditModalOpen(false);
      setEditingItem(null);
      setJudulInput("");
      setImagePreview("");
      setToast({ message: "Newsletter berhasil diperbarui.", type: "success" });
      router.refresh();
    } catch (err: any) {
      setToast({ message: err.message || "Gagal memperbarui", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmItem) return;
    setIsDeleting(true);
    try {
      setData((prev) => prev.filter((item) => item.id !== deleteConfirmItem.id));
      await deleteNewsletter(deleteConfirmItem.id, deleteConfirmItem.imageUrl);
      setToast({ message: "Newsletter berhasil dihapus.", type: "success" });
      router.refresh();
    } catch (err: any) {
      setToast({ message: err.message || "Gagal menghapus newsletter.", type: "error" });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmItem(null);
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
              type="text" placeholder="Cari newsletter / buletin…" value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#005621] bg-gray-50/60 placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => { setIsAddModalOpen(true); setJudulInput(""); setImagePreview(""); }}
            className="flex items-center gap-2 bg-[#005621] hover:bg-[#004219] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Tambah Newsletter
          </button>
        </div>

        {/* Card Grid */}
        <div className="p-5">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <div className="flex flex-col items-center gap-2">
                <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-sm font-semibold">{search ? "Tidak ada yang cocok" : "Belum ada newsletter"}</p>
                {!search && <p className="text-xs text-gray-300">Klik &quot;Tambah Newsletter&quot; untuk mengunggah edisi baru.</p>}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {filtered.map((item) => (
                <div key={item.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                  {/* Thumbnail gambar newsletter */}
                  <div className="relative h-40 bg-gray-50 shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt={item.judul} className="w-full h-full object-cover" />
                    {/* overlay gradient bawah */}
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-3 flex flex-col flex-1 gap-2">
                    <p className="font-bold text-gray-800 text-xs leading-snug line-clamp-2">{item.judul}</p>
                    <p className="text-[10px] text-gray-400 mt-auto">Edisi: {formatTanggal(item.tanggal)}</p>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-gray-50">
                      <button onClick={() => setPreviewingItem(item)} title="Preview" className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <button onClick={() => openEditModal(item)} title="Edit" className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#005621] flex items-center justify-center transition-colors cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => setDeleteConfirmItem(item)} title="Hapus" className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
              Menampilkan <span className="font-bold text-gray-700">{filtered.length}</span> dari <span className="font-bold text-gray-700">{totalCount}</span> newsletter
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                {currentPage > 1 ? (
                  <Link
                    href={`/admin/newsletter?page=${currentPage - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
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
                        href={`/admin/newsletter?page=${p}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${isActive
                          ? "bg-[#005621] text-white shadow-xs"
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
                    href={`/admin/newsletter?page=${currentPage + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
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
          </div>
        )}
      </div>

      {/* MODAL ADD */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base">Tambah Newsletter Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-lg cursor-pointer">×</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Judul Newsletter <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: E-Buletin Edisi Ramadhan 1447 H"
                  value={judulInput}
                  onChange={(e) => setJudulInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#005621]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Tanggal Edisi / Terbit <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  required
                  value={tanggalInput}
                  onChange={(e) => setTanggalInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#005621]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Gambar / Cover Buletin <span className="text-red-500">*</span></label>
                {imagePreview && (
                  <div className="mb-3 rounded-xl overflow-hidden border border-gray-200 p-2 max-h-[160px] flex justify-center bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Preview" className="max-h-[140px] object-contain" />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                    className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 transition-colors shadow-2xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5">
                    {uploading ? (
                      <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Uploading…</>
                    ) : imagePreview ? (
                      <><FontAwesomeIcon icon={faSync} /> Ganti Gambar</>
                    ) : (
                      <><FontAwesomeIcon icon={faUpload} /> Upload Gambar</>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer">
                  Batal
                </button>
                <button type="submit" disabled={uploading || !imagePreview} className="px-6 py-2 text-xs font-bold text-white bg-[#005621] hover:bg-[#004219] rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5">
                  {uploading ? "Simpan…" : <><FontAwesomeIcon icon={faSave} /> Simpan Newsletter</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base">Edit Newsletter</h3>
              <button onClick={() => { setIsEditModalOpen(false); setEditingItem(null); }} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-lg cursor-pointer">×</button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Judul Newsletter <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: E-Buletin Edisi Ramadhan 1447 H"
                  value={judulInput}
                  onChange={(e) => setJudulInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#005621]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Tanggal Edisi / Terbit <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  required
                  value={tanggalInput}
                  onChange={(e) => setTanggalInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#005621]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Gambar / Cover Buletin <span className="text-red-500">*</span></label>
                {imagePreview && (
                  <div className="mb-3 rounded-xl overflow-hidden border border-gray-200 p-2 max-h-[160px] flex justify-center bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Preview" className="max-h-[140px] object-contain" />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <input ref={editFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <button type="button" onClick={() => editFileInputRef.current?.click()} disabled={uploading}
                    className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 transition-colors shadow-2xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5">
                    {uploading ? (
                      <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Uploading…</>
                    ) : imagePreview ? (
                      <><FontAwesomeIcon icon={faSync} /> Ganti Gambar</>
                    ) : (
                      <><FontAwesomeIcon icon={faUpload} /> Upload Gambar</>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button type="button" onClick={() => { setIsEditModalOpen(false); setEditingItem(null); }} className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer">
                  Batal
                </button>
                <button type="submit" disabled={uploading || !imagePreview} className="px-6 py-2 text-xs font-bold text-white bg-[#005621] hover:bg-[#004219] rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5">
                  {uploading ? "Menyimpan…" : <><FontAwesomeIcon icon={faSave} /> Simpan Perubahan</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW FULL MODAL */}
      {previewingItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreviewingItem(null)}>
          <div className="bg-white max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-800 text-sm">{previewingItem.judul}</h3>
              <button onClick={() => setPreviewingItem(null)} className="text-gray-500 font-bold text-lg hover:text-black">×</button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewingItem.imageUrl} alt={previewingItem.judul} className="max-h-[65vh] w-auto max-w-full rounded-xl object-contain mx-auto" />
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <span>Edisi: {formatTanggal(previewingItem.tanggal)}</span>
              <button onClick={() => setPreviewingItem(null)} className="px-4 py-1.5 bg-gray-800 text-white font-bold rounded-lg">Tutup</button>
            </div>
          </div>
        </div>
      )}
      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmItem)}
        onClose={() => setDeleteConfirmItem(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus E-Buletin / Newsletter?"
        message={`Apakah Anda yakin ingin menghapus "${deleteConfirmItem?.judul || 'newsletter ini'}"? Data yang dihapus tidak dapat dikembalikan.`}
        confirmText="Hapus Newsletter"
        loading={isDeleting}
      />

      {/* Toast Notification */}
      <AdminToast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
