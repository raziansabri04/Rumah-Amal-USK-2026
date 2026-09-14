'use client';

import { useState, useTransition } from 'react';
import { deleteNewsletter } from '@/actions/newsletter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from '@/components/admin/ConfirmModal';

interface NewsletterCardProps {
    id: string;
    judul: string;
    tanggal: Date;
    imageUrl: string;
}

export default function NewsletterCard({ id, judul, tanggal, imageUrl }: NewsletterCardProps) {
    const [isPending, startTransition] = useTransition();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    function handleConfirmDelete() {
        startTransition(async () => {
            await deleteNewsletter(id, imageUrl);
            setIsConfirmOpen(false);
        });
    }

    const formattedDate = new Date(tanggal).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <>
            <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm group flex flex-col">
                {/* Thumbnail */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageUrl}
                    alt={judul}
                    className="w-full h-36 object-cover"
                />

                {/* Info */}
                <div className="p-3 flex-1 flex flex-col gap-1">
                    <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug">{judul}</p>
                    <p className="text-[10px] text-gray-400 mt-auto">{formattedDate}</p>
                </div>

                {/* Delete button */}
                <button
                    onClick={() => setIsConfirmOpen(true)}
                    disabled={isPending}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all disabled:opacity-50"
                    title="Hapus newsletter"
                >
                    {isPending
                        ? <span className="text-[8px]">...</span>
                        : <FontAwesomeIcon icon={faTrash} className="w-[10px] h-[10px]" />
                    }
                </button>
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Hapus Newsletter?"
                message={`Apakah Anda yakin ingin menghapus "${judul}"?`}
                confirmText="Hapus"
                loading={isPending}
            />
        </>
    );
}
