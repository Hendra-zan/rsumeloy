import { type NextWebVitalsMetric } from 'next/app';
'use client';

import { createClient } from './supabase/client';
import type { NavigateEvent } from '../types/navigation';

// Tipe data untuk event analytics
interface AnalyticsEvent {
  name: string;
  value: number;
  id: string;
  label: string;
  startTime?: number;
  attribution?: {
    name: string;
    startTime: number;
    duration: number;
    entries: PerformanceEntry[];
  };
}

interface PageViewEvent {
  url: string;
  referrer?: string;
  title?: string;
  userId?: string;
}

interface CustomEvent {
  eventName: string;
  eventData?: Record<string, unknown>;
  userId?: string;
}

const supabaseClient = createClient();

/**
 * Track page view
 */
export async function trackPageView({ url, referrer, title, userId }: PageViewEvent) {
  if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'true') return;

  try {
    await supabaseClient
      .from('page_views')
      .insert({
        url,
        referrer: referrer || document.referrer,
        title: title || document.title,
        user_id: userId,
        user_agent: navigator.userAgent,
      });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

/**
 * Track custom event
 */
export async function trackEvent({ eventName, eventData = {}, userId }: CustomEvent) {
  if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'true') return;

  try {
    await supabaseClient
      .from('events')
      .insert({
        name: eventName,
        data: eventData,
        user_id: userId,
        url: window.location.href,
      });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

/**
 * Send web vitals data
 */
async function sendWebVitals({ name, value, id, label }: NextWebVitalsMetric) {
  if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'true') return;

  try {
    await supabaseClient
      .from('web_vitals')
      .insert({
        name,
        value,
        metric_id: id,
        label,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
      });
  } catch (error) {
    console.error('Error sending web vitals:', error);
  }
}

/**
 * Report web vitals
 */
export function reportWebVitals(metric: NextWebVitalsMetric) {
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Web Vital: ${metric.name}`, {
      value: metric.value,
      id: metric.id,
      label: metric.label,
    });
  }

  // Send to analytics
  sendWebVitals(metric);
}

/**
 * Analytics wrapper untuk automatic tracking
 */
export function setupAnalytics() {
  if (typeof window === 'undefined') return;

  // Track initial page view
  trackPageView({
    url: window.location.href,
  });

  // Track navigation changes for SPA
  if (typeof (window as any).navigation !== 'undefined') {
    window.navigation?.addEventListener('navigate', (event) => {
      trackPageView({
        url: event.destination.url,
      });
    });
  }
}