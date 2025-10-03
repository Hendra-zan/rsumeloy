'use client';

import { useEffect } from 'react';
import { setupAnalytics } from "@/lib/analytics";
import { setupGlobalErrorHandler } from "@/lib/monitoring";

const AnalyticsInitializer = () => {
  useEffect(() => {
    setupGlobalErrorHandler();
    setupAnalytics();
  }, []);

  return null;
};

export default AnalyticsInitializer;