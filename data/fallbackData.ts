// Fallback data statis untuk digunakan saat build time
// Digunakan ketika koneksi ke Supabase gagal

export const fallbackServices = [
  {
    id: 1,
    name: "Layanan Gawat Darurat",
    description: "Layanan 24 jam untuk kondisi darurat medis",
    slug: "layanan-gawat-darurat",
    icon: "emergency",
    created_at: "2023-01-01T00:00:00.000Z"
  },
  {
    id: 2,
    name: "Rawat Inap",
    description: "Perawatan menginap dengan fasilitas lengkap",
    slug: "rawat-inap",
    icon: "bed",
    created_at: "2023-01-01T00:00:00.000Z"
  },
  {
    id: 3,
    name: "Rawat Jalan",
    description: "Konsultasi dan pengobatan tanpa menginap",
    slug: "rawat-jalan",
    icon: "stethoscope",
    created_at: "2023-01-01T00:00:00.000Z"
  }
];

export const fallbackFacilities = [
  {
    id: 1,
    name: "Ruang Operasi Modern",
    description: "Dilengkapi dengan peralatan medis terkini",
    slug: "ruang-operasi",
    image_url: "/images/facilities/operation-room.jpg",
    created_at: "2023-01-01T00:00:00.000Z"
  },
  {
    id: 2,
    name: "Laboratorium",
    description: "Fasilitas pemeriksaan laboratorium lengkap",
    slug: "laboratorium",
    image_url: "/images/facilities/lab.jpg",
    created_at: "2023-01-01T00:00:00.000Z"
  }
];

export const fallbackInfoItems = [
  {
    id: '617e93a0-c5ee-49d0-95c3-f939e2be945a',
    title: 'Jadwal Dokter Update',
    description: 'Informasi terbaru mengenai jadwal praktik dokter RSU Meloy',
    content: 'Silakan cek halaman jadwal dokter untuk informasi lengkap.',
    image_public_id: 'info/schedule_update',
    created_at: '2025-10-04T00:00:00.000Z'
  }
];
  {
    id: 1,
    title: "Jam Operasional",
    content: "Senin-Jumat: 08.00-20.00, Sabtu: 08.00-15.00, Minggu: Tutup",
    icon: "clock",
    created_at: "2023-01-01T00:00:00.000Z"
  },
  {
    id: 2,
    title: "Kontak Darurat",
    content: "Telepon: 0549-123456",
    icon: "phone",
    created_at: "2023-01-01T00:00:00.000Z"
  }
];

export const fallbackArticles = [
  {
    id: 1,
    title: "Pentingnya Kesehatan Jantung",
    slug: "pentingnya-kesehatan-jantung",
    excerpt: "Menjaga kesehatan jantung sangat penting untuk kualitas hidup yang baik",
    content: "Artikel lengkap tentang kesehatan jantung",
    created_at: "2023-01-01T00:00:00.000Z"
  },
  {
    id: 2,
    title: "Tips Hidup Sehat",
    slug: "tips-hidup-sehat",
    excerpt: "Beberapa tips sederhana untuk menjaga kesehatan sehari-hari",
    content: "Artikel lengkap tentang tips hidup sehat",
    created_at: "2023-01-01T00:00:00.000Z"
  }
];