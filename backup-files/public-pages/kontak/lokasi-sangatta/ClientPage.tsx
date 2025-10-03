'use client';

import { useEffect } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Phone, Clock, Award } from '@/components/icons';
import { useLanguage } from '@/hooks/useContextHooks';
import hospitalInfo from '@/data/hospitalInfo.json';

export default function LayananSangattaPage() {
  const { language } = useLanguage();

  const pageContent = {
    id: {
      title: "Layanan Kesehatan di Sangatta",
      description: "RSU Meloy menyediakan layanan kesehatan komprehensif untuk masyarakat Sangatta dan sekitarnya",
      contacts: "Kontak",
      address: "Alamat",
      operatingHours: "Jam Operasional",
      facilities: "Fasilitas",
      specialists: "Dokter Spesialis",
      insurance: "Kerjasama Asuransi",
      certifications: "Sertifikasi & Akreditasi",
      testimonials: "Testimoni Pasien",
      location: "Lokasi Kami",
      phone: "Telepon",
      email: "Email",
      whatsapp: "WhatsApp"
    },
    en: {
      title: "Healthcare Services in Sangatta",
      description: "RSU Meloy provides comprehensive healthcare services for the Sangatta community",
      contacts: "Contact",
      address: "Address",
      operatingHours: "Operating Hours",
      facilities: "Facilities",
      specialists: "Specialist Doctors",
      insurance: "Insurance Partners",
      certifications: "Certifications & Accreditation",
      testimonials: "Patient Testimonials",
      location: "Our Location",
      phone: "Phone",
      email: "Email",
      whatsapp: "WhatsApp"
    }
  };

  const content = pageContent[language] || pageContent.id;

  // Add LocalBusiness schema for Sangatta location
  useEffect(() => {
    const locationSchema = {
      "@context": "https://schema.org",
      "@type": "MedicalOrganization",
      "@id": "https://rsumeloy.com/kontak/lokasi-sangatta#organization",
      name: "RSU Meloy",
      url: "https://rsumeloy.com/kontak/lokasi-sangatta",
      logo: "https://res.cloudinary.com/ddyqhlilj/image/upload/logo_rsmeloy_web",
      address: {
        "@type": "PostalAddress",
        streetAddress: hospitalInfo.address.street,
        addressLocality: hospitalInfo.address.district,
        addressRegion: hospitalInfo.address.province,
        postalCode: hospitalInfo.address.postalCode,
        addressCountry: "ID"
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: hospitalInfo.googleMaps.latitude,
        longitude: hospitalInfo.googleMaps.longitude
      },
      telephone: hospitalInfo.contact.phone,
      medicalSpecialty: hospitalInfo.specialists,
      availableService: hospitalInfo.facilities,
      openingHoursSpecification: hospitalInfo.businessHours.map(hours => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: hours.days,
        opens: hours.hours.split(" - ")[0],
        closes: hours.hours.split(" - ")[1] || "24:00",
        description: hours.note
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(locationSchema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <PageHeader 
        title={content.title}
        description={content.description}
        imagePublicId="kontakrsmeloy_cv12fh"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Location Info */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{content.location}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium mb-2">{content.address}</h3>
                  <p className="text-gray-600">
                    {hospitalInfo.address.street}<br />
                    {hospitalInfo.address.district}, {hospitalInfo.address.city}<br />
                    {hospitalInfo.address.province} {hospitalInfo.address.postalCode}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium mb-2">{content.contacts}</h3>
                  <p className="text-gray-600">
                    {content.phone}: {hospitalInfo.contact.phone}<br />
                    {content.email}: {hospitalInfo.contact.email}<br />
                    {content.whatsapp}: {hospitalInfo.contact.whatsapp}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Business Hours */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{content.operatingHours}</h2>
          <div className="grid gap-4">
            {hospitalInfo.businessHours.map((schedule, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium mb-2">{schedule.note}</h3>
                    <p className="text-gray-600">
                      {schedule.days}: {schedule.hours}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Facilities */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{content.facilities}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {hospitalInfo.facilities.map((facility, index) => (
              <Badge key={index} variant="outline" className="p-2 text-center">
                {facility}
              </Badge>
            ))}
          </div>
        </section>

        {/* Specialist Doctors */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{content.specialists}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {hospitalInfo.specialists.map((specialist, index) => (
              <Card key={index} className="p-4">
                {specialist}
              </Card>
            ))}
          </div>
        </section>

        {/* Insurance */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{content.insurance}</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {hospitalInfo.insurance.map((insurance, index) => (
              <Badge key={index} variant="outline" className="p-2 text-center">
                {insurance}
              </Badge>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{content.certifications}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {hospitalInfo.certifications.map((cert, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start space-x-4">
                  <Award className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">{cert}</h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{content.testimonials}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {hospitalInfo.testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-600 italic">"{testimonial.review}"</p>
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{testimonial.name}</p>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Map */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">{content.location}</h2>
          <div className="aspect-video w-full rounded-lg overflow-hidden">
            <iframe
              src={hospitalInfo.googleMaps.embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </div>
    </div>
  );
}