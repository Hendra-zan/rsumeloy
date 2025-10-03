
import React from 'react';

const exampleData = [
    { name: 'Dr. Jane Doe', specialty: 'Jantung', image_public_id: 'rsu-meloy/dokter/jane-doe', schedule: 'Senin, Rabu (09:00 - 12:00)', status: 'Praktek', status_info: '', notes: 'Hanya sore hari', display_order: 1 },
    { name: 'Dr. John Smith', specialty: 'Anak', image_public_id: '', schedule: 'Selasa, Kamis (14:00 - 17:00)', status: 'Praktek', status_info: '', notes: '', display_order: 2 },
    { name: 'Dr. Alice Johnson', specialty: 'Bedah Umum', image_public_id: 'rsu-meloy/dokter/alice-johnson', schedule: '', status: 'Tutup', status_info: 'Cuti tahunan', notes: 'Kembali praktek bulan depan', display_order: '' },
];

const headers = ['name', 'specialty', 'image_public_id', 'schedule', 'status', 'status_info', 'notes', 'display_order'];

export const ImportDoctorsExample: React.FC = () => {
    return (
        <div className="p-4 my-4 border rounded-lg bg-secondary/50 animate-fade-in">
            <h5 className="font-semibold text-center mb-2">Contoh Format Data di File Excel</h5>
            <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                    <thead className="bg-gray-200">
                        <tr>
                            {headers.map(header => (
                                <th key={header} className="p-2 font-medium">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {exampleData.map((row, index) => (
                            <tr key={index} className="border-b last:border-b-0">
                                {headers.map(header => (
                                    <td key={header} className="p-2 whitespace-nowrap">{(row as any)[header]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
