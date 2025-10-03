
import dynamic from 'next/dynamic';
import { getServices, getPartners, getInfo, getFacilities } from "../../lib/data";

// Dynamically import the client component with no SSR to avoid client-reference-manifest issues
const HomePageClient = dynamic(() => import("./HomePageClient"), { ssr: false });

export default async function HomePage() {
  // Implement safe data fetching with fallbacks
  let services = [], partners = [], info = [], facilities = [];
  
  try {
    const [services, partners, infoItems, facilities] = await Promise.all([
      getServices().catch(() => []),
      getPartners().catch(() => []),
      getInfo().catch(() => []),
      getFacilities().catch(() => []),
    ]);
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    // Continue with empty arrays if fetch fails
  }

  return (
    <HomePageClient 
      services={services} 
      partners={partners} 
      info={info} 
      facilities={facilities} 
    />
  );
}
