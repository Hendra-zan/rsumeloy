"use client";

import { useEffect } from 'react';

interface LocalBusiness {
  name: string;
  image: string;
  telephone: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  url: string;
  openingHours: string[];
}

const hospitalData: LocalBusiness = {
  name: "RSU Meloy",
  image: "https://res.cloudinary.com/ddyqhlilj/image/upload/logo_rsmeloy_web",
  telephone: "(0549) 24222",
  address: {
    streetAddress: "Jl. Yos Sudarso II No.101",
    addressLocality: "Sangatta Utara",
    addressRegion: "Kalimantan Timur",
    postalCode: "75611",
    addressCountry: "ID"
  },
  geo: {
    latitude: 0.5267, // Update dengan koordinat yang tepat
    longitude: 117.5953 // Update dengan koordinat yang tepat
  },
  url: "https://rsumeloy.com",
  openingHours: [
    "Mo-Su 00:00-24:00" // 24 jam
  ]
};

export function useOrganizationSchema() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Hospital",
      ...hospitalData,
      areaServed: "Sangatta Utara",
      hasMap: "https://www.google.com/maps?q=RSU+Meloy",
      medicalSpecialty: ["Emergency Medicine", "Surgery", "Internal Medicine", "Pediatrics", "Obstetrics"],
      availableService: {
        "@type": "MedicalTherapy",
        name: "Emergency Care, Outpatient Care, Inpatient Care, Surgery, Laboratory Services"
      }
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);
}

export function useDoctorSchema(doctor: any) {
  useEffect(() => {
    if (!doctor) return;
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Physician",
      name: doctor.name,
      image: doctor.image_public_id ? `https://res.cloudinary.com/ddyqhlilj/image/upload/${doctor.image_public_id}` : undefined,
      medicalSpecialty: doctor.specialty,
      worksFor: {
        "@type": "Hospital",
        name: "RSU Meloy"
      }
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [doctor]);
}

export function useArticleSchema(article: any) {
  useEffect(() => {
    if (!article) return;
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      image: article.image_public_id ? `https://res.cloudinary.com/ddyqhlilj/image/upload/${article.image_public_id}` : undefined,
      datePublished: article.created_at,
      dateModified: article.updated_at || article.created_at,
      author: {
        "@type": "Person",
        name: article.author
      },
      publisher: {
        "@type": "Organization",
        name: "RSU Meloy",
        logo: {
          "@type": "ImageObject",
          url: "https://res.cloudinary.com/ddyqhlilj/image/upload/logo_rsmeloy_web"
        }
      }
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [article]);
}
