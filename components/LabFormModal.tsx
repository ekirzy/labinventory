
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Lab } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lab: Lab;
}

const LabFormModal = ({ isOpen, onClose, lab }: Props) => {
  const { updateLab } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    if (lab) {
      setFormData({
        name: lab.name,
        location: lab.location,
        description: lab.description,
        image: lab.image
      });
    }
  }, [lab, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLab(lab.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-gray-200 w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
             <div>
                <h2 className="text-xl font-bold tracking-tight text-gray-900">Edit Detail Lab</h2>
             </div>
             <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
             </button>
        </div>
        
        <div className="p-8 overflow-y-auto">
          <form id="lab-form" onSubmit={handleSubmit} className="space-y-6">
             <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Nama Lab</span>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-white border border-gray-300 rounded-lg h-11 px-3 text-gray-900 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none" />
            </label>

            <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Lokasi</span>
                <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="bg-white border border-gray-300 rounded-lg h-11 px-3 text-gray-900 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none" />
            </label>

            <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">URL Gambar</span>
                <input required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="bg-white border border-gray-300 rounded-lg h-11 px-3 text-gray-900 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none" placeholder="https://..." />
            </label>

            <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Deskripsi</span>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-white border border-gray-300 rounded-lg min-h-[100px] p-3 text-gray-900 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"></textarea>
            </label>
          </form>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-4 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">Batal</button>
          <button type="submit" form="lab-form" className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 shadow-md shadow-primary/20 transition-colors">
             Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabFormModal;
