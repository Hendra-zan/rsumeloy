
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHeader from '../../../../components/layout/PageHeader';
import { translations } from '../../../../lib/translations';
import { navItemsConfig } from '../../../../lib/navigation';

// Import components for each subpage
import UgdFlow from '../../../../components/pages/patient-flow/UgdFlow';
import OutpatientFlow from '../../../../components/pages/patient-flow/OutpatientFlow';
import BpjsFlow from '../../../../components/pages/patient-flow/BpjsFlow';
import InsuranceFlow from '../../../../components/pages/patient-flow/InsuranceFlow';

interface PageProps {
  params: { subPage: string };
}

const patientFlowSubmenu = navItemsConfig.find(item => item.id === 'patient-flow')?.submenu;

export async function generateStaticParams() {
    return patientFlowSubmenu?.map(item => ({
        subPage: item.id,
    })) || [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const t = (key: string) => translations['id'][key] || key;
    const subPageInfo = patientFlowSubmenu?.find(item => item.id === params.subPage);

    if (!subPageInfo) {
        return { title: 'Halaman Tidak Ditemukan' };
    }

    return {
        title: `${t(subPageInfo.labelKey)} | RSU Meloy`,
        description: t(subPageInfo.subtitleKey),
    };
}

export default function PatientFlowSubPage({ params }: PageProps) {
    const { subPage } = params;
    const t = (key: string) => translations['id'][key] || key;

    const subPageInfo = patientFlowSubmenu?.find(item => item.id === params.subPage);
    if (!subPageInfo) {
        notFound();
    }
    
    let contentComponent;
    switch(subPage) {
        case 'ugd':
            contentComponent = <UgdFlow />;
            break;
        case 'rawat-jalan':
            contentComponent = <OutpatientFlow />;
            break;
        case 'bpjs':
            contentComponent = <BpjsFlow />;
            break;
        case 'asuransi-lain':
            contentComponent = <InsuranceFlow />;
            break;
        default:
            notFound();
    }

    return (
        <div className="animate-fade-in">
            <PageHeader
                title={t(subPageInfo.labelKey)}
                subtitle={t(subPageInfo.subtitleKey)}
                imagePublicId={subPage === 'ugd' ? 'ugdrsmeloysangatta' : 'alurpasien_b9m0zu'}
            />
            <div className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    {contentComponent}
                </div>
            </div>
        </div>
    );
}
