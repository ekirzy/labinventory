
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ItemCategory, ItemStatus, InventoryItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editItem?: InventoryItem;
}

const ItemFormModal = ({ isOpen, onClose, editItem }: Props) => {
  const { addItem, updateItem, labs, uploadImage } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    labId: '',
    quantity: 0,
    unit: 'pcs',
    category: ItemCategory.EQUIPMENT,
    location: '',
    description: '',
    supplier: '',
    serialNumber: '',
    image: '',
    acquisitionDate: ''
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        labId: editItem.labId,
        quantity: editItem.quantity,
        unit: editItem.unit,
        category: editItem.category,
        location: editItem.location,
        description: editItem.description || '',
        supplier: editItem.supplier || '',
        serialNumber: editItem.serialNumber || '',
        image: editItem.image || '',
        acquisitionDate: editItem.acquisitionDate || ''
      });
    } else {
      setFormData({
        name: '',
        labId: labs[0]?.id || '',
        quantity: 0,
        unit: 'pcs',
        category: ItemCategory.EQUIPMENT,
        location: '',
        description: '',
        supplier: '',
        serialNumber: '',
        image: '',
        acquisitionDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [editItem, isOpen, labs]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedStatus = formData.quantity === 0 ? ItemStatus.OUT_OF_STOCK : (formData.quantity < 5 ? ItemStatus.LOW_STOCK : ItemStatus.AVAILABLE);

    if (editItem) {
      updateItem(editItem.id, {
        ...formData,
        status: editItem.status === ItemStatus.MAINTENANCE ? ItemStatus.MAINTENANCE : calculatedStatus
      });
    } else {
      addItem({
        ...formData,
        status: calculatedStatus,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      {/* Adjusted Width */}
      <div className="bg-white border border-gray-200 w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div>
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-gray-900">{editItem ? 'Edit Item' : 'Tambah Item Baru'}</h2>
            <p className="text-gray-500 text-xs md:text-sm mt-1">Isi detail untuk peralatan atau material.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar">
          <form id="item-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col gap-1">
                <p className="text-sm font-medium text-gray-700">Nama Item *</p>
                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-white border border-gray-300 rounded-lg h-11 px-3 text-gray-900 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none" placeholder="Cth: Beaker 250ml" />
              </label>
              <div className="flex gap-2">
                <label className="flex flex-col gap-1 flex-1">
                  <p className="text-sm font-medium text-gray-700">Jumlah *</p>
                  <input required type="number" min="0" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })} className="bg-white border border-gray-300 rounded-lg h-11 px-3 text-gray-900 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none" />
                </label>
                <label className="flex flex-col gap-1 w-24">
                  <p className="text-sm font-medium text-gray-700">Satuan</p>
                  <input required type="text" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} className="bg-white border border-gray-300 rounded-lg h-11 px-3 text-gray-900 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none" placeholder="pcs" />
                </label>
              </div>
            </div>

            <label className="flex flex-col gap-1">
              <p className="text-sm font-medium text-gray-700">Deskripsi</p>
              <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="bg-white border border-gray-300 rounded-lg min-h-[100px] p-3 text-gray-900 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none" placeholder="Masukkan deskripsi detail..."></textarea>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col gap-1">
                <p className="text-sm font-medium text-gray-700">Laboratorium *</p>
                <div className="relative">
                  <select required value={formData.labId} onChange={e => setFormData({ ...formData, labId: e.target.value })} className="appearance-none w-full bg-white border border-gray-300 rounded-lg h-11 px-3 text-gray-900 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none">
                    {labs.map(lab => <option key={lab.id} value={lab.id}>{lab.name}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">expand_more</span>
                </div>
              </label>
              <label className="flex flex-col gap-1">
                <p className="text-sm font-medium text-gray-700">Lokasi Penyimpanan</p>
                <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="bg-white border border-gray-300 rounded-lg h-11 px-3 text-gray-900 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none" placeholder="Cth: Rak A1" />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <label className="flex flex-col gap-1">
                <p className="text-sm font-medium text-gray-700">Kategori</p>
                <div className="relative">
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as ItemCategory })} className="appearance-none w-full bg-white border border-gray-300 rounded-lg h-11 px-3 text-gray-900 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none">
                    {Object.values(ItemCategory).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">expand_more</span>
                </div>
              </label>
              <label className="flex flex-col gap-1">
                <p className="text-sm font-medium text-gray-700">Tanggal Perolehan</p>
                <input type="date" value={formData.acquisitionDate} onChange={e => setFormData({ ...formData, acquisitionDate: e.target.value })} className="bg-white border border-gray-300 rounded-lg h-11 px-3 text-gray-900 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none" />
              </label>
              <label className="flex flex-col gap-1">
                <p className="text-sm font-medium text-gray-700">Gambar Item</p>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const url = await uploadImage(file);
                          setFormData({ ...formData, image: url });
                        } catch (error) {
                          alert('Gagal mengupload gambar');
                          console.error(error);
                        }
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 transition-colors"
                  />
                </div>
                {formData.image && (
                  <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-500 hover:bg-white"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                )}
              </label>
            </div>

          </form>
        </div>

        <div className="p-4 md:p-6 border-t border-gray-200 flex justify-end gap-4 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">Batal</button>
          <button type="submit" form="item-form" className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 shadow-md shadow-primary/20 transition-colors">
            {editItem ? 'Simpan Perubahan' : 'Simpan Item'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemFormModal;
