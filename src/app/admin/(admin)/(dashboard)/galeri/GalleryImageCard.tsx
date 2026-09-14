'use client';

import { useState, useTransition } from 'react';
import { deleteGalleryImage } from '@/actions/gallery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function GalleryImageCard({ id, imageUrl }: { id: string; imageUrl: string }) {
    const [isPending, startTransition] = useTransition();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    function handleConfirmDelete() {
        startTransition(async () => {
            await deleteGalleryImage(id, imageUrl);
            setIsConfirmOpen(false);
        });
    }

    return (
        <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="relative rounded-lg overflow-hidden border border-gray-200 group">
                <img src={imageUrl} alt="Galeri" className="w-full h-32 object-cover" />
                <button
                    onClick={() => setIsConfirmOpen(true)}
                    disabled={isPending}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all disabled:opacity-50"
                    title="Hapus foto"
                >
                    <FontAwesomeIcon icon={faTrash} className="w-[10px] h-[10px]" />
                </button>
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Hapus Foto Galeri?"
                message="Apakah Anda yakin ingin menghapus foto ini dari galeri?"
                confirmText="Hapus"
                loading={isPending}
            />
        </>
    );
}