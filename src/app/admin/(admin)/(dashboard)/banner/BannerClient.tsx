"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faSync, faSpinner, faSave, faExternalLinkAlt, faTrash, faEdit, faCheckCircle, faTimesCircle, faPlus } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "@/components/admin/ConfirmModal";
import AdminToast, { ToastState } from "@/components/admin/AdminToast";

export type BannerRow = {
  id: string;
  title: string;
  titleAr?: string | null;
  titleEn?: string | null;
  imageUrl: string;
  linkUrl?: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date | string;
};

type ModalMode = "add" | "edit";


interface BannerClientProps {
  initialData: BannerRow[];
}

export default function BannerClient({ initialData }: BannerClientProps) {
  const router = useRouter();
  const [data, setData] = useState<BannerRow[]>(initialData);

  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [editing, setEditing] = useState<BannerRow | null>(null);

  const [titleInput, setTitleInput] = useState("");
  const [titleArInput, setTitleArInput] = useState("");
  const [titleEnInput, setTitleEnInput] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [orderInput, setOrderInput] = useState(0);
  const [isActiveInput, setIsActiveInput] = useState(true);

  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const [deleteConfirmItem, setDeleteConfirmItem] = useState<BannerRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    (item.linkUrl && item.linkUrl.toLowerCase().includes(search.toLowerCase()))
  );

  const [showAdvanced, setShowAdvanced] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setTitleInput("");
    setTitleArInput("");
    setTitleEnInput("");
    setLinkInput("");
    setOrderInput(data.length > 0 ? Math.max(...data.map(d => d.order)) + 1 : 0);
    setIsActiveInput(true);
    setImagePreview("");
    setSelectedFile(null);
    setShowAdvanced(false);
    setModalMode("add");
  };

  const openEdit = (item: BannerRow) => {
    setEditing(item);
    setTitleInput(item.title);
    setTitleArInput(item.titleAr || "");
    setTitleEnInput(item.titleEn || "");
    setLinkInput(item.linkUrl || "");
    setOrderInput(item.order);
    setIsActiveInput(item.isActive);
    setImagePreview(item.imageUrl);
    setSelectedFile(null);
    setShowAdvanced(false);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditing(null);
    setSelectedFile(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
  };

  const handleToggleActive = async (item: BannerRow) => {
    const newStatus = !item.isActive;
    // Optimistic UI update
    setData((prev) =>
      prev.map((b) => (b.id === item.id ? { ...b, isActive: newStatus } : b))
    );

    try {
      const res = await fetch(`/api/banner/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (!res.ok) {
        // Revert on error
        setData((prev) =>
          prev.map((b) => (b.id === item.id ? { ...b, isActive: item.isActive } : b))
        );
        setToast({ message: "Gagal mengubah status banner.", type: "error" });
      } else {
        setToast({ message: `Status banner diubah ke ${newStatus ? 'Aktif' : 'Sembunyi'}.`, type: "info" });
        router.refresh();
      }
    } catch {
      setData((prev) =>
        prev.map((b) => (b.id === item.id ? { ...b, isActive: item.isActive } : b))
      );
      setToast({ message: "Terjadi kesalahan koneksi.", type: "error" });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing && !selectedFile) {
      setToast({ message: "Gambar banner wajib diunggah.", type: "error" });
      return;
    }

    const finalTitle = titleInput.trim() || (selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : editing?.title || `Banner ${data.length + 1}`);

    setIsSubmitting(true);

    try {
      if (editing && !selectedFile) {
        // Updating text details only
        const res = await fetch(`/api/banner/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: finalTitle,
            titleAr: titleArInput || null,
            titleEn: titleEnInput || null,
            linkUrl: linkInput || null,
            order: orderInput,
            isActive: isActiveInput,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Gagal memperbarui banner");
        }
      } else if (selectedFile) {
        // Uploading file (New Banner or Replacement image)
        setUploadingImage(true);
        const fd = new FormData();
        fd.append("image", selectedFile);
        fd.append("title", finalTitle);
        if (titleArInput) fd.append("titleAr", titleArInput);
        if (titleEnInput) fd.append("titleEn", titleEnInput);
        if (linkInput) fd.append("linkUrl", linkInput);
        fd.append("order", String(orderInput));
        fd.append("isActive", String(isActiveInput));

        if (editing) {
          // BUG 6 FIX (Refactored): Upload gambar ke Supabase TANPA buat record baru,
          // lalu UPDATE record yang sudah ada secara in-place.
          // Tidak ada duplikat record bisa terjadi.
          const imgOnlyFd = new FormData();
          imgOnlyFd.append('image', selectedFile);
          const resImg = await fetch('/api/banner/image-only', { method: 'POST', body: imgOnlyFd });
          if (!resImg.ok) {
            const err = await resImg.json();
            throw new Error(err.error || 'Upload gambar gagal.');
          }
          const { imageUrl: newImageUrl } = await resImg.json();

          // Update record yang ada (in-place)
          const resUpdate = await fetch(`/api/banner/${editing.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: finalTitle,
              titleAr: titleArInput || null,
              titleEn: titleEnInput || null,
              imageUrl: newImageUrl,
              linkUrl: linkInput || null,
              order: orderInput,
              isActive: isActiveInput,
            }),
          });

          if (!resUpdate.ok) {
            const err = await resUpdate.json();
            throw new Error(err.error || 'Gagal memperbarui banner setelah upload.');
          }

          const { banner: updatedBanner } = await resUpdate.json();
          setData((prev) => prev.map((b) => (b.id === editing.id ? updatedBanner : b)));
        } else {
          const res = await fetch('/api/banner/upload', { method: 'POST', body: fd });
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Upload gagal.');
          }
        }
      }

      closeModal();
      setToast({ message: editing ? "Banner berhasil diperbarui." : "Banner baru berhasil diunggah.", type: "success" });
      router.refresh();
      // Re-fetch client data
      const fetchRes = await fetch("/api/banner?all=true");
      if (fetchRes.ok) {
        const json = await fetchRes.json();
        if (json.banners) setData(json.banners);
      }
    } catch (error: any) {
      setToast({ message: error.message || "Terjadi kesalahan sistem.", type: "error" });
    } finally {
      setIsSubmitting(false);
      setUploadingImage(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmItem) return;
    setIsDeleting(true);
    const previousData = data;
    setData((prev) => prev.filter((item) => item.id !== deleteConfirmItem.id));

    try {
      const res = await fetch(`/api/banner/${deleteConfirmItem.id}`, { method: "DELETE" });
      if (!res.ok) {
        setData(previousData);
        const err = await res.json().catch(() => ({}));
        setToast({ message: err.error || "Gagal menghapus banner.", type: "error" });
        return;
      }
      setToast({ message: "Banner berhasil dihapus.", type: "success" });
      router.refresh();
    } catch {
      setData(previousData);
      setToast({ message: "Gagal menghapus banner — terjadi kesalahan koneksi.", type: "error" });
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
              type="text"
              placeholder="Cari banner hero…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#005621] bg-gray-50/60 placeholder-gray-400"
            />
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#005621] hover:bg-[#004219] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
            Tambah Banner Hero
          </button>
        </div>

        {/* Card Grid View */}
        <div className="p-5">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400 flex flex-col items-center gap-2">
              <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-semibold">{search ? "Tidak ada yang cocok" : "Belum ada Banner Hero"}</p>
              {!search && <p className="text-xs text-gray-400">Klik &quot;Tambah Banner Hero&quot; untuk mengunggah banner baru.</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative"
                >
                  {/* Banner Image Preview Card */}
                  <div className="relative aspect-[16/6] bg-gray-950 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title || "Banner"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Active Status Badge */}
                    <button
                      onClick={() => handleToggleActive(item)}
                      title="Klik untuk mengubah status"
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-extrabold shadow-md backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 ${
                        item.isActive
                          ? "bg-emerald-500/90 hover:bg-emerald-600 text-white"
                          : "bg-gray-900/80 hover:bg-gray-900 text-gray-300"
                      }`}
                    >
                      <FontAwesomeIcon icon={item.isActive ? faCheckCircle : faTimesCircle} className="w-3 h-3" />
                      {item.isActive ? "Aktif" : "Sembunyi"}
                    </button>
                  </div>

                  {/* Card Content & Action Controls */}
                  <div className="p-4 flex items-center justify-between gap-3 bg-white flex-1 border-t border-gray-100">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-800 text-xs truncate">
                        {item.title || "Banner Hero"}
                      </p>
                      {item.linkUrl ? (
                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-700 font-semibold hover:underline truncate inline-flex items-center gap-1 mt-0.5 max-w-full"
                        >
                          <span className="truncate">{item.linkUrl}</span>
                          <FontAwesomeIcon icon={faExternalLinkAlt} className="w-2.5 h-2.5 shrink-0 opacity-75" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic block mt-0.5">Tanpa Link Klik</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => openEdit(item)}
                        title="Edit Banner"
                        className="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-600 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faEdit} className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmItem(item)}
                        title="Hapus Banner"
                        className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* MODAL BANNER */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-gray-800 text-base">{editing ? "Edit Banner Hero" : "Upload Banner Hero Baru"}</h3>
              <button onClick={closeModal} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-lg cursor-pointer">×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
              {/* 1. UPLOAD GAMBAR BANNER */}
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

                {imagePreview ? (
                  <div className="rounded-2xl overflow-hidden border border-gray-200 aspect-[16/6] bg-gray-950 flex items-center justify-center shadow-inner relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Banner Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-white text-gray-900 font-bold text-xs rounded-xl shadow-md hover:bg-gray-100 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <FontAwesomeIcon icon={faSync} /> Ganti Gambar Banner
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-300 hover:border-[#005621] bg-emerald-50/50 hover:bg-emerald-50/80 rounded-2xl p-7 flex flex-col items-center justify-center cursor-pointer transition-all text-center group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 group-hover:scale-110 text-[#005621] flex items-center justify-center mb-3 transition-transform shadow-xs">
                      <FontAwesomeIcon icon={faUpload} className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-gray-800">Klik untuk Pilih Gambar Banner</p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Format PNG, JPG, WEBP (disarankan Banner Memanjang)</p>
                  </div>
                )}
              </div>

              {/* 2. LINK KLIK BANNER (OPSIONAL) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Link Klik Banner <span className="text-gray-400 font-normal">(opsional)</span></label>
                <input
                  type="text"
                  placeholder="Contoh: /infaq, /zakat, /program, atau URL luar"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#005621]"
                />
                {/* Presets */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[11px] text-gray-400 font-medium mr-1">Preset Cepat:</span>
                  {["/infaq", "/zakat", "/program", "/profil", "/pengumuman"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setLinkInput(preset)}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. PENGATURAN LANJUTAN (COLLAPSIBLE) */}
              <div className="border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center gap-1.5 cursor-pointer py-1 transition-colors"
                >
                  <span>{showAdvanced ? "▾ Sembunyikan Opsi Lanjutan" : "▸ Opsi Lanjutan (Judul & Urutan)"}</span>
                </button>

                {showAdvanced && (
                  <div className="mt-3 space-y-3 p-4 bg-gray-50/80 rounded-xl border border-gray-100">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Judul / Label Banner <span className="text-gray-400 font-normal">(opsional)</span></label>
                      <input
                        type="text"
                        placeholder="Keterangan internal admin"
                        value={titleInput}
                        onChange={(e) => setTitleInput(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#005621]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Urutan (Order)</label>
                        <input
                          type="number"
                          min={0}
                          value={orderInput}
                          onChange={(e) => setOrderInput(parseInt(e.target.value, 10) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#005621]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Status Tampil</label>
                        <button
                          type="button"
                          onClick={() => setIsActiveInput(!isActiveInput)}
                          className={`w-full py-2 px-3 rounded-lg border text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                            isActiveInput
                              ? "border-emerald-500 bg-emerald-100 text-emerald-800"
                              : "border-gray-300 bg-gray-200 text-gray-600"
                          }`}
                        >
                          <FontAwesomeIcon icon={isActiveInput ? faCheckCircle : faTimesCircle} />
                          {isActiveInput ? "Aktif" : "Sembunyi"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100 shrink-0">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || (!editing && !selectedFile)}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#005621] hover:bg-[#004219] rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                >
                  {isSubmitting ? (
                    <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Uploading…</>
                  ) : (
                    <><FontAwesomeIcon icon={faSave} /> Simpan Banner</>
                  )}
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
        title="Hapus Banner Hero?"
        message={`Apakah Anda yakin ingin menghapus "${deleteConfirmItem?.title || 'banner ini'}"? File di Supabase storage akan dihapus secara permanen.`}
        confirmText="Hapus Banner"
        loading={isDeleting}
      />

      {/* Toast Notification */}
      <AdminToast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
