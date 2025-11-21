
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InventoryItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem;
}

const BorrowModal = ({ isOpen, onClose, item }: Props) => {
  const { borrowItem } = useApp();
  const [borrower, setBorrower] = useState('');
  const [borrowerId, setBorrowerId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [dueDate, setDueDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Note: BorrowModal (Quick Borrow) currently doesn't ask for ID Image to keep it simple, 
    // or we pass an empty string. If detailed borrowing is needed, use RecordLoanModal.
    borrowItem(item.id, borrower, borrowerId, '', quantity, dueDate);
    onClose();
    setBorrower('');
    setBorrowerId('');
    setQuantity(1);
    setDueDate('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-gray-200 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Pinjam Item</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex gap-3 items-center">
                <div className="w-12 h-12 rounded bg-white border border-blue-100 flex items-center justify-center text-primary">
                     <span className="material-symbols-outlined">science</span>
                </div>
                <div>
                    <p className="text-gray-900 font-medium text-sm">{item.name}</p>
                    <p className="text-gray-500 text-xs">Tersedia: {item.quantity} {item.unit}</p>
                </div>
            </div>

            <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Nama Peminjam *</span>
                <input 
                    required 
                    type="text" 
                    value={borrower} 
                    onChange={e => setBorrower(e.target.value)} 
                    className="bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                    placeholder="Cth: Budi Santoso" 
                />
            </label>

            <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">NIM / NIP *</span>
                <input 
                    required 
                    type="text" 
                    value={borrowerId} 
                    onChange={e => setBorrowerId(e.target.value)} 
                    className="bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                    placeholder="Cth: 12345678" 
                />
            </label>

            <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Jumlah *</span>
                <input 
                    required 
                    type="number" 
                    min="1" 
                    max={item.quantity} 
                    value={quantity} 
                    onChange={e => setQuantity(parseInt(e.target.value))} 
                    className="bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                />
                <span className="text-xs text-gray-500 text-right">Maks: {item.quantity} {item.unit}</span>
            </label>

            <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Tanggal Pengembalian</span>
                <input 
                    type="date" 
                    value={dueDate} 
                    onChange={e => setDueDate(e.target.value)} 
                    className="bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                />
            </label>

            <button type="submit" className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-colors shadow-sm">
                Konfirmasi Peminjaman
            </button>
        </form>
      </div>
    </div>
  );
};

export default BorrowModal;
