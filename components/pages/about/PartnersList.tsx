
import React from 'react';
import { Card } from '../../ui/Card';
import OptimizedImage from '../../ui/OptimizedImage';
import { Partner } from '../../../types';

interface PartnersListProps {
    partners: Partner[];
}

const PartnersList: React.FC<PartnersListProps> = ({ partners }) => {
    return (
        <div className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {partners.length > 0 ? (partners.map((partner) => (
                    <Card key={partner.id} className="flex flex-col items-center justify-center p-6 transition-shadow hover:shadow-xl h-48">
                        <OptimizedImage publicId={partner.image_public_id} alt={partner.name} className="object-contain h-20" />
                        <p className="mt-4 font-semibold text-center text-muted-foreground">{partner.name}</p>
                    </Card>
                ))) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <p>Belum ada mitra yang ditambahkan.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PartnersList;
