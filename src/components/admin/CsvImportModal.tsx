'use client';

import { useCallback, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileArrowUp,
  faDownload,
  faCheckCircle,
  faExclamationTriangle,
  faTimesCircle,
  faSpinner,
  faXmark,
  faTableList,
  faCloudArrowUp,
} from '@fortawesome/free-solid-svg-icons';

/* ────────────────────────────────────────────────────────── */
/* Types                                                     */
/* ────────────────────────────────────────────────────────── */
export interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** Judul modal, misal "Import Data Muzakki" */
  title: string;
  /** Endpoint API yang menerima POST { rows: [...] } */
  endpoint: string;
  /** Kolom wajib di CSV */
  requiredColumns: string[];
  /** Kolom opsional di CSV */
  optionalColumns?: string[];
  /** Baris-baris contoh untuk template download (tanpa header) */
  templateRows?: string[][];
}

interface ImportResult {
  inserted: number;
  updated?: number;
  errors: { row: number; nip: string; message: string }[];
}

type Step = 'upload' | 'preview' | 'importing' | 'result';

/* ────────────────────────────────────────────────────────── */
/* CSV Parser (tidak perlu library external)                  */
/* ────────────────────────────────────────────────────────── */
function parseCsv(text: string): { headers: string[]; rows: Record<string, string>[] } {
  // Deteksi delimiter: koma atau titik-koma
  const firstLine = text.split('\n')[0] || '';
  const delimiter = firstLine.includes(';') ? ';' : ',';

  const lines = text
    .split('\n')
    .map((l) => l.replace(/\r$/, ''))
    .filter((l) => l.trim() !== '');

  if (lines.length < 1) return { headers: [], rows: [] };

  // Parse satu baris CSV (handle quoted values)
  function parseLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  }

  const headers = parseLine(lines[0]).map((h) => h.toLowerCase().trim().replace(/\s+/g, '_'));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? '';
    });
    rows.push(row);
  }

  return { headers, rows };
}

/* ────────────────────────────────────────────────────────── */
/* Component                                                  */
/* ────────────────────────────────────────────────────────── */
export default function CsvImportModal({
  isOpen,
  onClose,
  onSuccess,
  title,
  endpoint,
  requiredColumns,
  optionalColumns = [],
  templateRows = [],
}: CsvImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>('upload');
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<Record<string, string>[]>([]);
  const [allRows, setAllRows] = useState<Record<string, string>[]>([]);
  const [missingCols, setMissingCols] = useState<string[]>([]);
  const [unknownCols, setUnknownCols] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState('');

  const allKnownCols = [...requiredColumns, ...optionalColumns];

  function resetState() {
    setStep('upload');
    setFileName('');
    setHeaders([]);
    setPreviewRows([]);
    setAllRows([]);
    setMissingCols([]);
    setUnknownCols([]);
    setProgress(0);
    setResult(null);
    setImportError('');
  }

  function handleClose() {
    resetState();
    onClose();
  }

  function processFile(file: File) {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Hanya file .csv yang diperbolehkan');
      return;
    }
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers: hdrs, rows } = parseCsv(text);

      const missing = requiredColumns.filter((c) => !hdrs.includes(c));
      const unknown = hdrs.filter((h) => !allKnownCols.includes(h));

      setHeaders(hdrs);
      setMissingCols(missing);
      setUnknownCols(unknown);
      setAllRows(rows);
      setPreviewRows(rows.slice(0, 5));
      setStep('preview');
    };
    reader.readAsText(file, 'UTF-8');
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  async function handleImport() {
    if (missingCols.length > 0) return;
    setStep('importing');
    setProgress(0);

    const CHUNK = 100;
    let totalInserted = 0;
    let totalUpdated = 0;
    const totalErrors: ImportResult['errors'] = [];

    try {
      for (let i = 0; i < allRows.length; i += CHUNK) {
        const chunk = allRows.slice(i, i + CHUNK);
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rows: chunk }),
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error || `Server error ${res.status}`);
        }

        const data: ImportResult = await res.json();
        totalInserted += data.inserted || 0;
        totalUpdated += data.updated || 0;
        totalErrors.push(...(data.errors || []));

        setProgress(Math.round(((i + chunk.length) / allRows.length) * 100));
      }

      setResult({ inserted: totalInserted, updated: totalUpdated, errors: totalErrors });
      setStep('result');

      if (totalInserted > 0 || totalUpdated > 0) {
        onSuccess();
      }
    } catch (err: unknown) {
      setImportError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga');
      setStep('result');
    }
  }

  function downloadTemplate() {
    const allCols = [...requiredColumns, ...optionalColumns];
    const header = allCols.join(',');
    const rows = templateRows.map((r) => r.join(',')).join('\n');
    const csv = rows ? `${header}\n${rows}` : header;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template_${title.toLowerCase().replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#063A1E] to-[#0a5a30] shrink-0">
          <div className="flex items-center gap-2.5">
            <FontAwesomeIcon icon={faCloudArrowUp} className="text-white/80 w-4 h-4" />
            <h3 className="font-bold text-sm text-white">{title}</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white transition-colors cursor-pointer w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10"
          >
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {(['upload', 'preview', 'importing', 'result'] as Step[]).map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                {i > 0 && <span className="text-gray-300">›</span>}
                <span
                  className={
                    step === s
                      ? 'text-[#063A1E]'
                      : ['upload', 'preview', 'importing', 'result'].indexOf(step) > i
                      ? 'text-emerald-600'
                      : ''
                  }
                >
                  {s === 'upload' ? '1. Upload' : s === 'preview' ? '2. Preview' : s === 'importing' ? '3. Proses' : '4. Hasil'}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* ── STEP: Upload ── */}
          {step === 'upload' && (
            <div className="space-y-4">
              {/* Template Download */}
              <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-emerald-800">Butuh template CSV?</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">
                    Kolom wajib: <span className="font-mono">{requiredColumns.join(', ')}</span>
                  </p>
                  {optionalColumns.length > 0 && (
                    <p className="text-[10px] text-emerald-500 mt-0.5">
                      Opsional: <span className="font-mono">{optionalColumns.join(', ')}</span>
                    </p>
                  )}
                </div>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-[10px] font-bold transition-colors cursor-pointer shrink-0 ml-3"
                >
                  <FontAwesomeIcon icon={faDownload} className="w-3 h-3" />
                  Download
                </button>
              </div>

              {/* Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                  dragging
                    ? 'border-[#063A1E] bg-emerald-50 scale-[1.01]'
                    : 'border-gray-300 hover:border-[#063A1E] hover:bg-gray-50'
                }`}
              >
                <FontAwesomeIcon
                  icon={faFileArrowUp}
                  className={`w-10 h-10 mb-3 mx-auto transition-colors ${dragging ? 'text-[#063A1E]' : 'text-gray-300'}`}
                />
                <p className="text-sm font-bold text-gray-600">
                  {dragging ? 'Lepaskan file di sini' : 'Klik atau drag & drop file CSV'}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">Hanya file .csv • Urutan kolom bebas • Maks. baris tidak dibatasi</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          )}

          {/* ── STEP: Preview ── */}
          {step === 'preview' && (
            <div className="space-y-4">
              {/* File info */}
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faTableList} className="text-blue-600 w-4 h-4" />
                  <div>
                    <p className="text-xs font-bold text-blue-800">{fileName}</p>
                    <p className="text-[10px] text-blue-600">{allRows.length.toLocaleString('id-ID')} baris data akan diimport</p>
                  </div>
                </div>
                <button
                  onClick={() => { setStep('upload'); setFileName(''); }}
                  className="text-[10px] text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                >
                  Ganti file
                </button>
              </div>

              {/* Missing columns warning */}
              {missingCols.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                  <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-red-700">Kolom wajib tidak ditemukan di CSV:</p>
                    <p className="text-[10px] text-red-600 font-mono mt-0.5">{missingCols.join(', ')}</p>
                    <p className="text-[10px] text-red-500 mt-1">Perbaiki header CSV dan upload ulang.</p>
                  </div>
                </div>
              )}

              {/* Unknown columns info */}
              {unknownCols.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500 w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-amber-700">Kolom tidak dikenal (akan diabaikan):</p>
                    <p className="text-[10px] text-amber-600 font-mono mt-0.5">{unknownCols.join(', ')}</p>
                  </div>
                </div>
              )}

              {/* Preview table */}
              {previewRows.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Preview 5 baris pertama:
                  </p>
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-[10px]">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          {headers.map((h) => (
                            <th
                              key={h}
                              className={`py-2 px-3 text-left font-bold ${
                                requiredColumns.includes(h)
                                  ? 'text-[#063A1E]'
                                  : unknownCols.includes(h)
                                  ? 'text-gray-400'
                                  : 'text-gray-600'
                              }`}
                            >
                              {h}
                              {requiredColumns.includes(h) && <span className="text-red-400 ml-0.5">*</span>}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {previewRows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            {headers.map((h) => (
                              <td key={h} className="py-2 px-3 text-gray-700 max-w-[120px] truncate" title={row[h]}>
                                {row[h] || <span className="text-gray-300 italic">kosong</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {allRows.length > 5 && (
                    <p className="text-[10px] text-gray-400 mt-1.5 text-center">
                      + {(allRows.length - 5).toLocaleString('id-ID')} baris lainnya tidak ditampilkan
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── STEP: Importing ── */}
          {step === 'importing' && (
            <div className="flex flex-col items-center justify-center py-12 gap-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-gray-100 border-t-[#063A1E] animate-spin" />
                <FontAwesomeIcon icon={faSpinner} className="absolute inset-0 m-auto text-[#063A1E] w-6 h-6 opacity-0" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-800">Sedang mengimport data...</p>
                <p className="text-xs text-gray-500 mt-1">
                  {allRows.length.toLocaleString('id-ID')} baris diproses dalam batch 100
                </p>
              </div>
              <div className="w-full max-w-xs">
                <div className="flex justify-between text-[10px] text-gray-500 mb-1.5 font-bold">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#063A1E] to-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP: Result ── */}
          {step === 'result' && (
            <div className="space-y-4">
              {importError ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-red-700">Import Gagal</p>
                    <p className="text-xs text-red-600 mt-1">{importError}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Summary cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 w-5 h-5 mb-1.5 mx-auto" />
                      <p className="text-xl font-black text-emerald-700">{result?.inserted ?? 0}</p>
                      <p className="text-[10px] text-emerald-600 font-bold">Baru Ditambahkan</p>
                    </div>
                    {result?.updated !== undefined && (
                      <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-center">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 w-5 h-5 mb-1.5 mx-auto" />
                        <p className="text-xl font-black text-blue-700">{result.updated}</p>
                        <p className="text-[10px] text-blue-600 font-bold">Diperbarui</p>
                      </div>
                    )}
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-center">
                      <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 w-5 h-5 mb-1.5 mx-auto" />
                      <p className="text-xl font-black text-red-700">{result?.errors?.length ?? 0}</p>
                      <p className="text-[10px] text-red-600 font-bold">Baris Gagal</p>
                    </div>
                  </div>

                  {/* Error list */}
                  {result && result.errors.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Detail baris yang gagal:
                      </p>
                      <div className="max-h-48 overflow-y-auto rounded-xl border border-red-100 divide-y divide-red-50">
                        {result.errors.map((err, i) => (
                          <div key={i} className="flex items-start gap-3 px-3.5 py-2.5 text-[10px]">
                            <span className="bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded font-mono shrink-0">
                              Baris {err.row}
                            </span>
                            <span className="font-mono text-gray-500 shrink-0">NIP: {err.nip}</span>
                            <span className="text-red-600">{err.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between shrink-0 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            {step === 'result' ? 'Tutup' : 'Batal'}
          </button>

          <div className="flex items-center gap-2">
            {step === 'preview' && (
              <>
                <button
                  onClick={() => setStep('upload')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  ← Kembali
                </button>
                <button
                  onClick={handleImport}
                  disabled={missingCols.length > 0}
                  className="px-5 py-2 bg-[#063A1E] hover:bg-[#042814] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faCloudArrowUp} className="w-3.5 h-3.5" />
                  Import {allRows.length.toLocaleString('id-ID')} Baris
                </button>
              </>
            )}

            {step === 'result' && !importError && (
              <button
                onClick={() => { resetState(); }}
                className="px-5 py-2 bg-[#063A1E] hover:bg-[#042814] text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                Import File Lain
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
