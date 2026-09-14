"use client";

import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

interface AdminToastProps {
  toast: ToastState | null;
  onClose: () => void;
  duration?: number;
}

export default function AdminToast({
  toast,
  onClose,
  duration = 3500,
}: AdminToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [toast, duration, onClose]);

  if (!toast) return null;

  const bgMap = {
    success: "bg-emerald-900/95 border-emerald-700 text-white",
    error: "bg-red-900/95 border-red-700 text-white",
    info: "bg-gray-900/95 border-gray-700 text-white",
  };

  const iconMap = {
    success: <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 text-base" />,
    error: <FontAwesomeIcon icon={faExclamationCircle} className="text-red-400 text-base" />,
    info: <FontAwesomeIcon icon={faInfoCircle} className="text-blue-400 text-base" />,
  };

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm w-full animate-slideInDown">
      <div
        className={`px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md flex items-center justify-between gap-3 text-xs font-semibold ${bgMap[toast.type]}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="shrink-0">{iconMap[toast.type]}</span>
          <span className="leading-snug truncate">{toast.message}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 p-1"
        >
          <FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
