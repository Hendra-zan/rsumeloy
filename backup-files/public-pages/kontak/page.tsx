
import { Metadata } from 'next';
import { translations } from "../../../lib/translations";
import PageHeader from '../../../components/layout/PageHeader';
import { getPageNotes } from '../../../lib/data';
import { Card, CardContent } from '../../../components/ui/Card';
import { Phone, Mail, MapPin } from '../../../components/icons';

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata(): Promise<Metadata> {
  const t = (key: string) => translations['id'][key] || key;
  return {
    title: `${t('kontakTitle')} | RSU Meloy`,
    description: t('kontakSubtitle'),
  };
}

export default async function ContactPage() {
    const t = (key: string) => translations['id'][key] || key;
    const pageNotes = await getPageNotes();
    const note = pageNotes.find(n => n.page_name === 'contact_page');
    
    const contactInfo = [
        { icon: Phone, title: 'Telepon UGD (24 Jam)', content: '(0549) 24222', href: 'tel:054924222' },
        { icon: Phone, title: 'Pendaftaran WhatsApp', content: '+62 811-5495-477', href: `https://wa.me/628115495477?text=${encodeURIComponent(t('waRegistration'))}` },
        { icon: Mail, title: 'Email', content: 'rsu_meloy@yahoo.co.id', href: 'mailto:rsu_meloy@yahoo.co.id' },
        { icon: MapPin, title: 'Alamat', content: 'Jl. Yos Sudarso II No.101, Sangatta Utara, Kab. Kutai Timur', href: 'https://www.google.com/maps/search/?api=1&query=RSU+Meloy+Sangatta' }
    ];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title={t('kontakTitle')}
                subtitle={t('kontakSubtitle')}
                imagePublicId="kontakrsmeloy_cv12fh"
            />
            <div className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-1 space-y-6">
                            <h3 className="text-2xl font-bold text-primary">{t('infoKontak')}</h3>
                            {contactInfo.map((info, index) => (
                                <a key={index} href={info.href} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                                    <div className="mt-1 flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <info.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold group-hover:text-primary transition-colors">{info.title}</p>
                                        <p className="text-muted-foreground">{info.content}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                        <div className="lg:col-span-2">
                             <Card className="overflow-hidden shadow-lg">
                                <CardContent className="p-0">
                                     <iframe 
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d498.70790760743637!2d117.53498808013812!3d0.505139864509427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x320a357123eebbfd%3A0xf44dda0e133317bb!2sRumah%20Sakit%20Meloy%20Sangatta!5e0!3m2!1sid!2sid!4v1758760684934!5m2!1sid!2sid"
                                        width="100%" 
                                        height="450" 
                                        style={{ border: 0 }} 
                                        allowFullScreen={true}
                                        loading="lazy" 
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Lokasi RSU Meloy di Google Maps"
                                    ></iframe>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                     {note && (
                        <div className="mt-16 pt-12 border-t">
                            <div id="contact-note" className="max-w-4xl mx-auto prose"></div>
                            <script
                                dangerouslySetInnerHTML={{
                                    __html: `
                                    document.addEventListener('DOMContentLoaded', function() {
                                        document.getElementById('contact-note').innerHTML = ${JSON.stringify(note.content)};
                                    });
                                    `
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
