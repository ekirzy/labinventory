
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal = ({ isOpen, onClose }: Props) => {
  const { user, updateUserProfile } = useApp();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setRole(user.role);
      setAvatarPreview(user.avatar);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, role, avatar: avatarPreview });
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const url = URL.createObjectURL(file);
          setAvatarPreview(url);
      }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-gray-200 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Edit Profil</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="flex flex-col items-center gap-4">
                <div className="size-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md flex items-center justify-center">
                    {avatarPreview ? (
                        <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span className="material-symbols-outlined text-4xl text-gray-400 filled">person</span>
                    )}
                </div>
                <label className="cursor-pointer text-sm font-medium text-primary hover:text-primary-hover hover:underline">
                    Ubah Foto
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
            </div>

            <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Nama Lengkap</span>
                <input 
                    required 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                />
            </label>

             <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Peran / Jabatan</span>
                <input 
                    required 
                    type="text" 
                    value={role} 
                    onChange={e => setRole(e.target.value)} 
                    className="bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                />
            </label>

            <button type="submit" className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-colors shadow-sm">
                Simpan Profil
            </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
