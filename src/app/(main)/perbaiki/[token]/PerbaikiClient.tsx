'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faUpload,
  faCheckCircle,
  faArrowLeft,
  faFilePdf,
  faCheck,
  faInfoCircle,
  faFileAlt,
  faClock,
} from '@fortawesome/free-solid-svg-icons';

interface DocumentField {
  id: string;
  key: string;
  label: string;
  required: boolean;
  maxAgeMonths: number | null;
  nameCheckApplicable: boolean;
  isSingleCombinedUpload: boolean;
}

interface SubmissionDoc {
  id: string;
  fieldKey: string;
  originalFilename: string;
  fileUrl: string;
  needsRevision: boolean;
  revisionNote: string | null;
}

interface SubmissionData {
  id: string;
  token: string;
  status: string;
  biodataValues: Record<string, any>;
  warnings: {
    fieldKey: string;
    fieldLabel: string;
    type: string;
    message: string;
    severity: string;
  }[];
  linkDokumenGabungan: string | null;
  submittedAt: string;
  program: {
    id: string;
    nama: string;
    slug: string;
    documentFields: DocumentField[];
  };
  documents: SubmissionDoc[];
}

export default function PerbaikiClient({ submission }: { submission: SubmissionData }) {
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const biodata = submission.biodataValues || {};
  const applicantNameKey = Object.keys(biodata).find((k) => k.toLowerCase().includes('nama'));
  const applicantName = applicantNameKey ? String(biodata[applicantNameKey]) : 'Pendaftar';

  // Ambil daftar fieldKey yang memiliki warning kritis
  const warningMap = new Map<string, string[]>();
  (submission.warnings || []).forEach((w) => {
    if (['missing_document', 'keyword_mismatch', 'expired_document', 'name_mismatch'].includes(w.type)) {
      const existing = warningMap.get(w.fieldKey) || [];
      existing.push(w.message);
      warningMap.set(w.fieldKey, existing);
    }
  });

  const handleFileChange = (fieldKey: string, file: File | null) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Ukuran berkas maksimal 10MB.');
        return;
      }
      setSelectedFiles((prev) => ({ ...prev, [fieldKey]: file }));
    } else {
      setSelectedFiles((prev) => {
        const next = { ...prev };
        delete next[fieldKey];
        return next;
      });
    }
  };

  const handleReuploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (Object.keys(selectedFiles).length === 0) {
      setErrorMsg('Pilih minimal satu file dokumen pengganti sebelum menekan tombol kirim.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('token', submission.token);

      Object.entries(selectedFiles).forEach(([key, file]) => {
        formData.append(`reupload_${key}`, file);
      });

      const res = await fetch('/api/pendaftaran/perbaiki', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal mengunggah berkas perbaikan.');
      }

      setSuccessMsg(json.message);
    } catch (err: any) {
      console.error('[Perbaiki Error]', err);
      setErrorMsg(err.message || 'Terjadi kesalahan sistem saat mengirim berkas.');
    } finally {
      setSubmitting(false);
    }
  };

  if (successMsg) {
    return (
      <div className="min-h-screen bg-gray-50/50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-green-50 text-[#0b6330] rounded-full flex items-center justify-center mx-auto text-3xl">
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Revisi Berhasil Dikirim
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Berkas Telah Diperbarui</h1>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
              {successMsg}
            </p>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/pendaftaran"
              className="py-3 px-6 bg-[#0b6330] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#063A1E] transition-all"
            >
              Kembali ke Halaman Pendaftaran
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* HEADER / BREADCRUMB */}
        <div className="flex items-center justify-between">
          <Link
            href="/pendaftaran"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#0b6330] transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
            <span>Portal Pendaftaran</span>
          </Link>
          <span className="text-[11px] font-bold px-3 py-1 bg-amber-100 text-amber-900 rounded-full uppercase">
            Halaman Perbaikan Berkas
          </span>
        </div>

        {/* INFO PENDAFTAR CARD */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <span className="text-[11px] font-bold text-[#0b6330] uppercase tracking-wider">
                Program: {submission.program.nama}
              </span>
              <h1 className="text-2xl font-black text-gray-900 mt-0.5">
                Perbaikan Berkas: {applicantName}
              </h1>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-gray-400 block">Token Pendaftaran</span>
              <span className="font-mono font-black text-xs text-gray-800 bg-gray-100 px-2.5 py-1 rounded-md">
                {submission.token}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed font-normal">
            Berdasarkan pemeriksaan sistem kami, terdapat beberapa berkas yang memerlukan perbaikan atau unggah ulang. Anda cukup mengunggah berkas yang bertanda peringatan merah di bawah ini tanpa perlu mengisi ulang seluruh form data diri.
          </p>
        </div>

        {/* FORM RE-UPLOAD */}
        <form onSubmit={handleReuploadSubmit} className="space-y-6">

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-start gap-3 shadow-xs">
              <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-3">
              Daftar Berkas Persyaratan
            </h2>

            <div className="space-y-4">
              {submission.program.documentFields.map((docField) => {
                const warnings = warningMap.get(docField.key) || [];
                const isProblematic = warnings.length > 0;
                const existingDoc = submission.documents.find((d) => d.fieldKey === docField.key);
                const selectedFile = selectedFiles[docField.key];

                return (
                  <div
                    key={docField.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isProblematic
                        ? 'border-amber-300 bg-amber-50/40'
                        : selectedFile
                        ? 'border-green-300 bg-green-50/20'
                        : 'border-gray-200 bg-gray-50/30'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-bold text-gray-900">
                            {docField.label}
                          </label>
                          {isProblematic && (
                            <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                              Perlu Diperbaiki
                            </span>
                          )}
                          {!isProblematic && existingDoc && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Sudah Valid
                            </span>
                          )}
                        </div>

                        {/* Tampilkan pesan warning jika ada */}
                        {warnings.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {warnings.map((msg, idx) => (
                              <p key={idx} className="text-xs text-amber-900 font-semibold flex items-center gap-1.5">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="w-3 h-3 text-amber-600 shrink-0" />
                                <span>{msg}</span>
                              </p>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* File Info Eksisting */}
                      {existingDoc && (
                        <span className="text-xs text-gray-500 font-medium shrink-0 flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faFileAlt} className="w-3 h-3 text-gray-400" />
                          <span className="truncate max-w-[150px]">{existingDoc.originalFilename}</span>
                        </span>
                      )}
                    </div>

                    {/* Upload Baru */}
                    <div className="flex items-center gap-3 pt-2">
                      <label className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:border-[#0b6330] text-gray-700 hover:text-[#0b6330] font-bold text-xs rounded-xl shadow-2xs cursor-pointer transition-all">
                        <FontAwesomeIcon icon={faUpload} className="w-3.5 h-3.5 text-[#0b6330]" />
                        <span>{selectedFile ? 'Ganti Berkas Baru' : 'Unggah File Pengganti'}</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            handleFileChange(docField.key, e.target.files?.[0] || null)
                          }
                          className="hidden"
                        />
                      </label>

                      {selectedFile ? (
                        <div className="flex-1 min-w-0 flex items-center gap-2 text-xs text-[#0b6330] font-bold">
                          <FontAwesomeIcon icon={faCheck} className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{selectedFile.name}</span>
                          <span className="text-gray-400 font-normal shrink-0 text-[11px]">
                            ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          {isProblematic ? 'Pilih file scan baru yang jelas & sesuai' : 'Tidak perlu diubah bila sudah benar'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
              <span className="text-xs text-gray-500">
                Berkas yang diunggah ulang akan otomatis diverifikasi kembali oleh sistem.
              </span>
              <button
                type="submit"
                disabled={submitting}
                className="py-3.5 px-8 bg-[#0b6330] hover:bg-[#063A1E] text-white font-bold text-xs rounded-xl shadow-md transition-all duration-200 disabled:opacity-50 cursor-pointer inline-flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Menyimpan Perbaikan...</span>
                  </>
                ) : (
                  <>
                    <span>Simpan Perbaikan Berkas</span>
                    <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
