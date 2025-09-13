import { PerformanceMetric } from '@/lib/performance';

interface MetricsCardProps {
  title: string;
  metrics: PerformanceMetric[];
  className?: string;
}

export function MetricsCard({ title, metrics, className = '' }: MetricsCardProps) {
  const latestMetric = metrics[metrics.length - 1];
  const averageValue = metrics.length > 0 
    ? metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length 
    : 0;

  const formatValue = (value: number) => {
    return value < 1000 ? `${value.toFixed(2)}ms` : `${(value / 1000).toFixed(2)}s`;
  };

  const getPerformanceColor = (value: number) => {
    if (value < 100) return 'text-green-600';
    if (value < 300) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      
      {metrics.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No measurements yet</p>
      ) : (
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">Latest:</span>
              <span className={`font-mono text-lg font-semibold ${getPerformanceColor(latestMetric.value)}`}>
                {formatValue(latestMetric.value)}
              </span>
            </div>
            {latestMetric.region && (
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">Region:</span>
                <span className="text-xs font-mono text-blue-600 dark:text-blue-400">
                  {latestMetric.region}
                </span>
              </div>
            )}
          </div>
          
          {metrics.length > 1 && (
            <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Average:</span>
                <span className={`font-mono text-sm ${getPerformanceColor(averageValue)}`}>
                  {formatValue(averageValue)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">Samples:</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{metrics.length}</span>
              </div>
            </div>
          )}
          
          <div className="text-xs text-gray-400 dark:text-gray-500">
            Last updated: {new Date(latestMetric.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
}