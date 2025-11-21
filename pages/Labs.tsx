
import React from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

const Labs = () => {
  const { labs, items } = useApp();

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Laboratorium</h1>
        <p className="text-gray-500">Ringkasan fasilitas laboratorium dan lokasinya.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map(lab => {
          const itemCount = items.filter(i => i.labId === lab.id).length; 

          return (
            <div key={lab.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all group shadow-sm">
              <div className="h-48 overflow-hidden relative">
                <img src={lab.image} alt={lab.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                   <h2 className="text-xl font-bold text-white shadow-sm">{lab.name}</h2>
                   <p className="text-sm text-gray-200 flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-sm text-white">location_on</span> {lab.location}
                   </p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{lab.description}</p>
                
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase font-semibold">Total Item</span>
                        <span className="text-lg font-bold text-gray-900">{itemCount} Aset</span>
                    </div>
                    <Link to={`/labs/${lab.id}`} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-900 transition-colors">
                        Lihat Detail
                    </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Labs;
