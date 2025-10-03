
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';

const BpjsFlow: React.FC = () => {
    return (
        <div className="space-y-12">
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="text-2xl text-primary">Alur Berobat Menggunakan BPJS Kesehatan</CardTitle>
                    <CardDescription>Prosedur ini harus diikuti secara berurutan, kecuali dalam kondisi gawat darurat.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h4 className="text-lg font-semibold text-foreground mb-3">Tahap 1: Kunjungan ke Fasilitas Kesehatan Tingkat Pertama (FKTP)</h4>
                        <ul className="space-y-2 list-decimal list-inside text-muted-foreground">
                            <li><strong>Datang ke FKTP Terdaftar:</strong> Kunjungi Puskesmas, klinik pratama, atau dokter keluarga tempat Anda terdaftar.</li>
                            <li><strong>Bawa Dokumen:</strong> Siapkan Kartu BPJS Kesehatan (fisik atau digital) dan KTP Anda.</li>
                            <li><strong>Pemeriksaan & Diagnosis:</strong> Sampaikan keluhan Anda kepada dokter untuk pemeriksaan awal.</li>
                            <li><strong>Dapatkan Surat Rujukan:</strong> Jika diperlukan, dokter akan memberikan surat rujukan ke rumah sakit. Periksa masa berlaku surat tersebut, biasanya 1-3 bulan.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-foreground mb-3">Tahap 2: Kunjungan ke Rumah Sakit Rujukan</h4>
                        <ul className="space-y-2 list-decimal list-inside text-muted-foreground">
                            <li><strong>Datang ke Rumah Sakit:</strong> Kunjungi bagian pendaftaran pasien BPJS di rumah sakit yang tertera pada surat rujukan.</li>
                            <li><strong>Lengkapi Dokumen:</strong> Serahkan Kartu BPJS Kesehatan asli, KTP jika ada, dan Surat Rujukan dari FKTP.</li>
                            <li><strong>Penerbitan Surat Eligibilitas Peserta (SEP):</strong> Petugas akan memverifikasi data Anda dan menerbitkan SEP sebagai bukti penjaminan. Simpan SEP ini.</li>
                            <li><strong>Pelayanan Medis:</strong> Setelah mendapatkan SEP, Anda dapat langsung menuju poliklinik yang dituju untuk mendapatkan pelayanan.</li>
                        </ul>
                    </div>
                     <div className="pt-4 border-t">
                        <h4 className="text-lg font-semibold text-foreground mb-3">Pengecualian: Kondisi Gawat Darurat</h4>
                         <p className="text-muted-foreground">
                            Dalam kondisi gawat darurat, Anda bisa langsung pergi ke Unit Gawat Darurat (UGD) rumah sakit tanpa memerlukan surat rujukan dari FKTP. Administrasi akan diurus setelah kondisi Anda stabil. Namun, pastikan kondisi Anda benar-benar termasuk kategori gawat darurat.
                         </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BpjsFlow;
