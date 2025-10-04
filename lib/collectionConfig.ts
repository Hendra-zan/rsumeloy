
import { DoctorIcon, Heart, Building, Newspaper, Users, Megaphone, Briefcase, Sparkles, Info } from '../components/icons';
import React from 'react';

type FieldType = 'text' | 'textarea' | 'select' | 'date' | 'richtext' | 'number';

interface FormField {
    name: string;
    label: string;
    type: FieldType;
    required?: boolean;
    placeholder?: string;
    options?: (string | { value: string; label: string })[];
    disabledOnEdit?: boolean;
}

interface DisplayColumn {
    header: string;
    accessor: string;
    className?: string;
    render?: (item: any) => React.ReactNode;
}

interface CollectionConfig {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    fields: FormField[];
    displayColumns: DisplayColumn[];
}

export const collectionConfigs: Record<string, CollectionConfig> = {
    doctors: {
        title: 'Dokter',
        icon: DoctorIcon,
        fields: [
            { name: 'name', label: 'Nama Lengkap', type: 'text', required: true },
            { name: 'display_order', label: 'Urutan Tampilan (Opsional)', type: 'number', placeholder: 'Contoh: 1, 2, 3. Angka kecil tampil duluan.' },
            { name: 'specialty', label: 'Spesialisasi', type: 'text', required: true },
            { name: 'image_public_id', label: 'Cloudinary Public ID Foto', type: 'text', placeholder: 'rsu-meloy/dokter/nama-file' },
            { name: 'schedule', label: 'Jadwal Praktek', type: 'text', placeholder: 'Contoh: Senin - Jumat, 08:00 - 12:00' },
            { name: 'status', label: 'Status', type: 'select', options: ['Praktek', 'Tutup'], required: true },
            { name: 'status_info', label: 'Info Status (opsional)', type: 'text', placeholder: 'Contoh: Sedang Cuti' },
            { name: 'notes', label: 'Catatan (opsional)', type: 'textarea', placeholder: 'Contoh: Hanya menerima pasien rujukan BPJS' },
        ],
        displayColumns: [
            { header: 'Nama', accessor: 'name' },
            { header: 'Urutan', accessor: 'display_order' },
            { header: 'Spesialisasi', accessor: 'specialty' },
            { header: 'Status', accessor: 'status' },
            { header: 'Catatan', accessor: 'notes', className: 'line-clamp-2' },
        ]
    },
    services: {
        title: 'Layanan',
        icon: Heart,
        fields: [
            { name: 'name', label: 'Nama Layanan', type: 'text', required: true },
            { name: 'description', label: 'Deskripsi', type: 'richtext', required: true },
            { name: 'image_public_id_1', label: 'ID Cloudinary Gambar 1 (Utama)', type: 'text', required: true, placeholder: 'rsu-meloy/layanan/gambar-1' },
            { name: 'image_public_id_2', label: 'ID Cloudinary Gambar 2 (Opsional)', type: 'text', placeholder: 'rsu-meloy/layanan/gambar-2' },
            { name: 'image_public_id_3', label: 'ID Cloudinary Gambar 3 (Opsional)', type: 'text', placeholder: 'rsu-meloy/layanan/gambar-3' },
        ],
        displayColumns: [
            { header: 'Nama Layanan', accessor: 'name' },
            { header: 'Deskripsi', accessor: 'description', className: 'line-clamp-2' },
        ]
    },
    facilities: {
        title: 'Fasilitas',
        icon: Building,
        fields: [
            { name: 'name', label: 'Nama Fasilitas', type: 'text', required: true },
            { name: 'description', label: 'Konten Lengkap', type: 'richtext', required: true },
            { name: 'image_public_id_1', label: 'ID Cloudinary Gambar 1 (Utama)', type: 'text', required: true, placeholder: 'rsu-meloy/fasilitas/gambar-1' },
            { name: 'image_public_id_2', label: 'ID Cloudinary Gambar 2 (Opsional)', type: 'text', placeholder: 'rsu-meloy/fasilitas/gambar-2' },
            { name: 'image_public_id_3', label: 'ID Cloudinary Gambar 3 (Opsional)', type: 'text', placeholder: 'rsu-meloy/fasilitas/gambar-3' },
        ],
        displayColumns: [
            { header: 'Nama Fasilitas', accessor: 'name' },
            { header: 'Deskripsi', accessor: 'description', className: 'line-clamp-2' },
        ]
    },
    articles: {
        title: 'Artikel',
        icon: Newspaper,
        fields: [
            { name: 'title', label: 'Judul Artikel', type: 'text', required: true },
            { name: 'content', label: 'Konten', type: 'richtext', required: true },
            { name: 'author', label: 'Penulis', type: 'text', required: true },
            { name: 'image_public_id', label: 'Cloudinary Public ID Gambar', type: 'text', placeholder: 'rsu-meloy/artikel/nama-file' },
            { name: 'created_at', label: 'Tanggal Publikasi', type: 'date', required: false },
        ],
        displayColumns: [
            { header: 'Judul', accessor: 'title' },
            { header: 'Penulis', accessor: 'author' },
            { header: 'Tanggal', accessor: 'created_at' },
        ]
    },
    partners: {
        title: 'Mitra',
        icon: Users,
        fields: [
            { name: 'name', label: 'Nama Mitra', type: 'text', required: true },
            { name: 'image_public_id', label: 'Cloudinary Public ID Logo', type: 'text', required: true, placeholder: 'rsu-meloy/mitra/nama-file' },
        ],
        displayColumns: [
            { header: 'Nama Mitra', accessor: 'name' },
        ]
    },
    vacancies: {
        title: 'Lowongan',
        icon: Briefcase,
        fields: [
            { name: 'title', label: 'Posisi', type: 'text', required: true },
            { name: 'description', label: 'Deskripsi', type: 'textarea', required: true },
            { name: 'type', label: 'Tipe Pekerjaan', type: 'text', placeholder: 'e.g., Full-time', required: true },
            { name: 'location', label: 'Lokasi', type: 'text', required: true },
            { name: 'deadline', label: 'Batas Akhir', type: 'date', required: true },
        ],
        displayColumns: [
            { header: 'Posisi', accessor: 'title' },
            { header: 'Tipe', accessor: 'type' },
            { header: 'Batas Akhir', accessor: 'deadline' },
        ]
    },
    info: {
        title: 'Info Terkini (Billboard)',
        icon: Megaphone,
        fields: [
            { 
                name: 'title', 
                label: 'Judul Informasi', 
                type: 'text', 
                required: true,
                placeholder: 'Contoh: Jadwal Praktek Dokter Spesialis Jantung'
            },
            { 
                name: 'description', 
                label: 'Isi Informasi', 
                type: 'richtext', 
                required: true,
                placeholder: 'Tulis informasi lengkap di sini...'
            },
            { 
                name: 'image_public_id', 
                label: 'Gambar Ilustrasi (16:7)', 
                type: 'text', 
                required: true, 
                placeholder: 'rsu-meloy/info/nama-file'
            },
        ],
        displayColumns: [
            { 
                header: 'Judul', 
                accessor: 'title',
                className: 'font-semibold'
            },
            { 
                header: 'Deskripsi', 
                accessor: 'description', 
                className: 'prose-sm line-clamp-3'
            },
            {
                header: 'Tanggal',
                accessor: 'created_at',
                className: 'text-sm text-muted-foreground'
            }
        ]
    },
    page_notes: {
        title: 'Catatan Halaman',
        icon: Info,
        fields: [
            { 
                name: 'page_name', 
                label: 'Target Halaman', 
                type: 'select', 
                required: true,
                placeholder: 'Pilih halaman target...',
                options: [
                    { value: 'doctors_schedule', label: 'Halaman Jadwal Dokter' },
                    { value: 'services_page', label: 'Halaman Layanan' },
                    { value: 'contact_page', label: 'Halaman Kontak' },
                    { value: 'patient_flow_page', label: 'Halaman Alur Pasien' },
                ],
                disabledOnEdit: true
            },
            { 
                name: 'content', 
                label: 'Isi Catatan', 
                type: 'richtext', 
                required: true,
                placeholder: 'Tulis catatan penting di sini...'
            },
        ],
        displayColumns: [
            { 
                header: 'Halaman', 
                accessor: 'page_name',
                render: (item) => {
                    const pageNotesConfig = collectionConfigs['page_notes'];
                    if (pageNotesConfig) {
                        const options = pageNotesConfig.fields.find(f => f.name === 'page_name')?.options as { value: string; label: string }[] | undefined;
                        return options?.find(o => o.value === item.page_name)?.label || item.page_name;
                    }
                    return item.page_name;
                }
            },
            { header: 'Isi Catatan', accessor: 'content', className: 'line-clamp-3' },
        ]
    },
    ai_assistant_config: {
        title: 'Konfigurasi Asisten AI',
        icon: Sparkles,
        fields: [
            { 
                name: 'base_prompt', 
                label: 'Instruksi Sistem untuk AI', 
                type: 'textarea', 
                required: true,
                placeholder: `Contoh:
Anda adalah Asisten AI yang ramah untuk RSU Meloy. Informasi penting:

- Alamat: Jl. Yos Sudarso II No.101, Sangatta Utara
- UGD 24 Jam: (0549) 24222
- Pendaftaran Online: https://apam.rsumeloy.co.id (Senin-Sabtu, 08:00-14:00)

Untuk pendaftaran, selalu arahkan ke APAM...`
            },
        ],
        displayColumns: [
            { header: 'Instruksi Dasar', accessor: 'base_prompt', className: 'line-clamp-3' },
        ]
    }
};
