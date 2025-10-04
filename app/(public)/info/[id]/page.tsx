
import { getInfoItemById, getInfo } from "../../../../lib/data";
import { fallbackInfoItems } from "../../../../data/fallbackData";
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHeader from "../../../../components/layout/PageHeader";
import { Button } from '../../../../components/ui/Button';
import { ArrowLeft } from '../../../../components/icons';
import Link from 'next/link';
import { formatDate, truncateText } from '../../../../lib/utils';

export async function generateStaticParams() {
    if (process.env.VERCEL_ENV === 'production' && process.env.NEXT_PHASE === 'build') {
        return fallbackInfoItems.map(item => ({
            id: item.id,
        }));
    }
    const infoItems = await getInfo();
    return infoItems.map(item => ({
        id: item.id,
    }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const item = await getInfoItemById(params.id);
    if (!item) {
        return {
            title: 'Informasi Tidak Ditemukan',
        };
    }
    return {
        title: `${item.title} | RSU Meloy`,
        description: truncateText(item.description, 160),
    };
}

export default async function InfoDetailPage({ params }: { params: { id: string } }) {
    console.log('Rendering InfoDetailPage for id:', params.id);
    
    try {
        const item = await getInfoItemById(params.id);
        console.log('Retrieved item:', item);

        if (!item) {
            console.log('Item not found, redirecting to 404');
            notFound();
        }

        return (
        <div className="animate-fade-in">
            <PageHeader
                title={item.title}
                imagePublicId={item.image_public_id}
            />
            <div className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-8">
                             <Button variant="outline" asChild>
                                 <Link href="/">
                                     <ArrowLeft className="mr-2 h-4 w-4" />
                                     Kembali ke Beranda
                                 </Link>
                             </Button>
                         </div>
                        <div className="text-sm text-muted-foreground mb-6">
                           Dipublikasikan pada: {formatDate(item.created_at)}
                        </div>

                        <article className="prose lg:prose-lg max-w-none">
                            <div className="mb-8 p-6 bg-secondary rounded-lg">
                                <div className="text-sm text-muted-foreground mb-2">
                                    Dipublikasikan pada: {formatDate(item.created_at)}
                                </div>
                                <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
                            </div>
                            <div className="mt-6" dangerouslySetInnerHTML={{ __html: item.description }} />
                        </article>
                    </div>
                </div>
            </div>
        </div>
        );
    } catch (error) {
        console.error('Error in InfoDetailPage:', error);
        notFound();
    }
}
