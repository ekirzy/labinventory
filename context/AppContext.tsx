import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InventoryItem, Loan, ActivityLog, ItemStatus, Lab, UserProfile, Notification } from '../types';
import { supabase } from '../lib/supabase';

interface AppContextType {
  user: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  items: InventoryItem[];
  loans: Loan[];
  logs: ActivityLog[];
  labs: Lab[];
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  addItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  borrowItem: (itemId: string, borrower: string, borrowerId: string, idCardImage: string, quantity: number, dueDate?: string) => void;
  markLoanReturned: (id: string) => void;
  deleteLoan: (id: string) => void;
  reportDamage: (id: string, description: string) => void;
  completeMaintenance: (id: string) => void;
  updateLab: (id: string, updates: Partial<Lab>) => void;
  exportData: () => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_USER: UserProfile = {
  name: 'Dr. Arini',
  role: 'Kepala Laboratorium',
  avatar: ''
};

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: itemsData } = await supabase.from('items').select('*');
        if (itemsData) setItems(itemsData);

        const { data: loansData } = await supabase.from('loans').select('*');
        if (loansData) setLoans(loansData);

        const { data: logsData } = await supabase.from('logs').select('*').order('created_at', { ascending: false });
        if (logsData) setLogs(logsData);

        const { data: labsData } = await supabase.from('labs').select('*');
        if (labsData) setLabs(labsData);

        const { data: notifData } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
        if (notifData) setNotifications(notifData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addLog = async (action: string, type: ActivityLog['type']) => {
    const newLog = {
      id: crypto.randomUUID(),
      action,
      user: user.name,
      timestamp: new Date().toLocaleString('id-ID'),
      type
    };

    // Optimistic update
    setLogs(prev => [newLog, ...prev]);

    // Save to DB
    await supabase.from('logs').insert(newLog);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
    addLog('Profil pengguna diperbarui', 'edit');
  };

  const markNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await supabase.from('notifications').update({ read: true }).eq('id', id);
  };

  const clearNotifications = async () => {
    setNotifications([]);
    // Note: In a real app you might want to delete them or mark all as read in DB
    // For now we just clear local state as requested, or we could delete all
    // await supabase.from('notifications').delete().neq('id', '0'); 
  };

  const addItem = async (newItem: Omit<InventoryItem, 'id'>) => {
    const id = `ITEM-${Math.floor(Math.random() * 10000)}`;
    const image = newItem.image || `https://picsum.photos/seed/${Math.random()}/600/400`;
    const item: InventoryItem = { ...newItem, id, image };

    setItems(prev => [item, ...prev]);
    await supabase.from('items').insert(item);
    addLog(`Item baru ditambahkan: ${newItem.name}`, 'add');
  };

  const updateItem = async (id: string, updatedFields: Partial<InventoryItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
    await supabase.from('items').update(updatedFields).eq('id', id);
    addLog(`Item diperbarui: ${updatedFields.name || id}`, 'edit');
  };

  const deleteItem = async (id: string) => {
    const item = items.find(i => i.id === id);
    setItems(prev => prev.filter(i => i.id !== id));
    await supabase.from('items').delete().eq('id', id);
    if (item) addLog(`Item dihapus: ${item.name}`, 'delete');
  };

  const borrowItem = async (itemId: string, borrower: string, borrowerId: string, idCardImage: string, quantity: number, dueDate?: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    if (item.quantity < quantity) {
      alert('Stok tidak mencukupi!');
      return;
    }

    const finalDueDate = dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const id = `L-${Math.floor(Math.random() * 10000)}`;

    const loan: Loan = {
      id,
      itemId,
      itemName: item.name,
      borrower,
      borrowerId,
      idCardImage,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: finalDueDate,
      returnDate: null,
      status: 'Dipinjam',
      quantityBorrowed: quantity
    };

    setLoans(prev => [loan, ...prev]);
    await supabase.from('loans').insert(loan);

    const newQuantity = item.quantity - quantity;
    let newStatus = item.status;
    if (newQuantity === 0) newStatus = ItemStatus.OUT_OF_STOCK;
    else if (newQuantity < 5) newStatus = ItemStatus.LOW_STOCK;

    updateItem(itemId, { quantity: newQuantity, status: newStatus });
    addLog(`Peminjaman ${quantity}x ${item.name} oleh ${borrower}`, 'borrow');
  };

  const markLoanReturned = async (loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;

    const returnDate = new Date().toISOString().split('T')[0];
    const updates = { status: 'Dikembalikan', returnDate };

    setLoans(prev => prev.map(l => l.id === loanId ? { ...l, ...updates } : l));
    await supabase.from('loans').update(updates).eq('id', loanId);

    const item = items.find(i => i.id === loan.itemId);
    if (item) {
      const newQuantity = item.quantity + loan.quantityBorrowed;
      updateItem(item.id, {
        quantity: newQuantity,
        status: newQuantity > 5 ? ItemStatus.AVAILABLE : ItemStatus.LOW_STOCK
      });
    }
    addLog(`Pengembalian ${loan.quantityBorrowed}x ${loan.itemName}`, 'return');
  };

  const deleteLoan = async (id: string) => {
    const loan = loans.find(l => l.id === id);
    setLoans(prev => prev.filter(l => l.id !== id));
    await supabase.from('loans').delete().eq('id', id);
    if (loan) addLog(`Data peminjaman dihapus: ${loan.itemName}`, 'delete');
  }

  const reportDamage = (itemId: string, description: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      updateItem(itemId, { status: ItemStatus.MAINTENANCE });
      addLog(`Kerusakan dilaporkan: ${item.name}`, 'maintenance');
    }
  };

  const completeMaintenance = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      const newStatus = item.quantity === 0 ? ItemStatus.OUT_OF_STOCK : (item.quantity < 5 ? ItemStatus.LOW_STOCK : ItemStatus.AVAILABLE);
      updateItem(itemId, { status: newStatus });
      addLog(`Maintenance selesai: ${item.name}`, 'maintenance');
    }
  }

  const updateLab = async (id: string, updates: Partial<Lab>) => {
    setLabs(prev => prev.map(lab => lab.id === id ? { ...lab, ...updates } : lab));
    await supabase.from('labs').update(updates).eq('id', id);
    addLog(`Detail Lab diperbarui: ${id}`, 'edit');
  };

  const exportData = () => {
    const header = ['Nama Item', 'Kategori', 'Kuantitas', 'Satuan', 'Status', 'Nama Lab', 'Lokasi', 'Tanggal Perolehan'];
    const rows = items.map(item => {
      const lab = labs.find(l => l.id === item.labId);
      return [
        `"${item.name.replace(/"/g, '""')}"`,
        item.category,
        item.quantity,
        item.unit,
        item.status,
        `"${(lab ? lab.name : 'Lab Tidak Diketahui').replace(/"/g, '""')}"`,
        `"${item.location.replace(/"/g, '""')}"`,
        item.acquisitionDate || ''
      ].join(',');
    });

    const csvContent = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ekspor_inventaris_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppContext.Provider value={{
      user, updateUserProfile,
      items, loans, logs, labs, notifications, markNotificationRead, clearNotifications,
      addItem, updateItem, deleteItem,
      borrowItem, markLoanReturned, deleteLoan,
      reportDamage, completeMaintenance,
      updateLab, exportData,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
