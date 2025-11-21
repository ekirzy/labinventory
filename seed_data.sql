-- Seed Labs
INSERT INTO labs (id, name, location, description, image) VALUES
('LAB-01', 'Proses Manufaktur', 'Gedung A, Ruang 101', 'Lab utama untuk proses manufaktur (CNC, Bubut, Frais)', 'https://picsum.photos/id/20/600/400'),
('LAB-02', 'Material Teknik', 'Gedung B, Ruang 204', 'Lab pengujian material (Tarik, Kekerasan, Struktur Mikro)', 'https://picsum.photos/id/22/600/400'),
('LAB-03', 'Pengelasan dan Pengecoran', 'Gedung C, Ruang 305', 'Fasilitas pengelasan (SMAW, MIG/MAG, TIG) dan pengecoran logam', 'https://picsum.photos/id/24/600/400'),
('LAB-04', 'Otomasi dan Robotika', 'Gedung D, Ruang 402', 'Lab PLC, Pneumatik, Hidrolik, dan Lengan Robot', 'https://picsum.photos/id/252/600/400'),
('LAB-05', 'Desain Manufaktur', 'Gedung E, Ruang 105', 'Lab CAD/CAM/CAE dan 3D Printing', 'https://picsum.photos/id/28/600/400');

-- Seed Items
INSERT INTO items (id, "labId", name, category, quantity, unit, location, status, description, supplier, "acquisitionDate", image) VALUES
('TOOL-001', 'LAB-01', 'Mata Bor Carbide End Mill 10mm', 'Alat', 12, 'pcs', 'Rak Perkakas A1', 'Tersedia', 'Mata bor 4-flute carbide untuk CNC milling.', 'Sandvik Coromant', '2023-01-15', 'https://picsum.photos/id/1/600/400'),
('MACH-002', 'LAB-01', 'Insert Bubut CNC CNMG', 'Alat', 50, 'pcs', 'Laci B2', 'Tersedia', NULL, NULL, NULL, 'https://picsum.photos/id/2/600/400'),
('COOL-003', 'LAB-01', 'Cairan Pendingin (Coolant)', 'Bahan Kimia', 20, 'liter', 'Ruang Penyimpanan', 'Stok Menipis', NULL, NULL, NULL, 'https://picsum.photos/id/3/600/400'),
('MAT-001', 'LAB-02', 'Spesimen Uji Tarik Baja', 'Material', 100, 'pcs', 'Kabinet M1', 'Tersedia', 'Spesimen uji tarik standar ASTM.', NULL, NULL, 'https://picsum.photos/id/4/600/400'),
('EQP-005', 'LAB-02', 'Digital Hardness Tester', 'Peralatan', 2, 'unit', 'Meja 3', 'Tersedia', NULL, NULL, NULL, 'https://picsum.photos/id/5/600/400'),
('WELD-001', 'LAB-03', 'Elektroda Las E6013', 'Material', 5, 'kotak', 'Rak W1', 'Stok Menipis', NULL, NULL, NULL, 'https://picsum.photos/id/6/600/400'),
('SAFE-002', 'LAB-03', 'Helm Las Auto-Darkening', 'Keselamatan', 15, 'pcs', 'Loker Keselamatan', 'Tersedia', NULL, NULL, NULL, 'https://picsum.photos/id/7/600/400'),
('GAS-003', 'LAB-03', 'Tabung Gas Argon', 'Material', 0, 'tabung', 'Penyimpanan Gas', 'Stok Habis', NULL, NULL, NULL, 'https://picsum.photos/id/8/600/400'),
('ELEC-001', 'LAB-04', 'Unit PLC Siemens S7-1200', 'Elektronik', 8, 'unit', 'Rak PLC-01', 'Tersedia', NULL, NULL, NULL, 'https://picsum.photos/id/9/600/400'),
('ELEC-002', 'LAB-04', 'Sensor Proximity Induktif', 'Elektronik', 3, 'pcs', 'Laci E4', 'Stok Menipis', NULL, NULL, NULL, 'https://picsum.photos/id/10/600/400'),
('MAT-010', 'LAB-05', 'Filamen PLA Putih 1.75mm', 'Material', 10, 'roll', 'Kabinet 3D', 'Tersedia', NULL, NULL, NULL, 'https://picsum.photos/id/11/600/400'),
('TOOL-005', 'LAB-05', 'Jangka Sorong Digital 150mm', 'Alat', 25, 'pcs', 'Laci D1', 'Tersedia', NULL, NULL, NULL, 'https://picsum.photos/id/12/600/400');

-- Seed Loans
INSERT INTO loans (id, "itemId", "itemName", borrower, "borrowerId", "idCardImage", "borrowDate", "dueDate", "returnDate", status, "quantityBorrowed") VALUES
('L-101', 'TOOL-005', 'Jangka Sorong Digital 150mm', 'Ahmad Fauzi', '21000154', '', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE, NULL, 'Terlambat', 1),
('L-102', 'ELEC-001', 'Unit PLC Siemens S7-1200', 'Siti Aminah', '21000233', '', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day', NULL, 'Dipinjam', 1);

-- Seed Logs
INSERT INTO logs (id, action, "user", timestamp, type) VALUES
('1', 'Menambahkan 10 roll Filamen PLA', 'Dr. Arini', '2024-03-14 08:30', 'add'),
('2', 'Tabung Gas Argon dilaporkan kosong', 'Asisten Lab', '2024-03-14 10:15', 'edit'),
('3', 'Peminjaman tercatat untuk Ahmad Fauzi', 'Admin', '2024-03-14 11:00', 'borrow');

-- Seed Notifications
INSERT INTO notifications (id, title, message, date, read, type) VALUES
('1', 'Peminjaman Terlambat', 'Jangka Sorong Digital yang dipinjam oleh Ahmad Fauzi sudah melewati batas waktu.', 'Hari Ini', false, 'warning'),
('2', 'Peringatan Stok Rendah', 'Tabung Gas Argon stok habis.', 'Kemarin', false, 'alert'),
('3', 'Jadwal Maintenance', 'Maintenance Mesin CNC Milling dijadwalkan minggu depan.', '2 hari yang lalu', true, 'info');
