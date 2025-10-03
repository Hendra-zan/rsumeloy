
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Briefcase, MapPin, Calendar } from '../../icons';
import { formatDate } from '../../../lib/utils';
import { Vacancy } from '../../../types';

interface VacanciesListProps {
    vacancies: Vacancy[];
}

const VacanciesList: React.FC<VacanciesListProps> = ({ vacancies }) => {
    return (
        <div className="mt-8">
            <div className="columns-1 md:columns-2 gap-8 space-y-8">
                {vacancies.length > 0 ? (vacancies.map((vacancy) => (
                    <Card key={vacancy.id} className="flex flex-col overflow-hidden transition-shadow hover:shadow-xl break-inside-avoid">
                        <CardHeader>
                            <CardTitle className="mb-2 text-xl">{vacancy.title}</CardTitle>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /><span>{vacancy.type}</span></div>
                                <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /><span>{vacancy.location}</span></div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="line-clamp-4 text-muted-foreground">{vacancy.description}</p>
                        </CardContent>
                        <CardFooter className="p-6 bg-secondary/80 flex-wrap justify-between items-center gap-4">
                            <div className="flex items-center gap-1.5 text-sm text-destructive font-medium">
                                <Calendar className="h-4 w-4"/>
                                <span>Batas Akhir: {formatDate(vacancy.deadline)}</span>
                            </div>
                            <Button asChild>
                                <a 
                                    href={`mailto:rsu_meloy@yahoo.co.id?subject=Lamaran%20Pekerjaan%20-%20Posisi:%20${vacancy.title}`}
                                    title={`Kirim email lamaran untuk posisi ${vacancy.title}`}
                                >
                                    Kirim Lamaran
                                </a>
                            </Button>
                        </CardFooter>
                    </Card>
                ))) : (
                    <div className="col-span-full text-center py-16 text-muted-foreground">
                        <p>Saat ini belum ada lowongan pekerjaan yang tersedia.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VacanciesList;
