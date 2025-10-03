import type { Metadata } from "next";
import type { NextWebVitalsMetric } from 'next/app';
import { Poppins } from 'next/font/google';
import "./globals.css";
import { LanguageProvider } from "../contexts/LanguageContext";
import { AuthProvider } from "../contexts/AuthContext";
import { cn } from "../lib/utils";
import { reportWebVitals as reportWebVitalsToAnalytics } from "@/lib/analytics";
import React, { useEffect } from "react";
import Script from "next/script";
import { cookies } from 'next/headers';
import AnalyticsInitializer from "../components/AnalyticsInitializer";

// Enable web vitals reporting
export function reportWebVitals(metric: NextWebVitalsMetric) {
  reportWebVitalsToAnalytics(metric);
}

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    'sans-serif'
  ],
});


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rsumeloy.com'),
  title: {
    default: "RSU Meloy - Pelayanan Kesehatan Unggul di Sangatta Utara",
    template: "%s | RSU Meloy"
  },
  description: "RSU Meloy berkomitmen untuk memberikan pengalaman perawatan kesehatan yang unggul dengan tim profesional, teknologi canggih, dan kenyamanan pasien di Sangatta Utara, Kalimantan Timur.",
  keywords: ["rumah sakit", "RSU Meloy", "kesehatan", "Sangatta Utara", "Kalimantan Timur", "dokter", "layanan medis", "UGD", "rawat inap", "rawat jalan"],
  authors: [{ name: "RSU Meloy" }],
  applicationName: "RSU Meloy Website",

  generator: "Next.js",
  referrer: "strict-origin-when-cross-origin",
  creator: "RSU Meloy Digital Team",
  publisher: "RSU Meloy",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: 'https://res.cloudinary.com/ddyqhlilj/image/upload/logo_rsmeloy_web',
    shortcut: '/favicon.ico',
    apple: 'https://res.cloudinary.com/ddyqhlilj/image/upload/logo_rsmeloy_web',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  },
  alternates: {
    canonical: '/',
    languages: {
      'id-ID': '/id',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "RSU Meloy",
    title: "RSU Meloy - Pelayanan Kesehatan Unggul di Sangatta Utara",
    description: "RSU Meloy berkomitmen untuk memberikan pengalaman perawatan kesehatan yang unggul dengan tim profesional, teknologi canggih, dan kenyamanan pasien di Sangatta Utara, Kalimantan Timur.",
    images: [
      {
        url: "https://res.cloudinary.com/ddyqhlilj/image/upload/gedungrsmeloymalam",
        width: 1200,
        height: 630,
        alt: "RSU Meloy - Pelayanan Kesehatan Unggul di Sangatta Utara"
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@rsumeloy',
    images: "https://res.cloudinary.com/ddyqhlilj/image/upload/gedungrsmeloymalam"
  },
  manifest: "/manifest.json"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        poppins.variable
      )}>
        {/* <Script src="/analytics.js" strategy="afterInteractive" /> */}
        {/* <Script id="analytics-setup" strategy="afterInteractive">
          {`
            (function() {
              ${setupGlobalErrorHandler.toString()}
              ${setupAnalytics.toString()}
              setupGlobalErrorHandler();
              setupAnalytics();
            })();
          `}
        </Script> */}
        <LanguageProvider>
          <AuthProvider>
            {children}
            <AnalyticsInitializer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}