'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faCalendarAlt,
  faFolderOpen,
  faUpload,
  faCheckCircle,
  faExclamationTriangle,
  faArrowLeft,
  faFilePdf,
  faCheck,
  faCopy,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

interface DocumentField {
  id: string;
  key: string;
  label: string;
  required: boolean;
  maxAgeMonths: number | null;
  nameCheckApplicable: boolean;
  isSingleCombinedUpload: boolean;
  needsStampCheck: boolean;
}

interface BiodataField {
  id: string;
  key: string;
  label: string;
  tipe: string; // text | number | select | date | textarea | radio
  options: string[];
  required: boolean;
}

interface ProgramData {
  id: string;
  nama: string;
  slug: string;
  deskripsi: string | null;
  gambarUrl: string | null;
  status: string;
  tanggalBuka: Date | string | null;
  tanggalTutup: Date | string | null;
  linkDriveTemplate: string | null;
  documentFields: DocumentField[];
  biodataFields: BiodataField[];
}

export default function FormPendaftaranClient({ program }: { program: ProgramData }) {
  // State Biodata
  const [biodataValues, setBiodataValues] = useState<Record<string, string>>({});
  // State File uploads (key -> File)
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});
  // State Client validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [aggreement, setAggreement] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    token: string;
    message: string;
    submittedAt: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const isClosed = program.status !== 'dibuka';
  const now = new Date();
  const isPastDue = program.tanggalTutup ? now > new Date(program.tanggalTutup) : false;

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Tidak ditentukan';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleBiodataChange = (key: string, value: string) => {
    setBiodataValues((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[`biodata_${key}`]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[`biodata_${key}`];
        return next;
      });
    }
  };

  const handleFileChange = (key: string, file: File | null) => {
    if (file) {
      // Validasi ukuran maks 10MB
      if (file.size > 10 * 1024 * 1024) {
        setFieldErrors((prev) => ({
          ...prev,
          [`doc_${key}`]: 'Ukuran berkas maksimal 10MB.',
        }));
        return;
      }

      setSelectedFiles((prev) => ({ ...prev, [key]: file }));
      if (fieldErrors[`doc_${key}`]) {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next[`doc_${key}`];
          return next;
        });
      }
    } else {
      setSelectedFiles((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleCopyToken = () => {
    if (!submissionSuccess?.token) return;
    navigator.clipboard.writeText(submissionSuccess.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    // 1. Validasi Client Side
    const errors: Record<string, string> = {};

    // Validasi Biodata
    program.biodataFields.forEach((field) => {
      const val = (biodataValues[field.key] || '').trim();
      if (field.required && !val) {
        errors[`biodata_${field.key}`] = `${field.label} wajib diisi.`;
      }
    });

    // Validasi Dokumen
    program.documentFields.forEach((docField) => {
      const file = selectedFiles[docField.key];
      if (docField.required && !file) {
        errors[`doc_${docField.key}`] = `Berkas ${docField.label} wajib diunggah.`;
      }
    });

    if (!aggreement) {
      errors.agreement = 'Anda wajib mencentang pernyataan kebenaran data.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSubmitError('Harap lengkapi semua isian dan berkas yang wajib sebelum mengirim formulir.');
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }

    // 2. Siapkan FormData
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('programId', program.id);

      Object.entries(biodataValues).forEach(([k, v]) => {
        data.append(`biodata_${k}`, v);
      });

      Object.entries(selectedFiles).forEach(([k, file]) => {
        data.append(`doc_${k}`, file);
      });

      const res = await fetch('/api/pendaftaran/submit', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal mengirim formulir pendaftaran.');
      }

      setSubmissionSuccess({
        token: json.token,
        message: json.message,
        submittedAt: json.submittedAt,
      });

      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch (err: any) {
      console.error('[Submit Error]', err);
      setSubmitError(err.message || 'Terjadi kesalahan sistem saat mengirim formulir.');
    } finally {
      setSubmitting(false);
    }
  };

  // TAMPILAN SUKSES PENDAFTARAN
  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-gray-50/60 py-16 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-green-50 text-[#0b6330] rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Pendaftaran Berhasil Dikirim
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Terima Kasih, Berkas Diterima!
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md mx-auto font-normal">
              {submissionSuccess.message}
            </p>
          </div>

          {/* TOKEN CARD */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Token Verifikasi Anda:
              </span>
              <button
                type="button"
                onClick={handleCopyToken}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b6330] hover:text-[#063A1E] cursor-pointer"
              >
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                <span>{copied ? 'Tersalin!' : 'Salin Token'}</span>
              </button>
            </div>
            <div className="font-mono text-sm sm:text-base font-black text-gray-900 bg-white p-3 rounded-xl border border-amber-200 select-all break-all">
              {submissionSuccess.token}
            </div>
            <p className="text-[11px] text-amber-800 leading-tight">
              ⚠️ Simpan atau catat token ini. Jika ada dokumen yang memerlukan revisi, Anda dapat mengakses form perbaikan menggunakan token ini.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/pendaftaran"
              className="w-full sm:w-auto py-3 px-6 bg-[#0b6330] hover:bg-[#063A1E] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Kembali ke Katalog Program
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Halaman Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // TAMPILAN PROGRAM DITUTUP
  if (isClosed || isPastDue) {
    return (
      <div className="min-h-screen bg-gray-50/60 py-16 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-lg p-8 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-900">Pendaftaran Ditutup</h1>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
              Mohon maaf, pendaftaran untuk program <strong>{program.nama}</strong> saat ini sedang tidak menerima pengajuan berkas baru atau masa pendaftaran telah berakhir pada {formatDate(program.tanggalTutup)}.
            </p>
          </div>
          <div className="pt-4">
            <Link
              href="/pendaftaran"
              className="inline-flex items-center gap-2 py-3 px-6 bg-[#0b6330] text-white font-bold text-xs rounded-xl hover:bg-[#063A1E] transition-all"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" />
              <span>Lihat Program Terbuka Lainnya</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* BREADCRUMB & BACK */}
        <div className="flex items-center justify-between">
          <Link
            href="/pendaftaran"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#0b6330] transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
            <span>Kembali ke Katalog Program</span>
          </Link>
          <span className="text-[11px] font-bold px-3 py-1 bg-green-100 text-[#0b6330] rounded-full uppercase">
            Pendaftaran Resmi
          </span>
        </div>

        {/* PROGRAM BANNER CARD */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8 space-y-5">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Formulir Pendaftaran {program.nama}
            </h1>
            {program.deskripsi && (
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                {program.deskripsi}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 text-xs">
            <div className="flex items-center gap-2 text-gray-500 font-medium">
              <FontAwesomeIcon icon={faCalendarAlt} className="w-3.5 h-3.5 text-[#0b6330]" />
              <span>Batas Pendaftaran:</span>
              <strong className="text-gray-800">{formatDate(program.tanggalTutup)}</strong>
            </div>

            {/* Tombol Unduh Template Dokumen */}
            {program.linkDriveTemplate && (
              <a
                href={program.linkDriveTemplate}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 font-bold rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                <FontAwesomeIcon icon={faFolderOpen} className="w-3.5 h-3.5 text-amber-600" />
                <span>Unduh Template Dokumen Resmi (Google Drive)</span>
              </a>
            )}
          </div>
        </div>

        {/* FORM PENDAFTARAN */}
        <form onSubmit={handleSubmit} noValidate className="space-y-8">

          {/* ERROR GLOBAL NOTIFICATION */}
          {submitError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-start gap-3 shadow-xs">
              <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>{submitError}</div>
            </div>
          )}

          {/* BAGIAN 1: DATA DIRI (BIODATA DINAMIS) */}
          {program.biodataFields.length > 0 && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8 space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-green-50 text-[#0b6330] flex items-center justify-center text-xs font-black">
                    1
                  </span>
                  <span>Data Diri & Identitas Pendaftar</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1 ml-9">
                  Isikan informasi biodata Anda dengan data yang valid dan dapat dipertanggungjawabkan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {program.biodataFields.map((field) => {
                  const error = fieldErrors[`biodata_${field.key}`];
                  const value = biodataValues[field.key] || '';
                  const isFullWidth = ['textarea', 'radio'].includes(field.tipe);

                  return (
                    <div
                      key={field.id}
                      className={isFullWidth ? 'sm:col-span-2 space-y-1.5' : 'space-y-1.5'}
                    >
                      <label className="block text-xs font-bold text-gray-700">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>

                      {/* Tipe Text / Number / Date */}
                      {['text', 'number', 'date'].includes(field.tipe) && (
                        <input
                          type={field.tipe}
                          value={value}
                          onChange={(e) => handleBiodataChange(field.key, e.target.value)}
                          placeholder={`Masukkan ${field.label.toLowerCase()}...`}
                          className={`w-full px-3.5 py-2.5 bg-white border ${
                            error ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-200'
                          } rounded-xl text-xs font-medium focus:outline-none focus:border-[#0b6330] focus:ring-1 focus:ring-[#0b6330] transition-all`}
                        />
                      )}

                      {/* Tipe Textarea */}
                      {field.tipe === 'textarea' && (
                        <textarea
                          rows={3}
                          value={value}
                          onChange={(e) => handleBiodataChange(field.key, e.target.value)}
                          placeholder={`Tuliskan ${field.label.toLowerCase()} secara lengkap...`}
                          className={`w-full px-3.5 py-2.5 bg-white border ${
                            error ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-200'
                          } rounded-xl text-xs font-medium focus:outline-none focus:border-[#0b6330] focus:ring-1 focus:ring-[#0b6330] transition-all`}
                        />
                      )}

                      {/* Tipe Select */}
                      {field.tipe === 'select' && (
                        <select
                          value={value}
                          onChange={(e) => handleBiodataChange(field.key, e.target.value)}
                          className={`w-full px-3.5 py-2.5 bg-white border ${
                            error ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-200'
                          } rounded-xl text-xs font-medium focus:outline-none focus:border-[#0b6330] focus:ring-1 focus:ring-[#0b6330] transition-all cursor-pointer`}
                        >
                          <option value="">-- Pilih salah satu --</option>
                          {field.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {/* Tipe Radio */}
                      {field.tipe === 'radio' && (
                        <div className="flex flex-wrap gap-4 pt-1">
                          {field.options.map((opt) => (
                            <label
                              key={opt}
                              className="inline-flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name={`radio_${field.key}`}
                                value={opt}
                                checked={value === opt}
                                onChange={(e) => handleBiodataChange(field.key, e.target.value)}
                                className="text-[#0b6330] focus:ring-[#0b6330] cursor-pointer"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {error && <p className="text-[11px] text-red-500 font-semibold">{error}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* BAGIAN 2: BERKAS PERSYARATAN (DOCUMENT FIELDS) */}
          {program.documentFields.length > 0 && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8 space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  <span>Unggah Berkas Persyaratan</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1 ml-9">
                  Format berkas yang diterima: PDF, JPG, atau PNG (Maksimal 10MB per berkas).
                </p>
              </div>

              <div className="space-y-5">
                {program.documentFields.map((docField) => {
                  const error = fieldErrors[`doc_${docField.key}`];
                  const file = selectedFiles[docField.key];

                  return (
                    <div
                      key={docField.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        error
                          ? 'border-red-200 bg-red-50/40'
                          : file
                          ? 'border-green-200 bg-green-50/20'
                          : 'border-gray-200 bg-gray-50/40'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-900">
                            {docField.label}
                            {docField.required ? (
                              <span className="text-red-500 ml-1">*</span>
                            ) : (
                              <span className="text-gray-400 font-normal ml-1.5">(Opsional)</span>
                            )}
                          </label>

                          {/* Notes/Hints */}
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {docField.maxAgeMonths && (
                              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                                Berlaku maks {docField.maxAgeMonths} bulan
                              </span>
                            )}
                            {docField.nameCheckApplicable && (
                              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                                Nama harus sesuai pendaftar
                              </span>
                            )}
                            {docField.isSingleCombinedUpload && (
                              <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/60">
                                Gabungkan foto jadi 1 file sebelum diunggah
                              </span>
                            )}
                          </div>
                        </div>

                        {/* File Status Tag */}
                        {file && (
                          <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-100 text-[#0b6330] font-bold text-xs">
                            <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                            <span>Siap Diunggah</span>
                          </span>
                        )}
                      </div>

                      {/* Upload Control */}
                      <div className="flex items-center gap-3">
                        <label className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:border-[#0b6330] text-gray-700 hover:text-[#0b6330] font-bold text-xs rounded-xl shadow-2xs cursor-pointer transition-all">
                          <FontAwesomeIcon icon={faUpload} className="w-3.5 h-3.5 text-[#0b6330]" />
                          <span>{file ? 'Ganti File' : 'Pilih File'}</span>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) =>
                              handleFileChange(docField.key, e.target.files?.[0] || null)
                            }
                            className="hidden"
                          />
                        </label>

                        {file ? (
                          <div className="flex-1 min-w-0 flex items-center gap-2 text-xs text-gray-700 font-medium">
                            <FontAwesomeIcon icon={faFilePdf} className="w-4 h-4 text-red-500 shrink-0" />
                            <span className="truncate">{file.name}</span>
                            <span className="text-gray-400 shrink-0 text-[11px]">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Belum ada file dipilih</span>
                        )}
                      </div>

                      {error && <p className="text-[11px] text-red-500 font-semibold mt-2">{error}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* BAGIAN 3: PERNYATAAN & SUBMIT */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8 space-y-6">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aggreement}
                  onChange={(e) => {
                    setAggreement(e.target.checked);
                    if (fieldErrors.agreement) {
                      setFieldErrors((prev) => {
                        const next = { ...prev };
                        delete next.agreement;
                        return next;
                      });
                    }
                  }}
                  className="mt-1 w-4 h-4 text-[#0b6330] rounded border-gray-300 focus:ring-[#0b6330] cursor-pointer"
                />
                <span className="text-xs text-gray-700 leading-relaxed">
                  Saya menyatakan dengan sesungguhnya bahwa seluruh data dan dokumen yang saya unggah adalah <strong>benar, sah, dan dapat dipertanggungjawabkan</strong>. Apabila di kemudian hari ditemukan pemalsuan atau ketidaksesuaian data, saya bersedia menerima sanksi pembatalan sesuai ketentuan Rumah Amal USK.
                </span>
              </label>

              {fieldErrors.agreement && (
                <p className="text-[11px] text-red-600 font-bold">{fieldErrors.agreement}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-gray-500 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 w-3.5 h-3.5" />
                <span>Pastikan koneksi internet stabil sebelum menekan tombol kirim.</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 bg-[#0b6330] hover:bg-[#063A1E] text-white font-bold text-sm rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Mengirim Formulir & Berkas...</span>
                  </>
                ) : (
                  <>
                    <span>Kirim Pendaftaran Sekarang</span>
                    <FontAwesomeIcon icon={faCheck} className="w-3.5 h-3.5" />
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
