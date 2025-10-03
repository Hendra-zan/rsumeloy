
export type NavItem = {
    id: string;
    labelKey: string;
    path: string;
    submenu?: SubMenuItem[];
};

export type SubMenuItem = {
    id: string;
    labelKey: string;
    subtitleKey: string;
    path: string;
};

export const navItemsConfig: NavItem[] = [
    { id: 'home', labelKey: 'beranda', path: '/' },
    { id: 'services', labelKey: 'layanan', path: '/layanan' },
    { id: 'facilities', labelKey: 'fasilitas', path: '/fasilitas' },
    { id: 'doctors', labelKey: 'jadwalDokter', path: '/jadwal-dokter' },
    { 
        id: 'patient-flow', 
        labelKey: 'alurPasien',
        path: '/alur-pasien/ugd',
        submenu: [
            { id: 'ugd', labelKey: 'alurUgd', subtitleKey: 'alurUgdSubtitle', path: '/alur-pasien/ugd' },
            { id: 'rawat-jalan', labelKey: 'alurRawatJalan', subtitleKey: 'alurRawatJalanSubtitle', path: '/alur-pasien/rawat-jalan' },
            { id: 'bpjs', labelKey: 'alurBpjs', subtitleKey: 'alurBpjsSubtitle', path: '/alur-pasien/bpjs' },
            { id: 'asuransi-lain', labelKey: 'alurAsuransiLain', subtitleKey: 'alurAsuransiLainSubtitle', path: '/alur-pasien/asuransi-lain' },
        ]
    },
    { 
        id: 'about', 
        labelKey: 'tentangKami',
        path: '/tentang/profile',
        submenu: [
            { id: 'profile', labelKey: 'tentangSubNav', subtitleKey: 'profilSubtitle', path: '/tentang/profile' },
            { id: 'partners', labelKey: 'mitra', subtitleKey: 'mitraSubtitle', path: '/tentang/partners' },
            { id: 'vacancies', labelKey: 'lowonganKerja', subtitleKey: 'lowonganKerjaSubtitle', path: '/tentang/vacancies' },
            { id: 'health-articles', labelKey: 'artikelKesehatan', subtitleKey: 'artikelKesehatanSubtitle', path: '/tentang/artikel' },
        ]
    },
    { 
        id: 'contact', 
        labelKey: 'kontak', 
        path: '/kontak',
        submenu: [
            { id: 'main', labelKey: 'kontakUtama', subtitleKey: 'kontakUtamaSubtitle', path: '/kontak' },
            { id: 'sangatta', labelKey: 'layananSangatta', subtitleKey: 'layananSangattaSubtitle', path: '/kontak/lokasi-sangatta' }
        ]
    }
];