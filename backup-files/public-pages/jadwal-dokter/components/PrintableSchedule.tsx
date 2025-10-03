
import React from 'react';
import Image from 'next/image';
import { Doctor } from '../../../../types';
import { formatDate } from '../../../../lib/utils';
import { getOptimizedUrl } from '../../../../lib/cloudinary';

interface PrintableScheduleProps {
  doctors: Doctor[];
  forwardedRef: React.Ref<HTMLDivElement>;
}

export const PrintableSchedule: React.FC<PrintableScheduleProps> = ({ doctors, forwardedRef }) => {
  const logoUrl = getOptimizedUrl('logo_rsmeloy_web');
  return (
    <div
      ref={forwardedRef}
      className="p-8 bg-white text-black font-sans"
      style={{ 
        width: '1280px',
        color: '#000000',
        backgroundColor: '#ffffff',
        minHeight: '700px'
      }}
    >
      <header className="flex items-center justify-between pb-4 border-b-2 border-black">
        <div className="flex items-center gap-4">
          <img
            src={logoUrl}
            alt="Logo RSU Meloy"
            className="h-16 w-16"
            style={{ width: '64px', height: '64px' }}
          />
          <div>
            <h1 className="text-3xl font-bold text-black">RSU Meloy</h1>
            <p className="text-sm text-black">Jl. Yos Sudarso II No.101, Sangatta Utara</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-black">Jadwal Dokter</h2>
          <p className="text-sm text-black">Dicetak pada: {formatDate(new Date())}</p>
        </div>
      </header>

      <main className="mt-8">
        <table className="w-full border-collapse text-base" style={{ border: '1px solid black' }}>
          <thead>
            <tr className="bg-white">
              <th className="p-3 text-left font-semibold border border-black">No.</th>
              <th className="p-3 text-left font-semibold border border-black">Nama Dokter</th>
              <th className="p-3 text-left font-semibold border border-black">Spesialisasi</th>
              <th className="p-3 text-left font-semibold border border-black w-1/3">Jadwal</th>
              <th className="p-3 text-left font-semibold border border-black">Status Praktek</th>
              <th className="p-3 text-left font-semibold border border-black">Catatan Tambahan</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length > 0 ? doctors.map((doctor, index) => (
              <tr key={doctor.id} className="border-b border-black">
                <td className="p-3 border border-black text-center">{index + 1}</td>
                <td className="p-3 border border-black">{doctor.name}</td>
                <td className="p-3 border border-black">{doctor.specialty}</td>
                <td className="p-3 border border-black">{doctor.schedule || 'Sesuai perjanjian'}</td>
                <td className="p-3 border border-black">
                  <span style={{ color: doctor.status === 'Praktek' ? '#000000' : '#dc2626' }}>
                    {doctor.status}
                    {doctor.status !== 'Praktek' && doctor.status_info && ` (${doctor.status_info})`}
                  </span>
                </td>
                <td className="p-3 border border-black">{doctor.notes || '-'}</td>
              </tr>
            )) : (
                <tr>
                    <td colSpan={6} className="p-8 text-center text-black border border-black">
                        Tidak ada data dokter untuk ditampilkan sesuai filter yang dipilih.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </main>
      
      <footer className="mt-8 pt-4 text-xs text-black border-t border-black space-y-4">
        <div className="text-left space-y-2">
          <p className="font-semibold">Catatan Penting:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Jam tertera merupakan jadwal layanan pemeriksaan dokter, diharapkan pasien melakukan pendaftaran tidak lewat dari jam tersebut.</li>
            <li>Pendaftaran dibuka 1 jam sebelum jadwal pemeriksaan dokter atau disarankan melakukan pendaftaran melalui aplikasi Mobile JKN.</li>
            <li>Diharapkan selalu membawa identitas (BPJS atau KTP) dan kelengkapan berkas lainnya seperti surat rujukan atau surat kontrol (jika ada).</li>
            <li>Pasien BPJS dengan usia ≥17 Tahun wajib hadir saat pendaftaran untuk melakukan sidik jari dan pengenalan wajah (Biometrik).</li>
          </ul>
        </div>
        <div className="text-center pt-4 border-t border-black/20">
          <p>Jadwal dapat berubah sewaktu-waktu. Untuk informasi lebih lanjut, hubungi (0549) 24222.</p>
          <p>&copy; {new Date().getFullYear()} Rumah Sakit Umum Meloy. Seluruh hak cipta dilindungi.</p>
        </div>
      </footer>
    </div>
  );
};
