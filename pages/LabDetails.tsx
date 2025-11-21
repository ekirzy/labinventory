
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ItemStatus } from '../types';
import LabFormModal from '../components/LabFormModal';

const LabDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { labs, items, reportDamage } = useApp();
  const navigate = useNavigate();
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isEditLabModalOpen, setIsEditLabModalOpen] = useState(false);

  const lab = labs.find(l => l.id === id);
  const labItems = items.filter(i => i.labId === id);

  if (!lab) {
     return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Lab Tidak Ditemukan</h2>
        <button onClick={() => navigate('/labs')} className="text-primary hover:underline">Kembali ke Labs</button>
      </div>
    );
  }

  const handleDownloadSafetyReport = () => {
      const content = `LAPORAN KESELAMATAN - ${lab.name}\nTanggal: ${new Date().toLocaleDateString('id-ID')}\nLokasi: ${lab.location}\nManajer: Dr. Arini\n\nLevel Keselamatan: BSL-2\nKapasitas: 30 Mahasiswa\nStatus: Operasional\n\n-- Akhir Laporan --`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Laporan_Keselamatan_${lab.name.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  }

  const getStatusBadge = (status: ItemStatus) => {
    switch (status) {
      case ItemStatus.AVAILABLE:
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">Tersedia</span>;
      case ItemStatus.LOW_STOCK:
        return <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">Stok Rendah</span>;
      case ItemStatus.OUT_OF_STOCK:
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">Stok Habis</span>;
      case ItemStatus.MAINTENANCE:
        return <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded-full">Maintenance</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">{status}</span>;
    }
  };

  // Maintenance Scheduling Modal
  const MaintenanceModal = () => {
      const availableItems = labItems.filter(i => i.status !== ItemStatus.MAINTENANCE);
      const [selectedItems, setSelectedItems] = useState<string[]>([]);

      const toggleItem = (id: string) => {
          if(selectedItems.includes(id)) setSelectedItems(prev => prev.filter(i => i !== id));
          else setSelectedItems(prev => [...prev, id]);
      };

      const confirmSchedule = () => {
          selectedItems.forEach(itemId => {
              reportDamage(itemId, "Jadwal Maintenance via Dashboard Lab");
          });
          setIsMaintenanceModalOpen(false);
      };

      if(!isMaintenanceModalOpen) return null;

      return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[80vh]">
                  <div className="p-5 border-b border-gray-200 bg-gray-50">
                      <h3 className="font-bold text-lg">Jadwalkan Maintenance</h3>
                      <p className="text-xs text-gray-500">Pilih item yang akan ditandai untuk maintenance.</p>
                  </div>
                  <div className="p-5 overflow-y-auto">
                      {availableItems.length === 0 ? (
                          <p className="text-center text-gray-500 py-4">Semua item sedang dalam maintenance atau tidak tersedia.</p>
                      ) : (
                          <div className="space-y-2">
                              {availableItems.map(item => (
                                  <label key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        checked={selectedItems.includes(item.id)} 
                                        onChange={() => toggleItem(item.id)}
                                        className="rounded text-primary focus:ring-primary"
                                      />
                                      <div>
                                          <p className="text-sm font-medium">{item.name}</p>
                                          <p className="text-xs text-gray-500">{item.id}</p>
                                      </div>
                                  </label>
                              ))}
                          </div>
                      )}
                  </div>
                  <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                      <button onClick={() => setIsMaintenanceModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm">Batal</button>
                      <button onClick={confirmSchedule} disabled={selectedItems.length === 0} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover disabled:opacity-50">
                          Konfirmasi Jadwal
                      </button>
                  </div>
              </div>
          </div>
      )
  }

  return (
    <div className="animate-fade-in">
       {/* Breadcrumbs */}
      <div className="flex gap-2 text-sm text-gray-500 mb-6 font-medium">
          <Link to="/labs" className="hover:text-primary">Laboratorium</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">{lab.name}</span>
      </div>

      {/* Header */}
      <div className="relative rounded-xl overflow-hidden h-64 mb-8 shadow-md group">
          <img src={lab.image} alt={lab.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent/20 flex items-end p-8 justify-between">
              <div>
                  <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-sm">{lab.name}</h1>
                  <p className="text-gray-200 flex items-center gap-2 font-medium">
                      <span className="material-symbols-outlined text-lg">location_on</span> {lab.location}
                  </p>
              </div>
              <button 
                onClick={() => setIsEditLabModalOpen(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/50 rounded-lg text-sm font-bold backdrop-blur-sm transition-colors"
              >
                Edit Detail Lab
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Lab Layout Visualization (Mock) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
               <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Peta Layout Lab</h2>
                  <div className="bg-gray-50 rounded-lg h-96 w-full border border-gray-200 relative overflow-hidden p-4">
                      <div className="w-full h-full grid grid-cols-4 grid-rows-3 gap-4">
                          <div className="border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center text-gray-400 text-xs bg-white font-medium">Kabinet A</div>
                          <div className="border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center text-gray-400 text-xs col-span-2 bg-white font-medium">Workstation 1</div>
                          <div className="border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center text-gray-400 text-xs bg-white font-medium">Pintu Masuk</div>
                          
                          <div className="border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center text-gray-400 text-xs row-span-2 bg-white font-medium">Gudang</div>
                          <div className="border-2 border-blue-200 border-dashed rounded-lg flex items-center justify-center text-blue-500 text-xs col-span-2 row-span-2 bg-blue-50 font-medium">Meja Tengah</div>
                          <div className="border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center text-gray-400 text-xs bg-white font-medium">Kabinet B</div>
                          <div className="border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center text-gray-400 text-xs bg-white font-medium">Lemari Asam</div>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-white shadow-md border border-gray-200 px-3 py-1 rounded text-xs text-gray-600 font-medium">Peta Interaktif (Pratinjau)</div>
                  </div>
              </div>

               <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                   <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-900">Inventaris Lab</h2>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full font-medium">{labItems.length} Item</span>
                   </div>
                   <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3">Item</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {labItems.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 font-medium text-gray-900">
                                            <Link to={`/item/${item.id}`} className="hover:text-primary hover:underline">
                                                {item.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-3">{getStatusBadge(item.status)}</td>
                                        <td className="px-6 py-3 text-right">
                                            <Link to={`/item/${item.id}`} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors border border-gray-200">
                                                Detail
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {labItems.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                            Belum ada item di lab ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                   </div>
               </div>
          </div>

          {/* Right Sidebar Info */}
          <div className="flex flex-col gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Lab</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{lab.description}</p>
                  
                  <div className="space-y-3">
                      <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                          <span className="text-gray-500">Manajer</span>
                          <span className="text-gray-900 font-medium">Dr. Arini</span>
                      </div>
                       <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                          <span className="text-gray-500">Kapasitas</span>
                          <span className="text-gray-900 font-medium">30 Mahasiswa</span>
                      </div>
                       <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Level Keselamatan</span>
                          <span className="text-gray-900 font-medium">BSL-2</span>
                      </div>
                  </div>
              </div>

               <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                   <h3 className="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h3>
                   <button onClick={() => setIsMaintenanceModalOpen(true)} className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg mb-3 text-sm transition-colors shadow-sm shadow-blue-500/20">
                       Jadwalkan Maintenance
                   </button>
                    <button onClick={handleDownloadSafetyReport} className="w-full py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-sm transition-colors">
                       Unduh Laporan Keselamatan
                   </button>
               </div>
          </div>
      </div>
      
      <MaintenanceModal />
      <LabFormModal isOpen={isEditLabModalOpen} onClose={() => setIsEditLabModalOpen(false)} lab={lab} />
    </div>
  );
};

export default LabDetails;
