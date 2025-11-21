
import React from 'react';
import { useApp } from '../context/AppContext';

const Reports = () => {
  const { logs } = useApp();

  const getLogIcon = (type: string) => {
      switch(type) {
          case 'add': return 'add_circle';
          case 'edit': return 'edit';
          case 'delete': return 'delete';
          case 'borrow': return 'book';
          case 'return': return 'assignment_turned_in';
          case 'maintenance': return 'build';
          default: return 'info';
      }
  }

  const getLogColor = (type: string) => {
      switch(type) {
          case 'add': return 'text-green-600 bg-green-50';
          case 'delete': return 'text-red-600 bg-red-50';
          case 'borrow': return 'text-blue-600 bg-blue-50';
          case 'return': return 'text-indigo-600 bg-indigo-50';
          case 'maintenance': return 'text-amber-600 bg-amber-50';
          default: return 'text-gray-600 bg-gray-50';
      }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Laporan Aktivitas</h1>
        <p className="text-gray-500">Log audit semua perubahan inventaris, peminjaman, dan maintenance.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
              <h2 className="font-bold text-gray-900">Aktivitas Terbaru</h2>
          </div>
          <div className="divide-y divide-gray-100">
              {logs.map(log => (
                  <div key={log.id} className="p-4 flex gap-4 hover:bg-gray-50 transition-colors items-start">
                      <div className={`shrink-0 size-10 rounded-full flex items-center justify-center ${getLogColor(log.type)}`}>
                          <span className="material-symbols-outlined text-xl">{getLogIcon(log.type)}</span>
                      </div>
                      <div className="flex-1">
                          <p className="text-gray-900 font-medium">{log.action}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <span className="font-medium text-gray-700">{log.user}</span>
                              <span>•</span>
                              <span>{log.timestamp}</span>
                          </div>
                      </div>
                      <div className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-1 rounded">
                          {log.type}
                      </div>
                  </div>
              ))}
              {logs.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                      Belum ada aktivitas yang tercatat.
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default Reports;
