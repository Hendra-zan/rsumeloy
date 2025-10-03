
import { getFacilities } from "../../../lib/data";
import { translations } from "../../../lib/translations";
import { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from "../../../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/Card";
import CardImageSlider from "../../../components/ui/CardImageSlider";
import { Button } from "../../../components/ui/Button";
import { ArrowRight } from "../../../components/icons";
import { truncateText, getPlainText } from "../../../lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = (key: string) => translations['id'][key] || key;
  return {
    title: `${t('fasilitasTitle')} | RSU Meloy`,
    description: t('fasilitasSubtitle'),
  };
}

export default async function FacilitiesPage() {
    const facilities = await getFacilities();
    const t = (key: string) => translations['id'][key] || key;
    return (
        <div className="animate-fade-in">
            <PageHeader
                title={t('fasilitasTitle')}
                subtitle={t('fasilitasSubtitle')}
                imagePublicId="ruang_operasi_shmxxc"
            />
            <div className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        {facilities.map(facility => {
                            const facilityImages = [facility.image_public_id_1, facility.image_public_id_2, facility.image_public_id_3].filter(Boolean) as string[];
                            return (
                                <Card key={facility.id} className="overflow-hidden flex flex-col transition-shadow hover:shadow-xl group break-inside-avoid">
                                    <Link href={`/fasilitas/${facility.slug}`} className="block w-full text-left">
                                        <CardHeader className="p-0">
                                            <div className="overflow-hidden">
                                                <CardImageSlider imagePublicIds={facilityImages} alt={facility.name} />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6 flex-1">
                                            <CardTitle className="mb-2 group-hover:text-primary transition-colors">{facility.name}</CardTitle>
                                            <CardDescription>{truncateText(getPlainText(facility.description), 120)}</CardDescription>
                                        </CardContent>
                                    </Link>
                                    <div className="p-6 pt-0 mt-auto">
                                        <Button asChild variant="link" className="p-0">
                                            <Link href={`/fasilitas/${facility.slug}`}>
                                                Lihat Detail <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
