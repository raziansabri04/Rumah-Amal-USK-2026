'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStickyNote, faQuoteLeft, faXmark } from '@fortawesome/free-solid-svg-icons';

type PesanNoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  nama: string;
  kategori: string;
  tanggal?: string;
  pesan: string;
};

export default function PesanNoteModal({
  isOpen,
  onClose,
  nama,
  kategori,
  tanggal,
  pesan,
}: PesanNoteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full overflow-hidden flex flex-col transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faStickyNote} className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 leading-tight">Catatan Pesan / Doa</h3>
              <p className="text-[11px] text-gray-500">Detail pesan dari donatur</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup"
          >
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content / Note Body */}
        <div className="p-5 space-y-4">
          {/* Donatur Meta Info */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-xs space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Pengirim:</span>
              <span className="font-bold text-gray-900">{nama}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Kategori / Jenis:</span>
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 capitalize">
                {kategori}
              </span>
            </div>
            {tanggal && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Tanggal:</span>
                <span className="text-gray-700 font-mono">{tanggal}</span>
              </div>
            )}
          </div>

          {/* Sticky Note Box */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-4 shadow-xs relative overflow-hidden">
            <FontAwesomeIcon
              icon={faQuoteLeft}
              className="absolute right-3 bottom-3 text-amber-200/60 w-12 h-12 pointer-events-none"
            />
            <p className="text-[11px] uppercase tracking-wider font-bold text-amber-800/80 mb-2">
              Isi Catatan:
            </p>
            <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed whitespace-pre-wrap relative z-10">
              {pesan}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#063A1E] hover:bg-[#042814] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Tutup Catatan
          </button>
        </div>
      </div>
    </div>
  );
}
