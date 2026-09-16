'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSearch,
  faSliders,
  faUsers,
  faFileAlt,
  faListCheck,
  faFolderOpen,
  faPlay,
  faSpinner,
  faCalendarAlt,
  faEdit,
  faTrashAlt,
  faExternalLinkAlt,
  faCheckCircle,
  faClock,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import {
  createProgramBantuan,
  updateProgramBantuan,
  deleteProgramBantuan,
  toggleProgramStatus,
  triggerWorkerManual,
} from '@/actions/pendaftaran-admin';
import ConfirmModal from '@/components/admin/ConfirmModal';
import AdminToast, { ToastState } from '@/components/admin/AdminToast';

interface ProgramItem {
  id: string;
  nama: string;
  slug: string;
  deskripsi: string | null;
  gambarUrl: string | null;
  status: string;
  tanggalBuka: Date | string | null;
  tanggalTutup: Date | string | null;
  linkDriveTemplate: string | null;
  createdAt: Date | string;
  _count?: {
    documentFields: number;
    biodataFields: number;
    submissions: number;
  };
}

interface Props {
  initialPrograms: ProgramItem[];
  initialSearch: string;
  initialStatus: string;
}

export default function PendaftaranClient({
  initialPrograms,
  initialSearch,
  initialStatus,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // State pencarian & filter
  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  // State toast & modals
  const [toast, setToast] = useState<ToastState | null>(null);
  const [workerLoading, setWorkerLoading] = useState(false);

  // Modal Form Program
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(null);
  const [formNama, setFormNama] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDeskripsi, setFormDeskripsi] = useState('');
  const [formGambarUrl, setFormGambarUrl] = useState('');
  const [formStatus, setFormStatus] = useState('draft');
  const [formTanggalBuka, setFormTanggalBuka] = useState('');
  const [formTanggalTutup, setFormTanggalTutup] = useState('');
  const [formLinkDriveTemplate, setFormLinkDriveTemplate] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Modal Delete
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Filter list program lokal
  const filteredPrograms = initialPrograms.filter((p) => {
    const matchSearch =
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      (p.deskripsi && p.deskripsi.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Hitung ringkasan status
  const totalBuka = initialPrograms.filter((p) => p.status === 'dibuka').length;
  const totalTutup = initialPrograms.filter((p) => p.status === 'ditutup').length;
  const totalDraft = initialPrograms.filter((p) => p.status === 'draft').length;

  function openAddModal() {
    setEditingProgram(null);
    setFormNama('');
    setFormSlug('');
    setFormDeskripsi('');
    setFormGambarUrl('');
    setFormStatus('draft');
    setFormTanggalBuka('');
    setFormTanggalTutup('');
    setFormLinkDriveTemplate('');
    setIsModalOpen(true);
  }

  function openEditModal(program: ProgramItem) {
    setEditingProgram(program);
    setFormNama(program.nama);
    setFormSlug(program.slug);
    setFormDeskripsi(program.deskripsi || '');
    setFormGambarUrl(program.gambarUrl || '');
    setFormStatus(program.status);
    setFormTanggalBuka(
      program.tanggalBuka ? new Date(program.tanggalBuka).toISOString().slice(0, 10) : ''
    );
    setFormTanggalTutup(
      program.tanggalTutup ? new Date(program.tanggalTutup).toISOString().slice(0, 10) : ''
    );
    setFormLinkDriveTemplate(program.linkDriveTemplate || '');
    setIsModalOpen(true);
  }

  async function handleSaveProgram(e: React.FormEvent) {
    e.preventDefault();
    if (!formNama.trim()) {
      setToast({ message: 'Nama program wajib diisi.', type: 'error' });
      return;
    }

    setFormSubmitting(true);
    try {
      if (editingProgram) {
        const res = await updateProgramBantuan(editingProgram.id, {
          nama: formNama,
          slug: formSlug,
          deskripsi: formDeskripsi,
          gambarUrl: formGambarUrl,
          status: formStatus,
          tanggalBuka: formTanggalBuka || null,
          tanggalTutup: formTanggalTutup || null,
          linkDriveTemplate: formLinkDriveTemplate,
        });

        if (res.success) {
          setToast({ message: 'Program bantuan berhasil diperbarui.', type: 'success' });
          setIsModalOpen(false);
          router.refresh();
        } else {
          setToast({ message: res.error || 'Gagal mengupdate program.', type: 'error' });
        }
      } else {
        const res = await createProgramBantuan({
          nama: formNama,
          slug: formSlug,
          deskripsi: formDeskripsi,
          gambarUrl: formGambarUrl,
          status: formStatus,
          tanggalBuka: formTanggalBuka || null,
          tanggalTutup: formTanggalTutup || null,
          linkDriveTemplate: formLinkDriveTemplate,
        });

        if (res.success) {
          setToast({ message: 'Program bantuan baru berhasil dibuat.', type: 'success' });
          setIsModalOpen(false);
          router.refresh();
        } else {
          setToast({ message: res.error || 'Gagal membuat program.', type: 'error' });
        }
      }
    } finally {
      setFormSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      const res = await deleteProgramBantuan(deletingId);
      if (res.success) {
        setToast({ message: 'Program bantuan berhasil dihapus.', type: 'success' });
        setDeletingId(null);
        router.refresh();
      } else {
        setToast({ message: res.error || 'Gagal menghapus program.', type: 'error' });
      }
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleToggleStatus(id: string, currentStatus: string) {
    const nextStatus = currentStatus === 'dibuka' ? 'ditutup' : 'dibuka';
    startTransition(async () => {
      const res = await toggleProgramStatus(id, nextStatus as any);
      if (res.success) {
        setToast({
          message: `Status program diubah menjadi "${nextStatus}".`,
          type: 'success',
        });
        router.refresh();
      } else {
        setToast({ message: res.error || 'Gagal mengubah status.', type: 'error' });
      }
    });
  }

  async function handleTriggerWorker() {
    setWorkerLoading(true);
    try {
      const res = await triggerWorkerManual();
      if (res.success) {
        setToast({
          message: res.data?.message || 'Antrean worker berhasil diproses.',
          type: 'success',
        });
        router.refresh();
      } else {
        setToast({ message: res.error || 'Gagal memicu worker antrean.', type: 'error' });
      }
    } finally {
      setWorkerLoading(false);
    }
  }

  function formatTgl(d: Date | string | null) {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notifikasi */}
      <AdminToast toast={toast} onClose={() => setToast(null)} />

      {/* Header Utama & Tombol Aksi */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Pendaftaran Program Bantuan
            </h1>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-black rounded-lg border border-emerald-200">
              Neon DB
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Kelola beasiswa & bantuan, konfigurasi syarat berkas, biodata dinamis, dan seleksi pendaftar
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Tombol Manual Trigger Worker */}
          <button
            type="button"
            onClick={handleTriggerWorker}
            disabled={workerLoading}
            className="px-4 py-2.5 rounded-xl border border-amber-300 text-amber-900 font-bold text-xs bg-amber-50 hover:bg-amber-100 transition-colors shadow-2xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
            title="Picu pemrosesan antrean verifikasi pendaftar manual"
          >
            <FontAwesomeIcon
              icon={workerLoading ? faSpinner : faPlay}
              className={workerLoading ? 'animate-spin text-amber-700' : 'text-amber-700'}
            />
            <span>{workerLoading ? 'Memproses…' : 'Proses Antrean Sekarang'}</span>
          </button>

          {/* Tombol Tambah Program */}
          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#005621] hover:bg-[#004219] text-white transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Tambah Program Baru</span>
          </button>
        </div>
      </div>

      {/* Kartu Ringkasan & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Program</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{initialPrograms.length}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
            <FontAwesomeIcon icon={faListCheck} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Dibuka</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{totalBuka}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-red-600 font-bold uppercase tracking-wider">Ditutup</p>
            <p className="text-2xl font-black text-red-700 mt-1">{totalTutup}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-lg">
            <FontAwesomeIcon icon={faClock} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">Draft</p>
            <p className="text-2xl font-black text-amber-700 mt-1">{totalDraft}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
        </div>
      </div>

      {/* Bar Pencarian & Filter Status */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
          />
          <input
            type="text"
            placeholder="Cari program bantuan…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#005621] focus:ring-1 focus:ring-[#005621]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-gray-500 shrink-0 flex items-center gap-1.5">
            <FontAwesomeIcon icon={faSliders} className="text-gray-400" />
            Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#005621] cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="dibuka">Dibuka</option>
            <option value="ditutup">Ditutup</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Grid Daftar Program */}
      {filteredPrograms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center text-2xl mx-auto mb-3">
            <FontAwesomeIcon icon={faListCheck} />
          </div>
          <h3 className="text-base font-bold text-gray-900">Belum Ada Program Pendaftaran</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Mulai dengan menambahkan program bantuan baru untuk mengatur formulir pendaftaran dinamis.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="mt-4 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#005621] text-white hover:bg-[#004219] transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Tambah Program Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPrograms.map((prog) => {
            const statusBadgeMap: any = {
              dibuka: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              ditutup: 'bg-red-50 text-red-700 border-red-200',
              draft: 'bg-amber-50 text-amber-700 border-amber-200',
            };

            return (
              <div
                key={prog.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5 space-y-3.5">
                  {/* Status & Quick Toggle */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-1 rounded-lg border text-2xs font-extrabold uppercase tracking-wider ${
                        statusBadgeMap[prog.status] || 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {prog.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(prog.id, prog.status)}
                      disabled={isPending}
                      className="text-2xs font-bold text-gray-500 hover:text-[#005621] cursor-pointer"
                    >
                      {prog.status === 'dibuka' ? 'Tutup Pendaftaran' : 'Buka Pendaftaran'}
                    </button>
                  </div>

                  {/* Judul & Deskripsi */}
                  <div>
                    <h3 className="text-base font-black text-gray-900 leading-snug line-clamp-2">
                      {prog.nama}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {prog.deskripsi || 'Tidak ada deskripsi singkat.'}
                    </p>
                  </div>

                  {/* Jadwal Buka - Tutup */}
                  <div className="p-3 bg-gray-50 rounded-xl text-2xs space-y-1 text-gray-600 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium text-gray-500">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                        Buka:
                      </span>
                      <span className="font-bold text-gray-800">{formatTgl(prog.tanggalBuka)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium text-gray-500">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                        Tutup:
                      </span>
                      <span className="font-bold text-gray-800">{formatTgl(prog.tanggalTutup)}</span>
                    </div>
                  </div>

                  {/* Statistik Builder & Pendaftar */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-100/60">
                      <p className="text-2xs font-bold text-blue-600">Dokumen</p>
                      <p className="text-sm font-black text-blue-900 mt-0.5">
                        {prog._count?.documentFields ?? 0}
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-purple-50/60 border border-purple-100/60">
                      <p className="text-2xs font-bold text-purple-600">Biodata</p>
                      <p className="text-sm font-black text-purple-900 mt-0.5">
                        {prog._count?.biodataFields ?? 0}
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100/60">
                      <p className="text-2xs font-bold text-emerald-600">Pendaftar</p>
                      <p className="text-sm font-black text-emerald-900 mt-0.5">
                        {prog._count?.submissions ?? 0}
                      </p>
                    </div>
                  </div>

                  {/* Link Drive Template */}
                  {prog.linkDriveTemplate && (
                    <a
                      href={prog.linkDriveTemplate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold truncate"
                    >
                      <FontAwesomeIcon icon={faFolderOpen} className="shrink-0" />
                      <span className="truncate">Google Drive Template Dokumen</span>
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="shrink-0 text-3xs" />
                    </a>
                  )}
                </div>

                {/* Footer Action Buttons */}
                <div className="px-5 py-3.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(prog)}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 flex items-center justify-center text-xs transition-colors cursor-pointer shadow-2xs"
                      title="Edit Info Program"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingId(prog.id)}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center justify-center text-xs transition-colors cursor-pointer shadow-2xs"
                      title="Hapus Program"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </div>

                  {/* Tombol Masuk ke Builder & Seleksi */}
                  <Link
                    href={`/admin/pendaftaran/${prog.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-[#005621] hover:bg-[#004219] text-white text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1.5"
                  >
                    <span>Kelola & Seleksi</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Tambah / Edit Program */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto transform transition-all animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900">
                {editingProgram ? 'Edit Program Bantuan' : 'Tambah Program Bantuan Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nama Program <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: BPRA-UKT Semester Ganjil 2026"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#005621]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Slug URL (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Kosongkan untuk auto-generate dari nama"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#005621]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Status Pendaftaran
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#005621]"
                  >
                    <option value="draft">Draft (Belum Ditampilkan)</option>
                    <option value="dibuka">Dibuka</option>
                    <option value="ditutup">Ditutup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    URL Gambar / Banner
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formGambarUrl}
                    onChange={(e) => setFormGambarUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#005621]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tanggal Buka
                  </label>
                  <input
                    type="date"
                    value={formTanggalBuka}
                    onChange={(e) => setFormTanggalBuka(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#005621]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tanggal Tutup
                  </label>
                  <input
                    type="date"
                    value={formTanggalTutup}
                    onChange={(e) => setFormTanggalTutup(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#005621]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Link Google Drive Template Dokumen
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={formLinkDriveTemplate}
                  onChange={(e) => setFormLinkDriveTemplate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#005621]"
                />
                <p className="text-3xs text-gray-400 mt-1">
                  Pendaftar dapat mengunduh format surat rekomendasi, format surat pernyataan, dsb.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Deskripsi / Keterangan Program
                </label>
                <textarea
                  rows={3}
                  placeholder="Penjelasan ringkas mengenai sasaran program, kriteria penerima, dsb."
                  value={formDeskripsi}
                  onChange={(e) => setFormDeskripsi(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#005621]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#005621] text-white font-bold text-xs hover:bg-[#004219] transition-all shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {formSubmitting && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
                  <span>{editingProgram ? 'Simpan Perubahan' : 'Buat Program'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      <ConfirmModal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Program Bantuan?"
        message="Menghapus program ini akan sekaligus menghapus konfigurasi syarat dokumen, biodata, dan seluruh data pendaftar terkait. Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus Program"
        loading={deleteLoading}
        type="danger"
      />
    </div>
  );
}
