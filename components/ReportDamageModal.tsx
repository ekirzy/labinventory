
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InventoryItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem;
}

const ReportDamageModal = ({ isOpen, onClose, item }: Props) => {
  const { reportDamage } = useApp();
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
        reportDamage(item.id, description);
        setDescription('');
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-gray-200 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-amber-50">
          <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2">
             <span className="material-symbols-outlined text-amber-600">warning</span>
             Lapor Kerusakan
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-gray-900 font-medium text-sm">Item: {item.name}</p>
                <p className="text-gray-500 text-xs mt-1">ID: {item.id}</p>
            </div>

            <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700">Deskripsi Kerusakan / Masalah *</span>
                <textarea 
                    required 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    className="bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none min-h-[120px] text-sm" 
                    placeholder="Jelaskan apa yang rusak atau perlu perbaikan..." 
                />
            </label>

            <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors">
                    Batal
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-colors shadow-sm shadow-amber-900/10">
                    Kirim Laporan
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ReportDamageModal;
