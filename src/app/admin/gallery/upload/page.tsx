'use client';

import { useRef, useState, useCallback } from 'react';

interface UploadedImage {
  imageUrl: string;
  name: string;
  preview: string;
}

interface UploadResult {
  uploaded: { imageUrl: string }[];
  errors: string[];
}

const MAX_WIDTH = 1600;          // px — resolusi maksimum
const QUALITY = 0.99;            // kualitas WebP untuk file yang dikonversi
const RESIZE_THRESHOLD = 1_000_000; // hanya resize jika > 1 MB

function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas tidak didukung')); return; }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error(`Gagal konversi ${file.name} ke WebP`));
        },
        'image/webp',
        QUALITY
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Gagal memuat gambar: ${file.name}`));
    };
    img.src = url;
  });
}

export default function GalleryUploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<UploadedImage[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/'));
    const newPreviews = arr.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }, []);

  const removePreview = (idx: number) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleUpload = async () => {
    if (previews.length === 0) return;
    setUploading(true);
    setErrors([]);

    const resizeErrors: string[] = [];
    const validPreviews: typeof previews = [];
    const formData = new FormData();

    // Proses per file: resize hanya jika > 1MB, sisanya langsung
    for (const p of previews) {
      try {
        if (p.file.size > RESIZE_THRESHOLD) {
          // File besar: resize ke 1600px + encode WebP min 100KB
          const resized = await resizeImage(p.file);
          const webpFile = new File([resized], p.file.name.replace(/\.[^.]+$/, '.webp'), {
            type: 'image/webp',
          });
          formData.append('files', webpFile);
        } else {
          // File kecil (≤ 1MB): upload langsung tanpa diubah
          formData.append('files', p.file);
        }
        validPreviews.push(p);
      } catch (e) {
        resizeErrors.push(`Resize gagal - ${(e as Error).message}`);
      }
    }

    if (validPreviews.length === 0) {
      setErrors(resizeErrors);
      setUploading(false);
      return;
    }

    try {
      const res = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formData,
      });

      const resText = await res.text();
      let data: UploadResult & { error?: string };
      try {
        data = JSON.parse(resText);
      } catch {
        setErrors([...resizeErrors, `Server Error (${res.status}): ${resText.slice(0, 150)}`]);
        setUploading(false);
        return;
      }

      if (!res.ok) {
        setErrors([...resizeErrors, data.error ?? `Server error: ${res.status}`]);
        setUploading(false);
        return;
      }

      const newUploaded = data.uploaded.map((u, i) => ({
        imageUrl: u.imageUrl,
        name: validPreviews[i]?.file.name ?? '',
        preview: validPreviews[i]?.preview ?? u.imageUrl,
      }));

      setUploaded((prev) => [...newUploaded, ...prev]);
      setErrors([...resizeErrors, ...(data.errors ?? [])]);
      setPreviews([]);
    } catch (err) {
      setErrors([...resizeErrors, `Koneksi gagal: ${(err as Error).message}`]);
      console.error('[upload error]', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="gallery-upload-container">
      <div className="gallery-upload-header">
        <div className="gallery-upload-icon">🖼️</div>
        <h1>Upload Galeri</h1>
        <p>Upload foto kegiatan ke Supabase Storage. File &gt; 1MB otomatis di-resize &amp; dikonversi WebP.</p>
      </div>

      {/* Drop Zone */}
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden-input"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
        <div className="drop-zone-content">
          <div className="drop-icon">📁</div>
          <p className="drop-text">Klik atau seret foto ke sini</p>
          <p className="drop-hint">Mendukung JPG, PNG, WEBP • Bisa pilih banyak sekaligus</p>
        </div>
      </div>

      {/* Preview Queue */}
      {previews.length > 0 && (
        <div className="preview-section">
          <div className="preview-header">
            <span className="preview-count">{previews.length} foto dipilih</span>
            <button
              className="btn-upload"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <><span className="spinner" /> Mengupload...</>
              ) : (
                `⬆ Upload ${previews.length} Foto`
              )}
            </button>
          </div>
          <div className="preview-grid">
            {previews.map((p, i) => (
              <div key={i} className="preview-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.preview} alt={p.file.name} className="preview-img" />
                <div className="preview-overlay">
                  <button
                    className="remove-btn"
                    onClick={(e) => { e.stopPropagation(); removePreview(i); }}
                    title="Hapus"
                  >✕</button>
                </div>
                <p className="preview-name">{p.file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="error-box">
          <strong>⚠ Beberapa foto gagal diupload:</strong>
          <ul>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}

      {/* Uploaded Results */}
      {uploaded.length > 0 && (
        <div className="uploaded-section">
          <h2 className="uploaded-title">✅ Berhasil Diupload ({uploaded.length})</h2>
          <div className="uploaded-grid">
            {uploaded.map((u, i) => (
              <div key={i} className="uploaded-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u.imageUrl} alt={u.name} className="uploaded-img" />
                <div className="uploaded-url">
                  <a href={u.imageUrl} target="_blank" rel="noopener noreferrer">
                    Lihat gambar ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .gallery-upload-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1rem;
          font-family: 'Inter', sans-serif;
        }

        .gallery-upload-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .gallery-upload-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        .gallery-upload-header h1 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 0.5rem;
        }

        .gallery-upload-header p {
          color: #6b7280;
          font-size: 0.95rem;
          margin: 0;
        }

        .drop-zone {
          border: 2.5px dashed #d1d5db;
          border-radius: 16px;
          padding: 3rem 2rem;
          text-align: center;
          cursor: pointer;
          background: #f9fafb;
          transition: all 0.2s ease;
          margin-bottom: 2rem;
        }

        .drop-zone:hover,
        .drop-zone.dragging {
          border-color: #6366f1;
          background: #eef2ff;
        }

        .hidden-input {
          display: none;
        }

        .drop-icon {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
        }

        .drop-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: #374151;
          margin: 0 0 0.4rem;
        }

        .drop-hint {
          font-size: 0.85rem;
          color: #9ca3af;
          margin: 0;
        }

        .preview-section {
          margin-bottom: 2rem;
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .preview-count {
          font-weight: 600;
          color: #374151;
          font-size: 0.95rem;
        }

        .btn-upload {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          padding: 0.6rem 1.4rem;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .btn-upload:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-upload:hover:not(:disabled) {
          opacity: 0.9;
        }

        .spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 0.75rem;
        }

        .preview-card {
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
        }

        .preview-img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          display: block;
        }

        .preview-overlay {
          position: absolute;
          top: 4px;
          right: 4px;
        }

        .remove-btn {
          background: rgba(0,0,0,0.55);
          color: white;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          font-size: 0.7rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .remove-btn:hover {
          background: rgba(220, 38, 38, 0.85);
        }

        .preview-name {
          font-size: 0.7rem;
          color: #6b7280;
          padding: 0.25rem 0.4rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0;
        }

        .error-box {
          background: #fef2f2;
          border: 1px solid #fca5a5;
          border-radius: 10px;
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
          color: #b91c1c;
          font-size: 0.9rem;
        }

        .error-box ul {
          margin: 0.5rem 0 0;
          padding-left: 1.25rem;
        }

        .uploaded-section {
          margin-top: 1rem;
        }

        .uploaded-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #059669;
          margin-bottom: 1rem;
        }

        .uploaded-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1rem;
        }

        .uploaded-card {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .uploaded-img {
          width: 100%;
          height: 140px;
          object-fit: cover;
          display: block;
        }

        .uploaded-url {
          padding: 0.4rem 0.6rem;
          font-size: 0.78rem;
        }

        .uploaded-url a {
          color: #6366f1;
          text-decoration: none;
          font-weight: 500;
        }

        .uploaded-url a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
