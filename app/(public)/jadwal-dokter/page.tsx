
import { getDoctors } from "../../../lib/data";
import DoctorsPageClient from './components/DoctorsPageClient';
import { translations } from "../../../lib/translations";
import { Metadata } from 'next';
import PageHeader from "../../../components/layout/PageHeader";

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const t = (key: string) => translations['id'][key] || key;
  return {
    title: `${t('jadwalDokterTitle')} | RSU Meloy`,
    description: t('jadwalDokterSubtitle'),
  };
}

export default async function DoctorsPage() {
    const doctors = await getDoctors();
    const t = (key: string) => translations['id'][key] || key;
    
    return (
        <div className="animate-fade-in">
            <PageHeader
                title={t('jadwalDokterTitle')}
                subtitle={t('jadwalDokterSubtitle')}
                imagePublicId="polirsmeloy"
            />
            <DoctorsPageClient doctors={doctors} />
        </div>
    );
}
