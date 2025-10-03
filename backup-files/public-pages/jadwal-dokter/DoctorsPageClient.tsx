
"use client";

import React, { useState, useMemo, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useLanguage } from '../../../hooks/useContextHooks';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { FileDown, Loader2 } from '../../../components/icons';
import { Doctor } from '../../../types';
import { getOptimizedUrl } from '../../../lib/cloudinary';
import { PrintableSchedule } from '../../../components/features/PrintableSchedule';

interface DoctorsPageClientProps {
    doctors: Doctor[];
    scheduleNote: string | null;
}

const DoctorsPageClient: React.FC<DoctorsPageClientProps> = ({ doctors, scheduleNote }) => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('Semua');
    const [isPrinting, setIsPrinting] = useState(false);
    const printableRef = useRef<HTMLDivElement>(null);

    const specialties = useMemo(() => ['Semua', ...Array.from(new Set(doctors.map(d => d.specialty)))], [doctors]);
    
    const filteredDoctors = useMemo(() => {
        return doctors.filter(doctor => {
            const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSpecialty = selectedSpecialty === 'Semua' || doctor.specialty === selectedSpecialty;
            return matchesSearch && matchesSpecialty;
        });
    }, [doctors, searchTerm, selectedSpecialty]);
    
    const handlePrint = async () => {
        if (!printableRef.current || isPrinting) return;
        setIsPrinting(true);
        try {
            const canvas = await html2canvas(printableRef.current, {
                scale: 2,
                useCORS: true, 
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`Jadwal-Dokter-RSU-Meloy-${new Date().toLocaleDateString('id-ID')}.pdf`);
        } catch (error) {
            console.error("Gagal membuat PDF:", error);
            alert("Terjadi kesalahan saat mencoba membuat file PDF. Silakan coba lagi.");
        } finally {
            setIsPrinting(false);
        }
    };


    return (
        <div className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <input
                        type="text"
                        placeholder={t('cariNamaDokter')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow rounded-md border border-input bg-background px-4 py-2 text-base"
                    />
                    <select
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="rounded-md border border-input bg-background px-4 py-2 text-base"
                    >
                        {specialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                    </select>
                     <Button onClick={handlePrint} disabled={isPrinting}>
                        {isPrinting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                        Unduh Jadwal
                    </Button>
                </div>
                
                {scheduleNote && (
                    <div className="mb-8 p-4 bg-secondary border border-border rounded-lg prose max-w-none">
                        <div id="schedule-note" dangerouslySetInnerHTML={{ __html: scheduleNote }}></div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map(doctor => (
                            <Card key={doctor.id} className="transition-shadow hover:shadow-lg">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <Avatar className="h-20 w-20 border-2 border-primary/20">
                                        <AvatarImage src={getOptimizedUrl(doctor.image_public_id)} alt={doctor.name} />
                                        <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                            {doctor.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-xl font-bold">{doctor.name}</h3>
                                        <p className="text-primary">{doctor.specialty}</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="font-semibold text-sm">Jadwal Praktek:</p>
                                        <p>{doctor.schedule || 'Sesuai perjanjian'}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                         <Badge variant={doctor.status === 'Praktek' ? 'default' : 'destructive'} className="capitalize">
                                            {doctor.status}
                                         </Badge>
                                        {doctor.status_info && <p className="text-sm text-muted-foreground">{doctor.status_info}</p>}
                                    </div>
                                    {doctor.notes && <p className="text-xs text-muted-foreground pt-2 border-t mt-3">{doctor.notes}</p>}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="md:col-span-3 text-center text-muted-foreground">{t('dokterTidakDitemukan')}</p>
                    )}
                </div>
                <div className="hidden">
                     <PrintableSchedule doctors={filteredDoctors} forwardedRef={printableRef} />
                </div>
            </div>
        </div>
    );
};

export default DoctorsPageClient;
