'use client';

import { useRef, useState, useCallback } from 'react';
import { uploadGalleryImages } from '@/actions/gallery';
import { resizeImage, RESIZE_THRESHOLD } from '@/lib/image-resize';

export default function GalleryUploadForm() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([]);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const addFiles = (files: FileList | File[]) => {
        const arr = Array.from(files).filter((f) => f.type.startsWith('image/'));
        const newPreviews = arr.map((file) => ({ file, preview: URL.createObjectURL(file) }));
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
        const formData = new FormData();

        for (const p of previews) {
            try {
                if (p.file.size > RESIZE_THRESHOLD) {
                    const resized = await resizeImage(p.file);
                    const webpFile = new File([resized], p.file.name.replace(/\.[^.]+$/, '.webp'), {
                        type: 'image/webp',
                    });
                    formData.append('files', webpFile);
                } else {
                    formData.append('files', p.file);
                }
            } catch (e) {
                resizeErrors.push(`${p.file.name}: ${(e as Error).message}`);
            }
        }

        try {
            const result = await uploadGalleryImages(formData);
            setErrors([...resizeErrors, ...result.errors]);
            previews.forEach((p) => URL.revokeObjectURL(p.preview));
            setPreviews([]);
        } catch (e) {
            setErrors([...resizeErrors, `Upload gagal: ${(e as Error).message}`]);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mb-6">
            <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-smooth ${isDragging ? 'border-uskGreen bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-uskGreen/50'
                    }`}
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
                    className="hidden"
                    onChange={(e) => e.target.files && addFiles(e.target.files)}
                />
                <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-400 mb-3"></i>
                <p className="text-sm font-semibold text-gray-700">Klik atau seret foto ke sini untuk menambahkan</p>
                <p className="text-xs text-gray-400 mt-1">Mendukung JPG, PNG, WEBP — bisa pilih banyak sekaligus</p>
            </div>

            {previews.length > 0 && (
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700">{previews.length} foto dipilih</span>
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="bg-uskYellow hover:bg-uskYellow-hover text-uskGreen font-bold px-5 py-2 rounded-md text-xs shadow-sm transition-smooth disabled:opacity-50"
                        >
                            {uploading ? 'Mengunggah...' : `Unggah ${previews.length} Foto`}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                        {previews.map((p, i) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <div key={i} className="relative rounded-lg overflow-hidden border border-gray-200 group">
                                <img src={p.preview} alt={p.file.name} className="w-full h-24 object-cover" />
                                <button
                                    onClick={(e) => { e.stopPropagation(); removePreview(i); }}
                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center hover:bg-red-600 transition-smooth"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {errors.length > 0 && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md p-3">
                    <p className="font-bold mb-1">Beberapa foto gagal diunggah:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                        {errors.map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
}