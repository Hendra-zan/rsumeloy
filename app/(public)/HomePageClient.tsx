
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../hooks/useContextHooks';
import { cn, truncateText, getPlainText } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/Card';
import { Avatar, AvatarFallback } from '../../components/ui/Avatar';
import SectionHeader from '../../components/layout/SectionHeader';
import { DoctorIcon, WhatsAppIcon, Heart, MapPin, ArrowLeft, ArrowRight } from '../../components/icons';
import OptimizedImage from '../../components/ui/OptimizedImage';
import CardImageSlider from '../../components/ui/CardImageSlider';
import { Service, Partner, Info, Facility } from '../../types';
import Link from 'next/link';
import ClientSidePlainText from '../../components/ClientSidePlainText';

interface HomePageClientProps {
    services: Service[];
    partners: Partner[];
    info: Info[];
    facilities: Facility[];
}

const HomePageClient: React.FC<HomePageClientProps> = ({ services, partners, info, facilities }) => {
    const { t } = useLanguage();
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentInfoIndex, setCurrentInfoIndex] = useState(0);

    const facilitiesScrollRef = useRef<HTMLDivElement>(null);
    const servicesScrollRef = useRef<HTMLDivElement>(null);
    const facilitiesIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const servicesIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const heroSlides = [
        { titleKey: 'heroTitle', subtitleKey: 'heroSubtitle' },
        { titleKey: 'slideTimTitle', subtitleKey: 'slideTimSubtitle' },
        { titleKey: 'slideUgdTitle', subtitleKey: 'slideUgdSubtitle' },
        { titleKey: 'slideNyamanTitle', subtitleKey: 'slideNyamanSubtitle' },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [heroSlides.length]);
    
    useEffect(() => {
        if (!info || info.length === 0) return;
        const infoTimer = setInterval(() => {
            setCurrentInfoIndex((prevIndex) => (prevIndex + 1) % info.length);
        }, 8000);
        return () => clearInterval(infoTimer);
    }, [info]);

    const startAutoplay = useCallback((
        scrollRef: React.RefObject<HTMLDivElement>,
        intervalRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>
    ) => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                const firstItem = scrollRef.current.children[0] as HTMLElement;
                const scrollAmount = firstItem ? firstItem.offsetWidth + 24 : clientWidth * 0.8; // gap-6 is 24px

                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }
        }, 4000);
    }, []);

    const stopAutoplay = useCallback((
        intervalRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>
    ) => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (facilities && facilities.length > 0) {
            startAutoplay(facilitiesScrollRef, facilitiesIntervalRef);
        }
        return () => stopAutoplay(facilitiesIntervalRef);
    }, [facilities, startAutoplay, stopAutoplay]);

    useEffect(() => {
        if (services && services.length > 0) {
            startAutoplay(servicesScrollRef, servicesIntervalRef);
        }
        return () => stopAutoplay(servicesIntervalRef);
    }, [services, startAutoplay, stopAutoplay]);

    const whyUsItems = [
        { titleKey: 'profesionalTitle', descKey: 'profesionalDesc', imagePublicId: 'teamrsmeloyanimasi' },
        { titleKey: 'teknologiTitle', descKey: 'teknologiDesc', imagePublicId: 'panoramic_amfyvy' },
        { titleKey: 'kenyamananTitle', descKey: 'kenyamananDesc', imagePublicId: 'kamarperawatanrsmeloy' }
    ];

    const quickAccessItems = [
        { icon: DoctorIcon, titleKey: 'jadwalDokter', subtitle: 'Temukan spesialis kami', action: () => router.push('/jadwal-dokter') },
        { icon: WhatsAppIcon, titleKey: 'waDaftar', subtitle: 'Daftar online (APAM)', action: () => window.open('https://apam.rsumeloy.co.id', '_blank') },
        { icon: Heart, titleKey: 'layanan', subtitle: 'Lihat layanan unggulan', action: () => router.push('/layanan') },
        { icon: MapPin, titleKey: 'kontak', subtitle: 'Lokasi & informasi', action: () => router.push('/kontak') }
    ];
    
    const handleInfoNav = (direction: 'prev' | 'next') => {
        if (!info || info.length === 0) return;
        setCurrentInfoIndex(prevIndex => {
            if (direction === 'prev') {
                return (prevIndex - 1 + info.length) % info.length;
            } else {
                return (prevIndex + 1) % info.length;
            }
        });
    };

    const handleScroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
        if (ref.current) {
            const scrollAmount = ref.current.offsetWidth * 0.8;
            ref.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };


    return (
        <div className="animate-fade-in">
            <div className="w-full relative h-screen min-h-[600px] overflow-hidden">
                <OptimizedImage 
                    publicId="Gedungrsmeloy" 
                    alt="RSU Meloy" 
                    fill
                    priority
                    className="absolute inset-0 w-full h-full object-cover animate-kenburns"
                    style={{objectFit: 'cover'}}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                <div className="container mx-auto px-4 md:px-6 h-full relative flex flex-col justify-end pb-16 md:pb-24 text-left">
                    <div className="max-w-3xl text-white">
                        <div className="h-64 flex flex-col justify-end mb-6">
                            <div className="relative w-full flex-1">
                                {heroSlides.map((slide, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "absolute inset-0 flex flex-col justify-end",
                                        index !== currentIndex && "opacity-0 pointer-events-none"
                                    )}
                                >
                                    <h1 className={cn(
                                        "text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-md transition-all duration-700 ease-out",
                                        index === currentIndex ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                                    )}>
                                        {t(slide.titleKey)}
                                    </h1>
                                    <p className={cn(
                                        "text-lg md:text-xl text-gray-200 mt-2 drop-shadow-sm transition-all duration-700 ease-out",
                                        index === currentIndex ? "opacity-100 translate-y-0 delay-200" : "opacity-0 -translate-y-4"
                                    )}>
                                        {t(slide.subtitleKey)}
                                    </p>
                                </div>
                                ))}
                            </div>
                            
                            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mt-4">
                                <div 
                                    key={currentIndex} 
                                    className="h-full bg-white rounded-full animate-progress-bar"
                                    style={{ transformOrigin: 'left' }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-start">
                            <Button size="lg" onClick={() => router.push('/kontak')}>{t('buatJanji')}</Button>
                            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" onClick={() => router.push('/layanan')}>{t('lihatLayanan')}</Button>
                        </div>
                    </div>
                </div>
            </div>

            <section className="py-16 md:py-20 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 bg-background p-4 md:p-6 rounded-2xl shadow-lg border -mt-32 relative z-10 backdrop-blur-sm bg-background/80">
                        {quickAccessItems.map((item, index) => (
                            <div key={index} onClick={item.action} className="group flex flex-col items-center text-center p-4 rounded-lg cursor-pointer transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-105">
                                <Avatar className="h-16 w-16 mb-4 bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary-foreground group-hover:text-primary">
                                    <AvatarFallback className="bg-transparent"><item.icon className="h-8 w-8" /></AvatarFallback>
                                </Avatar>
                                <p className="font-semibold">{t(item.titleKey)}</p>
                                <p className="text-sm text-muted-foreground transition-all duration-300 group-hover:text-primary-foreground/80">{item.subtitle}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 pt-0">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeader title={t('kenapaMemilihKami')} subtitle={t('kenapaSubtitle')} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                        {whyUsItems.map((item, index) => (
                            <Card key={index} className="overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col">
                                <CardHeader className="p-0 relative h-56 w-full">
                                    <OptimizedImage publicId={item.imagePublicId} alt={t(item.titleKey)} fill style={{objectFit: 'cover'}} />
                                </CardHeader>
                                <CardContent className="p-6 flex-1">
                                    <CardTitle className="mb-2">{t(item.titleKey)}</CardTitle>
                                    <CardDescription>{t(item.descKey)}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            
            <section className="py-16 md:py-24 bg-secondary">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeader title={t('fasilitasTitle')} subtitle={t('fasilitasSubtitle')} />
                     <div 
                        className="relative mt-8 group"
                        onMouseEnter={() => stopAutoplay(facilitiesIntervalRef)}
                        onMouseLeave={() => startAutoplay(facilitiesScrollRef, facilitiesIntervalRef)}
                     >
                        <div ref={facilitiesScrollRef} className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide">
                            {facilities?.map(facility => {
                                const facilityImages = [facility.image_public_id_1, facility.image_public_id_2, facility.image_public_id_3].filter(Boolean) as string[];
                                return (
                                <div key={facility.id} className="flex-none snap-center w-[90%] sm:w-1/2 lg:w-1/3">
                                    <Card className="overflow-hidden flex flex-col h-full transition-shadow hover:shadow-xl group">
                                        <Link href={`/fasilitas/${facility.slug}`} className="block w-full text-left">
                                            <CardHeader className="p-0">
                                                <div className="overflow-hidden">
                                                    <CardImageSlider imagePublicIds={facilityImages} alt={facility.name} />
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-6 flex-1">
                                                <CardTitle className="mb-2 group-hover:text-primary transition-colors">{facility.name}</CardTitle>
                                                <CardDescription>{truncateText(getPlainText(facility.description), 100)}</CardDescription>
                                            </CardContent>
                                        </Link>
                                         <div className="p-6 pt-0 mt-auto">
                                            <Button asChild variant="link" className="p-0">
                                                <Link href={`/fasilitas/${facility.slug}`}>
                                                    Lihat Detail <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            )})}
                        </div>
                        <Button variant="outline" size="icon" className="absolute top-1/2 -translate-y-1/2 -left-4 rounded-full bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex" onClick={() => handleScroll(facilitiesScrollRef, 'left')}><ArrowLeft className="h-6 w-6 text-foreground" /></Button>
                        <Button variant="outline" size="icon" className="absolute top-1/2 -translate-y-1/2 -right-4 rounded-full bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex" onClick={() => handleScroll(facilitiesScrollRef, 'right')}><ArrowRight className="h-6 w-6 text-foreground" /></Button>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeader title={t('infoTerkini')} subtitle={t('infoTerkiniSubtitle')} />
                    {info && info.length > 0 && (
                        <div className="mt-8 relative group">
                            <div className="overflow-hidden rounded-2xl shadow-xl">
                                <div 
                                    className="flex transition-transform duration-700 ease-in-out" 
                                    style={{ transform: `translateX(-${currentInfoIndex * 100}%)` }}
                                >
                                    {info.map((item) => (
                                        <div key={item.id} className="flex-none w-full">
                                            <div className="relative aspect-[16/7] w-full text-white">
                                                <OptimizedImage publicId={item.image_public_id} alt={item.title} fill className="absolute inset-0 w-full h-full object-cover" style={{objectFit: 'cover'}} />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                                <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                                                    <h3 className="text-2xl md:text-4xl font-bold drop-shadow-lg">{item.title}</h3>
                                                    <p className="mt-2 text-base md:text-lg max-w-2xl drop-shadow-md text-gray-200">{truncateText(getPlainText(item.description), 150)}</p>
                                                    <Button asChild variant="link" className="p-0 h-auto mt-4 text-white font-semibold self-start hover:text-gray-200">
                                                        <Link href={`/info/${item.id}`}>
                                                            {t('selengkapnya')}
                                                            <ArrowRight className="ml-2 h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="absolute top-1/2 -translate-y-1/2 -left-4 rounded-full bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:flex hidden"
                                onClick={() => handleInfoNav('prev')}
                            >
                                <ArrowLeft className="h-6 w-6 text-foreground" />
                            </Button>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="absolute top-1/2 -translate-y-1/2 -right-4 rounded-full bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:flex hidden"
                                onClick={() => handleInfoNav('next')}
                            >
                                <ArrowRight className="h-6 w-6 text-foreground" />
                            </Button>
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                                {info.map((_, index) => (
                                    <button 
                                        key={index} 
                                        onClick={() => setCurrentInfoIndex(index)}
                                        aria-label={`Go to slide ${index + 1}`}
                                        className={cn(
                                            "h-2 w-2 rounded-full transition-all duration-300",
                                            currentInfoIndex === index ? 'w-6 bg-primary' : 'bg-gray-300 hover:bg-gray-400'
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-16 md:py-24 bg-secondary">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeader title={t('pusatKeunggulan')} />
                     <div 
                        className="relative mt-8 group"
                        onMouseEnter={() => stopAutoplay(servicesIntervalRef)}
                        onMouseLeave={() => startAutoplay(servicesScrollRef, servicesIntervalRef)}
                     >
                        <div ref={servicesScrollRef} className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide">
                            {services?.map(service => {
                                const serviceImages = [service.image_public_id_1, service.image_public_id_2, service.image_public_id_3].filter(Boolean) as string[];
                                return (
                                <div key={service.id} className="flex-none snap-center w-[90%] sm:w-1/2 lg:w-1/3">
                                    <Card className="overflow-hidden flex flex-col h-full transition-shadow hover:shadow-xl group">
                                        <Link href={`/layanan/${service.slug}`} className="block w-full text-left">
                                            <CardHeader className="p-0">
                                                <div className="overflow-hidden">
                                                    <CardImageSlider imagePublicIds={serviceImages} alt={service.name} />
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-6 flex-1">
                                                <CardTitle className="mb-2 group-hover:text-primary transition-colors">{service.name}</CardTitle>
                                                <CardDescription className="text-sm text-muted-foreground">
                                                    <ClientSidePlainText html={service.description} maxLength={150} />
                                                </CardDescription>
                                            </CardContent>
                                        </Link>
                                         <div className="p-6 pt-0 mt-auto">
                                            <Button asChild variant="link" className="p-0">
                                                <Link href={`/layanan/${service.slug}`}>
                                                    Lihat Detail <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            )})}
                        </div>
                        <Button variant="outline" size="icon" className="absolute top-1/2 -translate-y-1/2 -left-4 rounded-full bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex" onClick={() => handleScroll(servicesScrollRef, 'left')}><ArrowLeft className="h-6 w-6 text-foreground" /></Button>
                        <Button variant="outline" size="icon" className="absolute top-1/2 -translate-y-1/2 -right-4 rounded-full bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex" onClick={() => handleScroll(servicesScrollRef, 'right')}><ArrowRight className="h-6 w-6 text-foreground" /></Button>
                    </div>
                    <div className="mt-12 text-center">
                      <Button variant="outline" onClick={() => router.push('/layanan')}>
                        {t('lihatLayanan')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <SectionHeader title={t('mitraKami')} subtitle={t('mitraSubtitle')} />
                    <div
                      className="relative mt-8 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)] group"
                    >
                      <div className="flex w-max animate-scroll group-hover:[animation-play-state:paused]">
                        {[...(partners || []), ...(partners || [])].map((partner, index) => (
                          <div key={`${partner.id}-${index}`} className="flex-shrink-0 w-48 mx-8 flex justify-center items-center h-24">
                            <OptimizedImage
                              publicId={partner.image_public_id}
                              alt={partner.name}
                              height={48}
                              width={192}
                              className="object-contain h-12 max-w-full grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-12 text-center">
                      <Button variant="outline" onClick={() => router.push('/tentang/partners')}>
                        {t('selengkapnya')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePageClient;
