"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faUpload, faSync, faSpinner, faSave } from "@fortawesome/free-solid-svg-icons";
import {
  addKampanye,
  updateKampanye,
  deleteKampanye,
  toggleKampanyeStatus,
} from "@/actions/kampanye";
import { formatThousand, parseRawNumber } from "@/lib/formatNumber";
import ConfirmModal from "@/components/admin/ConfirmModal";
import AdminToast, { ToastState } from "@/components/admin/AdminToast";

const TipTapEditor = dynamic(() => import("@/components/TipTapEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded-xl p-8 text-center text-gray-400 text-sm animate-pulse bg-gray-50 min-h-[300px] flex items-center justify-center">
      <div>
        <div className="w-6 h-6 border-2 border-[#005621] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        Memuat editor…
      </div>
    </div>
  ),
});

type KampanyeRow = {
  id: string;
  judul: string;
  judulAr?: string | null;
  judulEn?: string | null;
  deskripsi: string | null;
  deskripsiAr?: string | null;
  deskripsiEn?: string | null;
  imageUrl: string | null;
  targetDana: number | null;
  terkumpul: number;
  tanggalSelesai: Date | null;
  isActive: boolean;
  createdAt: Date;
};

type ModalMode = "add" | "edit" | "preview-only";

function formatRupiah(amount: number | null) {
  if (amount === null || amount === undefined) return "Rp 0,00";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatTanggal(date: Date | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function PreviewPanel({
  judul, deskripsi, imageUrl, targetDana, terkumpul, tanggalSelesai,
}: {
  judul: string; deskripsi: string; imageUrl: string;
  targetDana: number; terkumpul: number; tanggalSelesai: string;
}) {
  const rawPct = targetDana > 0 ? (terkumpul / targetDana) * 100 : 0;
  const pctText = rawPct > 0 && rawPct < 1 ? rawPct.toFixed(1) : Math.round(rawPct);
  const barWidth = rawPct > 0 ? Math.max(1, Math.min(100, rawPct)) : 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50 border-l border-gray-200">
      <div className="px-5 py-3 bg-gray-900 text-white flex items-center gap-2 shrink-0">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wide text-gray-200">Preview Tampilan Publik</span>
      </div>

      <div className="p-5 sm:p-6 overflow-y-auto flex-1 font-sans text-gray-800 space-y-4">
        {imageUrl && (
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-white flex justify-center max-h-[220px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Banner Kampanye" className="w-full object-contain max-h-[220px]" />
          </div>
        )}

        <div>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-100 uppercase">
            DONASI KAMPANYE
          </span>
          <h1 className="text-xl font-extrabold text-gray-900 leading-tight mt-2">
            {judul || <span className="text-gray-300 italic">(Belum ada judul kampanye)</span>}
          </h1>
        </div>

        {/* Progress Card */}
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">Terkumpul: <strong className="text-emerald-700">{formatRupiah(terkumpul)}</strong></span>
            <span className="text-gray-400 font-medium">Target: {formatRupiah(targetDana)}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-[#005621] h-2.5 rounded-full transition-all duration-300" style={{ width: `${barWidth}%` }} />
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
            <span>Progress: {pctText}%</span>
          </div>
        </div>

        <style>{`
          .prev-body p { margin-bottom:.9rem; line-height:1.75; text-align:justify; }
          .prev-body h1 { font-size:1.5rem; font-weight:800; margin:1.2rem 0 .5rem; }
          .prev-body h2 { font-size:1.25rem; font-weight:700; margin:1rem 0 .4rem; }
          .prev-body ul { list-style:disc; padding-left:1.4rem; margin-bottom:.9rem; }
          .prev-body ol { list-style:decimal; padding-left:1.4rem; margin-bottom:.9rem; }
          .prev-body blockquote { border-left:4px solid #d1d5db; padding-left:1rem; color:#6b7280; font-style:italic; margin:.75rem 0; }
        `}</style>
        <div
          className="prev-body text-sm leading-relaxed text-gray-800 pt-2"
          dangerouslySetInnerHTML={{
            __html: deskripsi || '<p class="text-gray-400 italic text-center py-6">(Belum ada deskripsi rincian kampanye)</p>',
          }}
        />
      </div>
    </div>
  );
}

interface KampanyeClientProps {
  initialData: KampanyeRow[];
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  activeCount?: number;
  inactiveCount?: number;
  initialSearch?: string;
}

const DEBOUNCE_MS = 400;

export default function KampanyeClient({
  initialData,
  currentPage = 1,
  totalPages = 1,
  totalCount = initialData.length,
  activeCount = initialData.filter((d) => d.isActive).length,
  inactiveCount = initialData.filter((d) => !d.isActive).length,
  initialSearch = "",
}: KampanyeClientProps) {
  const router = useRouter();
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [editing, setEditing] = useState<KampanyeRow | null>(null);
  const [previewingItem, setPreviewingItem] = useState<KampanyeRow | null>(null);

  const [formTab, setFormTab] = useState<"id" | "en" | "ar">("id");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverPreview, setCoverPreview] = useState("");
  const [deskripsiHtml, setDeskripsiHtml] = useState("<p></p>");
  const [deskripsiEnHtml, setDeskripsiEnHtml] = useState("<p></p>");
  const [deskripsiArHtml, setDeskripsiArHtml] = useState("<p></p>");
  const [showPreviewPanel, setShowPreviewPanel] = useState(false);

  const [liveJudul, setLiveJudul] = useState("");
  const [liveJudulEn, setLiveJudulEn] = useState("");
  const [liveJudulAr, setLiveJudulAr] = useState("");
  const [liveTarget, setLiveTarget] = useState<number>(0);
  const [liveTerkumpul, setLiveTerkumpul] = useState<number>(0);
  const [liveDate, setLiveDate] = useState("");

  const [search, setSearch] = useState(initialSearch);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const filtered = data;

  const [deleteConfirmItem, setDeleteConfirmItem] = useState<KampanyeRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (val) params.set("search", val);
      params.set("page", "1");
      router.push(`/admin/kampanye?${params.toString()}`);
    }, DEBOUNCE_MS);
  };

  const openAdd = () => {
    setEditing(null);
    setFormTab("id");
    setCoverPreview("");
    setDeskripsiHtml("<p></p>");
    setDeskripsiEnHtml("<p></p>");
    setDeskripsiArHtml("<p></p>");
    setLiveJudul(""); setLiveJudulEn(""); setLiveJudulAr("");
    setLiveTarget(0); setLiveTerkumpul(0); setLiveDate("");
    setShowPreviewPanel(false);
    setModalMode("add");
  };

  const openEdit = (item: KampanyeRow) => {
    setEditing(item);
    setFormTab("id");
    setCoverPreview(item.imageUrl || "");
    setDeskripsiHtml(item.deskripsi || "<p></p>");
    setDeskripsiEnHtml(item.deskripsiEn || "<p></p>");
    setDeskripsiArHtml(item.deskripsiAr || "<p></p>");
    setLiveJudul(item.judul);
    setLiveJudulEn(item.judulEn || "");
    setLiveJudulAr(item.judulAr || "");
    setLiveTarget(item.targetDana || 0);
    setLiveTerkumpul(item.terkumpul || 0);
    setLiveDate(item.tanggalSelesai ? new Date(item.tanggalSelesai).toISOString().slice(0, 10) : "");
    setShowPreviewPanel(false);
    setModalMode("edit");
  };

  const openPreviewOnly = (item: KampanyeRow) => {
    setPreviewingItem(item);
    setModalMode("preview-only");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditing(null);
    setPreviewingItem(null);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", "Kampanye");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json();
        setToast({ message: `Upload gagal: ${err.error}`, type: "error" });
        return;
      }
      const result = await res.json();
      setCoverPreview(result.url);
      setToast({ message: "Banner berhasil diupload.", type: "success" });
    } catch (err) {
      setToast({ message: `Kesalahan: ${(err as Error).message}`, type: "error" });
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  };

  // ── Shared auto-translate logic ─────────────────────────────────────
  const runAutoTranslate = async () => {
    if (!liveJudul.trim()) {
      setToast({ message: "Silakan isi Judul Kampanye (Indonesia) terlebih dahulu!", type: "error" });
      return false;
    }
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: liveJudul, content: deskripsiHtml }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.titleEn) setLiveJudulEn(data.titleEn);
        if (data.titleAr) setLiveJudulAr(data.titleAr);
        if (data.contentEn) setDeskripsiEnHtml(data.contentEn);
        if (data.contentAr) setDeskripsiArHtml(data.contentAr);
        setToast({ message: "✨ Berhasil menerjemahkan ke EN & AR!", type: "success" });
        return { titleEn: data.titleEn, titleAr: data.titleAr, contentEn: data.contentEn, contentAr: data.contentAr };
      } else {
        setToast({ message: "Gagal melakukan terjemahan otomatis.", type: "error" });
        return null;
      }
    } catch (err: any) {
      setToast({ message: err.message || "Gagal menerjemahkan.", type: "error" });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    setIsSubmitting(true);
    try {
      // ── Auto-translate jika EN/AR belum terisi ──────────────────────
      let finalJudulEn = liveJudulEn;
      let finalJudulAr = liveJudulAr;
      let finalDeskripsiEn = deskripsiEnHtml;
      let finalDeskripsiAr = deskripsiArHtml;

      const needsTranslate = !liveJudulEn.trim() || !liveJudulAr.trim();
      if (needsTranslate && liveJudul.trim()) {
        const translated = await runAutoTranslate();
        if (translated) {
          finalJudulEn = translated.titleEn || finalJudulEn;
          finalJudulAr = translated.titleAr || finalJudulAr;
          finalDeskripsiEn = translated.contentEn || finalDeskripsiEn;
          finalDeskripsiAr = translated.contentAr || finalDeskripsiAr;
        }
      }

      const fd = new FormData(formElement);
      fd.set("imageUrl", coverPreview);
      fd.set("judul", liveJudul);
      fd.set("judulEn", finalJudulEn);
      fd.set("judulAr", finalJudulAr);
      fd.set("deskripsi", deskripsiHtml);
      fd.set("deskripsiEn", finalDeskripsiEn);
      fd.set("deskripsiAr", finalDeskripsiAr);
      fd.set("targetDana", String(liveTarget));
      fd.set("terkumpul", String(liveTerkumpul));
      if (editing) {
        fd.append("id", editing.id);
        await updateKampanye(fd);
        setToast({ message: "Kampanye berhasil diperbarui.", type: "success" });
      } else {
        await addKampanye(fd);
        setToast({ message: "Kampanye baru berhasil ditambahkan.", type: "success" });
      }
      closeModal();
      router.refresh();
    } catch (error: any) {
      setToast({ message: error.message || "Terjadi kesalahan sistem.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    setData((prev) => prev.map((item) => item.id === id ? { ...item, isActive: !current } : item));
    await toggleKampanyeStatus(id, current);
    setToast({ message: `Status kampanye diubah ke ${!current ? 'Aktif' : 'Nonaktif'}.`, type: "info" });
    router.refresh();
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmItem) return;
    setIsDeleting(true);
    try {
      setData((prev) => prev.filter((item) => item.id !== deleteConfirmItem.id));
      await deleteKampanye(deleteConfirmItem.id);
      setToast({ message: "Kampanye donasi berhasil dihapus.", type: "success" });
      router.refresh();
    } catch (err: any) {
      setToast({ message: err.message || "Gagal menghapus kampanye.", type: "error" });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmItem(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-gray-100">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text" placeholder="Cari kampanye donasi…" value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#005621] bg-gray-50/60 placeholder-gray-400"
            />
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 bg-[#005621] hover:bg-[#004219] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer whitespace-nowrap">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Tambah Kampanye
          </button>
        </div>

        {/* Card Grid */}
        <div className="p-5">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <div className="flex flex-col items-center gap-2">
                <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p className="text-sm font-semibold">{search ? "Tidak ada yang cocok" : "Belum ada kampanye"}</p>
                {!search && <p className="text-xs text-gray-300">Klik &quot;Tambah Kampanye&quot; untuk mulai.</p>}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {filtered.map((item) => {
                const target = item.targetDana || 0;
                const terkumpul = item.terkumpul || 0;
                const rawPct = target > 0 ? (terkumpul / target) * 100 : 0;
                const pctText = rawPct > 0 && rawPct < 1 ? rawPct.toFixed(1) : Math.round(rawPct);
                const barWidth = rawPct > 0 ? Math.max(1, Math.min(100, rawPct)) : 0;

                return (
                  <div key={item.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                    {/* Cover Image */}
                    <div className="relative h-36 bg-gradient-to-br from-[#005621]/10 to-[#005621]/20 shrink-0">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt={item.judul} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-[#005621]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                      )}
                      {/* Status badge */}
                      <div className="absolute top-2 right-2">
                        <button onClick={() => handleToggle(item.id, item.isActive)}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-colors cursor-pointer shadow-sm ${item.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                          {item.isActive ? "Aktif" : "Nonaktif"}
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1 gap-3">
                      <p className="font-bold text-gray-800 text-sm leading-snug line-clamp-2">{item.judul}</p>

                      {/* Progress */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-emerald-700 font-bold">{formatRupiah(terkumpul)}</span>
                          <span className="text-gray-400">dari {formatRupiah(target)}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-[#005621] h-1.5 rounded-full transition-all" style={{ width: `${barWidth}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-gray-400">
                          <span>{pctText}% terkumpul</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-gray-50 mt-auto">
                        <button onClick={() => openPreviewOnly(item)} title="Preview" className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button onClick={() => openEdit(item)} title="Edit" className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 flex items-center justify-center transition-colors cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => setDeleteConfirmItem(item)} title="Hapus" className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {totalCount > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 font-medium">
              Menampilkan <span className="font-bold text-gray-700">{filtered.length}</span> dari <span className="font-bold text-gray-700">{totalCount}</span> kampanye
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                {currentPage > 1 ? (
                  <Link
                    href={`/admin/kampanye?page=${currentPage - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
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
                        href={`/admin/kampanye?page=${p}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
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
                    href={`/admin/kampanye?page=${currentPage + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
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
              <span>Aktif: <span className="text-green-600 font-bold">{activeCount}</span></span>
              <span className="text-gray-200">|</span>
              <span>Nonaktif: <span className="text-gray-600 font-bold">{inactiveCount}</span></span>
            </div>
          </div>
        )}
      </div>

      {(modalMode === "add" || modalMode === "edit") && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-stretch justify-center">
          <div className="bg-white w-full max-w-[1400px] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-200 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#005621]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#005621]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">{editing ? "Edit Kampanye Donasi" : "Tambah Kampanye Donasi Baru"}</h3>
                  <p className="text-xs text-gray-400">{editing ? "Perbarui informasi rincian kampanye" : "Buat kampanye donasi baru"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreviewPanel((v) => !v)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${showPreviewPanel ? "bg-gray-900 text-white border-gray-900" : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  {showPreviewPanel ? "Sembunyikan Preview" : "Tampilkan Preview"}
                </button>
                <button onClick={closeModal} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center font-bold transition-colors cursor-pointer text-lg">×</button>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col overflow-y-auto"
                style={{ width: showPreviewPanel ? "55%" : "100%", transition: "width 0.3s ease" }}
              >
                <div className="p-6 space-y-5 flex-1">
                  <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 space-y-3">
                    <label className="block text-xs font-bold text-gray-700">
                      <FontAwesomeIcon icon={faImage} className="mr-1.5 text-gray-500" />
                      Banner / Header Kampanye
                    </label>
                    {coverPreview && (
                      <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-white flex justify-center max-h-[200px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={coverPreview} alt="Cover Preview" className="max-h-[200px] w-auto object-contain p-2" />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                      <button type="button" onClick={() => coverInputRef.current?.click()} disabled={uploadingCover}
                        className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5">
                        {uploadingCover ? (
                          <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Mengupload…</>
                        ) : coverPreview ? (
                          <><FontAwesomeIcon icon={faSync} /> Ganti Gambar</>
                        ) : (
                          <><FontAwesomeIcon icon={faUpload} /> Upload Gambar</>
                        )}
                      </button>
                      {coverPreview && (
                        <button type="button" onClick={() => setCoverPreview("")} className="text-xs text-[#d32f2f] hover:text-red-700 font-bold cursor-pointer">Hapus</button>
                      )}
                    </div>
                  </div>

                  {/* General Configs: Target Dana, Terkumpul, Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50/80 p-4 rounded-xl border border-gray-200">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Target Dana (Rp)</label>
                      <input
                        type="text" name="targetDana"
                        value={formatThousand(liveTarget)}
                        onChange={(e) => setLiveTarget(Number(parseRawNumber(e.target.value)))}
                        placeholder="Contoh: 50.000.000"
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#005621] bg-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Dana Terkumpul (Rp)</label>
                      <input
                        type="text" name="terkumpul"
                        value={formatThousand(liveTerkumpul)}
                        onChange={(e) => setLiveTerkumpul(Number(parseRawNumber(e.target.value)))}
                        placeholder="Contoh: 15.000.000"
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#005621] bg-white font-medium"
                      />
                    </div>
                    <div className="flex flex-col justify-end pb-2">
                      <div className="flex items-center gap-2.5">
                        <input type="checkbox" id="published" name="published" value="1"
                          defaultChecked={editing ? editing.isActive : true}
                          className="w-4 h-4 text-[#005621] rounded focus:ring-[#005621] cursor-pointer" />
                        <label htmlFor="published" className="text-sm text-gray-700 font-semibold cursor-pointer">Status Aktif</label>
                      </div>
                    </div>
                  </div>

                  {/* 🌐 Multilingual Tabs (ID, EN, AR) */}
                  <div className="border border-gray-200 rounded-2xl p-4 bg-white space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-extrabold text-gray-700 uppercase tracking-wide">
                          🌐 Konten 3 Bahasa (Multilingual)
                        </span>
                        <button
                          type="button"
                          onClick={async () => { setIsSubmitting(true); await runAutoTranslate(); setIsSubmitting(false); }}
                          disabled={isSubmitting}
                          className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                        >
                          ✨ Auto Translate ke EN & AR
                        </button>
                      </div>

                      {/* Tab Buttons */}
                      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setFormTab("id")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${formTab === "id" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                          🇮🇩 Indonesia
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormTab("en")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${formTab === "en" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                          🇬🇧 English
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormTab("ar")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${formTab === "ar" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                          🇸🇦 العربية
                        </button>
                      </div>
                    </div>

                    {/* TAB ID */}
                    {formTab === "id" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">
                            Judul Kampanye (Indonesia) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={liveJudul}
                            onChange={(e) => setLiveJudul(e.target.value)}
                            placeholder="Contoh: Beasiswa Anak Yatim USK 2026"
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#005621] bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">
                            Rincian Deskripsi Kampanye (Indonesia)
                          </label>
                          <TipTapEditor
                            content={deskripsiHtml}
                            onChange={(html) => setDeskripsiHtml(html)}
                            minHeight="280px"
                          />
                        </div>
                      </div>
                    )}

                    {/* TAB EN */}
                    {formTab === "en" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">
                            Campaign Title (English)
                          </label>
                          <input
                            type="text"
                            value={liveJudulEn}
                            onChange={(e) => setLiveJudulEn(e.target.value)}
                            placeholder="Enter campaign title in English…"
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#005621] bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">
                            Campaign Description (English)
                          </label>
                          <TipTapEditor
                            content={deskripsiEnHtml}
                            onChange={(html) => setDeskripsiEnHtml(html)}
                            minHeight="280px"
                          />
                        </div>
                      </div>
                    )}

                    {/* TAB AR */}
                    {formTab === "ar" && (
                      <div className="space-y-4" dir="rtl">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5 font-serif text-right">
                            عنوان الحملة (العربية)
                          </label>
                          <input
                            type="text"
                            value={liveJudulAr}
                            onChange={(e) => setLiveJudulAr(e.target.value)}
                            placeholder="أدخل عنوان الحملة باللغة العربية…"
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#005621] bg-white font-serif text-right"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5 font-serif text-right">
                            تفاصيل الحملة (العربية)
                          </label>
                          <TipTapEditor
                            content={deskripsiArHtml}
                            onChange={(html) => setDeskripsiArHtml(html)}
                            minHeight="280px"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/60 shrink-0">
                  <button type="button" onClick={closeModal}
                    className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer">
                    Batal
                  </button>
                  <button type="submit" disabled={isSubmitting}
                    className="px-7 py-2.5 text-sm font-bold text-white bg-[#005621] hover:bg-[#004219] rounded-xl shadow-sm transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2">
                    {isSubmitting ? (
                      <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Menyimpan…</>
                    ) : (
                      <><FontAwesomeIcon icon={faSave} /> {editing ? "Perbarui Kampanye" : "Simpan Kampanye"}</>
                    )}
                  </button>
                </div>
              </form>

              {showPreviewPanel && (
                <div className="flex-1 flex flex-col overflow-hidden border-l border-gray-200">
                  <PreviewPanel
                    judul={liveJudul}
                    deskripsi={deskripsiHtml}
                    imageUrl={coverPreview}
                    targetDana={liveTarget}
                    terkumpul={liveTerkumpul}
                    tanggalSelesai={liveDate}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {modalMode === "preview-only" && previewingItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6" onClick={closeModal}>
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="font-extrabold text-sm tracking-wide uppercase text-gray-200">Preview Tampilan Publik</h3>
              </div>
              <button type="button" onClick={closeModal} className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all cursor-pointer text-lg">×</button>
            </div>

            <div className="p-6 sm:p-10 overflow-y-auto flex-1 font-sans text-gray-800 space-y-4">
              {previewingItem.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex justify-center max-h-[320px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewingItem.imageUrl} alt="Cover" className="w-full object-contain max-h-[320px]" />
                </div>
              )}

              <div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-100 uppercase">
                  DONASI KAMPANYE
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mt-2">{previewingItem.judul}</h1>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">Terkumpul: <strong className="text-emerald-700">{formatRupiah(previewingItem.terkumpul)}</strong></span>
                  <span className="text-gray-500 font-medium">Target: {formatRupiah(previewingItem.targetDana)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-[#005621] h-3 rounded-full"
                    style={{ width: `${previewingItem.targetDana ? Math.min(100, Math.round((previewingItem.terkumpul / previewingItem.targetDana) * 100)) : 0}%` }}
                  />
                </div>
              </div>

              <style>{`
                .prev-full p { margin-bottom:1rem; line-height:1.8; text-align:justify; }
                .prev-full h1 { font-size:1.7rem; font-weight:800; margin:1.4rem 0 .6rem; }
                .prev-full h2 { font-size:1.35rem; font-weight:700; margin:1.2rem 0 .5rem; }
                .prev-full ul { list-style:disc; padding-left:1.5rem; margin-bottom:1rem; }
                .prev-full ol { list-style:decimal; padding-left:1.5rem; margin-bottom:1rem; }
              `}</style>
              <div className="prev-full text-base leading-relaxed text-gray-800"
                dangerouslySetInnerHTML={{
                  __html: previewingItem.deskripsi || '<p class="text-gray-400 italic text-center">(Belum ada deskripsi)</p>',
                }}
              />
            </div>

            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200 shrink-0">
              <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${previewingItem.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {previewingItem.isActive ? "● Aktif" : "○ Nonaktif"}
              </div>
              <button type="button" onClick={closeModal} className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer">Tutup Preview</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmItem)}
        onClose={() => setDeleteConfirmItem(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Kampanye Donasi?"
        message={`Apakah Anda yakin ingin menghapus "${deleteConfirmItem?.judul || 'kampanye ini'}"? Data yang dihapus tidak dapat dikembalikan.`}
        confirmText="Hapus Kampanye"
        loading={isDeleting}
      />

      {/* Toast Notification */}
      <AdminToast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
