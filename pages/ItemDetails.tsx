
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ItemStatus } from '../types';
import ItemFormModal from '../components/ItemFormModal';
import BorrowModal from '../components/BorrowModal';
import ConfirmationModal from '../components/ConfirmationModal';
import ReportDamageModal from '../components/ReportDamageModal';

const ItemDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, deleteItem, labs, completeMaintenance } = useApp();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDamageModalOpen, setIsDamageModalOpen] = useState(false);
  const [isMaintenanceConfirmOpen, setIsMaintenanceConfirmOpen] = useState(false);

  const item = items.find(i => i.id === id);
  const assignedLab = item ? labs.find(l => l.id === item.labId) : null;

  if (!item) return <div className="text-gray-900 p-8">Item tidak ditemukan</div>;

  const handleDelete = () => {
      deleteItem(item.id);
      navigate('/inventory');
  }

  const handleCompleteMaintenance = () => {
      completeMaintenance(item.id);
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Link to="/inventory" className="text-gray-500 text-base font-medium hover:text-primary transition-colors">Inventaris</Link>
        <span className="text-gray-300 text-base font-medium">/</span>
        <span className="text-gray-500 text-base font-medium">{item.category}</span>
        <span className="text-gray-300 text-base font-medium">/</span>
        <span className="text-gray-900 text-base font-medium">{item.name}</span>
      </div>

      {/* Page Heading */}
      <div className="flex flex-wrap justify-between items-start gap-3 mb-6">
        <div className="flex min-w-72 flex-col gap-2">
          <p className="text-gray-900 text-4xl font-black leading-tight tracking-tight">{item.name}</p>
          <p className="text-gray-500 text-base font-normal">ID Item: {item.id}</p>
        </div>
        
        {/* Status Chip */}
        <div className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 border ${
            item.status === ItemStatus.AVAILABLE ? 'bg-green-50 border-green-100' : 
            item.status === ItemStatus.OUT_OF_STOCK ? 'bg-red-50 border-red-100' : 
            item.status === ItemStatus.MAINTENANCE ? 'bg-orange-50 border-orange-100' :
            'bg-amber-50 border-amber-100'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
              item.status === ItemStatus.AVAILABLE ? 'bg-green-500' : 
              item.status === ItemStatus.OUT_OF_STOCK ? 'bg-red-500' : 
              item.status === ItemStatus.MAINTENANCE ? 'bg-orange-500' :
              'bg-amber-500'
          }`}></div>
          <p className={`${
              item.status === ItemStatus.AVAILABLE ? 'text-green-700' : 
              item.status === ItemStatus.OUT_OF_STOCK ? 'text-red-700' : 
              item.status === ItemStatus.MAINTENANCE ? 'text-orange-700' :
              'text-amber-700'
          } text-sm font-medium`}>{item.status}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Details Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-gray-900 text-xl font-bold mb-5">Detail Item</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 text-sm">
                    <div>
                        <p className="text-gray-500 font-normal mb-1">Deskripsi</p>
                        <p className="text-gray-900 font-medium">{item.description || 'Tidak ada deskripsi.'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-normal mb-1">Nomor Seri</p>
                        <p className="text-gray-900 font-medium">{item.serialNumber || '-'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-normal mb-1">Jumlah</p>
                        <p className="text-gray-900 font-medium">{item.quantity} {item.unit}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-normal mb-1">Tanggal Perolehan</p>
                        <p className="text-gray-900 font-medium">{item.acquisitionDate}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-normal mb-1">Pemasok</p>
                        <p className="text-gray-900 font-medium">{item.supplier || '-'}</p>
                    </div>
                     <div>
                        <p className="text-gray-500 font-normal mb-1">Kategori</p>
                        <p className="text-gray-900 font-medium">{item.category}</p>
                    </div>
                </div>
            </div>

            {/* Location Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-gray-900 text-xl font-bold mb-5">Lokasi</h2>
                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                        <span className="material-symbols-outlined">location_on</span>
                    </div>
                    <div>
                        <p className="text-gray-900 font-bold text-lg">{assignedLab?.name}</p>
                        <p className="text-gray-500 mt-1">{item.location}</p>
                        <Link to={`/labs/${assignedLab?.id}`} className="text-primary text-sm font-semibold mt-2 inline-flex items-center gap-1 hover:underline">
                            Lihat Denah Lab <span className="material-symbols-outlined" style={{fontSize: '16px'}}>arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8">
            {/* Image */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-gray-900 text-lg font-bold mb-4">Gambar Item</h3>
                <div 
                    className="aspect-video bg-cover bg-center rounded-lg bg-gray-100 border border-gray-200" 
                    style={{backgroundImage: `url('${item.image || 'https://via.placeholder.com/600x400'}')`}}
                ></div>
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-gray-900 text-lg font-bold mb-4">Tindakan</h3>
                <div className="flex flex-col gap-3">
                    {item.status === ItemStatus.MAINTENANCE ? (
                        <button onClick={() => setIsMaintenanceConfirmOpen(true)} className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-green-600 text-white text-sm font-bold tracking-wide hover:bg-green-700 transition-colors shadow-sm shadow-green-500/20">
                            <span className="material-symbols-outlined" style={{fontSize: '20px'}}>check_circle</span> Selesaikan Maintenance
                        </button>
                    ) : (
                        <>
                        <button onClick={() => setIsEditModalOpen(true)} className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold tracking-wide hover:bg-primary-hover transition-colors shadow-sm shadow-blue-500/20">
                            <span className="material-symbols-outlined" style={{fontSize: '20px'}}>edit</span> Edit Item
                        </button>
                        <button onClick={() => setIsBorrowModalOpen(true)} className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white border border-gray-300 text-gray-700 text-sm font-bold tracking-wide hover:bg-gray-50 transition-colors">
                            <span className="material-symbols-outlined" style={{fontSize: '20px'}}>book</span> Pinjam Item
                        </button>
                        <button onClick={() => setIsDamageModalOpen(true)} className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-bold tracking-wide hover:bg-amber-100 transition-colors">
                            <span className="material-symbols-outlined" style={{fontSize: '20px'}}>report</span> Lapor Kerusakan
                        </button>
                        </>
                    )}
                    <button onClick={() => setIsDeleteModalOpen(true)} className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-red-50 border border-red-200 text-red-600 text-sm font-bold tracking-wide hover:bg-red-100 transition-colors">
                        <span className="material-symbols-outlined" style={{fontSize: '20px'}}>delete</span> Hapus
                    </button>
                </div>
            </div>
            
            {/* QR Code */}
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                <h3 className="text-gray-900 text-lg font-bold mb-4">Scan QR Code</h3>
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${item.id}`} alt="QR Code" className="w-32 h-32" />
                </div>
            </div>
        </div>
      </div>

      <ItemFormModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} editItem={item} />
      <BorrowModal isOpen={isBorrowModalOpen} onClose={() => setIsBorrowModalOpen(false)} item={item} />
      <ReportDamageModal isOpen={isDamageModalOpen} onClose={() => setIsDamageModalOpen(false)} item={item} />
      
      {/* Maintenance Confirmation */}
      <ConfirmationModal 
        isOpen={isMaintenanceConfirmOpen} 
        onClose={() => setIsMaintenanceConfirmOpen(false)} 
        onConfirm={handleCompleteMaintenance} 
        title="Selesaikan Maintenance" 
        message="Apakah maintenance telah selesai dengan sukses dan item siap digunakan kembali?" 
        confirmText="Ya, Selesaikan"
        cancelText="Batal"
        isDanger={false}
      />

      {/* Delete Confirmation */}
      <ConfirmationModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDelete} 
        title="Hapus Item" 
        message="Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan." 
        confirmText="Hapus"
        cancelText="Batal"
        isDanger={true} 
      />
    </div>
  );
};

export default ItemDetails;
