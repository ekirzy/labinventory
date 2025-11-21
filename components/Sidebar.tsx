
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: Props) => {
  const location = useLocation();
  const { user } = useApp();
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Sidebar content to reuse
  const SidebarContent = (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col gap-8">
        {/* Logo */}
        <div className="flex items-start gap-3 px-2">
          <div className="bg-primary/10 p-2 rounded-lg shrink-0 mt-1">
            <span className="material-symbols-outlined text-primary text-2xl">science</span>
          </div>
          <span className="text-gray-900 text-sm font-bold leading-tight pt-2">Inventaris Laboratorium Teknologi Rekayasa Manufaktur</span>
        </div>

        {/* Nav */}
        <div className="flex flex-col gap-1">
          {[
            { path: '/', icon: 'dashboard', label: 'Beranda' },
            { path: '/inventory', icon: 'inventory_2', label: 'Inventaris' },
            { path: '/labs', icon: 'location_on', label: 'Laboratorium' },
            { path: '/loans', icon: 'description', label: 'Peminjaman' },
            { path: '/reports', icon: 'bar_chart', label: 'Laporan' }
          ].map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              onClick={onClose} // Close sidebar on click (mobile)
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(item.path) ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <span className={`material-symbols-outlined ${isActive(item.path) ? 'filled' : ''}`}>{item.icon}</span>
              <p className="text-sm">{item.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Profile */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex gap-3 items-center">
          <div className="bg-gray-200 rounded-full size-10 border border-gray-200 flex items-center justify-center text-gray-400 overflow-hidden">
             {user.avatar ? (
                 <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
             ) : (
                <span className="material-symbols-outlined text-2xl filled">person</span>
             )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-gray-900 text-sm font-medium truncate max-w-[140px]">{user.name}</h1>
            <p className="text-gray-500 text-xs truncate max-w-[140px]">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 p-4 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {SidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
