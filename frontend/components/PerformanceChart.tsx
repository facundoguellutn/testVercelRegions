'use client';

import { PerformanceMetric } from '@/lib/performance';

interface PerformanceChartProps {
  metrics: PerformanceMetric[];
  title: string;
  maxPoints?: number;
}

export function PerformanceChart({ metrics, title, maxPoints = 10 }: PerformanceChartProps) {
  const recentMetrics = metrics.slice(-maxPoints);
  
  if (recentMetrics.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No data to display</p>
      </div>
    );
  }

  const maxValue = Math.max(...recentMetrics.map(m => m.value));
  const minValue = Math.min(...recentMetrics.map(m => m.value));
  const range = maxValue - minValue || 1;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      
      <div className="relative h-32 mb-4">
        <svg className="w-full h-full" viewBox="0 0 400 128">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          
          {recentMetrics.length > 1 && (
            <>
              <polyline
                fill="url(#gradient)"
                stroke="none"
                points={`0,128 ${recentMetrics.map((metric, index) => {
                  const x = (index / (recentMetrics.length - 1)) * 400;
                  const y = 128 - ((metric.value - minValue) / range) * 118;
                  return `${x},${y}`;
                }).join(' ')} 400,128`}
              />
              
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                points={recentMetrics.map((metric, index) => {
                  const x = (index / (recentMetrics.length - 1)) * 400;
                  const y = 128 - ((metric.value - minValue) / range) * 118;
                  return `${x},${y}`;
                }).join(' ')}
              />
            </>
          )}
          
          {recentMetrics.map((metric, index) => {
            const x = recentMetrics.length === 1 ? 200 : (index / (recentMetrics.length - 1)) * 400;
            const y = 128 - ((metric.value - minValue) / range) * 118;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#3b82f6"
                className="hover:r-6 transition-all duration-200"
              />
            );
          })}
        </svg>
        
        <div className="absolute top-0 left-0 text-xs text-gray-500 dark:text-gray-400">
          {maxValue.toFixed(1)}ms
        </div>
        <div className="absolute bottom-0 left-0 text-xs text-gray-500 dark:text-gray-400">
          {minValue.toFixed(1)}ms
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-gray-500 dark:text-gray-400">Min</div>
          <div className="font-mono text-green-600 dark:text-green-400">
            {minValue.toFixed(2)}ms
          </div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400">Avg</div>
          <div className="font-mono text-blue-600 dark:text-blue-400">
            {(recentMetrics.reduce((sum, m) => sum + m.value, 0) / recentMetrics.length).toFixed(2)}ms
          </div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400">Max</div>
          <div className="font-mono text-red-600 dark:text-red-400">
            {maxValue.toFixed(2)}ms
          </div>
        </div>
      </div>
    </div>
  );
}