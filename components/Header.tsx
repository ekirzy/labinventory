
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import EditProfileModal from './EditProfileModal';
import HelpModal from './HelpModal';

interface Props {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: Props) => {
  const { user, notifications, markNotificationRead, clearNotifications } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
              setShowNotifications(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 shrink-0 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Left Search (Global) */}
        <div className="relative w-full max-w-xs hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input 
            type="text" 
            placeholder="Cari..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative flex items-center justify-center rounded-full size-10 text-gray-500 hover:bg-gray-100 transition-colors"
            >
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 size-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
            </button>

            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-fade-in">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-900">Notifikasi</h3>
                        {notifications.length > 0 && (
                            <button onClick={clearNotifications} className="text-xs text-primary hover:underline">Hapus Semua</button>
                        )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">Tidak ada notifikasi</div>
                        ) : (
                            notifications.map(notif => (
                                <div 
                                    key={notif.id} 
                                    onClick={() => markNotificationRead(notif.id)}
                                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${notif.read ? 'opacity-60' : 'bg-blue-50/30'}`}
                                >
                                    <div className="flex gap-3">
                                        <div className={`shrink-0 size-8 rounded-full flex items-center justify-center ${notif.type === 'alert' ? 'bg-red-100 text-red-600' : notif.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                            <span className="material-symbols-outlined text-sm">
                                                {notif.type === 'alert' ? 'error' : notif.type === 'warning' ? 'warning' : 'info'}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">{notif.title}</h4>
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notif.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-2">{notif.date}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>

        {/* Help */}
        <button 
            onClick={() => setIsHelpOpen(true)}
            className="hidden md:flex items-center justify-center rounded-full size-10 text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <span className="material-symbols-outlined">help</span>
        </button>

        {/* Profile Avatar */}
        <button 
            onClick={() => setIsEditProfileOpen(true)}
            className="bg-gray-200 rounded-full size-8 md:size-10 ml-2 border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 overflow-hidden hover:ring-2 ring-primary/50 transition-all"
        >
            {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <span className="material-symbols-outlined text-xl md:text-2xl filled">person</span>
            )}
        </button>
      </div>
    </header>

    <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
    <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
};

export default Header;
