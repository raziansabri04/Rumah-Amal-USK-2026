'use client';

import { useRef, useState } from 'react';
import { uploadNewsletter } from '@/actions/newsletter';
import { resizeImage, RESIZE_THRESHOLD } from '@/lib/image-resize';

interface NewsletterFormProps {
    onSuccess?: () => void;
}

export default function NewsletterForm({ onSuccess }: NewsletterFormProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<{ file: File; url: string } | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [judul, setJudul] = useState('');
    const [tanggal, setTanggal] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.type.startsWith('image/')) {
                if (preview) URL.revokeObjectURL(preview.url);
                setPreview({ file, url: URL.createObjectURL(file) });
                setError(null);
            } else {
                setError('Hanya file gambar yang diizinkan.');
            }
        }
    };

    const removePreview = () => {
        if (preview) {
            URL.revokeObjectURL(preview.url);
            setPreview(null);
        }
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!judul.trim() || !tanggal || !preview) {
            setError('Semua field harus diisi: Judul, Tanggal, dan Gambar.');
            return;
        }

        setUploading(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData();
        formData.append('judul', judul.trim());
        formData.append('tanggal', tanggal);

        try {
            let fileToUpload = preview.file;
            if (preview.file.size > RESIZE_THRESHOLD) {
                const resized = await resizeImage(preview.file);
                fileToUpload = new File(
                    [resized],
                    preview.file.name.replace(/\.[^.]+$/, '.webp'),
                    { type: 'image/webp' }
                );
            }
            formData.append('file', fileToUpload);

            const result = await uploadNewsletter(formData);

            if (result.success) {
                setSuccess(true);
                setJudul('');
                setTanggal('');
                removePreview();
                // Tutup modal setelah jeda singkat
                setTimeout(() => {
                    setSuccess(false);
                    onSuccess?.();
                }, 1000);
            } else {
                setError(result.error || 'Terjadi kesalahan saat mengunggah.');
            }
        } catch (err) {
            setError(`Gagal upload: ${(err as Error).message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Judul */}
            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Judul Newsletter <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-uskGreen/40 focus:border-uskGreen text-sm"
                    placeholder="Masukkan judul newsletter..."
                    disabled={uploading}
                />
            </div>

            {/* Tanggal */}
            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Tanggal <span className="text-red-500">*</span>
                </label>
                <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-uskGreen/40 focus:border-uskGreen text-sm"
                    disabled={uploading}
                />
            </div>

            {/* Upload Gambar */}
            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Gambar <span className="text-red-500">*</span>
                </label>
                <div
                    className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-smooth border-gray-300 bg-gray-50 hover:border-uskGreen/50"
                    onClick={() => inputRef.current?.click()}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    {!preview ? (
                        <>
                            <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-400 mb-2"></i>
                            <p className="text-sm font-semibold text-gray-700">Klik untuk memilih foto</p>
                            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</p>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <div className="relative w-full max-w-xs h-36 rounded-lg overflow-hidden border border-gray-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="text-xs text-gray-500 truncate max-w-[180px]">{preview.file.name}</p>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); removePreview(); }}
                                    className="text-xs text-red-500 hover:text-red-700 font-semibold transition-smooth"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md p-3 font-medium">
                    {error}
                </div>
            )}

            {/* Success */}
            {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-xs rounded-md p-3 font-medium flex items-center gap-2">
                    <i className="fa-solid fa-circle-check"></i>
                    Newsletter berhasil ditambahkan!
                </div>
            )}

            {/* Submit */}
            <div className="flex justify-end gap-3">
                <button
                    type="submit"
                    disabled={uploading || !judul.trim() || !tanggal || !preview}
                    className="bg-uskYellow hover:bg-uskYellow-hover text-uskGreen font-bold px-6 py-2 rounded-lg text-sm shadow-sm transition-smooth disabled:opacity-50 flex items-center gap-2"
                >
                    {uploading ? (
                        <>
                            <i className="fa-solid fa-spinner fa-spin"></i>
                            Menyimpan...
                        </>
                    ) : (
                        'Simpan Newsletter'
                    )}
                </button>
            </div>
        </form>
    );
}
