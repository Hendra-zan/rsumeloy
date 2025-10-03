
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHeader from '../../../../components/layout/PageHeader';
import { translations } from '../../../../lib/translations';
import { navItemsConfig } from '../../../../lib/navigation';
import { getArticles, getPartners, getVacancies } from '../../../../lib/data';

// Import components for each subpage
import ProfileContent from '../../../../components/pages/about/ProfileContent';
import ArticlesList from '../../../../components/pages/about/ArticlesList';
import PartnersList from '../../../../components/pages/about/PartnersList';
import VacanciesList from '../../../../components/pages/about/VacanciesList';

interface PageProps {
  params: { subPage: string };
}

const aboutSubmenu = navItemsConfig.find(item => item.id === 'about')?.submenu;

export async function generateStaticParams() {
    // We filter out 'health-articles' because it has a separate detail page structure
    // and will be handled by /tentang/artikel/[slug]
    const validSubPages = aboutSubmenu?.filter(item => item.path.startsWith('/tentang/')) || [];
    return validSubPages.map(item => ({
        subPage: item.id,
    })) || [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const t = (key: string) => translations['id'][key] || key;
    const subPageInfo = aboutSubmenu?.find(item => item.id === params.subPage);

    if (!subPageInfo) {
        return { title: 'Halaman Tidak Ditemukan' };
    }

    return {
        title: `${t(subPageInfo.labelKey)} | RSU Meloy`,
        description: t(subPageInfo.subtitleKey),
    };
}

export default async function AboutSubPage({ params }: PageProps) {
    const { subPage } = params;
    const t = (key: string) => translations['id'][key] || key;

    const subPageInfo = aboutSubmenu?.find(item => item.id === params.subPage);
    if (!subPageInfo) {
        notFound();
    }
    
    let contentComponent;

    switch(subPage) {
        case 'profile':
            contentComponent = <ProfileContent />;
            break;
        case 'partners':
            const partners = await getPartners();
            contentComponent = <PartnersList partners={partners} />;
            break;
        case 'vacancies':
            const vacancies = await getVacancies();
            contentComponent = <VacanciesList vacancies={vacancies} />;
            break;

        default:
            notFound();
    }

    return (
        <div className="animate-fade-in">
            <PageHeader
                title={t(subPageInfo.labelKey)}
                subtitle={t(subPageInfo.subtitleKey)}
                imagePublicId={
                    subPage === 'profile' ? '2014rsmeloysangatta' : 'gedungrsmeloymalam'
                }
            />
            <div className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    {contentComponent}
                </div>
            </div>
        </div>
    );
}
