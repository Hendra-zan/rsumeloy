
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../hooks/useContextHooks';
import ClientSideContent from '../../ClientSideContent';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { ArrowRight } from '../../icons';
import { formatDate } from '../../../lib/utils';
import OptimizedImage from '../../ui/OptimizedImage';
import { Article } from '../../../types';

interface ArticlesListProps {
    articles: Article[];
}

const ArticlesList: React.FC<ArticlesListProps> = ({ articles }) => {
    const { t } = useLanguage();
    const router = useRouter();

    return (
        <div className="mt-8">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {articles.length > 0 ? articles.map(article => (
                    <Card key={article.id} className="flex flex-col overflow-hidden transition-shadow hover:shadow-xl break-inside-avoid">
                        <CardHeader className="p-0">
                            <OptimizedImage publicId={article.image_public_id} alt={article.title} width={600} height={400} className="w-full h-56 object-cover" />
                        </CardHeader>
                        <div className="flex flex-col flex-1 p-6">
                            <CardTitle className="mb-2 text-xl">{article.title}</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground mb-4">Oleh {article.author} &bull; {formatDate(article.created_at)}</CardDescription>
                            <div className="prose prose-sm text-muted-foreground line-clamp-3 flex-1">
                                <ClientSideContent html={article.content} className="text-sm" />
                            </div>
                            <CardFooter className="p-0 pt-6 mt-auto">
                                <Button 
                                    variant="link" 
                                    className="p-0" 
                                    onClick={() => router.push(`/tentang/artikel/${article.slug}`)}
                                >
                                    {t('selengkapnya')} <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </div>
                    </Card>
                )) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <p>Belum ada artikel yang dipublikasikan.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticlesList;
