interface PerformanceEntryWithProcessingStart extends PerformanceEntry {
  processingStart?: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput?: boolean;
  value?: number;
}

export const measurePerformance = (metricName: string, value: number) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    window.performance.mark(`${metricName}-start`);
    window.performance.mark(`${metricName}-end`);
    window.performance.measure(metricName, `${metricName}-start`, `${metricName}-end`);
    
    const entries = window.performance.getEntriesByName(metricName);
    const lastEntry = entries[entries.length - 1];
    
    console.log(`${metricName}: ${lastEntry.duration}ms`);
    
    // Report to analytics if needed
    if (process.env.NEXT_PUBLIC_ANALYTICS_ID) {
      // Add your analytics reporting logic here
    }
  }
};

export const measureLCP = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      console.log('LCP:', lastEntry.startTime);
      measurePerformance('LCP', lastEntry.startTime);
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }
};

export const measureFID = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntryWithProcessingStart;
      
      if (lastEntry.processingStart) {
        console.log('FID:', lastEntry.processingStart - lastEntry.startTime);
        measurePerformance('FID', lastEntry.processingStart - lastEntry.startTime);
      }
    });
    
    observer.observe({ entryTypes: ['first-input'] });
  }
};

export const measureCLS = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    let clsValue = 0;
    let clsEntries: LayoutShiftEntry[] = [];
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as LayoutShiftEntry;
        if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
          clsValue += layoutShiftEntry.value;
          clsEntries.push(layoutShiftEntry);
        }
      }
      
      console.log('CLS:', clsValue);
      measurePerformance('CLS', clsValue);
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
  }
};

export const initPerformanceMonitoring = () => {
  if (typeof window !== 'undefined') {
    measureLCP();
    measureFID();
    measureCLS();
  }
}; 