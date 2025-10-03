// Tipe data untuk web vital metrics
export type WebVitalName = 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';

export interface WebVital {
  id: string;
  name: WebVitalName;
  value: number;
  metric_id: string;
  label: string;
  page_url: string;
  user_agent?: string;
  timestamp: string;
  created_at: string;
}

// Interface untuk inserting web vital data
export interface WebVitalInsert extends Omit<WebVital, 'id' | 'created_at' | 'timestamp'> {
  timestamp?: string;
}

// Fungsi helper untuk memvalidasi web vital name
export function isValidWebVitalName(name: string): name is WebVitalName {
  return ['CLS', 'FCP', 'FID', 'INP', 'LCP', 'TTFB'].includes(name);
}

// Fungsi untuk memformat nilai web vital
export function formatWebVitalValue(name: WebVitalName, value: number): string {
  switch (name) {
    case 'CLS':
      return value.toFixed(3);
    case 'FCP':
    case 'FID':
    case 'INP':
    case 'LCP':
    case 'TTFB':
      return `${Math.round(value)}ms`;
  }
}

// Fungsi untuk mendapatkan threshold nilai yang baik
export function getWebVitalThreshold(name: WebVitalName): { good: number; needsImprovement: number } {
  switch (name) {
    case 'CLS':
      return { good: 0.1, needsImprovement: 0.25 };
    case 'FCP':
      return { good: 1800, needsImprovement: 3000 };
    case 'FID':
      return { good: 100, needsImprovement: 300 };
    case 'INP':
      return { good: 200, needsImprovement: 500 };
    case 'LCP':
      return { good: 2500, needsImprovement: 4000 };
    case 'TTFB':
      return { good: 800, needsImprovement: 1800 };
  }
}

// Fungsi untuk mengevaluasi performa metric
export function evaluateWebVital(name: WebVitalName, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = getWebVitalThreshold(name);
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
}