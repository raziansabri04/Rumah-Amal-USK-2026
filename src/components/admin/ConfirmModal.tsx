"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faCircleInfo,
  faTrashCan,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  loading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Ya, Hapus",
  cancelText = "Batal",
  type = "danger",
  loading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const iconBgMap = {
    danger: "bg-red-100 text-red-600 border-red-200",
    warning: "bg-amber-100 text-amber-600 border-amber-200",
    info: "bg-blue-100 text-blue-600 border-blue-200",
  };

  const btnBgMap = {
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    warning: "bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-400",
    info: "bg-[#005621] hover:bg-[#004219] text-white focus:ring-[#005621]",
  };

  const iconMap = {
    danger: faTrashCan,
    warning: faTriangleExclamation,
    info: faCircleInfo,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full p-6 text-center space-y-4 transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon Header */}
        <div
          className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto text-xl shadow-xs ${iconBgMap[type]}`}
        >
          <FontAwesomeIcon icon={iconMap[type]} />
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-black text-gray-900 leading-tight">
            {title}
          </h3>
          <p className="text-xs text-gray-600 font-medium leading-relaxed max-w-xs mx-auto">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs bg-white hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${btnBgMap[type]}`}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                Memproses…
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
