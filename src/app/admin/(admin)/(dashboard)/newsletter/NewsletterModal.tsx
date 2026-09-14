'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import NewsletterForm from './NewsletterForm';

export default function NewsletterModal() {
    const [isOpen, setIsOpen] = useState(false);

    // Tutup modal dengan tombol Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Cegah scroll saat modal terbuka
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <>
            {/* Tombol Tambah */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-uskYellow hover:bg-uskYellow-hover text-uskGreen font-bold px-4 py-2 rounded-lg text-sm shadow-sm transition-smooth"
            >
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
                Tambah Newsletter
            </button>

            {/* Backdrop + Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                    {/* Panel */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto z-10">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-base font-bold text-uskGreen">Tambah Newsletter</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-smooth"
                            >
                                <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6">
                            <NewsletterForm onSuccess={() => setIsOpen(false)} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
