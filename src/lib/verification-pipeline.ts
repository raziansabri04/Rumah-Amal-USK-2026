import { closest, distance } from 'fastest-levenshtein';
import { PDFDocument } from 'pdf-lib';
import Tesseract from 'tesseract.js';

export interface VerificationWarning {
  fieldKey: string;
  fieldLabel: string;
  type: 'missing_document' | 'keyword_mismatch' | 'expired_document' | 'name_mismatch' | 'ocr_failed' | 'needs_manual_check';
  message: string;
  severity: 'warning' | 'info';
}

/**
 * 1. Pengecekan Kata Kunci Dokumen
 */
export function checkExpectedKeywords(
  ocrText: string,
  expectedKeywords: string[]
): { matches: boolean; foundKeywords: string[] } {
  if (!expectedKeywords || expectedKeywords.length === 0) {
    return { matches: true, foundKeywords: [] };
  }

  const normalizedOcr = ocrText.toLowerCase();
  const foundKeywords = expectedKeywords.filter((kw) =>
    normalizedOcr.includes(kw.toLowerCase().trim())
  );

  return {
    matches: foundKeywords.length > 0,
    foundKeywords,
  };
}

/**
 * 2. Ekstraksi dan Pengecekan Masa Berlaku Dokumen (maxAgeMonths)
 * Mencari pola tanggal: "12 Maret 2026", "12/03/2026", "12-03-2026", "2026-03-12"
 * Dibandingkan dengan submittedAt (BUKAN waktu worker berjalan)
 */
export function checkDocumentMaxAge(
  ocrText: string,
  submittedAt: Date,
  maxAgeMonths: number
): { valid: boolean; detectedDateStr?: string; diffMonths?: number; reason?: string } {
  // Mapping nama bulan Indonesia
  const monthMap: Record<string, number> = {
    januari: 0, jan: 0,
    februari: 1, feb: 1,
    maret: 2, mar: 2,
    april: 3, apr: 3,
    mei: 4, may: 4,
    juni: 5, jun: 5,
    juli: 6, jul: 6,
    agustus: 7, agu: 7, agt: 7, aug: 7,
    september: 8, sep: 8, sept: 8,
    oktober: 9, okt: 9, oct: 9,
    november: 10, nov: 10,
    desember: 11, des: 11, dec: 11,
  };

  const datesFound: Date[] = [];
  const rawMatches: string[] = [];

  // Pola 1: "12 Maret 2026" / "12-Maret-2026"
  const patternWordMonth = /(\b\d{1,2}\b)\s*[-/ ]\s*([a-zA-Z]{3,10})\s*[-/ ]\s*(\b20\d{2}\b)/gi;
  let match;
  while ((match = patternWordMonth.exec(ocrText)) !== null) {
    const day = parseInt(match[1], 10);
    const monthName = match[2].toLowerCase();
    const year = parseInt(match[3], 10);

    if (monthMap[monthName] !== undefined && day >= 1 && day <= 31) {
      datesFound.push(new Date(year, monthMap[monthName], day));
      rawMatches.push(match[0]);
    }
  }

  // Pola 2: "12/03/2026" atau "12-03-2026"
  const patternNumeric = /(\b\d{1,2}\b)[/-](\b\d{1,2}\b)[/-](\b20\d{2}\b)/g;
  while ((match = patternNumeric.exec(ocrText)) !== null) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const year = parseInt(match[3], 10);

    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      datesFound.push(new Date(year, month, day));
      rawMatches.push(match[0]);
    }
  }

  if (datesFound.length === 0) {
    return {
      valid: false,
      reason: 'Tanggal pembuatan dokumen tidak dapat dibaca dari teks OCR.',
    };
  }

  // Ambil tanggal paling baru di dalam surat
  datesFound.sort((a, b) => b.getTime() - a.getTime());
  const latestDate = datesFound[0];

  // Hitung selisih bulan dari submittedAt
  const diffTime = submittedAt.getTime() - latestDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const diffMonths = Math.round((diffDays / 30.44) * 10) / 10;

  if (diffMonths > maxAgeMonths) {
    return {
      valid: false,
      detectedDateStr: latestDate.toLocaleDateString('id-ID'),
      diffMonths,
      reason: `Dokumen terbit pada ${latestDate.toLocaleDateString('id-ID')} (${diffMonths} bulan lalu), melebihi batas ${maxAgeMonths} bulan.`,
    };
  }

  return {
    valid: true,
    detectedDateStr: latestDate.toLocaleDateString('id-ID'),
    diffMonths,
  };
}

/**
 * 3. Pengecekan Kecocokan Nama Pendaftar (Fuzzy Matching)
 * Menggunakan fastest-levenshtein untuk toleransi salah baca OCR
 */
export function checkApplicantNameMatch(
  ocrText: string,
  applicantName: string
): { matches: boolean; similarityScore: number; bestMatchCandidate?: string } {
  if (!applicantName || !applicantName.trim()) {
    return { matches: true, similarityScore: 1 };
  }

  const cleanTarget = applicantName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const targetWords = cleanTarget.split(/\s+/).filter((w) => w.length > 2);

  if (targetWords.length === 0) {
    return { matches: true, similarityScore: 1 };
  }

  // Bersihkan teks OCR per baris & token kata
  const lines = ocrText
    .toLowerCase()
    .split('\n')
    .map((l) => l.replace(/[^a-z0-9\s]/g, ' ').trim())
    .filter(Boolean);

  let bestRatio = 0;
  let candidateFound = '';

  // 1. Cek string exact substring atau baris kemiripan
  for (const line of lines) {
    if (line.includes(cleanTarget)) {
      return { matches: true, similarityScore: 1.0, bestMatchCandidate: line };
    }

    // Levenshtein ratio: 1 - (dist / max(len1, len2))
    const dist = distance(cleanTarget, line);
    const maxLen = Math.max(cleanTarget.length, line.length);
    const ratio = maxLen > 0 ? (maxLen - dist) / maxLen : 0;

    if (ratio > bestRatio) {
      bestRatio = ratio;
      candidateFound = line;
    }
  }

  // 2. Cek kecocokan per kata kunci nama (misal nama 3 kata, min 2 kata ditemukan)
  let wordMatches = 0;
  for (const word of targetWords) {
    if (ocrText.toLowerCase().includes(word)) {
      wordMatches++;
    }
  }

  const wordMatchRatio = wordMatches / targetWords.length;

  // Ambang batas toleransi: kata cocok >= 60% ATAU ratio baris >= 0.70
  const matches = wordMatchRatio >= 0.6 || bestRatio >= 0.7;

  return {
    matches,
    similarityScore: Math.max(bestRatio, wordMatchRatio),
    bestMatchCandidate: candidateFound,
  };
}

/**
 * 4. Eksekusi OCR pada Buffer Berkas (Gambar / Halaman)
 */
export async function runOcrOnBuffer(buffer: Buffer, mimeType: string): Promise<string> {
  // Hanya proses OCR jika tipe gambar (PNG, JPG, WEBP)
  // Catatan: Jika PDF, pdf-lib menggabungkan langsung ke dokumen akhir
  if (!mimeType.startsWith('image/')) {
    return '';
  }

  try {
    const result = await Tesseract.recognize(buffer, 'ind+eng', {
      logger: () => {},
    });
    return result.data.text || '';
  } catch (err) {
    console.error('[Tesseract OCR Error]', err);
    return '';
  }
}

/**
 * 5. Gabungkan Seluruh Dokumen Menjadi Satu File PDF Utuh
 */
export async function mergeDocumentsToSinglePdf(
  files: { buffer: Buffer; mimeType: string; filename: string }[]
): Promise<Buffer> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    try {
      if (file.mimeType === 'application/pdf' || file.filename.toLowerCase().endsWith('.pdf')) {
        const doc = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } else if (
        file.mimeType.startsWith('image/') ||
        ['.jpg', '.jpeg', '.png'].some((ext) => file.filename.toLowerCase().endsWith(ext))
      ) {
        let image;
        if (file.filename.toLowerCase().endsWith('.png') || file.mimeType === 'image/png') {
          image = await mergedPdf.embedPng(file.buffer);
        } else {
          image = await mergedPdf.embedJpg(file.buffer);
        }

        // Buat halaman seukuran gambar atau proporsional A4
        const page = mergedPdf.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }
    } catch (docErr) {
      console.error(`[Error merging page: ${file.filename}]`, docErr);
    }
  }

  const mergedBytes = await mergedPdf.save();
  return Buffer.from(mergedBytes);
}
