'use server';

export interface ServerActionResult {
  success: boolean;
  message: string;
  serverTime: number;
  processingTime: number;
  region: string;
  timestamp: number;
}

export async function testServerAction(delay: number = 100): Promise<ServerActionResult> {
  const startTime = Date.now();
  
  // Simulate some processing time
  await new Promise(resolve => setTimeout(resolve, delay));
  
  const endTime = Date.now();
  const processingTime = endTime - startTime;
  
  return {
    success: true,
    message: `Server action completed successfully with ${delay}ms simulated delay`,
    serverTime: Date.now(),
    processingTime,
    region: process.env.VERCEL_REGION || 'development',
    timestamp: Date.now()
  };
}

export async function testServerActionWithData(): Promise<ServerActionResult> {
  const startTime = Date.now();
  
  // Simulate some database operation or external API call
  await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50));
  
  const endTime = Date.now();
  const processingTime = endTime - startTime;
  
  // Simulate getting some data
  const mockData = {
    users: Math.floor(Math.random() * 1000),
    posts: Math.floor(Math.random() * 5000),
    lastUpdate: new Date().toISOString()
  };
  
  return {
    success: true,
    message: `Server action with data fetching completed. Found ${mockData.users} users and ${mockData.posts} posts`,
    serverTime: Date.now(),
    processingTime,
    region: process.env.VERCEL_REGION || 'development',
    timestamp: Date.now()
  };
}

export async function testServerActionError(): Promise<ServerActionResult> {
  const startTime = Date.now();
  
  // Simulate some processing time before error
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const shouldError = Math.random() > 0.5;
  
  if (shouldError) {
    const endTime = Date.now();
    return {
      success: false,
      message: 'Simulated server error occurred',
      serverTime: Date.now(),
      processingTime: endTime - startTime,
      region: process.env.VERCEL_REGION || 'development',
      timestamp: Date.now()
    };
  }
  
  const endTime = Date.now();
  return {
    success: true,
    message: 'Server action completed successfully (no error this time)',
    serverTime: Date.now(),
    processingTime: endTime - startTime,
    region: process.env.VERCEL_REGION || 'development',
    timestamp: Date.now()
  };
}