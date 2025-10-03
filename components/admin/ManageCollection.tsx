
"use client";

import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useData } from '../../hooks/useContextHooks';
import { collectionConfigs } from '../../lib/collectionConfig';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import RichTextEditor from '../../components/admin/RichTextEditor';
import { ImportDoctorsModal } from './ImportDoctorsModal';
import { PlusCircle, Loader2, X, Trash2, UploadCloud, Info } from '../../components/icons';
import { cn, formatDate } from '../../lib/utils';
import { TableName } from '../../types';

interface ManageCollectionProps {
    collectionName: TableName;
}

const ManageCollection: React.FC<ManageCollectionProps> = ({ collectionName }) => {
    const config = collectionConfigs[collectionName];
    const dataContext = useData();
    const items = (dataContext as any)[collectionName] || [];
    
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<any>(null);
    const [currentItem, setCurrentItem] = useState<any>(null);

    const getInitialFormData = () => config.fields.reduce((acc, field) => {
        acc[field.name] = field.type === 'date' ? new Date().toISOString().split('T')[0] : '';
        if (field.name === 'status') acc[field.name] = 'Praktek';
        return acc;
    }, {} as any);
    
    const [formData, setFormData] = useState(getInitialFormData());

    // Reset form when collection changes
    useEffect(() => {
        setFormData(getInitialFormData());
        setCurrentItem(null);
        setIsModalOpen(false);
        setIsImportModalOpen(false);
        setIsConfirmOpen(false);
    }, [collectionName, config.fields]);

    // Handle modal close only when explicitly requested
    const handleModalClose = (e?: React.MouseEvent) => {
        // If clicking the modal backdrop (not the modal itself)
        if (e && e.target === e.currentTarget) {
            return; // Do nothing, prevent auto-close
        }
        setIsModalOpen(false);
        resetForm();
    };


    const handleOpenModal = (item: Record<string, any> | null = null) => {
        setCurrentItem(item);
        if (item && typeof item === 'object') {
            const formattedItem: Record<string, any> = { ...item };
            config.fields.forEach(field => {
                if (field.type === 'date' && item[field.name]) {
                    const date = new Date(item[field.name]);
                    if (!isNaN(date.getTime())) {
                        formattedItem[field.name] = date.toISOString().split('T')[0];
                    } else {
                        formattedItem[field.name] = '';
                    }
                }
            });
            setFormData(formattedItem);
        } else {
            setFormData(getInitialFormData());
        }
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData(getInitialFormData());
        setCurrentItem(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: Record<string, any>) => ({ ...prev, [name]: value }));
    };
    
    // Reset form state when component unmounts
    useEffect(() => {
        return () => {
            resetForm();
            setIsModalOpen(false);
            setIsImportModalOpen(false);
            setIsConfirmOpen(false);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload: { [key: string]: any } = {};
        config.fields.forEach(field => {
            if (Object.prototype.hasOwnProperty.call(formData, field.name)) {
                let value = formData[field.name];
                if (field.type === 'number') {
                    value = (value === null || String(value).trim() === '') ? null : parseInt(String(value), 10);
                }
                payload[field.name] = value;
            }
        });

        if (collectionName === 'articles') {
            if (currentItem) {
                const dateString = payload.created_at;
                if (dateString && typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                    payload.created_at = new Date(dateString + 'T00:00:00.000Z').toISOString();
                } else if (!dateString) {
                    payload.created_at = null;
                }
            } else {
                if (!payload.created_at) {
                    delete payload.created_at;
                } else {
                    payload.created_at = new Date(payload.created_at + 'T00:00:00.000Z').toISOString();
                }
            }
        }
    
        try {
            if (currentItem) {
                await dataContext.updateItem(collectionName, currentItem.id, payload);
            } else {
                await dataContext.addItem(collectionName, payload);
            }
            resetForm();
            handleCloseModal();
        } catch (err: any) {
            console.error(`Error saving ${collectionName}:`, err);

            let detailedMessage = 'Terjadi kesalahan tak terduga.';
            
            // Most specific check: Supabase/PostgrestError object
            if (err && typeof err === 'object' && typeof err.message === 'string') {
                const parts: string[] = [err.message];
                if (typeof err.details === 'string') parts.push(`Detail: ${err.details}`);
                if (typeof err.hint === 'string') parts.push(`Petunjuk: ${err.hint}`);
                if (typeof err.code === 'string') parts.push(`Kode Error: ${err.code}`);

                // Provide helpful, user-friendly hints for common database errors
                if (err.code === '23505') { // unique_violation
                    parts.push("\nPetunjuk Tambahan: Kesalahan ini biasanya terjadi jika Anda mencoba menambahkan item dengan nama yang sudah ada atau sangat mirip, yang menghasilkan 'slug' (URL) yang sama. Mohon periksa kembali apakah ada data duplikat.");
                } else if (err.code === '23502' && err.message.includes('"slug"')) { // not_null_violation on slug
                    parts.push("\nPetunjuk Tambahan: Database Anda mengharuskan 'slug' diisi, tetapi aplikasi tidak mengirimnya. Ini menandakan skema database belum diperbarui. Harap jalankan skrip SQL yang telah disediakan untuk mengatur 'slug' agar dibuat secara otomatis.");
                }
                
                detailedMessage = parts.join('\n');
            // Check for standard JavaScript Error object
            } else if (err instanceof Error) {
                detailedMessage = err.message;
            // Fallback for anything else
            } else {
                try {
                    detailedMessage = JSON.stringify(err);
                } catch {
                    detailedMessage = 'Terjadi kesalahan yang tidak dapat ditampilkan.';
                }
            }
        
            alert(`Gagal menyimpan data:\n\n${detailedMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (item: any) => {
        setItemToDelete(item);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            setIsLoading(true);
            try {
                await dataContext.deleteItem(collectionName, itemToDelete.id);
            } catch (error) {
                console.error(`Error deleting ${collectionName}:`, error);
                alert(`Gagal menghapus data: ${(error as Error).message}`);
            } finally {
                setIsLoading(false);
                setIsConfirmOpen(false);
                setItemToDelete(null);
            }
        }
    };

    const renderFormField = (field: any) => {
        const commonProps = {
            id: field.name,
            name: field.name,
            value: formData[field.name] || '',
            onChange: handleInputChange,
            className: "w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            required: field.required,
            placeholder: field.placeholder || '',
            disabled: !!(currentItem && field.disabledOnEdit),
        };

        switch (field.type) {
            case 'richtext':
                return (
                    <RichTextEditor
                        value={formData[field.name] || ''}
                        onChange={(content) => {
                            setFormData((prev: Record<string, any>) => ({ ...prev, [field.name]: content }));
                        }}
                    />
                );
            case 'textarea': return <textarea {...commonProps} rows={10} />;
            case 'select':
                return (
                    <select {...commonProps}>
                        <option value="" disabled={field.required}>
                            {field.placeholder || 'Pilih salah satu...'}
                        </option>
                        {field.options?.map((opt: any) => {
                            if (typeof opt === 'string') {
                                return <option key={opt} value={opt}>{opt}</option>;
                            }
                            return <option key={opt.value} value={opt.value}>{opt.label}</option>;
                        })}
                    </select>
                );
            case 'date': return <input type="date" {...commonProps} />;
            case 'number': return <input type="number" {...commonProps} />;
            default: return <input type="text" {...commonProps} />;
        }
    };
    
    const defaultRender = (item: any, accessor: string) => {
        const value = item[accessor];
        if (typeof value === 'boolean') return value ? 'Ya' : 'Tidak';
        if (accessor.includes('at') || accessor.includes('deadline')) return formatDate(value);
        if (accessor === 'content' || accessor === 'base_prompt' || accessor === 'description') {
            const cleanHTML = DOMPurify.sanitize(value || '');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = cleanHTML;
            const plainText = tempDiv.textContent || tempDiv.innerText || '';
            return <div className="line-clamp-3 text-sm">{plainText}</div>;
        }
        return value;
    }
    
    if (!config) return <div>Konfigurasi untuk {collectionName} tidak ditemukan.</div>;
    
    return (
        <div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manajemen {config.title}</h1>
                <div className="flex items-center gap-2">
                    {collectionName === 'doctors' && (
                         <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
                            <UploadCloud className="mr-2 h-4 w-4" /> Impor Excel
                        </Button>
                    )}
                    <Button onClick={() => handleOpenModal()}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah {config.title}
                    </Button>
                </div>
            </div>

            {collectionName === 'facilities' && (
                <Card className="mb-6 p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-start gap-4">
                        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-blue-800">Cara Kerja Halaman Fasilitas</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                Fasilitas yang Anda tambahkan akan ditampilkan dalam tata letak galeri (masonry/Pinterest-style) yang dinamis di halaman publik. Anda tidak perlu lagi mengelola slide, sehingga Anda bebas menambahkan fasilitas sebanyak yang diperlukan.
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {collectionName === 'ai_assistant_config' && (
                 <Card className="mb-6 p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-start gap-4">
                        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-blue-800">Mengelola Pengetahuan Asisten AI</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                Teks yang Anda masukkan di sini akan menjadi "otak" atau instruksi dasar bagi Asisten AI. Ini menentukan kepribadian, informasi kunci, dan batasannya.
                            </p>
                             <p className="text-sm text-blue-700 mt-2">
                                <strong>Penting:</strong> Informasi dinamis seperti <strong>jadwal dokter terkini</strong> akan ditambahkan secara otomatis ke AI setiap kali pengguna bertanya. Anda tidak perlu memasukkan jadwal dokter di sini.
                            </p>
                        </div>
                    </div>
                </Card>
            )}
            
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            {config.displayColumns.map(col => <th key={col.header} className="p-4 text-left font-semibold text-gray-600">{col.header}</th>)}
                            <th className="p-4 text-right font-semibold text-gray-600">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {items.map((item: any) => (
                                <tr key={item.id}>
                                    {config.displayColumns.map(col => (
                                        <td key={col.accessor} className={cn("p-4 align-top", col.className)}>
                                            {col.render ? col.render(item) : defaultRender(item, col.accessor)}
                                        </td>
                                    ))}
                                    <td className="p-4 text-right align-top">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="sm" onClick={() => handleOpenModal(item)}>Edit</Button>
                                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteClick(item)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {items.length === 0 && (
                        <div className="text-center p-8 text-muted-foreground">Tidak ada data untuk ditampilkan.</div>
                    )}
                </div>
            </Card>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in"
                     onClick={(e) => {
                         // Don't close modal when clicking overlay
                         e.preventDefault();
                         e.stopPropagation();
                     }}>
                    <Card className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center justify-between p-6 border-b">
                                <h3 className="text-2xl font-semibold leading-none tracking-tight">{currentItem ? `Edit ${config.title}` : `Tambah ${config.title}`}</h3>
                                <Button type="button" variant="ghost" size="icon" className="rounded-full" onClick={handleCloseModal}><X /></Button>
                            </div>
                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                {config.fields.map(field => (
                                    <div key={field.name}>
                                        <label htmlFor={field.name} className="text-sm font-medium">{field.label} {field.required && '*'}</label>
                                        {renderFormField(field)}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-end p-6 pt-0 gap-2">
                                <Button type="button" variant="outline" onClick={handleCloseModal}>Batal</Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin" /> : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
            
            <ConfirmationModal 
                isOpen={isConfirmOpen} 
                onClose={() => setIsConfirmOpen(false)} 
                onConfirm={confirmDelete} 
                title={`Konfirmasi Hapus ${config.title}`} 
                message={`Apakah Anda yakin ingin menghapus data "${itemToDelete?.name || itemToDelete?.title || ''}"? Tindakan ini tidak dapat diurungkan.`} 
            />

            {collectionName === 'doctors' && (
                <ImportDoctorsModal
                    isOpen={isImportModalOpen}
                    onClose={() => setIsImportModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ManageCollection;
