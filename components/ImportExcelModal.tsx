import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useApp } from '../context/AppContext';
import { ItemCategory } from '../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const ImportExcelModal = ({ isOpen, onClose }: Props) => {
    const { importItems, labs } = useApp();
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            parseExcel(selectedFile);
            setError(null);
            setSuccess(null);
        }
    };

    const parseExcel = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                setPreviewData(jsonData);
            } catch (err) {
                setError('Gagal membaca file Excel. Pastikan format file benar.');
                console.error(err);
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleImport = async () => {
        if (!previewData.length) {
            setError('Tidak ada data untuk diimpor.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Map Excel columns to InventoryItem fields
            const itemsToImport = previewData.map((row: any) => {
                // Basic validation
                if (!row['Nama Item'] || !row['Jumlah']) {
                    throw new Error('Kolom "Nama Item" dan "Jumlah" wajib diisi.');
                }

                // Find Lab ID based on name or default to first lab
                const labName = row['Nama Lab'] || row['Lab'];
                const lab = labs.find(l => l.name === labName) || labs[0];

                // Validate Category
                let category = ItemCategory.EQUIPMENT;
                const catStr = row['Kategori'];
                if (Object.values(ItemCategory).includes(catStr as ItemCategory)) {
                    category = catStr as ItemCategory;
                }

                return {
                    name: row['Nama Item'],
                    category: category,
                    quantity: parseInt(row['Jumlah']) || 0,
                    unit: row['Satuan'] || 'pcs',
                    labId: lab.id,
                    location: row['Lokasi'] || '',
                    description: row['Deskripsi'] || '',
                    supplier: row['Supplier'] || '',
                    serialNumber: row['Serial Number'] || '',
                    acquisitionDate: row['Tanggal Perolehan'] || new Date().toISOString().split('T')[0],
                    image: row['URL Gambar'] || '',
                };
            });

            await importItems(itemsToImport);
            setSuccess(`Berhasil mengimpor ${itemsToImport.length} item.`);
            setTimeout(() => {
                onClose();
                setFile(null);
                setPreviewData([]);
                setSuccess(null);
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan saat mengimpor data.');
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = () => {
        const template = [
            {
                'Nama Item': 'Contoh Item',
                'Kategori': 'Peralatan',
                'Jumlah': 10,
                'Satuan': 'pcs',
                'Nama Lab': labs[0]?.name || 'Lab Manufaktur',
                'Lokasi': 'Rak A1',
                'Deskripsi': 'Deskripsi item...',
                'Supplier': 'PT. Contoh',
                'Serial Number': 'SN12345',
                'Tanggal Perolehan': '2023-01-01',
                'URL Gambar': ''
            }
        ];
        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Template');
        XLSX.writeFile(wb, 'template_import_inventaris.xlsx');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white border border-gray-200 w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="p-4 md:p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg md:text-xl font-bold tracking-tight text-gray-900">Import Data dari Excel</h2>
                        <p className="text-gray-500 text-xs md:text-sm mt-1">Upload file Excel (.xlsx) untuk menambahkan item secara massal.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar flex-1">

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
                        <div className="flex gap-2">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">upload_file</span>
                                Pilih File Excel
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".xlsx, .xls"
                                className="hidden"
                            />
                            <button
                                onClick={downloadTemplate}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">download</span>
                                Download Template
                            </button>
                        </div>
                        {file && <span className="text-sm text-gray-600 font-medium bg-blue-50 px-3 py-1 rounded-full border border-blue-100">{file.name}</span>}
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined filled">error</span>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined filled">check_circle</span>
                            {success}
                        </div>
                    )}

                    {/* Preview Table */}
                    {previewData.length > 0 && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                                Preview Data ({previewData.length} baris)
                            </div>
                            <div className="overflow-x-auto max-h-[300px]">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                        <tr>
                                            {Object.keys(previewData[0]).map((key) => (
                                                <th key={key} className="px-6 py-3 whitespace-nowrap">{key}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewData.slice(0, 10).map((row, i) => (
                                            <tr key={i} className="bg-white border-b hover:bg-gray-50">
                                                {Object.values(row).map((val: any, j) => (
                                                    <td key={j} className="px-6 py-4 whitespace-nowrap">{val}</td>
                                                ))}
                                            </tr>
                                        ))}
                                        {previewData.length > 10 && (
                                            <tr>
                                                <td colSpan={Object.keys(previewData[0]).length} className="px-6 py-4 text-center text-gray-500 italic">
                                                    ... dan {previewData.length - 10} baris lainnya
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {!file && (
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50">
                            <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">description</span>
                            <p className="text-gray-500 font-medium">Belum ada file yang dipilih</p>
                            <p className="text-gray-400 text-sm mt-1">Silakan upload file Excel untuk melihat preview</p>
                        </div>
                    )}

                </div>

                <div className="p-4 md:p-6 border-t border-gray-200 flex justify-end gap-4 bg-gray-50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">Batal</button>
                    <button
                        onClick={handleImport}
                        disabled={!file || loading || previewData.length === 0}
                        className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 shadow-md shadow-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                        {loading ? 'Mengimpor...' : 'Import Data'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportExcelModal;
