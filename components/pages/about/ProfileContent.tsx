
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { ArrowLeft, ArrowRight } from '../../icons';
import { cn } from '../../../lib/utils';
import OptimizedImage from '../../ui/OptimizedImage';

const ProfileContent: React.FC = () => {
    const profileImages = [
        '2014rsmeloysangatta',
        'Rsmeloysangatta1_c2qz40',
        'parkiranrsmeloy'
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % profileImages.length);
        }, 5000); // Autoplay every 5 seconds
        return () => clearInterval(timer);
    }, [profileImages.length]);

    const handleNav = (direction: 'prev' | 'next') => {
        setCurrentIndex(prevIndex => {
            if (direction === 'prev') {
                return (prevIndex - 1 + profileImages.length) % profileImages.length;
            }
            return (prevIndex + 1) % profileImages.length;
        });
    };

    return (
        <div className="space-y-12">
            {/* Sejarah */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-primary">Profil & Sejarah RSU Meloy</h3>
                    <p className="text-muted-foreground leading-relaxed">RSU Meloy Sangatta merupakan rumah sakit umum yang berlokasi di Sangatta Utara, Kabupaten Kutai Timur. Rumah Sakit Meloy berada dibawah naungan PT. Meloy berdiri sejak tahun 2003 dengan pengesahan Akta Notaris Wasiah, SH, Nomor 25 Tanggal 21 Oktober 2003. Rumah Sakit Meloy Sangatta merupakan perusahaan milik swasta yang menjalankan usahanya berfokus pada pelayanan kesehatan bagi masyarakat umum.</p>
                    <p className="text-muted-foreground leading-relaxed">Atas ijin uji coba penyelenggaraan dari Dinas Kesehatan Propinsi Kalimantan Timur No. 503/52540/Regdit/I/2004 telah menjalankan usaha pelayanan kesehatan sejak tanggal 28 Januari 2004 dengan nama <strong>Rumah Sakit Khusus Ibu dan Anak Meloy</strong>. Pada tahun 2005 kembali diberikan Surat Ijin Uji Coba ke 2 Penyelenggaraan operasional Rumah Sakit Ibu dan Anak Meloy dengan No. 503/1313/PSTK-2/IV/2005.</p>
                    <p className="text-muted-foreground leading-relaxed">Beranjak dari prestasi-prestasi yang telah dicapai oleh Rumah Sakit Meloy maka pada tanggal 05 September 2007 melalui keputusan Dinas Kesehatan Provinsi Kalimantan Timur No. 503/3154/PTSK-2/IX/2007 telah berhasil mendapatkan surat ijin uji coba penyelenggaraan operasional menjadi Rumah Sakit Umum dengan nama <strong>Rumah Sakit Umum Meloy Sangatta</strong> yang sebelumnya Rumah Sakit Khusus Ibu dan Anak, yang memberikan pelayanan kesehatan kepada semua jenis penyakit dari bersifat dasar sampai spesialistik dan mempunyai karakteristik pelayanan yang berbeda dengan industri jasa lainnya.</p>
                </div>
                
                <div className="relative group rounded-lg overflow-hidden shadow-lg aspect-video">
                    <div className="flex transition-transform duration-700 ease-in-out h-full" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                        {profileImages.map((publicId, index) => (
                            <div key={index} className="flex-none w-full h-full">
                                <OptimizedImage publicId={publicId} alt={`Profil RSU Meloy ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 rounded-full bg-white/60 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleNav('prev')}
                        aria-label="Previous image"
                    >
                        <ArrowLeft className="h-6 w-6 text-foreground" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 rounded-full bg-white/60 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleNav('next')}
                        aria-label="Next image"
                    >
                        <ArrowRight className="h-6 w-6 text-foreground" />
                    </Button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {profileImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                aria-label={`Go to image ${index + 1}`}
                                className={cn(
                                    "h-2 w-2 rounded-full transition-all duration-300",
                                    currentIndex === index ? 'w-6 bg-white' : 'bg-white/50 hover:bg-white'
                                )}
                            />
                        ))}
                    </div>
                </div>

            </div>

            {/* Visi & Misi */}
            <div className="space-y-8 pt-12 border-t">
                <h3 className="text-3xl font-bold text-primary text-center">Visi & Misi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader><CardTitle className="text-primary">Visi</CardTitle></CardHeader>
                        <CardContent><p className="text-lg text-muted-foreground">Menjadi rumah sakit terdepan yang memberikan layanan kesehatan profesional, penuh kasih, dan terintegrasi untuk meningkatkan kualitas hidup pasien dan keluarga.</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="text-primary">Misi</CardTitle></CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                <li>Memberikan layanan kesehatan holistik dan terpadu yang berpusat pada kebutuhan pasien dan keluarga.</li>
                                <li>Membangun tim kerja yang solid, dinamis, dan terpercaya dengan dedikasi tinggi dan semangat inovasi.</li>
                                <li>Mengembangkan kompetensi sumber daya manusia secara berkelanjutan seiring dengan kemajuan ilmu pengetahuan dan teknologi.</li>
                                <li>Meningkatkan kualitas dan kuantitas fasilitas serta sarana pelayanan secara terus-menerus dan berkelanjutan.</li>
                                <li>Menciptakan budaya kerja yang positif, sehat, dan harmonis untuk mendukung kinerja terbaik.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfileContent;
