
import { getInfoItemById, getInfo } from "../../../../lib/data";
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHeader from "../../../../components/layout/PageHeader";
import { Button } from '../../../../components/ui/Button';
import { ArrowLeft } from '../../../../components/icons';
import Link from 'next/link';
import { formatDate, truncateText } from '../../../../lib/utils';

export async function generateStaticParams() {
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
    const item = await getInfoItemById(params.id);

    if (!item) {
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
                          <p>{item.description}</p>
                        </article>
                    </div>
                </div>
            </div>
        </div>
    );
}
