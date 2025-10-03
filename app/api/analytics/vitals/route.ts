import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { WebVitalInsert, isValidWebVitalName, evaluateWebVital } from '@/types/analytics';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const data = await request.json();

    // Validasi nama web vital
    if (!isValidWebVitalName(data.name)) {
      return NextResponse.json(
        { error: 'Invalid web vital name' },
        { status: 400 }
      );
    }

    // Siapkan data untuk insert
    const webVital: WebVitalInsert = {
      name: data.name,
      value: data.value,
      metric_id: data.id,
      label: data.label,
      page_url: request.headers.get('referer') || request.headers.get('origin') || '',
      user_agent: request.headers.get('user-agent') || '',
    };

    // Simpan data web vitals ke Supabase
    const { error } = await supabase
      .from('web_vitals')
      .insert(webVital);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json({ 
      success: true,
      rating: evaluateWebVital(webVital.name, webVital.value)
    });
  } catch (error) {
    console.error('Error saving web vitals:', error);
    return NextResponse.json(
      { error: 'Failed to save web vitals' },
      { status: 500 }
    );
  }
}