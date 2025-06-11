interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export const measurePerformance = () => {
  if (typeof window === 'undefined') return;

  // Report Web Vitals
  const reportWebVitals = (metric: any) => {
    console.log(metric);
    // You can send these metrics to your analytics service
  };

  // Track Largest Contentful Paint (LCP)
  const trackLCP = () => {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      reportWebVitals({
        name: 'LCP',
        value: lastEntry.startTime,
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  };

  // Track First Input Delay (FID)
  const trackFID = () => {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        const firstInput = entry as PerformanceEventTiming;
        reportWebVitals({
          name: 'FID',
          value: firstInput.processingStart - firstInput.startTime,
        });
      });
    }).observe({ entryTypes: ['first-input'] });
  };

  // Track Cumulative Layout Shift (CLS)
  const trackCLS = () => {
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const layoutShift = entry as LayoutShift;
        if (!layoutShift.hadRecentInput) {
          clsValue += layoutShift.value;
        }
      }
      reportWebVitals({
        name: 'CLS',
        value: clsValue,
      });
    }).observe({ entryTypes: ['layout-shift'] });
  };

  // Initialize all trackers
  trackLCP();
  trackFID();
  trackCLS();
}; 