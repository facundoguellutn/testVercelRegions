'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  performanceTracker, 
  measurePageLoad, 
  measureTTFB, 
  measureFCP,
  measureNetworkRequest,
  PerformanceMetric,
  getRegionInfo
} from '@/lib/performance';
import { testServerAction, testServerActionWithData } from './actions';
import { MetricsCard } from '@/components/MetricsCard';
import { TestButton } from '@/components/TestButton';
import { RegionInfo } from '@/components/RegionInfo';
import { PerformanceChart } from '@/components/PerformanceChart';

export function PerformanceDashboard() {
  const [pageLoadMetrics, setPageLoadMetrics] = useState<PerformanceMetric[]>([]);
  const [serverActionMetrics, setServerActionMetrics] = useState<PerformanceMetric[]>([]);
  const [apiRouteMetrics, setApiRouteMetrics] = useState<PerformanceMetric[]>([]);
  const [databaseApiMetrics, setDatabaseApiMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Measure initial page load metrics
    const measureInitialMetrics = async () => {
      const pageLoad = measurePageLoad();
      const ttfb = measureTTFB();
      const fcp = measureFCP();
      
      const metrics: PerformanceMetric[] = [];
      if (pageLoad) metrics.push(pageLoad);
      if (ttfb) metrics.push(ttfb);
      if (fcp) metrics.push(fcp);
      
      setPageLoadMetrics(metrics);
      
      // Load saved metrics from localStorage
      performanceTracker.loadFromLocalStorage();
      const savedMetrics = performanceTracker.getMetrics();
      
      // Categorize saved metrics
      const serverActions = savedMetrics.filter(m => m.name.includes('Server Action'));
      const apiRoutes = savedMetrics.filter(m => m.name.includes('API Route') && !m.name.includes('Database'));
      const databaseApi = savedMetrics.filter(m => m.name.includes('Database API'));
      
      if (serverActions.length) setServerActionMetrics(serverActions);
      if (apiRoutes.length) setApiRouteMetrics(apiRoutes);
      if (databaseApi.length) setDatabaseApiMetrics(databaseApi);
    };

    measureInitialMetrics();
  }, []);

  const setLoadingState = (key: string, isLoading: boolean) => {
    setLoading(prev => ({ ...prev, [key]: isLoading }));
  };

  const testServerActionSimple = async () => {
    setLoadingState('serverAction', true);
    try {
      const { metric } = await performanceTracker.measureAsync(
        'Server Action - Simple',
        () => testServerAction(100),
        getRegionInfo().region
      );
      
      const newMetrics = [...serverActionMetrics, metric];
      setServerActionMetrics(newMetrics);
      performanceTracker.saveToLocalStorage();
    } catch (error) {
      console.error('Server action failed:', error);
    } finally {
      setLoadingState('serverAction', false);
    }
  };

  const testServerActionWithDataFetch = async () => {
    setLoadingState('serverActionData', true);
    try {
      const { metric } = await performanceTracker.measureAsync(
        'Server Action - With Data',
        () => testServerActionWithData(),
        getRegionInfo().region
      );
      
      const newMetrics = [...serverActionMetrics, metric];
      setServerActionMetrics(newMetrics);
      performanceTracker.saveToLocalStorage();
    } catch (error) {
      console.error('Server action with data failed:', error);
    } finally {
      setLoadingState('serverActionData', false);
    }
  };

  const testApiRoute = async () => {
    setLoadingState('apiRoute', true);
    try {
      const { metric } = await performanceTracker.measureAsync(
        'API Route - GET',
        () => measureNetworkRequest('/api/test?delay=100'),
        getRegionInfo().region
      );
      
      const newMetrics = [...apiRouteMetrics, metric];
      setApiRouteMetrics(newMetrics);
      performanceTracker.saveToLocalStorage();
    } catch (error) {
      console.error('API route test failed:', error);
    } finally {
      setLoadingState('apiRoute', false);
    }
  };

  const testApiRoutePost = async () => {
    setLoadingState('apiRoutePost', true);
    try {
      const { metric } = await performanceTracker.measureAsync(
        'API Route - POST',
        () => measureNetworkRequest('/api/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ delay: 150, data: { test: 'performance' } })
        }),
        getRegionInfo().region
      );
      
      const newMetrics = [...apiRouteMetrics, metric];
      setApiRouteMetrics(newMetrics);
      performanceTracker.saveToLocalStorage();
    } catch (error) {
      console.error('API route POST test failed:', error);
    } finally {
      setLoadingState('apiRoutePost', false);
    }
  };

  const testDatabaseApi = async () => {
    setLoadingState('databaseApi', true);
    try {
      const { metric } = await performanceTracker.measureAsync(
        'Database API - Queries',
        () => measureNetworkRequest('/api/database?complexity=2&queries=5'),
        getRegionInfo().region
      );
      
      const newMetrics = [...databaseApiMetrics, metric];
      setDatabaseApiMetrics(newMetrics);
      performanceTracker.saveToLocalStorage();
    } catch (error) {
      console.error('Database API test failed:', error);
    } finally {
      setLoadingState('databaseApi', false);
    }
  };

  const clearAllMetrics = () => {
    performanceTracker.clearMetrics();
    localStorage.removeItem('performance-metrics');
    setServerActionMetrics([]);
    setApiRouteMetrics([]);
    setDatabaseApiMetrics([]);
  };

  const exportMetrics = () => {
    const allMetrics = [
      ...pageLoadMetrics,
      ...serverActionMetrics,
      ...apiRouteMetrics,
      ...databaseApiMetrics
    ];
    
    const dataStr = JSON.stringify(allMetrics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `performance-metrics-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Vercel Region Performance Testing
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Measure loading times for pages, server actions, and API routes across different regions.
          </p>
          
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <RegionInfo />
            
            <div className="flex gap-2">
              <TestButton onClick={exportMetrics} variant="secondary">
                Export Metrics
              </TestButton>
              <TestButton onClick={clearAllMetrics} variant="secondary">
                Clear All
              </TestButton>
              <Link href="/server-component">
                <TestButton onClick={() => {}} variant="primary">
                  Test Server Component
                </TestButton>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Load Metrics */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Page Load Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pageLoadMetrics.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric.name}
                metrics={[metric]}
              />
            ))}
            {pageLoadMetrics.length === 0 && (
              <div className="col-span-3 text-center py-8 text-gray-500 dark:text-gray-400">
                Refresh the page to measure initial load performance
              </div>
            )}
          </div>
        </section>

        {/* Server Actions Testing */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Server Actions Performance</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Test Controls</h3>
              <div className="space-y-3">
                <TestButton
                  onClick={testServerActionSimple}
                  loading={loading.serverAction}
                  className="w-full"
                >
                  Test Simple Server Action (100ms delay)
                </TestButton>
                <TestButton
                  onClick={testServerActionWithDataFetch}
                  loading={loading.serverActionData}
                  variant="secondary"
                  className="w-full"
                >
                  Test Server Action with Data Fetch
                </TestButton>
              </div>
            </div>
            
            <MetricsCard
              title="Server Action Performance"
              metrics={serverActionMetrics}
            />
          </div>
          
          {serverActionMetrics.length > 0 && (
            <PerformanceChart
              metrics={serverActionMetrics}
              title="Server Action Response Times"
            />
          )}
        </section>

        {/* API Routes Testing */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">API Routes Performance</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Test Controls</h3>
              <div className="space-y-3">
                <TestButton
                  onClick={testApiRoute}
                  loading={loading.apiRoute}
                  className="w-full"
                >
                  Test GET API Route
                </TestButton>
                <TestButton
                  onClick={testApiRoutePost}
                  loading={loading.apiRoutePost}
                  variant="secondary"
                  className="w-full"
                >
                  Test POST API Route
                </TestButton>
              </div>
            </div>
            
            <MetricsCard
              title="API Route Performance"
              metrics={apiRouteMetrics}
            />
          </div>
          
          {apiRouteMetrics.length > 0 && (
            <PerformanceChart
              metrics={apiRouteMetrics}
              title="API Route Response Times"
            />
          )}
        </section>

        {/* Database API Testing */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Database Operations Performance</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Test Controls</h3>
              <div className="space-y-3">
                <TestButton
                  onClick={testDatabaseApi}
                  loading={loading.databaseApi}
                  className="w-full"
                >
                  Test Database API (Multiple Queries)
                </TestButton>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Simulates 5 SELECT queries and 1 INSERT operation
                </p>
              </div>
            </div>
            
            <MetricsCard
              title="Database API Performance"
              metrics={databaseApiMetrics}
            />
          </div>
          
          {databaseApiMetrics.length > 0 && (
            <PerformanceChart
              metrics={databaseApiMetrics}
              title="Database API Response Times"
            />
          )}
        </section>

        <footer className="text-center text-sm text-gray-500 dark:text-gray-400 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p>
            Performance metrics are automatically saved to localStorage. 
            Deploy to different Vercel regions and compare results.
          </p>
        </footer>
      </div>
    </div>
  );
}