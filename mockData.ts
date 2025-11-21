
import { InventoryItem, ItemCategory, ItemStatus, Loan, ActivityLog, Notification } from './types';

export const INITIAL_ITEMS: InventoryItem[] = [
  // LAB-01: Proses Manufaktur (CNC, Lathe, Milling)
  {
    id: 'TOOL-001',
    labId: 'LAB-01',
    name: 'Mata Bor Carbide End Mill 10mm',
    category: ItemCategory.TOOL,
    quantity: 12,
    unit: 'pcs',
    location: 'Rak Perkakas A1',
    status: ItemStatus.AVAILABLE,
    description: 'Mata bor 4-flute carbide untuk CNC milling.',
    supplier: 'Sandvik Coromant',
    acquisitionDate: '2023-01-15',
    image: 'https://picsum.photos/id/1/600/400'
  },
  {
    id: 'MACH-002',
    labId: 'LAB-01',
    name: 'Insert Bubut CNC CNMG',
    category: ItemCategory.TOOL,
    quantity: 50,
    unit: 'pcs',
    location: 'Laci B2',
    status: ItemStatus.AVAILABLE,
    image: 'https://picsum.photos/id/2/600/400'
  },
  {
    id: 'COOL-003',
    labId: 'LAB-01',
    name: 'Cairan Pendingin (Coolant)',
    category: ItemCategory.CHEMICAL,
    quantity: 20,
    unit: 'liter',
    location: 'Ruang Penyimpanan',
    status: ItemStatus.LOW_STOCK,
    image: 'https://picsum.photos/id/3/600/400'
  },

  // LAB-02: Material Teknik (Testing, Metallurgy)
  {
    id: 'MAT-001',
    labId: 'LAB-02',
    name: 'Spesimen Uji Tarik Baja',
    category: ItemCategory.MATERIAL,
    quantity: 100,
    unit: 'pcs',
    location: 'Kabinet M1',
    status: ItemStatus.AVAILABLE,
    description: 'Spesimen uji tarik standar ASTM.',
    image: 'https://picsum.photos/id/4/600/400'
  },
  {
    id: 'EQP-005',
    labId: 'LAB-02',
    name: 'Digital Hardness Tester',
    category: ItemCategory.EQUIPMENT,
    quantity: 2,
    unit: 'unit',
    location: 'Meja 3',
    status: ItemStatus.AVAILABLE,
    image: 'https://picsum.photos/id/5/600/400'
  },

  // LAB-03: Pengelasan (Welding)
  {
    id: 'WELD-001',
    labId: 'LAB-03',
    name: 'Elektroda Las E6013',
    category: ItemCategory.MATERIAL,
    quantity: 5,
    unit: 'kotak',
    location: 'Rak W1',
    status: ItemStatus.LOW_STOCK,
    image: 'https://picsum.photos/id/6/600/400'
  },
  {
    id: 'SAFE-002',
    labId: 'LAB-03',
    name: 'Helm Las Auto-Darkening',
    category: ItemCategory.SAFETY,
    quantity: 15,
    unit: 'pcs',
    location: 'Loker Keselamatan',
    status: ItemStatus.AVAILABLE,
    image: 'https://picsum.photos/id/7/600/400'
  },
  {
    id: 'GAS-003',
    labId: 'LAB-03',
    name: 'Tabung Gas Argon',
    category: ItemCategory.MATERIAL,
    quantity: 0,
    unit: 'tabung',
    location: 'Penyimpanan Gas',
    status: ItemStatus.OUT_OF_STOCK,
    image: 'https://picsum.photos/id/8/600/400'
  },

  // LAB-04: Otomasi (PLC, Robotics)
  {
    id: 'ELEC-001',
    labId: 'LAB-04',
    name: 'Unit PLC Siemens S7-1200',
    category: ItemCategory.ELECTRONICS,
    quantity: 8,
    unit: 'unit',
    location: 'Rak PLC-01',
    status: ItemStatus.AVAILABLE,
    image: 'https://picsum.photos/id/9/600/400'
  },
  {
    id: 'ELEC-002',
    labId: 'LAB-04',
    name: 'Sensor Proximity Induktif',
    category: ItemCategory.ELECTRONICS,
    quantity: 3,
    unit: 'pcs',
    location: 'Laci E4',
    status: ItemStatus.LOW_STOCK,
    image: 'https://picsum.photos/id/10/600/400'
  },

  // LAB-05: Desain (CAD/3D Print)
  {
    id: 'MAT-010',
    labId: 'LAB-05',
    name: 'Filamen PLA Putih 1.75mm',
    category: ItemCategory.MATERIAL,
    quantity: 10,
    unit: 'roll',
    location: 'Kabinet 3D',
    status: ItemStatus.AVAILABLE,
    image: 'https://picsum.photos/id/11/600/400'
  },
  {
    id: 'TOOL-005',
    labId: 'LAB-05',
    name: 'Jangka Sorong Digital 150mm',
    category: ItemCategory.TOOL,
    quantity: 25,
    unit: 'pcs',
    location: 'Laci D1',
    status: ItemStatus.AVAILABLE,
    image: 'https://picsum.photos/id/12/600/400'
  }
];

const today = new Date();
const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

export const INITIAL_LOANS: Loan[] = [
  {
    id: 'L-101',
    itemId: 'TOOL-005',
    itemName: 'Jangka Sorong Digital 150mm',
    borrower: 'Ahmad Fauzi',
    borrowerId: '21000154',
    idCardImage: '',
    borrowDate: yesterday.toISOString().split('T')[0],
    dueDate: today.toISOString().split('T')[0],
    returnDate: null,
    status: 'Terlambat',
    quantityBorrowed: 1
  },
  {
    id: 'L-102',
    itemId: 'ELEC-001',
    itemName: 'Unit PLC Siemens S7-1200',
    borrower: 'Siti Aminah',
    borrowerId: '21000233',
    idCardImage: '',
    borrowDate: today.toISOString().split('T')[0],
    dueDate: tomorrow.toISOString().split('T')[0],
    returnDate: null,
    status: 'Dipinjam',
    quantityBorrowed: 1
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  { id: '1', action: 'Menambahkan 10 roll Filamen PLA', user: 'Dr. Arini', timestamp: '2024-03-14 08:30', type: 'add' },
  { id: '2', action: 'Tabung Gas Argon dilaporkan kosong', user: 'Asisten Lab', timestamp: '2024-03-14 10:15', type: 'edit' },
  { id: '3', action: 'Peminjaman tercatat untuk Ahmad Fauzi', user: 'Admin', timestamp: '2024-03-14 11:00', type: 'borrow' }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Peminjaman Terlambat', message: 'Jangka Sorong Digital yang dipinjam oleh Ahmad Fauzi sudah melewati batas waktu.', date: 'Hari Ini', read: false, type: 'warning' },
  { id: '2', title: 'Peringatan Stok Rendah', message: 'Tabung Gas Argon stok habis.', date: 'Kemarin', read: false, type: 'alert' },
  { id: '3', title: 'Jadwal Maintenance', message: 'Maintenance Mesin CNC Milling dijadwalkan minggu depan.', date: '2 hari yang lalu', read: true, type: 'info' }
];
