
import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white border border-gray-200 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
             <span className="material-symbols-outlined text-primary">help</span>
             Bantuan & Dokumentasi
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6 text-gray-700 leading-relaxed">
            <section>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Memulai</h3>
                <p>Selamat datang di Sistem Inventaris Laboratorium. Gunakan sidebar untuk menavigasi antara Beranda, Daftar Inventaris, Manajemen Peminjaman, dan Detail Lab.</p>
            </section>

            <section>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Mengelola Inventaris</h3>
                <p>Untuk menambah peralatan baru, buka halaman <strong>Inventaris</strong> dan klik "Tambah Item". Anda dapat memfilter item berdasarkan Lab atau Kategori menggunakan toolbar.</p>
            </section>

             <section>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Peminjaman</h3>
                <p>Gunakan halaman <strong>Peminjaman</strong> untuk melacak item yang dipinjam. Klik "Catat Peminjaman Baru" untuk meminjamkan item kepada mahasiswa atau staf. Anda dapat memfilter peminjaman berdasarkan status (Dipinjam, Dikembalikan, Terlambat).</p>
            </section>

             <section>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Maintenance</h3>
                <p>Di <strong>Detail Lab</strong>, Anda dapat menjadwalkan maintenance untuk beberapa item. Kerusakan yang dilaporkan juga akan muncul di sistem dan perlu ditandai sebagai "Selesai" di halaman Detail Item agar item tersedia kembali.</p>
            </section>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm">
                <p className="font-semibold text-blue-800">Butuh dukungan teknis?</p>
                <p className="text-blue-600">Hubungi Departemen IT di support@university.edu</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
