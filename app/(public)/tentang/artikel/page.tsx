import { Metadata } from 'next';
import PageHeader from "@/components/layout/PageHeader";
import { getArticles } from '@/lib/data';
import ArticlesList from '@/components/pages/about/ArticlesList';

export const metadata: Metadata = {
    title: 'Artikel Kesehatan | RSU Meloy',
    description: 'Artikel-artikel kesehatan informatif dan bermanfaat dari RSU Meloy.',
};

export default async function ArticlesPage() {
    const articles = await getArticles();

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Artikel Kesehatan"
                description="Temukan informasi kesehatan terpercaya dari tim medis RSU Meloy."
                imagePublicId="artikelkesehatan_ao6b4b"
            />
            <div className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <ArticlesList articles={articles} />
                </div>
            </div>
        </div>
    );
}