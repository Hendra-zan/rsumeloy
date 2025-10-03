
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';

const UgdFlow: React.FC = () => {
    const steps = [
        { title: 'Tiba di UGD', description: 'Pasien datang atau diantar ke Unit Gawat Darurat yang beroperasi 24 jam. Segera informasikan kondisi pasien kepada petugas.' },
        { title: 'Triase Medis', description: 'Tim medis akan melakukan penilaian cepat (triase) untuk menentukan tingkat kegawatan dan prioritas penanganan pasien.' },
        { title: 'Pendaftaran Administrasi', description: 'Keluarga atau pendamping pasien melakukan registrasi di loket UGD. Siapkan KTP atau kartu identitas pasien.' },
        { title: 'Pemeriksaan & Tindakan', description: 'Dokter jaga dan perawat akan melakukan pemeriksaan, diagnosis awal, dan memberikan tindakan medis yang diperlukan.' },
        { title: 'Observasi & Keputusan', description: 'Pasien akan diobservasi. Berdasarkan kondisi, dokter akan memutuskan apakah pasien perlu rawat inap, dirujuk, atau dapat pulang.' },
    ];

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h3 className="text-3xl font-bold text-primary">Prosedur Pasien Gawat Darurat (UGD)</h3>
                <p className="text-lg text-muted-foreground mt-2">Panduan langkah demi langkah untuk penanganan di UGD kami.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {steps.map((step, index) => (
                    <Card key={index} className="flex flex-col">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">{index + 1}</div>
                             <CardTitle className="text-xl">{step.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-muted-foreground">{step.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default UgdFlow;
