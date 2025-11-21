
export enum ItemStatus {
  AVAILABLE = 'Tersedia',
  LOW_STOCK = 'Stok Rendah',
  OUT_OF_STOCK = 'Stok Habis',
  MAINTENANCE = 'Maintenance',
  BORROWED = 'Dipinjam'
}

export enum ItemCategory {
  EQUIPMENT = 'Peralatan',
  TOOL = 'Alat',
  MATERIAL = 'Material',
  MACHINERY = 'Mesin',
  ELECTRONICS = 'Elektronik',
  SAFETY = 'Keselamatan',
  CHEMICAL = 'Bahan Kimia'
}

export interface InventoryItem {
  id: string;
  labId: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  unit: string;
  location: string;
  status: ItemStatus;
  description?: string;
  supplier?: string;
  acquisitionDate?: string;
  image?: string;
  serialNumber?: string;
}

export interface Loan {
  id: string;
  itemId: string;
  itemName: string;
  borrower: string;
  borrowerId: string; // NIM/NIP/NIK
  idCardImage: string; // URL/Path to uploaded KTP/KARMAS
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'Dipinjam' | 'Dikembalikan' | 'Terlambat';
  quantityBorrowed: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: 'add' | 'edit' | 'delete' | 'borrow' | 'return' | 'maintenance';
}

export interface Lab {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
}

export interface UserProfile {
  name: string;
  role: string;
  avatar: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'alert';
}
