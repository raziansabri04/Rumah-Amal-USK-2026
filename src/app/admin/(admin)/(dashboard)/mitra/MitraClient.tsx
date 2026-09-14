"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faSync, faSpinner, faSave } from "@fortawesome/free-solid-svg-icons";
import { addMitra, updateMitra, deleteMitra } from "@/actions/mitra";
import ConfirmModal from "@/components/admin/ConfirmModal";
import AdminToast, { ToastState } from "@/components/admin/AdminToast";

type MitraRow = {
  id: string;
  nama: string;
  imageUrl?: string;
  logoUrl?: string;
  websiteUrl?: string | null;
  createdAt: Date;
};

type ModalMode = "add" | "edit";

function formatTanggal(date: Date | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

interface MitraClientProps {
  initialData: MitraRow[];
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  initialSearch?: string;
}

const DEBOUNCE_MS = 400;

export default function MitraClient({
  initialData,
  currentPage = 1,
  totalPages = 1,
  totalCount = initialData.length,
  initialSearch = "",
}: MitraClientProps) {
  const router = useRouter();
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [editing, setEditing] = useState<MitraRow | null>(null);

  const [namaInput, setNamaInput] = useState("");
  const [websiteInput, setWebsiteInput] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [deleteConfirmItem, setDeleteConfirmItem] = useState<MitraRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);

  const filtered = data;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (val) params.set("search", val);
      params.set("page", "1");
      router.push(`/admin/mitra?${params.toString()}`);
    }, DEBOUNCE_MS);
  };

  const openAdd = () => {
    setEditing(null);
    setNamaInput(""); setWebsiteInput(""); setLogoPreview("");
    setModalMode("add");
  };

  const openEdit = (item: MitraRow) => {
    setEditing(item);
    setNamaInput(item.nama);
    setWebsiteInput(item.websiteUrl || "");
    setLogoPreview(item.imageUrl || item.logoUrl || "");
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditing(null);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", "Mitra");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json();
        setToast({ message: `Upload gagal: ${err.error}`, type: "error" });
        return;
      }
      const result = await res.json();
      setLogoPreview(result.url);
      setToast({ message: "Logo mitra berhasil diupload.", type: "success" });
    } catch (err) {
      setToast({ message: `Kesalahan: ${(err as Error).message}`, type: "error" });
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!logoPreview) {
      setToast({ message: "Logo mitra wajib diunggah.", type: "error" });
      return;
    }
    setIsSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set("logoUrl", logoPreview);
      if (editing) {
        fd.append("id", editing.id);
        await updateMitra(fd);
        setToast({ message: "Data mitra berhasil diperbarui.", type: "success" });
      } else {
        await addMitra(fd);
        setToast({ message: "Mitra baru berhasil ditambahkan.", type: "success" });
      }
      closeModal();
      router.refresh();
    } catch (error: any) {
      setToast({ message: error.message || "Terjadi kesalahan sistem.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmItem) return;
    setIsDeleting(true);
    try {
      setData((prev) => prev.filter((item) => item.id !== deleteConfirmItem.id));
      await deleteMitra(deleteConfirmItem.id);
      setToast({ message: "Data mitra berhasil dihapus.", type: "success" });
      router.refresh();
    } catch (err: any) {
      setToast({ message: err.message || "Gagal menghapus data mitra.", type: "error" });
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
              type="text" placeholder="Cari mitra…" value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#005621] bg-gray-50/60 placeholder-gray-400"
            />
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 bg-[#005621] hover:bg-[#004219] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer whitespace-nowrap">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Tambah Mitra
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50/80 text-gray-700 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 font-bold">Mitra</th>
                <th className="px-5 py-3 font-bold">Link Website</th>
                <th className="px-5 py-3 font-bold">Tanggal Ditambahkan</th>
                <th className="px-5 py-3 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-sm font-semibold">{search ? "Tidak ada yang cocok" : "Belum ada mitra"}</p>
                      {!search && <p className="text-xs text-gray-300">Klik &quot;Tambah Mitra&quot; untuk mulai.</p>}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 rounded-lg bg-gray-50 border border-gray-200 p-1.5 flex items-center justify-center shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.imageUrl || item.logoUrl} alt={item.nama} className="max-w-full max-h-full object-contain" />
                        </div>
                        <p className="font-bold text-gray-800 text-xs">{item.nama}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {item.websiteUrl ? (
                        <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-700 font-semibold hover:underline">
                          {item.websiteUrl} ↗
                        </a>
                      ) : (
                        <span className="text-xs text-gray-300 italic">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500">{formatTanggal(item.createdAt)}</td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => openEdit(item)} title="Edit" className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 flex items-center justify-center transition-colors cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => setDeleteConfirmItem(item)} title="Hapus" className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalCount > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 font-medium">
              Menampilkan <span className="font-bold text-gray-700">{filtered.length}</span> dari <span className="font-bold text-gray-700">{totalCount}</span> mitra
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                {currentPage > 1 ? (
                  <Link
                    href={`/admin/mitra?page=${currentPage - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
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
                        href={`/admin/mitra?page=${p}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
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
                    href={`/admin/mitra?page=${currentPage + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
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

      {/* MODAL MITRA */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base">{editing ? "Edit Mitra" : "Tambah Mitra Baru"}</h3>
              <button onClick={closeModal} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-lg cursor-pointer">×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama Mitra / Instansi <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="nama"
                  required
                  placeholder="Contoh: Bank Syariah Indonesia"
                  value={namaInput}
                  onChange={(e) => setNamaInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#005621]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Logo Mitra <span className="text-red-500">*</span></label>
                {logoPreview && (
                  <div className="mb-3 rounded-xl overflow-hidden border border-gray-200 p-3 max-h-[120px] flex justify-center bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoPreview} alt="Logo Preview" className="max-h-[100px] object-contain" />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  <button type="button" onClick={() => logoInputRef.current?.click()} disabled={uploadingLogo}
                    className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 transition-colors shadow-2xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5">
                    {uploadingLogo ? (
                      <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Uploading…</>
                    ) : logoPreview ? (
                      <><FontAwesomeIcon icon={faSync} /> Ganti Logo</>
                    ) : (
                      <><FontAwesomeIcon icon={faUpload} /> Upload Logo</>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Link Website <span className="text-gray-400 font-normal">(opsional)</span></label>
                <input
                  type="url"
                  name="websiteUrl"
                  placeholder="https://..."
                  value={websiteInput}
                  onChange={(e) => setWebsiteInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#005621]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting || !logoPreview} className="px-6 py-2 text-xs font-bold text-white bg-[#005621] hover:bg-[#004219] rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5">
                  {isSubmitting ? "Simpan…" : <><FontAwesomeIcon icon={faSave} /> Simpan Mitra</>}
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
        title="Hapus Mitra Kerjasama?"
        message={`Apakah Anda yakin ingin menghapus "${deleteConfirmItem?.nama || 'mitra ini'}"? Data yang dihapus tidak dapat dikembalikan.`}
        confirmText="Hapus Mitra"
        loading={isDeleting}
      />

      {/* Toast Notification */}
      <AdminToast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
