'use client';

import { useEffect, useState } from 'react';
import { getRegionInfo } from '@/lib/performance';

export function RegionInfo() {
  const [regionInfo, setRegionInfo] = useState<{ region: string; deployment: string } | null>(null);

  useEffect(() => {
    setRegionInfo(getRegionInfo());
  }, []);

  if (!regionInfo) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-blue-700 dark:text-blue-300">Loading region info...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Deployment Info</h3>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-blue-700 dark:text-blue-300">Region:</span>
          <span className="text-xs font-mono text-blue-900 dark:text-blue-100 bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">
            {regionInfo.region}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-blue-700 dark:text-blue-300">Deployment:</span>
          <span className="text-xs font-mono text-blue-900 dark:text-blue-100 bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded truncate max-w-[120px]">
            {regionInfo.deployment === 'local' ? 'local' : regionInfo.deployment.slice(0, 8)}
          </span>
        </div>
      </div>
    </div>
  );
}