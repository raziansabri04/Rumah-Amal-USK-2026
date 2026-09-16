'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faFileAlt,
  faUserTag,
  faUsers,
  faGear,
  faPlus,
  faEdit,
  faTrashAlt,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faSpinner,
  faExternalLinkAlt,
  faFolderOpen,
  faCalendarAlt,
  faSearch,
  faFilePdf,
  faStamp,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import {
  updateProgramBantuan,
  toggleProgramStatus,
  addDocumentField,
  updateDocumentField,
  deleteDocumentField,
  addBiodataField,
  updateBiodataField,
  deleteBiodataField,
  updateSubmissionStatus,
} from '@/actions/pendaftaran-admin';
import ConfirmModal from '@/components/admin/ConfirmModal';
import AdminToast, { ToastState } from '@/components/admin/AdminToast';

interface DocumentFieldItem {
  id: string;
  programId: string;
  key: string;
  label: string;
  required: boolean;
  maxAgeMonths: number | null;
  expectedKeywords: string[];
  nameCheckApplicable: boolean;
  isSingleCombinedUpload: boolean;
  needsStampCheck: boolean;
  order: number;
}

interface BiodataFieldItem {
  id: string;
  programId: string;
  key: string;
  label: string;
  tipe: string;
  options: string[];
  required: boolean;
  order: number;
}

interface SubmissionItem {
  id: string;
  programId: string;
  token: string;
  biodataValues: any;
  status: string;
  warnings: any;
  linkDokumenGabungan: string | null;
  submittedAt: Date | string;
  documents: {
    id: string;
    fieldKey: string;
    originalFilename: string;
    fileUrl: string;
    needsRevision: boolean;
    revisionNote: string | null;
  }[];
}

interface ProgramDetailProps {
  program: {
    id: string;
    nama: string;
    slug: string;
    deskripsi: string | null;
    gambarUrl: string | null;
    status: string;
    tanggalBuka: Date | string | null;
    tanggalTutup: Date | string | null;
    linkDriveTemplate: string | null;
    documentFields: DocumentFieldItem[];
    biodataFields: BiodataFieldItem[];
  };
  initialSubmissions: SubmissionItem[];
  submissionMeta: {
    total: number;
    page: number;
    totalPages: number;
    statusCounts: Record<string, number>;
  };
  initialStatus: string;
}

export default function ProgramDetailClient({
  program,
  initialSubmissions,
  submissionMeta,
  initialStatus,
}: ProgramDetailProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'dokumen' | 'biodata' | 'pendaftar' | 'pengaturan'>('dokumen');

  // Toasts
  const [toast, setToast] = useState<ToastState | null>(null);

  // Filter Submissions
  const [subStatusFilter, setSubStatusFilter] = useState(initialStatus);

  // ==========================================
  // STATE: DOCUMENT FIELD MODAL
  // ==========================================
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentFieldItem | null>(null);
  const [docKey, setDocKey] = useState('');
  const [docLabel, setDocLabel] = useState('');
  const [docRequired, setDocRequired] = useState(true);
  const [docMaxAgeMonths, setDocMaxAgeMonths] = useState<string>('');
  const [docKeywordsStr, setDocKeywordsStr] = useState('');
  const [docNameCheck, setDocNameCheck] = useState(false);
  const [docSingleCombined, setDocSingleCombined] = useState(false);
  const [docNeedsStamp, setDocNeedsStamp] = useState(false);
  const [docSubmitting, setDocSubmitting] = useState(false);

  // ==========================================
  // STATE: BIODATA FIELD MODAL
  // ==========================================
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [editingBio, setEditingBio] = useState<BiodataFieldItem | null>(null);
  const [bioKey, setBioKey] = useState('');
  const [bioLabel, setBioLabel] = useState('');
  const [bioTipe, setBioTipe] = useState('text');
  const [bioOptionsStr, setBioOptionsStr] = useState('');
  const [bioRequired, setBioRequired] = useState(true);
  const [bioSubmitting, setBioSubmitting] = useState(false);

  // ==========================================
  // STATE: PENGATURAN PROGRAM FORM
  // ==========================================
  const [progNama, setProgNama] = useState(program.nama);
  const [progSlug, setProgSlug] = useState(program.slug);
  const [progStatus, setProgStatus] = useState(program.status);
  const [progDeskripsi, setProgDeskripsi] = useState(program.deskripsi || '');
  const [progGambarUrl, setProgGambarUrl] = useState(program.gambarUrl || '');
  const [progTanggalBuka, setProgTanggalBuka] = useState(
    program.tanggalBuka ? new Date(program.tanggalBuka).toISOString().slice(0, 10) : ''
  );
  const [progTanggalTutup, setProgTanggalTutup] = useState(
    program.tanggalTutup ? new Date(program.tanggalTutup).toISOString().slice(0, 10) : ''
  );
  const [progLinkDriveTemplate, setProgLinkDriveTemplate] = useState(program.linkDriveTemplate || '');
  const [progSubmitting, setProgSubmitting] = useState(false);

  // ==========================================
  // STATE: SUBMISSION DETAIL MODAL
  // ==========================================
  const [viewingSub, setViewingSub] = useState<SubmissionItem | null>(null);

  // ==========================================
  // STATE: DELETE CONFIRMATION
  // ==========================================
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'doc' | 'bio';
    id: string;
    label: string;
  } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ----------------------------------------------------
  // HANDLERS: DOCUMENT FIELD
  // ----------------------------------------------------
  function openAddDocModal() {
    setEditingDoc(null);
    setDocKey('');
    setDocLabel('');
    setDocRequired(true);
    setDocMaxAgeMonths('');
    setDocKeywordsStr('');
    setDocNameCheck(false);
    setDocSingleCombined(false);
    setDocNeedsStamp(false);
    setIsDocModalOpen(true);
  }

  function openEditDocModal(doc: DocumentFieldItem) {
    setEditingDoc(doc);
    setDocKey(doc.key);
    setDocLabel(doc.label);
    setDocRequired(doc.required);
    setDocMaxAgeMonths(doc.maxAgeMonths ? String(doc.maxAgeMonths) : '');
    setDocKeywordsStr(doc.expectedKeywords?.join(', ') || '');
    setDocNameCheck(doc.nameCheckApplicable);
    setDocSingleCombined(doc.isSingleCombinedUpload);
    setDocNeedsStamp(doc.needsStampCheck);
    setIsDocModalOpen(true);
  }

  async function handleSaveDoc(e: React.FormEvent) {
    e.preventDefault();
    if (!docLabel.trim()) {
      setToast({ message: 'Label dokumen wajib diisi.', type: 'error' });
      return;
    }

    setDocSubmitting(true);
    const keywords = docKeywordsStr
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    try {
      if (editingDoc) {
        const res = await updateDocumentField(editingDoc.id, {
          key: docKey || undefined,
          label: docLabel,
          required: docRequired,
          maxAgeMonths: docMaxAgeMonths ? parseInt(docMaxAgeMonths, 10) : null,
          expectedKeywords: keywords,
          nameCheckApplicable: docNameCheck,
          isSingleCombinedUpload: docSingleCombined,
          needsStampCheck: docNeedsStamp,
        });

        if (res.success) {
          setToast({ message: 'Syarat dokumen berhasil diperbarui.', type: 'success' });
          setIsDocModalOpen(false);
          router.refresh();
        } else {
          setToast({ message: res.error || 'Gagal menyimpan syarat dokumen.', type: 'error' });
        }
      } else {
        const res = await addDocumentField(program.id, {
          key: docKey,
          label: docLabel,
          required: docRequired,
          maxAgeMonths: docMaxAgeMonths ? parseInt(docMaxAgeMonths, 10) : null,
          expectedKeywords: keywords,
          nameCheckApplicable: docNameCheck,
          isSingleCombinedUpload: docSingleCombined,
          needsStampCheck: docNeedsStamp,
        });

        if (res.success) {
          setToast({ message: 'Syarat dokumen baru berhasil ditambahkan.', type: 'success' });
          setIsDocModalOpen(false);
          router.refresh();
        } else {
          setToast({ message: res.error || 'Gagal menambahkan syarat dokumen.', type: 'error' });
        }
      }
    } finally {
      setDocSubmitting(false);
    }
  }

  // ----------------------------------------------------
  // HANDLERS: BIODATA FIELD
  // ----------------------------------------------------
  function openAddBioModal() {
    setEditingBio(null);
    setBioKey('');
    setBioLabel('');
    setBioTipe('text');
    setBioOptionsStr('');
    setBioRequired(true);
    setIsBioModalOpen(true);
  }

  function openEditBioModal(bio: BiodataFieldItem) {
    setEditingBio(bio);
    setBioKey(bio.key);
    setBioLabel(bio.label);
    setBioTipe(bio.tipe);
    setBioOptionsStr(bio.options?.join('\n') || '');
    setBioRequired(bio.required);
    setIsBioModalOpen(true);
  }

  async function handleSaveBio(e: React.FormEvent) {
    e.preventDefault();
    if (!bioLabel.trim()) {
      setToast({ message: 'Label biodata wajib diisi.', type: 'error' });
      return;
    }

    setBioSubmitting(true);
    const options = bioOptionsStr
      .split('\n')
      .map((o) => o.trim())
      .filter(Boolean);

    try {
      if (editingBio) {
        const res = await updateBiodataField(editingBio.id, {
          key: bioKey || undefined,
          label: bioLabel,
          tipe: bioTipe,
          options,
          required: bioRequired,
        });

        if (res.success) {
          setToast({ message: 'Field biodata berhasil diperbarui.', type: 'success' });
          setIsBioModalOpen(false);
          router.refresh();
        } else {
          setToast({ message: res.error || 'Gagal menyimpan field biodata.', type: 'error' });
        }
      } else {
        const res = await addBiodataField(program.id, {
          key: bioKey,
          label: bioLabel,
          tipe: bioTipe,
          options,
          required: bioRequired,
        });

        if (res.success) {
          setToast({ message: 'Field biodata baru berhasil ditambahkan.', type: 'success' });
          setIsBioModalOpen(false);
          router.refresh();
        } else {
          setToast({ message: res.error || 'Gagal menambahkan field biodata.', type: 'error' });
        }
      }
    } finally {
      setBioSubmitting(false);
    }
  }

  // ----------------------------------------------------
  // HANDLERS: DELETE FIELD
  // ----------------------------------------------------
  async function handleDeleteFieldConfirm() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      if (deleteTarget.type === 'doc') {
        const res = await deleteDocumentField(deleteTarget.id);
        if (res.success) {
          setToast({ message: 'Syarat dokumen berhasil dihapus.', type: 'success' });
          setDeleteTarget(null);
          router.refresh();
        } else {
          setToast({ message: res.error || 'Gagal menghapus dokumen.', type: 'error' });
        }
      } else {
        const res = await deleteBiodataField(deleteTarget.id);
        if (res.success) {
          setToast({ message: 'Field biodata berhasil dihapus.', type: 'success' });
          setDeleteTarget(null);
          router.refresh();
        } else {
          setToast({ message: res.error || 'Gagal menghapus biodata.', type: 'error' });
        }
      }
    } finally {
      setDeleteLoading(false);
    }
  }

  // ----------------------------------------------------
  // HANDLERS: PENGATURAN PROGRAM
  // ----------------------------------------------------
  async function handleSaveProgramSettings(e: React.FormEvent) {
    e.preventDefault();
    setProgSubmitting(true);
    try {
      const res = await updateProgramBantuan(program.id, {
        nama: progNama,
        slug: progSlug,
        status: progStatus,
        deskripsi: progDeskripsi,
        gambarUrl: progGambarUrl,
        tanggalBuka: progTanggalBuka || null,
        tanggalTutup: progTanggalTutup || null,
        linkDriveTemplate: progLinkDriveTemplate,
      });

      if (res.success) {
        setToast({ message: 'Pengaturan program berhasil disimpan.', type: 'success' });
        router.refresh();
      } else {
        setToast({ message: res.error || 'Gagal menyimpan pengaturan.', type: 'error' });
      }
    } finally {
      setProgSubmitting(false);
    }
  }

  // ----------------------------------------------------
  // HANDLERS: SUBMISSION STATUS
  // ----------------------------------------------------
  async function handleChangeSubmissionStatus(submissionId: string, newStatus: string) {
    startTransition(async () => {
      const res = await updateSubmissionStatus(submissionId, newStatus);
      if (res.success) {
        setToast({ message: `Status pendaftar diubah menjadi "${newStatus}".`, type: 'success' });
        router.refresh();
      } else {
        setToast({ message: res.error || 'Gagal mengubah status.', type: 'error' });
      }
    });
  }

  function handleFilterStatus(status: string) {
    setSubStatusFilter(status);
    router.push(`/admin/pendaftaran/${program.id}?status=${status}`);
  }

  function formatTgl(d: Date | string | null) {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <AdminToast toast={toast} onClose={() => setToast(null)} />

      {/* Top Bar: Back button & Program Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/pendaftaran"
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center text-xs transition-colors cursor-pointer"
              title="Kembali ke Daftar Program"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                  {program.nama}
                </h1>
                <span
                  className={`px-2.5 py-0.5 rounded-lg border text-3xs font-extrabold uppercase tracking-wider ${
                    program.status === 'dibuka'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : program.status === 'ditutup'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {program.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-medium flex items-center gap-3">
                <span>Slug: <code className="text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded-md font-mono">{program.slug}</code></span>
                {program.linkDriveTemplate && (
                  <a
                    href={program.linkDriveTemplate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    <FontAwesomeIcon icon={faFolderOpen} />
                    <span>Drive Template</span>
                  </a>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/pendaftaran/${program.slug}`}
              target="_blank"
              className="px-3.5 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs shadow-2xs inline-flex items-center gap-2"
            >
              <span>Lihat Form Publik</span>
              <FontAwesomeIcon icon={faExternalLinkAlt} className="text-3xs text-gray-400" />
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-gray-100 pt-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('dokumen')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 shrink-0 ${
              activeTab === 'dokumen'
                ? 'bg-[#005621] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FontAwesomeIcon icon={faFileAlt} />
            <span>Syarat Dokumen ({program.documentFields.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('biodata')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 shrink-0 ${
              activeTab === 'biodata'
                ? 'bg-[#005621] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FontAwesomeIcon icon={faUserTag} />
            <span>Syarat Biodata ({program.biodataFields.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pendaftar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 shrink-0 ${
              activeTab === 'pendaftar'
                ? 'bg-[#005621] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FontAwesomeIcon icon={faUsers} />
            <span>Data Pendaftar & Seleksi ({submissionMeta.total})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pengaturan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 shrink-0 ${
              activeTab === 'pengaturan'
                ? 'bg-[#005621] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FontAwesomeIcon icon={faGear} />
            <span>Pengaturan Program</span>
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* TAB 1: SYARAT DOKUMEN BUILDER                                    */}
      {/* ================================================================= */}
      {activeTab === 'dokumen' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
            <div>
              <h2 className="text-base font-black text-gray-900">Builder Syarat Dokumen</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Konfigurasi berkas yang harus diunggah pendaftar beserta aturan verifikasi otomatis (OCR, usia surat, nama, stempel)
              </p>
            </div>
            <button
              type="button"
              onClick={openAddDocModal}
              className="px-4 py-2 rounded-xl bg-[#005621] hover:bg-[#004219] text-white font-bold text-xs transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Tambah Syarat Dokumen</span>
            </button>
          </div>

          {program.documentFields.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs">
              <p className="text-sm font-bold text-gray-800">Belum ada syarat dokumen yang ditambahkan.</p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Program ini belum mensyaratkan upload berkas apa pun. Klik tombol di atas untuk menambahkan berkas seperti KTP, KTM, surat permohonan, dsb.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {program.documentFields.map((field, idx) => (
                <div
                  key={field.id}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gray-200 transition-all"
                >
                  <div className="space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-gray-100 text-gray-700 font-black text-2xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h3 className="text-sm font-black text-gray-900 truncate">{field.label}</h3>
                      <span className="text-3xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-semibold">
                        key: {field.key}
                      </span>
                      <span
                        className={`text-3xs font-bold px-2 py-0.5 rounded-md border ${
                          field.required
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                      >
                        {field.required ? 'Wajib' : 'Opsional'}
                      </span>
                    </div>

                    {/* Flags Indicators */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {field.maxAgeMonths && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-3xs font-semibold">
                          Maks Usia: {field.maxAgeMonths} Bulan
                        </span>
                      )}

                      {field.nameCheckApplicable && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-3xs font-semibold">
                          Cek Nama Pendaftar (Fuzzy Levenshtein)
                        </span>
                      )}

                      {field.isSingleCombinedUpload && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200 text-3xs font-semibold">
                          Upload Foto Gabungan Mandiri (Format Tata Letak)
                        </span>
                      )}

                      {field.needsStampCheck && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 text-3xs font-semibold flex items-center gap-1">
                          <FontAwesomeIcon icon={faStamp} />
                          Perlu Cek Stempel Manual
                        </span>
                      )}

                      {field.expectedKeywords && field.expectedKeywords.length > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-3xs font-semibold">
                          Keyword OCR: {field.expectedKeywords.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => openEditDocModal(field)}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <FontAwesomeIcon icon={faEdit} className="text-gray-400" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({
                          type: 'doc',
                          id: field.id,
                          label: field.label,
                        })
                      }
                      className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 2: SYARAT BIODATA BUILDER                                    */}
      {/* ================================================================= */}
      {activeTab === 'biodata' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
            <div>
              <h2 className="text-base font-black text-gray-900">Builder Syarat Biodata</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Konfigurasi formulir isian data diri dinamis yang harus diisi pendaftar
              </p>
            </div>
            <button
              type="button"
              onClick={openAddBioModal}
              className="px-4 py-2 rounded-xl bg-[#005621] hover:bg-[#004219] text-white font-bold text-xs transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Tambah Field Biodata</span>
            </button>
          </div>

          {program.biodataFields.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs">
              <p className="text-sm font-bold text-gray-800">Belum ada syarat biodata yang dikonfigurasi.</p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Tambahkan field data diri seperti Nama, NPM, Fakultas, Penghasilan Orang Tua, dsb.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {program.biodataFields.map((field, idx) => (
                <div
                  key={field.id}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gray-200 transition-all"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-gray-100 text-gray-700 font-black text-2xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h3 className="text-sm font-black text-gray-900 truncate">{field.label}</h3>
                      <span className="text-3xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-semibold">
                        key: {field.key}
                      </span>
                      <span className="text-3xs font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                        tipe: {field.tipe}
                      </span>
                      <span
                        className={`text-3xs font-bold px-2 py-0.5 rounded-md border ${
                          field.required
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                      >
                        {field.required ? 'Wajib' : 'Opsional'}
                      </span>
                    </div>

                    {field.options && field.options.length > 0 && (
                      <p className="text-2xs text-gray-500 pt-1 font-medium">
                        Pilihan opsi: <span className="text-gray-700 font-semibold">{field.options.join(', ')}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => openEditBioModal(field)}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <FontAwesomeIcon icon={faEdit} className="text-gray-400" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({
                          type: 'bio',
                          id: field.id,
                          label: field.label,
                        })
                      }
                      className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 3: DATA PENDAFTAR & SELEKSI                                  */}
      {/* ================================================================= */}
      {activeTab === 'pendaftar' && (
        <div className="space-y-4">
          {/* Filter Status Submissions */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center gap-2">
            {[
              { key: 'all', label: 'Semua', count: submissionMeta.statusCounts.all },
              { key: 'menunggu_diproses', label: 'Menunggu Diproses', count: submissionMeta.statusCounts.menunggu_diproses },
              { key: 'sedang_diproses', label: 'Sedang Diproses', count: submissionMeta.statusCounts.sedang_diproses },
              { key: 'belum_diseleksi', label: 'Belum Diseleksi', count: submissionMeta.statusCounts.belum_diseleksi },
              { key: 'lolos', label: 'Lolos Seleksi', count: submissionMeta.statusCounts.lolos },
              { key: 'tidak_lolos', label: 'Tidak Lolos', count: submissionMeta.statusCounts.tidak_lolos },
              { key: 'gagal_diproses', label: 'Gagal Diproses', count: submissionMeta.statusCounts.gagal_diproses },
            ].map((st) => (
              <button
                key={st.key}
                type="button"
                onClick={() => handleFilterStatus(st.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  subStatusFilter === st.key
                    ? 'bg-[#005621] text-white shadow-2xs'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{st.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-3xs font-black ${
                  subStatusFilter === st.key ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {st.count || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Tabel Submissions */}
          {initialSubmissions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center text-2xl mx-auto mb-3">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <h3 className="text-base font-bold text-gray-900">Belum Ada Pendaftar</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Pendaftaran untuk program ini masih kosong atau tidak ada pendaftar dengan status yang dipilih.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/80 border-b border-gray-100 text-3xs font-black uppercase tracking-wider text-gray-400">
                    <tr>
                      <th className="p-4">Tanggal & Token</th>
                      <th className="p-4">Identitas Pendaftar</th>
                      <th className="p-4">Status & Warning Verifikasi</th>
                      <th className="p-4">PDF Gabungan</th>
                      <th className="p-4 text-right">Aksi Seleksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {initialSubmissions.map((sub) => {
                      const vals = sub.biodataValues || {};
                      const nama = vals.nama || vals.nama_lengkap || vals.nama_pengusul || 'Pendaftar';
                      const kontak = vals.no_hp || vals.no_wa || vals.whatsapp || vals.email || '-';
                      const idNum = vals.npm || vals.nik || '';

                      const statusBadgeMap: any = {
                        menunggu_diproses: 'bg-amber-50 text-amber-700 border-amber-200',
                        sedang_diproses: 'bg-blue-50 text-blue-700 border-blue-200',
                        belum_diseleksi: 'bg-purple-50 text-purple-700 border-purple-200',
                        lolos: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                        tidak_lolos: 'bg-red-50 text-red-700 border-red-200',
                        gagal_diproses: 'bg-gray-100 text-gray-700 border-gray-300',
                      };

                      const warningsList = Array.isArray(sub.warnings) ? sub.warnings : [];

                      return (
                        <tr key={sub.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="p-4 align-top">
                            <p className="font-bold text-gray-900">{formatTgl(sub.submittedAt)}</p>
                            <p className="text-3xs font-mono text-gray-400 mt-0.5 truncate max-w-[120px]">
                              {sub.token}
                            </p>
                          </td>

                          <td className="p-4 align-top">
                            <p className="font-bold text-gray-900 text-sm">{nama}</p>
                            <p className="text-2xs text-gray-500 font-medium">
                              {idNum ? `${idNum} • ` : ''}{kontak}
                            </p>
                          </td>

                          <td className="p-4 align-top space-y-1.5">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-lg border text-3xs font-extrabold uppercase tracking-wider ${
                                statusBadgeMap[sub.status] || 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {sub.status.replace(/_/g, ' ')}
                            </span>

                            {warningsList.length > 0 && (
                              <div className="text-3xs text-amber-800 bg-amber-50/80 p-2 rounded-lg border border-amber-200 space-y-0.5 max-w-xs">
                                <div className="font-black flex items-center gap-1 text-amber-900">
                                  <FontAwesomeIcon icon={faExclamationTriangle} />
                                  <span>{warningsList.length} Catatan Sistem:</span>
                                </div>
                                {warningsList.slice(0, 2).map((w: any, i: number) => (
                                  <p key={i} className="line-clamp-1">
                                    • {typeof w === 'string' ? w : w.message || JSON.stringify(w)}
                                  </p>
                                ))}
                                {warningsList.length > 2 && (
                                  <p className="text-3xs text-amber-700 font-bold">
                                    +{warningsList.length - 2} catatan lainnya…
                                  </p>
                                )}
                              </div>
                            )}
                          </td>

                          <td className="p-4 align-top">
                            {sub.linkDokumenGabungan ? (
                              <a
                                href={sub.linkDokumenGabungan}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-2xs font-bold border border-blue-200 inline-flex items-center gap-1.5 transition-colors"
                              >
                                <FontAwesomeIcon icon={faFilePdf} className="text-red-500 text-xs" />
                                <span>Unduh PDF</span>
                                <FontAwesomeIcon icon={faExternalLinkAlt} className="text-3xs" />
                              </a>
                            ) : (
                              <span className="text-3xs text-gray-400 italic">Belum dibuat</span>
                            )}
                          </td>

                          <td className="p-4 align-top text-right space-y-2">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setViewingSub(sub)}
                                className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-2xs font-bold inline-flex items-center gap-1 cursor-pointer"
                                title="Lihat detail biodata dan berkas lengkap"
                              >
                                <FontAwesomeIcon icon={faEye} />
                                <span>Detail</span>
                              </button>

                              <select
                                value={sub.status}
                                onChange={(e) => handleChangeSubmissionStatus(sub.id, e.target.value)}
                                disabled={isPending}
                                className="px-2.5 py-1 rounded-lg border border-gray-200 text-2xs font-bold text-gray-700 bg-white focus:outline-none focus:border-[#005621] cursor-pointer"
                              >
                                <option value="belum_diseleksi">Belum Diseleksi</option>
                                <option value="lolos">Lolos</option>
                                <option value="tidak_lolos">Tidak Lolos</option>
                                <option value="menunggu_diproses">Menunggu Diproses</option>
                                <option value="sedang_diproses">Sedang Diproses</option>
                                <option value="gagal_diproses">Gagal Diproses</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 4: PENGATURAN PROGRAM                                        */}
      {/* ================================================================= */}
      {activeTab === 'pengaturan' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs max-w-2xl">
          <h2 className="text-base font-black text-gray-900 mb-1">Pengaturan Informasi Program</h2>
          <p className="text-xs text-gray-500 mb-6">
            Ubah nama, status buka/tutup pendaftaran, serta folder Google Drive template
          </p>

          <form onSubmit={handleSaveProgramSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Nama Program Bantuan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={progNama}
                onChange={(e) => setProgNama(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#005621]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Slug URL Pendaftaran
              </label>
              <input
                type="text"
                required
                value={progSlug}
                onChange={(e) => setProgSlug(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#005621]"
              />
              <p className="text-3xs text-gray-400 mt-1">
                Akan diakses publik melalui: <code className="text-gray-700 font-mono">/pendaftaran/{progSlug}</code>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Status Pendaftaran
                </label>
                <select
                  value={progStatus}
                  onChange={(e) => setProgStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#005621]"
                >
                  <option value="draft">Draft</option>
                  <option value="dibuka">Dibuka</option>
                  <option value="ditutup">Ditutup</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  URL Banner / Gambar
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={progGambarUrl}
                  onChange={(e) => setProgGambarUrl(e.target.value)}
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
                  value={progTanggalBuka}
                  onChange={(e) => setProgTanggalBuka(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#005621]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Tanggal Tutup
                </label>
                <input
                  type="date"
                  value={progTanggalTutup}
                  onChange={(e) => setProgTanggalTutup(e.target.value)}
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
                value={progLinkDriveTemplate}
                onChange={(e) => setProgLinkDriveTemplate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#005621]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Deskripsi Program
              </label>
              <textarea
                rows={3}
                value={progDeskripsi}
                onChange={(e) => setProgDeskripsi(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#005621]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={progSubmitting}
                className="px-5 py-2.5 rounded-xl bg-[#005621] text-white font-bold text-xs hover:bg-[#004219] transition-all shadow-xs cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
              >
                {progSubmitting && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
                <span>Simpan Perubahan Pengaturan</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: TAMBAH / EDIT DOKUMEN FIELD                               */}
      {/* ================================================================= */}
      {isDocModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsDocModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto transform transition-all animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-black text-gray-900">
                {editingDoc ? 'Edit Syarat Dokumen' : 'Tambah Syarat Dokumen Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsDocModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nama / Label Dokumen <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Surat Rekomendasi Dosen Wali"
                  value={docLabel}
                  onChange={(e) => setDocLabel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#005621]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Key Identifikasi (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: surat_rekomendasi"
                    value={docKey}
                    onChange={(e) => setDocKey(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#005621]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Masa Berlaku Maks (Bulan)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Contoh: 6"
                    value={docMaxAgeMonths}
                    onChange={(e) => setDocMaxAgeMonths(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#005621]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Kata Kunci OCR yang Diharapkan (Pisahkan koma)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: surat keterangan, tidak mampu, kepala desa"
                  value={docKeywordsStr}
                  onChange={(e) => setDocKeywordsStr(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#005621]"
                />
                <p className="text-3xs text-gray-400 mt-1">
                  Sistem OCR akan mendeteksi kecocokan kata kunci untuk mencegah salah upload berkas.
                </p>
              </div>

              {/* Flags Checklist */}
              <div className="space-y-2.5 pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={docRequired}
                    onChange={(e) => setDocRequired(e.target.checked)}
                    className="rounded text-[#005621] focus:ring-[#005621] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-gray-800">
                    Dokumen Wajib Diupload (Required)
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={docNameCheck}
                    onChange={(e) => setDocNameCheck(e.target.checked)}
                    className="rounded text-[#005621] focus:ring-[#005621] w-4 h-4 cursor-pointer mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-semibold text-gray-800 block">
                      Cocokkan Nama Pendaftar dengan Isi Dokumen (Fuzzy Levenshtein)
                    </span>
                    <span className="text-3xs text-gray-400">
                      Aktifkan hanya untuk dokumen identitas pendaftar (KTP, KTM, SKTM pendaftar). Jangan aktifkan untuk surat rekomendasi dosen atau berkas orang tua.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={docSingleCombined}
                    onChange={(e) => setDocSingleCombined(e.target.checked)}
                    className="rounded text-[#005621] focus:ring-[#005621] w-4 h-4 cursor-pointer mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-semibold text-gray-800 block">
                      Format Foto Gabungan Mandiri (isSingleCombinedUpload)
                    </span>
                    <span className="text-3xs text-gray-400">
                      Untuk berkas seperti Foto Rumah di mana pendaftar menggabungkan sendiri beberapa foto jadi satu file sesuai template. Lewati OCR teks namun tetap gabungkan ke PDF akhir.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={docNeedsStamp}
                    onChange={(e) => setDocNeedsStamp(e.target.checked)}
                    className="rounded text-[#005621] focus:ring-[#005621] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-gray-800">
                    Tandai untuk Cek Stempel / Tanda Tangan Basah Manual oleh Admin
                  </span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsDocModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={docSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#005621] text-white font-bold text-xs hover:bg-[#004219] transition-all shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {docSubmitting && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
                  <span>{editingDoc ? 'Simpan Perubahan' : 'Tambahkan Dokumen'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: TAMBAH / EDIT BIODATA FIELD                               */}
      {/* ================================================================= */}
      {isBioModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsBioModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto transform transition-all animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-black text-gray-900">
                {editingBio ? 'Edit Field Biodata' : 'Tambah Field Biodata Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsBioModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBio} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Label Pertanyaan / Data <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Nomor Pokok Mahasiswa (NPM)"
                  value={bioLabel}
                  onChange={(e) => setBioLabel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#005621]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Key Identifikasi (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: npm"
                    value={bioKey}
                    onChange={(e) => setBioKey(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#005621]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tipe Input
                  </label>
                  <select
                    value={bioTipe}
                    onChange={(e) => setBioTipe(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#005621]"
                  >
                    <option value="text">Teks Pendek (Text)</option>
                    <option value="number">Angka (Number)</option>
                    <option value="date">Tanggal (Date)</option>
                    <option value="textarea">Teks Panjang (Textarea)</option>
                    <option value="select">Pilihan Dropdown (Select)</option>
                    <option value="radio">Pilihan Radio (Radio Button)</option>
                  </select>
                </div>
              </div>

              {['select', 'radio'].includes(bioTipe) && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Opsi Pilihan (Tulis 1 opsi per baris)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Opsi 1&#10;Opsi 2&#10;Opsi 3"
                    value={bioOptionsStr}
                    onChange={(e) => setBioOptionsStr(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#005621]"
                  />
                </div>
              )}

              <div className="pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bioRequired}
                    onChange={(e) => setBioRequired(e.target.checked)}
                    className="rounded text-[#005621] focus:ring-[#005621] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-gray-800">
                    Field Wajib Diisi (Required)
                  </span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsBioModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={bioSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#005621] text-white font-bold text-xs hover:bg-[#004219] transition-all shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {bioSubmitting && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
                  <span>{editingBio ? 'Simpan Perubahan' : 'Tambahkan Field'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: DETAIL SUBMISSION                                         */}
      {/* ================================================================= */}
      {viewingSub && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setViewingSub(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto transform transition-all animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-black text-gray-900">
                  Detail Pendaftaran
                </h3>
                <p className="text-3xs font-mono text-gray-400 mt-0.5">Token: {viewingSub.token}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewingSub(null)}
                className="text-gray-400 hover:text-gray-600 text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Isian Biodata */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                Isian Biodata Pendaftar
              </h4>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(viewingSub.biodataValues || {}).map(([key, val]) => (
                  <div key={key}>
                    <p className="text-3xs font-bold text-gray-400 uppercase">{key.replace(/_/g, ' ')}</p>
                    <p className="font-semibold text-gray-900 mt-0.5">
                      {typeof val === 'object' ? JSON.stringify(val) : String(val || '-')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Berkas Upload */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                Dokumen yang Diunggah ({viewingSub.documents?.length || 0})
              </h4>
              <div className="space-y-2">
                {viewingSub.documents?.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-gray-900">{doc.fieldKey.replace(/_/g, ' ')}</p>
                      <p className="text-3xs text-gray-500 font-mono truncate max-w-xs">{doc.originalFilename}</p>
                    </div>

                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-blue-600 hover:text-blue-800 font-bold text-2xs inline-flex items-center gap-1.5 shadow-2xs"
                    >
                      <FontAwesomeIcon icon={faFolderOpen} />
                      <span>Buka File</span>
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="text-3xs" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Warnings Log */}
            {Array.isArray(viewingSub.warnings) && viewingSub.warnings.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500" />
                  Catatan Verifikasi Sistem
                </h4>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1 text-xs text-amber-900">
                  {viewingSub.warnings.map((w: any, idx: number) => (
                    <p key={idx}>• {typeof w === 'string' ? w : w.message || JSON.stringify(w)}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setViewingSub(null)}
                className="px-4 py-2 rounded-xl bg-gray-900 text-white font-bold text-xs hover:bg-gray-800 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: KONFIRMASI HAPUS FIELD                                    */}
      {/* ================================================================= */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteFieldConfirm}
        title={deleteTarget?.type === 'doc' ? 'Hapus Syarat Dokumen?' : 'Hapus Field Biodata?'}
        message={`Apakah Anda yakin ingin menghapus "${deleteTarget?.label}"? Konfigurasi ini akan dihapus dari form pendaftaran program.`}
        confirmText="Ya, Hapus"
        loading={deleteLoading}
        type="danger"
      />
    </div>
  );
}
