"use client";

import React, { useState, useCallback } from 'react';
import * as ExcelJS from 'exceljs';
import { useData } from '../../hooks/useContextHooks';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Loader2, X, UploadCloud } from '../../components/icons';
import { ImportDoctorsExample } from './ImportDoctorsExample';
import { Doctor } from '../../types';

interface ImportDoctorsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const requiredHeaders = ['name', 'specialty', 'status'];
const optionalHeaders = ['image_public_id', 'schedule', 'status_info', 'notes', 'display_order'];

export const ImportDoctorsModal: React.FC<ImportDoctorsModalProps> = ({ isOpen, onClose }) => {
    const { addItem } = useData();
    const [file, setFile] = useState<File | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showExample, setShowExample] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
            setImportResult(null);
        }
    };

    const handleImport = useCallback(async () => {
        if (!file) {
            setError('Silakan pilih file Excel terlebih dahulu.');
            return;
        }
        setIsImporting(true);
        setError(null);
        setImportResult(null);

        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(await file.arrayBuffer());
            
            const worksheet = workbook.worksheets[0];
            if (!worksheet) {
                throw new Error("File Excel kosong atau format tidak sesuai.");
            }

            // Get headers from the first row
            const headers = worksheet.getRow(1).values as string[];
            if (!headers || headers.length <= 1) {
                throw new Error("Format file tidak valid. Pastikan baris pertama berisi header kolom.");
            }

            // Remove first empty element and lowercase headers
            headers.shift();
            const normalizedHeaders = headers.map(h => String(h).toLowerCase().trim());

            const missingHeaders = requiredHeaders.filter(h => !normalizedHeaders.includes(h));
            if (missingHeaders.length > 0) {
                throw new Error(`Kolom wajib tidak ditemukan: ${missingHeaders.join(', ')}. Pastikan nama kolom sesuai format.`);
            }

            let successCount = 0;
            let failedCount = 0;

            // Process rows
            const rows = worksheet.getRows(2, worksheet.rowCount - 1) || [];
            const headerIndexMap = normalizedHeaders.reduce((acc, header, index) => {
                acc[header] = index + 1; // ExcelJS uses 1-based indexing
                return acc;
            }, {} as Record<string, number>);

            await Promise.all(rows.map(async (row) => {
                if (!row || !row.values) return;

                const rowValues = row.values as any[];
                const doctorData: Partial<Doctor> = {
                    name: rowValues[headerIndexMap.name],
                    specialty: rowValues[headerIndexMap.specialty],
                    status: rowValues[headerIndexMap.status] === 'Praktek' ? 'Praktek' : 'Tutup',
                    image_public_id: rowValues[headerIndexMap.image_public_id] || null,
                    schedule: rowValues[headerIndexMap.schedule] || 'Sesuai perjanjian',
                    status_info: rowValues[headerIndexMap.status_info] || null,
                    notes: rowValues[headerIndexMap.notes] || null,
                    display_order: rowValues[headerIndexMap.display_order] ? 
                        parseInt(String(rowValues[headerIndexMap.display_order]), 10) : undefined,
                };

                try {
                    if (!doctorData.name || !doctorData.specialty || !doctorData.status) {
                        failedCount++;
                        return;
                    }

                    await addItem('doctors', doctorData);
                    successCount++;
                } catch (err) {
                    console.error('Gagal mengimpor baris:', doctorData, err);
                    failedCount++;
                }
            }));

            setImportResult({ success: successCount, failed: failedCount });
        } catch (err: any) {
            console.error('Error importing:', err);
            setError(err.message || 'Terjadi kesalahan saat mengimpor data.');
        } finally {
            setIsImporting(false);
        }
    }, [file, addItem]);

    const resetState = () => {
        setFile(null);
        setError(null);
        setImportResult(null);
        setShowExample(false);
        setIsImporting(false);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    // Reset state when modal is explicitly closed
    React.useEffect(() => {
        if (!isOpen) {
            resetState();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Handler untuk modal backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        // Jika yang diklik adalah backdrop (bukan modal content)
        if (e.target === e.currentTarget) {
            return; // Tidak melakukan apa-apa, mencegah auto-close
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4"
             onClick={(e) => {
                 // Don't close modal when clicking overlay
                 e.preventDefault();
                 e.stopPropagation();
             }}>
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Import Data Dokter</CardTitle>
                        <Button variant="ghost" size="icon" onClick={handleClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="text-sm text-muted-foreground">
                            <p className="mb-2">Petunjuk Import:</p>
                            <ul className="list-disc pl-5 space-y-1">
                            <li>Gunakan file format .xlsx.</li>
                                <li>Kolom wajib: name, specialty, status (Praktek/Tutup)</li>
                                <li>Kolom opsional: image_public_id, schedule, status_info, notes, display_order</li>
                            </ul>
                            <Button
                                variant="link"
                                onClick={() => setShowExample(!showExample)}
                                className="mt-2 h-auto p-0 text-primary"
                            >
                                {showExample ? 'Sembunyikan contoh' : 'Lihat contoh format'}
                            </Button>
                        </div>

                        {showExample && <ImportDoctorsExample />}

                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="file-upload" className="w-full">
                                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                                    <UploadCloud className="h-8 w-8 mb-2 text-muted-foreground" />
                                    <div className="text-sm text-center">
                                        <span className="font-semibold text-primary">Klik untuk upload</span> atau drag and drop
                                        <p className="text-xs text-muted-foreground mt-1">XLSX hingga 10MB</p>
                                    </div>
                                </div>
                                <input id="file-upload" name="file-upload" type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileChange} />
                            </label>
                        </div>

                        {file && (
                            <div className="text-sm">
                                File terpilih: <span className="font-medium">{file.name}</span>
                            </div>
                        )}

                        {error && (
                            <div className="text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        {importResult && (
                            <div className="text-sm">
                                Import selesai:<br />
                                ✅ Berhasil: {importResult.success} data<br />
                                {importResult.failed > 0 && `❌ Gagal: ${importResult.failed} data`}
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleClose}>
                        Batal
                    </Button>
                    <Button onClick={handleImport} disabled={!file || isImporting}>
                        {isImporting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Mengimpor...
                            </>
                        ) : (
                            'Import'
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};