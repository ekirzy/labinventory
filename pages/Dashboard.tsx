
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ItemStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

type TimeFilter = 'month' | 'quarter' | 'all';

const Dashboard = () => {
  const { items, labs } = useApp();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');

  const totalItems = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const outOfStock = items.filter(i => i.status === ItemStatus.OUT_OF_STOCK).length;
  const lowStock = items.filter(i => i.status === ItemStatus.LOW_STOCK).length;
  const maintenance = items.filter(i => i.status === ItemStatus.MAINTENANCE).length;

  // Chart Data - Connected dynamically to Labs
  const distributionData = labs.map(lab => {
    return {
      name: lab.name, // Use the actual Lab Name
      count: items.filter(i => i.labId === lab.id).length // Count items in this lab
    };
  });

  const statusData = [
    { name: 'Tersedia', value: items.filter(i => i.status === ItemStatus.AVAILABLE).length, color: '#10b981' }, // emerald-500
    { name: 'Stok Rendah', value: lowStock, color: '#f59e0b' }, // amber-500
    { name: 'Stok Habis', value: outOfStock, color: '#ef4444' }, // red-500
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in p-2">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-gray-900 text-3xl font-bold tracking-tight">Beranda</h1>
          <p className="text-gray-500 text-base">Ringkasan inventaris laboratorium</p>
        </div>
        
        {/* Chips */}
        <div className="flex gap-1 p-1 bg-white rounded-lg border border-gray-200 shadow-sm">
          <button 
            onClick={() => setTimeFilter('month')}
            className={`flex h-8 shrink-0 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors ${timeFilter === 'month' ? 'bg-gray-100 text-primary font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Bulan Ini
          </button>
          <button 
            onClick={() => setTimeFilter('quarter')}
            className={`flex h-8 shrink-0 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors ${timeFilter === 'quarter' ? 'bg-gray-100 text-primary font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            90 Hari Terakhir
          </button>
          <button 
            onClick={() => setTimeFilter('all')}
            className={`flex h-8 shrink-0 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors ${timeFilter === 'all' ? 'bg-gray-100 text-primary font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Semua
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-base font-medium">Total Item</p>
          <p className="text-gray-900 text-3xl font-bold">{totalItems.toLocaleString()}</p>
          <p className="text-green-600 text-sm font-medium flex items-center gap-1">
             <span className="material-symbols-outlined text-sm">trending_up</span> +1.5% dari bulan lalu
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-base font-medium">Stok Habis</p>
          <p className="text-gray-900 text-3xl font-bold">{outOfStock}</p>
          <p className="text-red-600 text-sm font-medium flex items-center gap-1">
             <span className="material-symbols-outlined text-sm">trending_up</span> +2 item
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-base font-medium">Stok Rendah</p>
          <p className="text-gray-900 text-3xl font-bold">{lowStock}</p>
          <p className="text-amber-600 text-sm font-medium flex items-center gap-1">
             <span className="material-symbols-outlined text-sm">trending_down</span> -5 item
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-base font-medium">Perlu Maintenance</p>
          <p className="text-gray-900 text-3xl font-bold">{maintenance}</p>
          <p className="text-green-600 text-sm font-medium flex items-center gap-1">
             <span className="material-symbols-outlined text-sm">trending_down</span> -1 dari bulan lalu
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Distribusi Item per Lab</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{fill: '#f3f4f6'}}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Status Inventaris</h3>
          <div className="flex-1 min-h-[200px] relative flex items-center justify-center">
             <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-gray-900">{items.length}</span>
                  <span className="text-xs text-gray-500">Total Item</span>
                </div>
             </div>
          </div>
          
          <div className="flex flex-col gap-3 text-sm mt-6">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-2"><span className="size-3 rounded-full bg-emerald-500"></span><p className="text-gray-700">Tersedia</p></div>
                <p className="font-medium text-gray-900">80%</p>
             </div>
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-2"><span className="size-3 rounded-full bg-amber-500"></span><p className="text-gray-700">Stok Rendah</p></div>
                <p className="font-medium text-gray-900">15%</p>
             </div>
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-2"><span className="size-3 rounded-full bg-red-500"></span><p className="text-gray-700">Stok Habis</p></div>
                <p className="font-medium text-gray-900">5%</p>
             </div>
          </div>
        </div>
      </div>

      {/* Actionable Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Item Sering Digunakan</h3>
          <div className="flex flex-col divide-y divide-gray-100">
             <div className="py-3 flex justify-between items-center">
                <div>
                   <p className="font-medium text-gray-900">Mata Bor Carbide 10mm</p>
                   <p className="text-sm text-gray-500">Proses Manufaktur</p>
                </div>
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded">128 x pakai</span>
             </div>
             <div className="py-3 flex justify-between items-center">
                <div>
                   <p className="font-medium text-gray-900">Jangka Sorong Digital</p>
                   <p className="text-sm text-gray-500">Desain Manufaktur</p>
                </div>
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded">97 x pakai</span>
             </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Peringatan Stok Rendah</h3>
          <table className="w-full text-sm text-left">
             <thead className="text-xs text-gray-500 uppercase bg-gray-50 rounded">
                <tr>
                   <th className="py-2 px-2">Nama Item</th>
                   <th className="py-2 px-2">Lokasi</th>
                   <th className="py-2 px-2 text-right">Sisa</th>
                </tr>
             </thead>
             <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                   <td className="py-3 px-2 font-medium">Cairan Pendingin</td>
                   <td className="py-3 px-2">Proses Manufaktur</td>
                   <td className="py-3 px-2 text-right"><span className="text-amber-600 font-bold">20</span> / 100</td>
                </tr>
                <tr>
                   <td className="py-3 px-2 font-medium">Elektroda Las</td>
                   <td className="py-3 px-2">Pengelasan</td>
                   <td className="py-3 px-2 text-right"><span className="text-amber-600 font-bold">5</span> / 50</td>
                </tr>
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
