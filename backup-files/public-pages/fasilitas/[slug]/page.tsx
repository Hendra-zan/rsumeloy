
import { getFacilityBySlug, getFacilities } from "../../../../lib/data";
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHeader from "../../../../components/layout/PageHeader";
import OptimizedImage from "../../../../components/ui/OptimizedImage";
import Link from 'next/link';
import { Button } from '../../../../components/ui/Button';
import { ArrowLeft } from '../../../../components/icons';
import ClientSideContent from "../../../../components/ClientSideContent";

export async function generateStaticParams() {
    const facilities = await getFacilities();
    return facilities.map(facility => ({
        slug: facility.slug,
    }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const facility = await getFacilityBySlug(params.slug);
    if (!facility) {
        return {
            title: 'Fasilitas Tidak Ditemukan',
        };
    }
    const plainTextDescription = getPlainText(facility.description);
    return {
        title: `${facility.name} | RSU Meloy`,
        description: truncateText(plainTextDescription, 160),
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

export default async function FacilityDetailPage({ params }: { params: { slug: string } }) {
    const facility = await getFacilityBySlug(params.slug);

    if (!facility) {
        notFound();
    }

    const images = [facility.image_public_id_1, facility.image_public_id_2, facility.image_public_id_3].filter(Boolean) as string[];

    return (
        <div className="animate-fade-in">
            <PageHeader
                title={facility.name}
                imagePublicId={facility.image_public_id_1}
            />
            <div className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto">
                         <div className="mb-12">
                             <Button variant="outline" asChild>
                                 <Link href="/fasilitas">
                                     <ArrowLeft className="mr-2 h-4 w-4" />
                                     Kembali ke Semua Fasilitas
                                 </Link>
                             </Button>
                         </div>

                        {images.length > 0 && (
                            <div className="columns-1 md:columns-2 gap-8 mb-12 space-y-8">
                                {images.map((imgId, index) => (
                                    <div key={index} className="overflow-hidden rounded-lg shadow-lg break-inside-avoid">
                                        <OptimizedImage publicId={imgId} alt={`${facility.name} ${index+1}`} width={600} height={400} className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105" />
                                    </div>
                                ))}
                            </div>
                        )}

                        <article className="prose lg:prose-lg max-w-none">
                            {/* Menggunakan komponen ClientSideContent untuk menghindari error hydration */}
                            <ClientSideContent html={facility.description || ''} />
                        </article>
                    </div>
                </div>
            </div>
        </div>
    );
}
