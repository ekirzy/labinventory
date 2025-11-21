
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { InventoryItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const RecordLoanModal = ({ isOpen, onClose }: Props) => {
  const { items, borrowItem } = useApp();
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
  const [borrower, setBorrower] = useState('');
  const [borrowerId, setBorrowerId] = useState(''); // NIK/NIM
  const [idCardImage, setIdCardImage] = useState(''); // URL for preview
  const [quantity, setQuantity] = useState(1);
  const [dueDate, setDueDate] = useState('');

  // Filter items for search
  const filteredItems = useMemo(() => {
      if (!search) return [];
      return items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5);
  }, [items, search]);

  if (!isOpen) return null;

  const handleReset = () => {
      setSearch('');
      setSelectedItem(null);
      setBorrower('');
      setBorrowerId('');
      setIdCardImage('');
      setQuantity(1);
      setDueDate('');
      onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
        borrowItem(selectedItem.id, borrower, borrowerId, idCardImage, quantity, dueDate);
        handleReset();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const url = URL.createObjectURL(file);
          setIdCardImage(url);
      }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      {/* Adjusted width and margin for mobile */}
      <div className="bg-white border border-gray-200 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 md:p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Catat Peminjaman Baru</h2>
          <button onClick={handleReset} className="text-gray-500 hover:text-gray-900">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="p-4 md:p-6 overflow-y-auto">
            {!selectedItem ? (
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Cari Item untuk Dipinjam</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input 
                            autoFocus
                            type="text" 
                            className="w-full bg-white border border-gray-300 rounded-lg pl-10 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-primary/50 focus:border-primary"
                            placeholder="Cari nama item..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        {search && filteredItems.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">Item tidak ditemukan.</p>
                        )}
                        {filteredItems.map(item => (
                            <button 
                                key={item.id}
                                onClick={() => { setSelectedItem(item); setSearch(''); }}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-colors text-left"
                            >
                                <div className="size-10 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.location} • Stok: {item.quantity}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Selected Item Summary */}
                    <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex gap-3 items-center relative">
                        <button 
                            type="button"
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                        <div className="size-12 rounded bg-white border border-blue-100 overflow-hidden shrink-0">
                            <img src={selectedItem.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-gray-900 font-bold text-sm line-clamp-1">{selectedItem.name}</p>
                            <p className="text-gray-500 text-xs">Tersedia: {selectedItem.quantity} {selectedItem.unit}</p>
                        </div>
                    </div>

                    {/* Stack on mobile, Grid on tablet+ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700">Nama Peminjam *</span>
                            <input 
                                required 
                                type="text" 
                                value={borrower} 
                                onChange={e => setBorrower(e.target.value)} 
                                className="mt-1 block w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                                placeholder="Cth: Mahasiswa A" 
                            />
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700">NIM / NIP / NIK *</span>
                            <input 
                                required 
                                type="text" 
                                value={borrowerId} 
                                onChange={e => setBorrowerId(e.target.value)} 
                                className="mt-1 block w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                                placeholder="Cth: 12345678" 
                            />
                        </label>
                    </div>

                    <label className="block">
                        <span className="text-sm font-medium text-gray-700">Upload KTP / KARMAS</span>
                        <div className="mt-1 flex flex-col md:flex-row items-start md:items-center gap-4">
                            <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors w-full md:w-auto text-center">
                                Pilih File
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                            </label>
                            {idCardImage && (
                                <span className="text-xs text-green-600 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">check_circle</span> Terupload
                                </span>
                            )}
                        </div>
                        {idCardImage && (
                            <div className="mt-2 h-24 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                <img src={idCardImage} alt="ID Card Preview" className="w-full h-full object-contain" />
                            </div>
                        )}
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700">Jumlah *</span>
                            <input 
                                required 
                                type="number" 
                                min="1" 
                                max={selectedItem.quantity} 
                                value={quantity} 
                                onChange={e => setQuantity(parseInt(e.target.value))} 
                                className="mt-1 block w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                            />
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700">Tanggal Pengembalian</span>
                            <input 
                                required
                                type="date" 
                                value={dueDate} 
                                onChange={e => setDueDate(e.target.value)} 
                                className="mt-1 block w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                            />
                        </label>
                    </div>

                    <button type="submit" className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-colors shadow-md shadow-blue-200">
                        Konfirmasi Peminjaman
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default RecordLoanModal;
