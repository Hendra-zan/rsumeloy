
"use client";

import React, { useState, useMemo, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useLanguage } from '../../../../hooks/useContextHooks';
import { useDoctorSchema } from '../../../../hooks/useStructuredData';
import { Card, CardHeader, CardContent } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Avatar, AvatarImage, AvatarFallback } from '../../../../components/ui/Avatar';
import { Badge } from '../../../../components/ui/Badge';
import { FileDown, Loader2, X } from '../../../../components/icons';
import { Doctor } from '../../../../types';
import { getOptimizedUrl } from '../../../../lib/cloudinary';
import { PrintableSchedule } from './PrintableSchedule';
import { formatDate } from '../../../../lib/utils';
import ClientSideContent from '../../../../components/ClientSideContent';

interface DoctorsPageClientProps {
    doctors: Doctor[];
}

const DoctorsPageClient: React.FC<DoctorsPageClientProps> = ({ doctors }) => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('Semua');
    const [isPrinting, setIsPrinting] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const printableRef = useRef<HTMLDivElement>(null);

    // Inject structured data for selected doctor
    useDoctorSchema(selectedDoctor);

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
        
        let tempContainer: HTMLDivElement | null = null;

        try {
            // Create a temporary container
            tempContainer = document.createElement('div');
            tempContainer.style.position = 'fixed';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '0';
            document.body.appendChild(tempContainer);
            
            // Clone the printable content
            const clone = printableRef.current.cloneNode(true) as HTMLElement;
            clone.style.display = 'block';
            tempContainer.appendChild(clone);
            
            // Pre-load images
            const images = clone.getElementsByTagName('img');
            await Promise.all([...images].map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            }));

            // Add delay for rendering
            await new Promise(resolve => setTimeout(resolve, 1000));

            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                logging: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: 1280, // Fixed width for consistency
                height: clone.offsetHeight,
                foreignObjectRendering: false,
            });
            
            // A4 size in points (72 DPI)
            const pageWidth = 841.89;  // 297mm
            const pageHeight = 595.28;  // 210mm
            
            // Calculate scaling to fit content
            const contentRatio = canvas.width / canvas.height;
            const pageRatio = pageWidth / pageHeight;
            
            let finalWidth = pageWidth;
            let finalHeight = pageHeight;
            
            if (contentRatio > pageRatio) {
                // Content is wider
                finalHeight = pageWidth / contentRatio;
            } else {
                // Content is taller
                finalWidth = pageHeight * contentRatio;
            }

            // Create PDF with point units for more precise positioning
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'pt',
                format: 'a4',
            });

            // Center the content on the page
            const xOffset = (pageWidth - finalWidth) / 2;
            const yOffset = (pageHeight - finalHeight) / 2;

            pdf.addImage(
                canvas.toDataURL('image/jpeg', 1.0),
                'JPEG',
                xOffset,
                yOffset,
                finalWidth,
                finalHeight
            );
            
            pdf.save(`Jadwal-Dokter-RSU-Meloy-${new Date().toLocaleDateString('id-ID')}.pdf`);
        } catch (error) {
            console.error("Gagal membuat PDF:", error);
            alert("Terjadi kesalahan saat mencoba membuat file PDF. Silakan coba lagi.");
        } finally {
            // Clean up the temporary container
            if (tempContainer) {
                document.body.removeChild(tempContainer);
            }
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
                


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map(doctor => (
                            <Card
                                key={doctor.id}
                                className="transition-shadow hover:shadow-lg cursor-pointer"
                                onClick={() => setSelectedDoctor(doctor)}
                            >
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
                                        {doctor.status !== 'Praktek' && doctor.status_info && (
                                            <p className="text-sm text-muted-foreground">{doctor.status_info}</p>
                                        )}
                                    </div>
                                    {doctor.notes && <p className="text-xs text-muted-foreground pt-2 border-t mt-3">{doctor.notes}</p>}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="md:col-span-3 text-center text-muted-foreground">{t('dokterTidakDitemukan')}</p>
                    )}
                </div>
                <div style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
                     <PrintableSchedule doctors={filteredDoctors} forwardedRef={printableRef} />
                </div>

                <div className="mt-12 pt-8 border-t">
                    <div className="prose max-w-none">
                        <h3 className="text-xl font-semibold mb-4">Catatan Penting:</h3>
                        <ul className="space-y-2 list-disc pl-5">
                            <li>Jam tertera merupakan jadwal layanan pemeriksaan dokter, diharapkan pasien melakukan pendaftaran tidak lewat dari jam tersebut.</li>
                            <li>Pendaftaran dibuka 1 jam sebelum jadwal pemeriksaan dokter atau disarankan melakukan pendaftaran melalui aplikasi Mobile JKN.</li>
                            <li>Diharapkan selalu membawa identitas (BPJS atau KTP) dan kelengkapan berkas lainnya seperti surat rujukan atau surat kontrol (jika ada).</li>
                            <li>Pasien BPJS dengan usia ≥17 Tahun wajib hadir saat pendaftaran untuk melakukan sidik jari dan pengenalan wajah (Biometrik).</li>
                        </ul>
                    </div>
                </div>

                {/* Modal Detail Dokter */}
                {selectedDoctor && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in">
                        <Card className="w-full max-w-2xl bg-white shadow-lg border border-gray-200">
                            <CardHeader className="flex flex-row items-center gap-6 relative">
                                <Avatar className="h-32 w-32 border-2 border-primary/20">
                                    <AvatarImage src={getOptimizedUrl(selectedDoctor.image_public_id)} alt={selectedDoctor.name} />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                                        {selectedDoctor.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold mb-2">{selectedDoctor.name}</h2>
                                    <p className="text-lg text-primary font-semibold">{selectedDoctor.specialty}</p>
                                    <Badge variant={selectedDoctor.status === 'Praktek' ? 'default' : 'destructive'} className="capitalize mt-2">
                                        {selectedDoctor.status}
                                    </Badge>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-4 right-4"
                                    onClick={() => setSelectedDoctor(null)}
                                >
                                    <X className="h-6 w-6" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Jadwal Praktek</h3>
                                    <p className="text-base">{selectedDoctor.schedule || 'Sesuai perjanjian'}</p>
                                </div>
                                {selectedDoctor.status !== 'Praktek' && selectedDoctor.status_info && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Status Kehadiran</h3>
                                        <p className="text-base text-muted-foreground">{selectedDoctor.status_info}</p>
                                    </div>
                                )}
                                {selectedDoctor.notes && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Catatan</h3>
                                        <p className="text-base text-muted-foreground">{selectedDoctor.notes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorsPageClient;
