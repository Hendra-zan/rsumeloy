
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../hooks/useContextHooks';
import { Button } from '../ui/Button';
import { Facebook, Instagram, Mail, MapPin, Phone, TwitterIcon, WhatsAppIcon, Share2 } from '../icons';
import OptimizedImage from '../ui/OptimizedImage';
import Link from 'next/link';

const Footer: React.FC = () => {
    const { t } = useLanguage();
    const router = useRouter();
    const waUrl = `https://wa.me/628115495477?text=${encodeURIComponent(t('waRegistration'))}`;
    const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=RSU+Meloy+Sangatta";
    const phoneUrl = "tel:054924222";

    const emailAddress = "rsu_meloy@yahoo.co.id";
    const [emailText, setEmailText] = useState(emailAddress);

    const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        navigator.clipboard.writeText(emailAddress);
        setEmailText('Alamat email disalin!');
        setTimeout(() => {
            setEmailText(emailAddress);
        }, 2000);
    };

    const contactItems = [
        { id: 'map', href: googleMapsUrl, icon: MapPin, text: "Jl. Yos Sudarso II No.101, Sangatta Utara, Kab. Kutai Timur", target: "_blank" },
        { id: 'phone', href: phoneUrl, icon: Phone, text: "(0549) 24222", target: "_self" },
        { id: 'email', href: `mailto:${emailAddress}`, icon: Mail, text: emailText, target: "_self", onClick: handleEmailClick },
    ];
    
    const handleShareWebsite = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `RSU Meloy - ${t('heroTitle')}`,
                    text: t('heroSubtitle'),
                    url: window.location.origin,
                });
            } catch (error) {
                console.error('Error sharing website:', error);
            }
        }
    };

    return (
        <footer className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="cursor-pointer group" aria-label="Admin Login">
                                <div className="bg-white p-1 rounded-full group-hover:bg-gray-200 transition-colors">
                                    <OptimizedImage publicId="logo_rsmeloy_web" alt="Logo RSU Meloy" width="32" height="32" className="object-contain" />
                                </div>
                            </Link>
                            <Link href="/" className="cursor-pointer group">
                                <h3 className="text-xl font-bold group-hover:text-primary-foreground/80 transition-colors">RSU Meloy</h3>
                            </Link>
                        </div>
                        <p className="text-sm text-primary-foreground/80">{t('footerTagline')}</p>
                        <div className="flex space-x-2">
                            <Button size="icon" variant="ghost" className="hover:bg-primary-foreground/10" asChild><a href="https://www.facebook.com/rsumeloy" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook className="h-5 w-5" /></a></Button>
                            <Button size="icon" variant="ghost" className="hover:bg-primary-foreground/10" asChild><a href="https://x.com/Rsumeloy" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><TwitterIcon className="h-5 w-5" /></a></Button>
                            <Button size="icon" variant="ghost" className="hover:bg-primary-foreground/10" asChild><a href={waUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><WhatsAppIcon className="h-5 w-5" /></a></Button>
                            <Button size="icon" variant="ghost" className="hover:bg-primary-foreground/10" asChild><a href="https://www.instagram.com/rsumeloy" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram className="h-5 w-5" /></a></Button>
                            {typeof window !== 'undefined' && 'share' in navigator && (
                                <Button size="icon" variant="ghost" className="hover:bg-primary-foreground/10" onClick={handleShareWebsite} aria-label="Bagikan Website">
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">{t('tautanCepat')}</h4>
                        <ul className="space-y-2">
                            <li><button onClick={() => router.push('/')} className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer">{t('beranda')}</button></li>
                            <li><button onClick={() => router.push('/layanan')} className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer">{t('layanan')}</button></li>
                            <li><button onClick={() => router.push('/jadwal-dokter')} className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer">{t('jadwalDokter')}</button></li>
                            <li><button onClick={() => router.push('/kontak')} className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer">{t('kontak')}</button></li>
                        </ul>
                    </div>
                    <div className="md:col-span-2">
                        <h4 className="font-semibold mb-4">{t('kontak')}</h4>
                        <ul className="space-y-3 text-sm text-primary-foreground/80">
                           {contactItems.map((item) => (
                               <li key={item.id}>
                                   <a href={item.href} target={item.target} rel="noopener noreferrer" className="flex items-start gap-3 transition-colors hover:text-primary-foreground" onClick={item.onClick as any}>
                                       <item.icon className="h-5 w-5 mt-0.5 shrink-0" />
                                       <span>{item.text}</span>
                                   </a>
                               </li>
                           ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">&copy; {new Date().getFullYear()} Rumah Sakit Umum Meloy. All rights reserved.</div>
            </div>
        </footer>
    );
};

export default Footer;
