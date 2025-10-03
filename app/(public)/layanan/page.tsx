
import { getServices } from "../../../lib/data";
import { translations } from "../../../lib/translations";
import { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from "../../../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/Card";
import CardImageSlider from "../../../components/ui/CardImageSlider";
import { Button } from "../../../components/ui/Button";
import { ArrowRight } from "../../../components/icons";
import { truncateText, getPlainText } from "../../../lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = (key: string) => translations['id'][key] || key;
  return {
    title: `${t('layananTitle')} | RSU Meloy`,
    description: t('layananSubtitle'),
    openGraph: {
      title: t('layananTitle'),
      description: t('layananSubtitle'),
      url: '/layanan',
      type: 'website',
      images: [{
        url: 'https://res.cloudinary.com/ddyqhlilj/image/upload/ugdrsmeloysangatta',
        width: 1200,
        height: 630,
        alt: t('layananTitle')
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: t('layananTitle'),
      description: t('layananSubtitle'),
      images: ['https://res.cloudinary.com/ddyqhlilj/image/upload/ugdrsmeloysangatta']
    },
    alternates: {
      canonical: '/layanan',
    }
  };
}

export default async function ServicesPage() {
    const services = await getServices();
    const t = (key: string) => translations['id'][key] || key;
    return (
        <div className="animate-fade-in">
            <PageHeader
                title={t('layananTitle')}
                subtitle={t('layananSubtitle')}
                imagePublicId="ugdrsmeloysangatta"
            />
            <div className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map(service => {
                            const serviceImages = [service.image_public_id_1, service.image_public_id_2, service.image_public_id_3].filter(Boolean) as string[];
                            return (
                                <Card key={service.id} className="overflow-hidden flex flex-col transition-shadow hover:shadow-xl group">
                                    <Link href={`/layanan/${service.slug}`} className="block w-full text-left">
                                        <CardHeader className="p-0">
                                            <div className="overflow-hidden">
                                                <CardImageSlider imagePublicIds={serviceImages} alt={service.name} />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6 flex-1">
                                            <CardTitle className="mb-2 group-hover:text-primary transition-colors">{service.name}</CardTitle>
                                            <CardDescription>{truncateText(getPlainText(service.description), 120)}</CardDescription>
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
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
