
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';

interface StepCardProps {
    title: string;
    description: string;
    index: number;
    extraContent?: React.ReactNode;
}

const OutpatientFlow: React.FC = () => {
    const jknMobileSteps = [
        { 
            title: 'Unduh & Buka Aplikasi Mobile JKN', 
            description: 'Pastikan Anda sudah mengunduh dan login ke aplikasi Mobile JKN. Jika belum punya, silakan unduh melalui tautan di bawah ini.',
            extraContent: (
                <div className="flex flex-col sm:flex-row gap-x-4 gap-y-2 text-center justify-center">
                    <a href="https://play.google.com/store/apps/details?id=app.bpjs.mobile" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                        Unduh di Google Play (Android)
                    </a>
                    <a href="https://apps.apple.com/id/app/mobile-jkn/id1237601115" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                        Unduh di App Store (iOS)
                    </a>
                </div>
            )
        },
        { title: 'Pilih Pendaftaran Pelayanan', description: 'Pada menu utama, pilih fitur "Pendaftaran Pelayanan (Antrean)" untuk memulai.' },
        { title: 'Pilih RSU Meloy & Poli', description: 'Pilih RSU Meloy sebagai faskes rujukan, kemudian pilih poliklinik dan dokter spesialis yang dituju.' },
        { title: 'Dapatkan Nomor Antrean', description: 'Konfirmasi pendaftaran Anda. Anda akan mendapatkan nomor antrean dan estimasi waktu layanan langsung di aplikasi.' },
        { title: 'Cetak SEP di Anjungan', description: 'Pada hari kunjungan, datang ke Anjungan Mandiri RSU Meloy, pindai barcode dari aplikasi untuk mencetak Surat Eligibilitas Peserta (SEP).' },
    ];

    const onlineSteps = [
        { title: 'Hubungi via WhatsApp', description: 'Kirim pesan pendaftaran ke nomor +62 811-5495-477 pada jam operasional (Senin-Sabtu, 08:00 - 14:00 WITA).' },
        { title: 'Kirim Dokumen', description: 'Ikuti instruksi petugas untuk mengirimkan foto KTP dan kartu jaminan kesehatan (Asuransi) jika ada.' },
        { title: 'Terima Konfirmasi', description: 'Anda akan menerima nomor antrian dan konfirmasi jadwal konsultasi dari petugas kami.' },
        { title: 'Verifikasi di RS', description: 'Datang 15 menit sebelum jadwal, lakukan verifikasi ulang di loket pendaftaran untuk mendapatkan berkas rekam medis.' },
    ];
    
    const onsiteSteps = [
        { title: 'Ambil Nomor Antrian', description: 'Ambil nomor antrian pendaftaran di mesin antrian yang tersedia di lobi utama rumah sakit.' },
        { title: 'Menuju Loket', description: 'Tunggu hingga nomor antrian Anda dipanggil. Kemudian, menuju ke loket pendaftaran yang ditunjukkan.' },
        { title: 'Serahkan Dokumen', description: 'Serahkan KTP dan kartu jaminan kesehatan (BPJS/Asuransi) yang valid kepada petugas loket.' },
        { title: 'Menuju Poliklinik', description: 'Setelah pendaftaran selesai, Anda akan diarahkan ke poliklinik yang dituju. Tunggu panggilan dari perawat poli.' },
    ];

    const StepCard: React.FC<StepCardProps> = ({ title, description, index, extraContent }) => (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">{index + 1}</div>
                <CardTitle className="text-lg leading-tight">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-muted-foreground">{description}</p>
                {extraContent && <div className="mt-4">{extraContent}</div>}
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-16">
            <div>
                <div className="text-center mb-10">
                    <h3 className="text-3xl font-bold text-primary">Alur Pendaftaran via Mobile JKN (BPJS)</h3>
                    <p className="text-lg text-muted-foreground mt-2">Cara termudah dan paling direkomendasikan untuk pasien BPJS.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {jknMobileSteps.map((step, index) => <StepCard key={index} {...step} index={index} />)}
                </div>
            </div>
            
            <div className="border-t pt-16">
                <div className="text-center mb-10">
                    <h3 className="text-3xl font-bold text-primary">Alur Pendaftaran Online (via WhatsApp)</h3>
                    <p className="text-lg text-muted-foreground mt-2">Daftar lebih mudah dari rumah (untuk pasien umum/asuransi non-BPJS).</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {onlineSteps.map((step, index) => <StepCard key={index} {...step} index={index} />)}
                </div>
            </div>
            
            <div className="border-t pt-16">
                <div className="text-center mb-10">
                    <h3 className="text-3xl font-bold text-primary">Alur Pendaftaran Langsung (di Tempat)</h3>
                    <p className="text-lg text-muted-foreground mt-2">Panduan pendaftaran bagi Anda yang datang langsung ke rumah sakit.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {onsiteSteps.map((step, index) => <StepCard key={index} {...step} index={index} />)}
                </div>
            </div>
        </div>
    );
};

export default OutpatientFlow;
