
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useRouter } from 'next/navigation';

const InsuranceFlow: React.FC = () => {
    const router = useRouter();

    const insuranceRequirements = [
        'Kartu kepesertaan asuransi yang aktif.',
        'Kartu Tanda Penduduk (KTP) asli.',
        'Surat rujukan atau formulir dari perusahaan (jika dipersyaratkan).',
        'Konfirmasi terlebih dahulu apakah asuransi Anda bekerja sama dengan RSU Meloy.',
    ];
    
    return (
        <div className="space-y-12">
            <div className="text-center">
                <h3 className="text-3xl font-bold text-primary">Panduan Penggunaan Jaminan Kesehatan Swasta</h3>
                <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">Informasi penting mengenai prosedur pendaftaran menggunakan asuransi swasta atau perusahaan.</p>
            </div>
            
            <div className="flex justify-center">
                <Card className="w-full max-w-4xl hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-2xl text-primary">Prosedur Pasien Asuransi Lainnya</CardTitle>
                        <CardDescription>Prosedur untuk pasien yang dijamin oleh asuransi swasta atau perusahaan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h4 className="font-semibold mb-3">Dokumen yang Diperlukan:</h4>
                        <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                            {insuranceRequirements.map((req, index) => <li key={index}>{req}</li>)}
                        </ul>
                        <Button variant="link" className="p-0 mt-4" onClick={() => router.push('/tentang/partners')}>Lihat Daftar Mitra Asuransi Kami</Button>
                    </CardContent>
                </Card>
            </div>

            <div className="border-t pt-8 text-center text-muted-foreground">
                <p>Jika Anda memiliki pertanyaan lebih lanjut mengenai penjaminan, jangan ragu untuk menghubungi bagian informasi kami.</p>
            </div>
        </div>
    );
};

export default InsuranceFlow;
