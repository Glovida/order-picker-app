'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vitals:', metric)
    }
    
    // In production, you could send to analytics service
    // Example: analytics.track('web-vitals', metric)
    
    // Handle specific metrics
    switch (metric.name) {
      case 'FCP':
        // First Contentful Paint
        break
      case 'LCP':
        // Largest Contentful Paint
        break
      case 'CLS':
        // Cumulative Layout Shift
        break
      case 'FID':
        // First Input Delay
        break
      case 'TTFB':
        // Time to First Byte
        break
      case 'INP':
        // Interaction to Next Paint
        break
      case 'Next.js-hydration':
        // Next.js hydration time
        break
      case 'Next.js-route-change-to-render':
        // Route change rendering time
        break
      case 'Next.js-render':
        // Page render time
        break
      default:
        break
    }
  })

  return null
}