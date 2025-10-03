
import { getServiceBySlug, getServices } from "../../../../lib/data";
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHeader from "../../../../components/layout/PageHeader";
import OptimizedImage from "../../../../components/ui/OptimizedImage";
import Link from 'next/link';
import { Button } from '../../../../components/ui/Button';
import { ArrowLeft } from '../../../../components/icons';
import ClientSideContent from "../../../../components/ClientSideContent";

// Function to generate static paths
export async function generateStaticParams() {
    const services = await getServices();
    return services.map(service => ({
        slug: service.slug,
    }));
}

// Function to generate metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const service = await getServiceBySlug(params.slug);
    if (!service) {
        return {
            title: 'Layanan Tidak Ditemukan',
            description: 'Layanan yang Anda cari tidak tersedia.',
        };
    }
    const plainTextDescription = getPlainText(service.description);
    return {
        title: `${service.name} | RSU Meloy`,
        description: truncateText(plainTextDescription, 160),
        openGraph: {
            title: service.name,
            description: truncateText(plainTextDescription, 160),
            url: `/layanan/${service.slug}`,
            type: 'website',
            images: [{
                url: `https://res.cloudinary.com/ddyqhlilj/image/upload/${service.image_public_id_1}`,
                width: 1200,
                height: 630,
                alt: service.name
            }]
        },
        twitter: {
            card: 'summary_large_image',
            title: service.name,
            description: truncateText(plainTextDescription, 160),
            images: [`https://res.cloudinary.com/ddyqhlilj/image/upload/${service.image_public_id_1}`]
        },
        alternates: {
            canonical: `/layanan/${service.slug}`,
        }
    };
}
// Helper function to extract plain text, needed for metadata
const getPlainText = (html: string): string => {
    if(!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
};
const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};


const generateServiceJsonLd = (service: any) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalService',
    name: service.name,
    description: getPlainText(service.description),
    provider: {
      '@type': 'Hospital',
      name: 'RSU Meloy',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jalan Yos Sudarso No. 5',
        addressLocality: 'Sangatta Utara',
        addressRegion: 'Kalimantan Timur',
        postalCode: '75683',
        addressCountry: 'ID'
      }
    },
    image: `https://res.cloudinary.com/ddyqhlilj/image/upload/${service.image_public_id_1}`,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/layanan/${service.slug}`,
    serviceType: 'Medical',
    category: 'Healthcare',
  };
};

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
    const service = await getServiceBySlug(params.slug);

    if (!service) {
        notFound();
    }

    const images = [service.image_public_id_1, service.image_public_id_2, service.image_public_id_3].filter(Boolean) as string[];

    return (
        <div className="animate-fade-in">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateServiceJsonLd(service))
                }}
            />
            <PageHeader
                title={service.name}
                imagePublicId={service.image_public_id_1}
            />
            <div className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto">
                         <div className="mb-12">
                             <Button variant="outline" asChild>
                                 <Link href="/layanan">
                                     <ArrowLeft className="mr-2 h-4 w-4" />
                                     Kembali ke Semua Layanan
                                 </Link>
                             </Button>
                         </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            {images.map((imgId, index) => (
                                <div key={index} className="overflow-hidden rounded-lg shadow-lg">
                                    <OptimizedImage publicId={imgId} alt={`${service.name} ${index+1}`} width={600} height={400} className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105" />
                                </div>
                            ))}
                        </div>

                        <div className="prose lg:prose-lg max-w-none">
                            <ClientSideContent html={service.description} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
