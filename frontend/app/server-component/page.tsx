import Link from 'next/link';

// Simulate server-side data fetching
async function fetchServerData(delay: number = 200): Promise<{
  timestamp: number;
  region: string;
  data: {
    users: number;
    posts: number;
    comments: number;
    categories: number;
  };
  serverProcessingTime: number;
}> {
  const startTime = Date.now();
  
  // Simulate different types of data fetching delays
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Simulate fetching data from different sources
  const userData = await new Promise<number>(resolve => {
    setTimeout(() => resolve(Math.floor(Math.random() * 1000) + 100), 50);
  });
  
  const postsData = await new Promise<number>(resolve => {
    setTimeout(() => resolve(Math.floor(Math.random() * 5000) + 500), 75);
  });
  
  const commentsData = await new Promise<number>(resolve => {
    setTimeout(() => resolve(Math.floor(Math.random() * 10000) + 1000), 25);
  });
  
  const categoriesData = await new Promise<number>(resolve => {
    setTimeout(() => resolve(Math.floor(Math.random() * 50) + 10), 30);
  });
  
  const endTime = Date.now();
  
  return {
    timestamp: Date.now(),
    region: process.env.VERCEL_REGION || 'development',
    data: {
      users: userData,
      posts: postsData,
      comments: commentsData,
      categories: categoriesData,
    },
    serverProcessingTime: endTime - startTime,
  };
}

// Server Component for performance testing
export default async function ServerComponentPage() {
  // This runs on the server and the time it takes affects TTFB
  const startTime = Date.now();
  
  // Simulate fetching data from multiple sources
  const [primaryData, secondaryData] = await Promise.all([
    fetchServerData(150),
    fetchServerData(100),
  ]);
  
  const totalServerTime = Date.now() - startTime;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              ← Back to Dashboard
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Server Component Performance Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This page is rendered entirely on the server. The data below was fetched during server-side rendering.
          </p>
        </header>

        {/* Server Rendering Info */}
        <section className="mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
              Server Rendering Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-green-700 dark:text-green-300">Total Server Time</div>
                <div className="text-2xl font-mono font-bold text-green-900 dark:text-green-100">
                  {totalServerTime}ms
                </div>
              </div>
              <div>
                <div className="text-sm text-green-700 dark:text-green-300">Render Region</div>
                <div className="text-lg font-mono font-semibold text-green-900 dark:text-green-100">
                  {primaryData.region}
                </div>
              </div>
              <div>
                <div className="text-sm text-green-700 dark:text-green-300">Rendered At</div>
                <div className="text-sm font-mono text-green-900 dark:text-green-100">
                  {new Date(primaryData.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Data Source */}
        <section className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Primary Data Source
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Processed in {primaryData.serverProcessingTime}ms
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {primaryData.data.users.toLocaleString()}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Users</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {primaryData.data.posts.toLocaleString()}
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300">Posts</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {primaryData.data.comments.toLocaleString()}
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300">Comments</div>
              </div>
              <div className="text-center p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                  {primaryData.data.categories}
                </div>
                <div className="text-sm text-teal-700 dark:text-teal-300">Categories</div>
              </div>
            </div>
          </div>
        </section>

        {/* Secondary Data Source */}
        <section className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Secondary Data Source
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Processed in {secondaryData.serverProcessingTime}ms
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {secondaryData.data.users.toLocaleString()}
                </div>
                <div className="text-sm text-red-700 dark:text-red-300">Active Users</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {secondaryData.data.posts.toLocaleString()}
                </div>
                <div className="text-sm text-indigo-700 dark:text-indigo-300">Published</div>
              </div>
              <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                  {secondaryData.data.comments.toLocaleString()}
                </div>
                <div className="text-sm text-pink-700 dark:text-pink-300">Interactions</div>
              </div>
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {secondaryData.data.categories}
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-300">Topics</div>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Tips */}
        <section className="mb-8">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
              📊 Performance Analysis
            </h2>
            <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
              <p>
                <strong>Server Rendering Time:</strong> {totalServerTime}ms - This affects your Time to First Byte (TTFB)
              </p>
              <p>
                <strong>Data Fetching:</strong> Primary source took {primaryData.serverProcessingTime}ms, 
                Secondary source took {secondaryData.serverProcessingTime}ms
              </p>
              <p>
                <strong>Region:</strong> Currently rendering in {primaryData.region} region
              </p>
              <p>
                <strong>Optimization:</strong> Both data sources were fetched in parallel using Promise.all()
              </p>
            </div>
          </div>
        </section>

        {/* Instructions */}
        <section>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              🧪 How to Test
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>Note the current server rendering time and region above</li>
              <li>Deploy your application to Vercel</li>
              <li>Change your Vercel deployment region in project settings</li>
              <li>Redeploy and visit this page again</li>
              <li>Compare the server rendering times between regions</li>
              <li>Use browser DevTools to measure TTFB and see the difference</li>
            </ol>
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            ← Back to Performance Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}