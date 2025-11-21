
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ConfirmationModal from '../components/ConfirmationModal';
import RecordLoanModal from '../components/RecordLoanModal';

const Loans = () => {
    const { loans, markLoanReturned, deleteLoan } = useApp();
    const [loanToDelete, setLoanToDelete] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Filters
    const [filterStatus, setFilterStatus] = useState<'Semua' | 'Dipinjam' | 'Dikembalikan' | 'Terlambat'>('Semua');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const statusDropdownRef = useRef<HTMLDivElement>(null);

    // Date Filter
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
                setShowStatusDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredLoans = loans.filter(l => {
        const matchesSearch = l.itemName.toLowerCase().includes(search.toLowerCase()) ||
            l.borrower.toLowerCase().includes(search.toLowerCase()) ||
            (l.borrowerId && l.borrowerId.includes(search));

        let matchesDate = true;
        if (startDate && endDate) {
            const borrowDate = new Date(l.borrowDate);
            const start = new Date(startDate);
            const end = new Date(endDate);
            matchesDate = borrowDate >= start && borrowDate <= end;
        } else if (startDate) {
            matchesDate = new Date(l.borrowDate) >= new Date(startDate);
        } else if (endDate) {
            matchesDate = new Date(l.borrowDate) <= new Date(endDate);
        }

        // Calculate overdue status dynamically or use stored status
        const isCalculatedOverdue = new Date(l.dueDate) < new Date() && l.status === 'Dipinjam';
        const isActuallyOverdue = isCalculatedOverdue || l.status === 'Terlambat';

        let matchesStatus = true;
        if (filterStatus === 'Semua') {
            matchesStatus = true;
        } else if (filterStatus === 'Terlambat') {
            matchesStatus = isActuallyOverdue;
        } else if (filterStatus === 'Dipinjam') {
            matchesStatus = l.status === 'Dipinjam';
        } else {
            matchesStatus = l.status === filterStatus;
        }

        return matchesSearch && matchesDate && matchesStatus;
    });

    const confirmDelete = (id: string) => setLoanToDelete(id);
    const handleDelete = () => { if (loanToDelete) deleteLoan(loanToDelete); setLoanToDelete(null); };

    const resetDateFilter = () => {
        setStartDate('');
        setEndDate('');
        setShowDateFilter(false);
    }

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-gray-900 text-2xl md:text-3xl font-bold leading-tight">Manajemen Peminjaman</h1>
                    <p className="text-gray-500 text-sm md:text-base font-normal">Lacak peralatan dan material yang dipinjam.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                        onClick={() => setIsRecordModalOpen(true)}
                        className="flex w-full md:min-w-[84px] md:max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white gap-2 text-sm font-bold hover:bg-primary-hover transition-colors shadow-sm shadow-blue-500/20"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                        <span className="truncate">Catat Peminjaman Baru</span>
                    </button>
                </div>
            </div>

            {/* Filters Bar - Stacking on mobile */}
            <div className="mt-8 flex flex-col gap-4 mb-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="w-full md:flex-grow md:min-w-[300px] md:max-w-lg">
                        <label className="flex flex-col h-12 w-full">
                            <div className="flex w-full flex-1 items-stretch rounded-lg h-full shadow-sm">
                                <div className="text-gray-400 bg-white flex items-center justify-center pl-4 rounded-l-lg border border-r-0 border-gray-300">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-gray-900 focus:ring-2 focus:ring-primary/50 focus:border-primary border border-gray-300 bg-white h-full placeholder:text-gray-400 px-2 text-base font-normal"
                                    placeholder="Cari item, peminjam, atau NIM..."
                                />
                            </div>
                        </label>
                    </div>

                    {/* Filters Container */}
                    <div className="flex gap-3 flex-wrap w-full md:w-auto">
                        {/* Status Filter Dropdown */}
                        <div className="relative w-full md:w-auto" ref={statusDropdownRef}>
                            <button
                                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                className={`flex w-full md:w-auto h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-3 border transition-colors ${filterStatus !== 'Semua' ? 'bg-blue-50 text-primary border-primary' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                            >
                                <span className="material-symbols-outlined text-gray-500" style={{ fontSize: '20px' }}>sell</span>
                                <p className="text-sm font-medium">Status: {filterStatus}</p>
                                <span className="material-symbols-outlined text-gray-500" style={{ fontSize: '20px' }}>expand_more</span>
                            </button>
                            {showStatusDropdown && (
                                <div className="absolute right-0 left-0 md:left-auto mt-2 w-full md:w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-20 animate-fade-in">
                                    <button onClick={() => { setFilterStatus('Semua'); setShowStatusDropdown(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${filterStatus === 'Semua' ? 'text-primary font-medium' : 'text-gray-700'}`}>Semua</button>
                                    <button onClick={() => { setFilterStatus('Dipinjam'); setShowStatusDropdown(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${filterStatus === 'Dipinjam' ? 'text-primary font-medium' : 'text-gray-700'}`}>Dipinjam</button>
                                    <button onClick={() => { setFilterStatus('Dikembalikan'); setShowStatusDropdown(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${filterStatus === 'Dikembalikan' ? 'text-primary font-medium' : 'text-gray-700'}`}>Dikembalikan</button>
                                    <button onClick={() => { setFilterStatus('Terlambat'); setShowStatusDropdown(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 ${filterStatus === 'Terlambat' ? 'font-bold' : ''}`}>Terlambat</button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setShowDateFilter(!showDateFilter)}
                            className={`flex w-full md:w-auto h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-3 border transition-colors ${showDateFilter ? 'bg-blue-50 text-primary border-primary' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>calendar_month</span>
                            <p className="text-sm font-medium">Rentang Tanggal</p>
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{showDateFilter ? 'expand_less' : 'expand_more'}</span>
                        </button>
                    </div>
                </div>

                {/* Expanded Date Filter Inputs */}
                {showDateFilter && (
                    <div className="bg-white border border-gray-200 p-4 rounded-xl flex flex-col md:flex-row items-end gap-4 animate-fade-in shadow-sm">
                        <label className="flex flex-col gap-2 w-full md:w-auto">
                            <span className="text-sm text-gray-600">Tanggal Mulai</span>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full"
                            />
                        </label>
                        <label className="flex flex-col gap-2 w-full md:w-auto">
                            <span className="text-sm text-gray-600">Tanggal Selesai</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full"
                            />
                        </label>
                        <button onClick={resetDateFilter} className="w-full md:w-auto px-4 py-2 h-[42px] text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                            Hapus
                        </button>
                    </div>
                )}
            </div>

            {/* Table - Scrollable on Mobile */}
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg bg-white border border-gray-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 min-w-[900px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nama Item</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Info Peminjam</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Jml</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Tgl Pinjam</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Jatuh Tempo</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Aksi</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {filteredLoans.map(loan => {
                            const isCalculatedOverdue = new Date(loan.dueDate) < new Date() && loan.status === 'Dipinjam';
                            const isOverdue = isCalculatedOverdue || loan.status === 'Terlambat';

                            return (
                                <tr key={loan.id} className={`hover:bg-gray-50/50 transition-colors ${isOverdue ? 'bg-red-50' : ''}`}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{loan.itemName}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{loan.borrower}</span>
                                            <span className="text-xs">{loan.borrowerId || '-'}</span>
                                            {loan.idCardImage && (
                                                <button
                                                    onClick={() => setPreviewImage(loan.idCardImage)}
                                                    className="text-xs text-primary hover:underline mt-1 text-left flex items-center gap-1"
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>visibility</span>
                                                    Lihat ID
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{loan.quantityBorrowed}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {new Date(loan.borrowDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className={`whitespace-nowrap px-3 py-4 text-sm ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                                        {new Date(loan.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${loan.status === 'Dikembalikan' ? 'bg-green-100 text-green-800' :
                                                isOverdue ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {isOverdue ? 'Terlambat' : loan.status}
                                        </span>
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            {loan.status !== 'Dikembalikan' && (
                                                <button
                                                    onClick={() => markLoanReturned(loan.id)}
                                                    className="flex items-center justify-center overflow-hidden rounded-md h-8 px-3 bg-primary text-white gap-2 text-xs font-bold hover:bg-primary-hover transition-colors shadow-sm"
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>assignment_turned_in</span>
                                                    Kembali
                                                </button>
                                            )}
                                            <button onClick={() => confirmDelete(loan.id)} className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded">
                                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        {filteredLoans.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-gray-500">Tidak ada data peminjaman yang sesuai.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <RecordLoanModal
                isOpen={isRecordModalOpen}
                onClose={() => setIsRecordModalOpen(false)}
            />

            {/* Image Preview Modal - Responsive */}
            {previewImage && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={() => setPreviewImage(null)}>
                    <div className="w-full max-w-2xl max-h-[90vh] bg-white p-2 rounded-lg overflow-hidden">
                        <img src={previewImage} alt="ID Preview" className="w-full h-full object-contain" />
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={!!loanToDelete}
                onClose={() => setLoanToDelete(null)}
                onConfirm={handleDelete}
                title="Hapus Data Peminjaman"
                message="Apakah Anda yakin ingin menghapus data peminjaman ini? Tindakan ini tidak dapat dibatalkan."
                isDanger={true}
                confirmText="Hapus"
                cancelText="Batal"
            />
        </div>
    );
};

export default Loans;
