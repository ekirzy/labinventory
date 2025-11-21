
import React from 'react';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onClose,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  isDanger = false
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-gray-200 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isDanger ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-primary'}`}>
               <span className="material-symbols-outlined text-2xl filled">{isDanger ? 'warning' : 'info'}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <p className="text-gray-600 mb-8 text-sm leading-relaxed">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors shadow-sm ${
                isDanger ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' : 'bg-primary hover:bg-primary-hover shadow-primary/20'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
