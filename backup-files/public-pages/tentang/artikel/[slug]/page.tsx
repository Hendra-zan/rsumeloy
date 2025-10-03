
import { getArticleBySlug, getArticles } from "../../../../../lib/data";
import { truncateText, getPlainText } from "../../../../../lib/utils";
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleContent from './ArticleContent';

export async function generateStaticParams() {
    const articles = await getArticles();
    return articles.map(article => ({
        slug: article.slug,
    }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const article = await getArticleBySlug(params.slug);
    if (!article) {
        return {
            title: 'Artikel Tidak Ditemukan',
        };
    }
    return {
        title: `${article.title} | RSU Meloy`,
        description: truncateText(getPlainText(article.content), 160),
        openGraph: {
            title: article.title,
            description: truncateText(getPlainText(article.content), 160),
            images: [
                {
                    url: `https://res.cloudinary.com/ddyqhlilj/image/upload/w_1200,h_630,c_fill/${article.image_public_id}`,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
            type: 'article',
            publishedTime: article.created_at,
            authors: [article.author],
        },
    };
}


export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
    const article = await getArticleBySlug(params.slug);

    if (!article) {
        notFound();
    }

    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/tentang/artikel/${params.slug}`;

    return <ArticleContent article={article} url={url} />;
}
