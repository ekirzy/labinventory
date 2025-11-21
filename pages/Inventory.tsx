
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { ItemStatus, ItemCategory, InventoryItem } from '../types';
import ItemFormModal from '../components/ItemFormModal';
import ConfirmationModal from '../components/ConfirmationModal';

const Inventory = () => {
  const { items, deleteItem, labs, exportData } = useApp();
  const [search, setSearch] = useState('');
  const [activeLabId, setActiveLabId] = useState<string>(labs[0]?.id || '');
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(undefined);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Get current active lab info
  const currentLab = labs.find(l => l.id === activeLabId);

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
              setShowCategoryDropdown(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter Items
  const filteredItems = items.filter(item => {
    const matchesLab = item.labId === activeLabId;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    return matchesLab && matchesSearch && matchesCategory;
  });

  const handleEdit = (item: InventoryItem) => {
      setEditingItem(item);
      setIsModalOpen(true);
  };

  const handleCreate = () => {
      setEditingItem(undefined);
      setIsModalOpen(true);
  };

  const confirmDelete = (id: string) => {
      setItemToDelete(id);
  };

  const handleDelete = () => {
      if(itemToDelete) {
          deleteItem(itemToDelete);
          setItemToDelete(null);
      }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Link to="/" className="text-gray-500 text-sm font-medium hover:text-primary transition-colors">Beranda</Link>
        <span className="text-gray-400 text-sm font-medium">/</span>
        <span className="text-gray-500 text-sm font-medium">Inventaris</span>
        <span className="text-gray-400 text-sm font-medium">/</span>
        <span className="text-gray-900 text-sm font-medium">{currentLab?.name || 'Lab'}</span>
      </div>

      {/* Page Heading & Lab Selector (Tabs) */}
      <div className="flex flex-col gap-6 mb-6">
         <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-gray-900 text-2xl md:text-3xl font-bold leading-tight tracking-tight">Inventaris {currentLab?.name || 'Lab'}</h1>
                <p className="text-gray-500 text-sm md:text-base font-normal">Daftar lengkap peralatan dan material di laboratorium ini.</p>
            </div>
         </div>
         
         {/* Tabs - Horizontal Scroll on Mobile */}
         <div className="flex gap-1 overflow-x-auto pb-0 border-b border-gray-200 custom-scrollbar">
            {labs.map(lab => (
                <button
                    key={lab.id}
                    onClick={() => setActiveLabId(lab.id)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap rounded-t-lg transition-all border-b-2 ${activeLabId === lab.id ? 'border-primary text-primary bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                    {lab.name}
                </button>
            ))}
         </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar & Search - Stack on Mobile */}
        <div className="flex flex-col lg:flex-row justify-between gap-4 p-4 border-b border-gray-200 bg-gray-50/50">
            <div className="flex-1 w-full">
                <label className="flex flex-col w-full">
                    <div className="flex w-full flex-1 items-stretch rounded-lg h-10 shadow-sm">
                        <div className="text-gray-400 flex border border-r-0 border-gray-300 bg-white items-center justify-center pl-3 rounded-l-lg">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-gray-900 focus:ring-2 focus:ring-primary/50 focus:border-primary border border-l-0 border-gray-300 bg-white h-full placeholder:text-gray-400 px-2 text-sm font-normal transition-all" 
                            placeholder="Cari berdasarkan nama item..."
                        />
                    </div>
                </label>
            </div>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
                
                {/* Category Filter Dropdown */}
                <div className="relative w-full md:w-auto" ref={categoryRef}>
                    <button 
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                        className={`flex w-full md:min-w-[140px] cursor-pointer items-center justify-between overflow-hidden rounded-lg h-10 px-3 border text-sm font-medium gap-2 transition-colors ${selectedCategory !== 'Semua' ? 'bg-blue-50 border-blue-200 text-primary' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                        <div className="flex items-center gap-2 truncate">
                             <span className="material-symbols-outlined text-base">filter_list</span>
                             <span>{selectedCategory === 'Semua' ? 'Kategori' : selectedCategory}</span>
                        </div>
                        <span className="material-symbols-outlined text-base">expand_more</span>
                    </button>
                    
                    {showCategoryDropdown && (
                        <div className="absolute right-0 left-0 md:left-auto mt-2 w-full md:w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 animate-fade-in">
                            <div className="py-1">
                                <button 
                                    onClick={() => { setSelectedCategory('Semua'); setShowCategoryDropdown(false); }}
                                    className={`block w-full text-left px-4 py-2 text-sm ${selectedCategory === 'Semua' ? 'bg-blue-50 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    Semua Kategori
                                </button>
                                {Object.values(ItemCategory).map(category => (
                                    <button 
                                        key={category}
                                        onClick={() => { setSelectedCategory(category); setShowCategoryDropdown(false); }}
                                        className={`block w-full text-left px-4 py-2 text-sm ${selectedCategory === category ? 'bg-blue-50 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button 
                    onClick={exportData}
                    className="flex w-full md:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 gap-2 text-sm font-bold px-4 transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined text-lg font-bold">download</span>
                    <span className="truncate">Ekspor CSV</span>
                </button>

                <button 
                    onClick={handleCreate}
                    className="flex w-full md:max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary hover:bg-primary-hover text-white gap-2 text-sm font-bold px-4 transition-colors shadow-sm shadow-blue-500/20"
                >
                    <span className="material-symbols-outlined text-lg font-bold">add</span>
                    <span className="truncate">Tambah Item</span>
                </button>
            </div>
        </div>

        {/* Data Table - Scrollable on Mobile */}
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 min-w-[800px]">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 font-medium text-gray-900">Gambar</th>
                        <th className="px-6 py-4 font-medium text-gray-900">Nama Item</th>
                        <th className="px-6 py-4 font-medium text-gray-900">Kategori</th>
                        <th className="px-6 py-4 font-medium text-gray-900">Jumlah</th>
                        <th className="px-6 py-4 font-medium text-gray-900">Lokasi Penyimpanan</th>
                        <th className="px-6 py-4 font-medium text-right text-gray-900">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredItems.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors bg-white">
                            <td className="px-6 py-3">
                                <div className="size-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden">
                                    <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900">
                                <Link to={`/item/${item.id}`} className="hover:text-primary hover:underline">{item.name}</Link>
                            </td>
                            <td className="px-6 py-4">
                                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-200">{item.category}</span>
                            </td>
                            <td className="px-6 py-4">
                                {item.status === ItemStatus.LOW_STOCK ? (
                                     <span className="text-amber-600 font-medium flex items-center gap-1">
                                        <span className="material-symbols-outlined text-base filled">warning</span>
                                        <span>{item.quantity} {item.unit} (Rendah)</span>
                                    </span>
                                ) : item.status === ItemStatus.OUT_OF_STOCK ? (
                                    <span className="text-red-600 font-medium flex items-center gap-1">
                                        <span className="material-symbols-outlined text-base filled">error</span>
                                        <span>Habis</span>
                                    </span>
                                ) : (
                                    <span className="text-gray-700">{item.quantity} {item.unit}</span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-gray-700">{item.location}</td>
                            <td className="px-6 py-4 flex justify-end gap-2">
                                <button onClick={() => handleEdit(item)} className="p-2 text-gray-500 hover:bg-blue-50 hover:text-primary rounded-lg transition-colors" title="Edit">
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                                <button onClick={() => confirmDelete(item.id)} className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" title="Hapus">
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredItems.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-16 text-center bg-white">
                                <div className="inline-flex items-center justify-center size-16 rounded-full bg-gray-100 mb-4">
                                    <span className="material-symbols-outlined text-3xl text-gray-400">inventory_2</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Tidak ada item ditemukan</h3>
                                <p className="text-sm text-gray-500 mt-1">Coba ubah filter atau tambahkan item baru ke lab ini.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 text-sm text-gray-500 border-t border-gray-200 bg-gray-50/50 gap-4">
            <span>Menampilkan {filteredItems.length > 0 ? 1 : 0} sampai {filteredItems.length} dari {filteredItems.length} hasil</span>
            <div className="inline-flex items-center gap-1">
                <button className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50" disabled>Sebelumnya</button>
                <button className="px-3 py-1 rounded border border-primary bg-primary text-white">1</button>
                <button className="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50" disabled>Berikutnya</button>
            </div>
        </div>
      </div>

      <ItemFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editItem={editingItem}
      />

      <ConfirmationModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDelete}
        title="Hapus Item"
        message="Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan."
        isDanger={true}
        confirmText="Hapus"
        cancelText="Batal"
      />
    </div>
  );
};

export default Inventory;
