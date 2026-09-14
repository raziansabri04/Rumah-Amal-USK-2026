"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faSave,
  faSpinner,
  faCheckCircle,
  faExclamationTriangle,
  faUndo,
  faImage,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { updateStrukturOrganisasi, resetStrukturOrganisasi } from "@/actions/struktur-organisasi";
import ConfirmModal from "@/components/admin/ConfirmModal";

interface StrukturOrganisasiClientProps {
  initialData: {
    id: string;
    imageUrl: string;
    updatedAt: Date | string;
  };
}

export default function StrukturOrganisasiClient({ initialData }: StrukturOrganisasiClientProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initialData.imageUrl);
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [useCustomUrl, setUseCustomUrl] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const DEFAULT_IMAGE_URL = "/profil/struktur-organisasi.png";

  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    setUseCustomUrl(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const localUrl = URL.createObjectURL(file);
      setImagePreview(localUrl);
      setUseCustomUrl(false);
    } else if (file) {
      setStatusMsg({ type: "error", text: "File yang diunggah harus berupa file gambar (PNG, JPG, WEBP)." });
    }
  };

  const handleConfirmResetDefault = async () => {
    setIsSubmitting(true);
    setStatusMsg(null);
    try {
      const res = await resetStrukturOrganisasi();
      if (res.success) {
        setImageUrl(DEFAULT_IMAGE_URL);
        setImagePreview(DEFAULT_IMAGE_URL);
        setSelectedFile(null);
        setCustomUrlInput("");
        setUseCustomUrl(false);
        setStatusMsg({ type: "success", text: "Gambar custom berhasil dihapus dari database dan dikembalikan ke gambar default." });
        router.refresh();
      } else {
        setStatusMsg({ type: "error", text: res.error || "Gagal mengembalikan gambar default." });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Terjadi kesalahan koneksi." });
    } finally {
      setIsSubmitting(false);
      setIsResetConfirmOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      let finalUrl = imageUrl;

      if (useCustomUrl) {
        if (!customUrlInput.trim()) {
          setStatusMsg({ type: "error", text: "URL gambar tidak boleh kosong." });
          setIsSubmitting(false);
          return;
        }
        finalUrl = customUrlInput.trim();
      } else if (selectedFile) {
        // Upload file to Supabase Storage via /api/upload
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("bucket", "StrukturOrganisasi");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData.error || "Gagal mengunggah gambar ke storage.");
        }

        const uploadData = await uploadRes.json();
        finalUrl = uploadData.url;
      }

      const res = await updateStrukturOrganisasi(finalUrl);
      if (res.success) {
        setImageUrl(finalUrl);
        setImagePreview(finalUrl);
        setSelectedFile(null);
        setStatusMsg({ type: "success", text: "Gambar struktur organisasi berhasil diperbarui!" });
        router.refresh();
      } else {
        setStatusMsg({ type: "error", text: res.error || "Gagal menyimpan ke database." });
      }
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Terjadi kesalahan saat mengunggah gambar." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FontAwesomeIcon icon={faImage} className="text-[#005621]" />
            Pengaturan Struktur Organisasi
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Kelola gambar bagan struktur organisasi yang ditampilkan pada halaman publik Rumah Amal USK.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            disabled={isSubmitting || imageUrl === DEFAULT_IMAGE_URL}
            className="px-3.5 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            <FontAwesomeIcon icon={faUndo} /> Reset Default
          </button>
        </div>
      </div>

      {/* Alert Status */}
      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
            statusMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <FontAwesomeIcon
            icon={statusMsg.type === "success" ? faCheckCircle : faExclamationTriangle}
            className="text-base"
          />
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Form & Preview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">
              Upload / Ubah Gambar
            </h2>

            {/* Input Selection Mode */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="uploadMode"
                  checked={!useCustomUrl}
                  onChange={() => setUseCustomUrl(false)}
                  className="text-[#005621] focus:ring-[#005621]"
                />
                Upload File
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="uploadMode"
                  checked={useCustomUrl}
                  onChange={() => setUseCustomUrl(true)}
                  className="text-[#005621] focus:ring-[#005621]"
                />
                Input URL Gambar
              </label>
            </div>

            {!useCustomUrl ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all text-center group ${
                    isDragging
                      ? "border-[#005621] bg-emerald-100/80 scale-[1.02]"
                      : "border-emerald-300 hover:border-[#005621] bg-emerald-50/50 hover:bg-emerald-50"
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 group-hover:scale-110 text-[#005621] flex items-center justify-center mb-3 transition-transform shadow-xs">
                    <FontAwesomeIcon icon={faUpload} className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-gray-800">
                    {selectedFile
                      ? selectedFile.name
                      : isDragging
                      ? "Lepaskan file gambar di sini..."
                      : "Klik atau Drag & Drop Gambar Baru di Sini"}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Format PNG, JPG, WEBP (Maksimal 5MB)
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  URL Gambar
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/gambar-struktur.png"
                  value={customUrlInput}
                  onChange={(e) => {
                    setCustomUrlInput(e.target.value);
                    if (e.target.value.trim()) setImagePreview(e.target.value.trim());
                  }}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#005621]"
                />
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || (!selectedFile && !useCustomUrl && imageUrl === imagePreview)}
                className="w-full py-3 px-4 text-xs font-bold text-white bg-[#005621] hover:bg-[#004219] rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] text-gray-400 space-y-1">
            <p>
              <strong className="text-gray-600">Catatan:</strong> Gambar ini akan langsung tampil di halaman publik <a href="/profil/struktur-organisasi" target="_blank" className="text-[#005621] underline inline-flex items-center gap-0.5">/profil/struktur-organisasi <FontAwesomeIcon icon={faExternalLinkAlt} className="w-2 h-2" /></a>
            </p>
          </div>
        </div>

        {/* Right Column: Live Preview Card (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <h2 className="text-sm font-bold text-gray-800">
              Pratinjau Gambar Struktur
            </h2>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
              Live Preview
            </span>
          </div>

          <div className="flex-1 border border-gray-100 rounded-xl overflow-hidden bg-gray-50 p-3 flex items-center justify-center min-h-[300px] relative">
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview}
                alt="Pratinjau Struktur Organisasi"
                className="max-w-full max-h-[500px] object-contain rounded-lg shadow-2xs"
              />
            ) : (
              <div className="text-center text-gray-400">
                <FontAwesomeIcon icon={faImage} className="w-10 h-10 mb-2 text-gray-300" />
                <p className="text-xs">Belum ada gambar terpilih</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Confirm Reset Modal */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleConfirmResetDefault}
        title="Reset Gambar ke Default?"
        message="Apakah Anda yakin ingin mengembalikan gambar ke versi default? Data custom di database akan dihapus secara permanen."
        confirmText="Reset Gambar"
        loading={isSubmitting}
      />
    </div>
  );
}
