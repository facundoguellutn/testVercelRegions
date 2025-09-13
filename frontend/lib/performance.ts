export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'seconds';
  timestamp: number;
  region?: string;
}

export interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export class PerformanceTracker {
  private static instance: PerformanceTracker;
  private metrics: PerformanceMetric[] = [];
  private startTimes: Map<string, number> = new Map();

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  startTimer(name: string): void {
    this.startTimes.set(name, performance.now());
  }

  endTimer(name: string, region?: string): PerformanceMetric {
    const startTime = this.startTimes.get(name);
    if (!startTime) {
      throw new Error(`Timer ${name} was not started`);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    const metric: PerformanceMetric = {
      name,
      value: Math.round(duration * 100) / 100,
      unit: 'ms',
      timestamp: Date.now(),
      region
    };

    this.metrics.push(metric);
    this.startTimes.delete(name);
    
    return metric;
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>, region?: string): Promise<{ result: T; metric: PerformanceMetric }> {
    this.startTimer(name);
    try {
      const result = await fn();
      const metric = this.endTimer(name, region);
      return { result, metric };
    } catch (error) {
      this.startTimes.delete(name);
      throw error;
    }
  }

  measureSync<T>(name: string, fn: () => T, region?: string): { result: T; metric: PerformanceMetric } {
    this.startTimer(name);
    try {
      const result = fn();
      const metric = this.endTimer(name, region);
      return { result, metric };
    } catch (error) {
      this.startTimes.delete(name);
      throw error;
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.name === name);
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }

  saveToLocalStorage(key: string = 'performance-metrics'): void {
    localStorage.setItem(key, this.exportMetrics());
  }

  loadFromLocalStorage(key: string = 'performance-metrics'): PerformanceMetric[] {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const metrics = JSON.parse(data) as PerformanceMetric[];
        this.metrics = [...this.metrics, ...metrics];
        return metrics;
      } catch (error) {
        console.warn('Failed to load performance metrics from localStorage:', error);
      }
    }
    return [];
  }
}

export function measurePageLoad(): PerformanceMetric | null {
  if (typeof window === 'undefined') return null;
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (!navigation) return null;

  const loadTime = navigation.loadEventEnd - navigation.fetchStart;
  
  return {
    name: 'Page Load',
    value: Math.round(loadTime * 100) / 100,
    unit: 'ms',
    timestamp: Date.now()
  };
}

export function measureTTFB(): PerformanceMetric | null {
  if (typeof window === 'undefined') return null;
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (!navigation) return null;

  const ttfb = navigation.responseStart - navigation.fetchStart;
  
  return {
    name: 'Time to First Byte (TTFB)',
    value: Math.round(ttfb * 100) / 100,
    unit: 'ms',
    timestamp: Date.now()
  };
}

export function measureFCP(): PerformanceMetric | null {
  if (typeof window === 'undefined') return null;
  
  const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
  if (!fcpEntry) return null;

  return {
    name: 'First Contentful Paint (FCP)',
    value: Math.round(fcpEntry.startTime * 100) / 100,
    unit: 'ms',
    timestamp: Date.now()
  };
}

export async function measureNetworkRequest(url: string, options?: RequestInit): Promise<{ response: Response; metric: PerformanceMetric }> {
  const startTime = performance.now();
  
  try {
    const response = await fetch(url, options);
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    const metric: PerformanceMetric = {
      name: `Network Request: ${url}`,
      value: Math.round(duration * 100) / 100,
      unit: 'ms',
      timestamp: Date.now()
    };

    return { response, metric };
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    const metric: PerformanceMetric = {
      name: `Failed Network Request: ${url}`,
      value: Math.round(duration * 100) / 100,
      unit: 'ms',
      timestamp: Date.now()
    };

    throw { error, metric };
  }
}

export function getRegionInfo(): { region: string; deployment: string } {
  if (typeof window === 'undefined') {
    return { region: 'unknown', deployment: 'unknown' };
  }

  return {
    region: process.env.NEXT_PUBLIC_VERCEL_REGION || 'development',
    deployment: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'local'
  };
}

export const performanceTracker = PerformanceTracker.getInstance();