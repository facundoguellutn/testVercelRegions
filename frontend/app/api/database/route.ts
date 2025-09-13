import { NextRequest, NextResponse } from 'next/server';

export interface DatabaseApiResponse {
  success: boolean;
  message: string;
  serverTime: number;
  processingTime: number;
  dbQueryTime: number;
  region: string;
  operations: {
    queries: number;
    inserts: number;
    updates: number;
  };
  timestamp: number;
}

async function simulateDbQuery(queryType: 'SELECT' | 'INSERT' | 'UPDATE', complexity: number = 1): Promise<number> {
  // Simulate different query complexities
  const baseTime = queryType === 'SELECT' ? 20 : queryType === 'INSERT' ? 30 : 40;
  const variableTime = Math.random() * 50 * complexity;
  const totalTime = baseTime + variableTime;
  
  await new Promise(resolve => setTimeout(resolve, totalTime));
  return totalTime;
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  const complexity = parseInt(request.nextUrl.searchParams.get('complexity') || '1', 10);
  const queries = parseInt(request.nextUrl.searchParams.get('queries') || '3', 10);
  
  // Simulate multiple database queries
  const queryTimes: number[] = [];
  const operations = { queries: 0, inserts: 0, updates: 0 };
  
  for (let i = 0; i < Math.min(queries, 10); i++) {
    const queryTime = await simulateDbQuery('SELECT', complexity);
    queryTimes.push(queryTime);
    operations.queries++;
  }
  
  // Simulate one insert operation
  const insertTime = await simulateDbQuery('INSERT', complexity);
  queryTimes.push(insertTime);
  operations.inserts++;
  
  const endTime = Date.now();
  const totalDbTime = queryTimes.reduce((sum, time) => sum + time, 0);
  const processingTime = endTime - startTime;
  
  const response: DatabaseApiResponse = {
    success: true,
    message: `Database operations completed: ${operations.queries} queries, ${operations.inserts} inserts`,
    serverTime: Date.now(),
    processingTime,
    dbQueryTime: Math.round(totalDbTime),
    region: process.env.VERCEL_REGION || 'development',
    operations,
    timestamp: Date.now()
  };

  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  
  const records = Math.min(body.records || 5, 20);
  const complexity = Math.min(body.complexity || 1, 3);
  
  // Simulate batch operations
  const queryTimes: number[] = [];
  const operations = { queries: 0, inserts: 0, updates: 0 };
  
  // Simulate checking existing records
  const checkTime = await simulateDbQuery('SELECT', complexity);
  queryTimes.push(checkTime);
  operations.queries++;
  
  // Simulate inserting multiple records
  for (let i = 0; i < records; i++) {
    const insertTime = await simulateDbQuery('INSERT', complexity);
    queryTimes.push(insertTime);
    operations.inserts++;
  }
  
  // Simulate updating some records
  const updateCount = Math.floor(records * 0.3);
  for (let i = 0; i < updateCount; i++) {
    const updateTime = await simulateDbQuery('UPDATE', complexity);
    queryTimes.push(updateTime);
    operations.updates++;
  }
  
  const endTime = Date.now();
  const totalDbTime = queryTimes.reduce((sum, time) => sum + time, 0);
  const processingTime = endTime - startTime;
  
  const response: DatabaseApiResponse = {
    success: true,
    message: `Batch operation completed: ${operations.queries} queries, ${operations.inserts} inserts, ${operations.updates} updates`,
    serverTime: Date.now(),
    processingTime,
    dbQueryTime: Math.round(totalDbTime),
    region: process.env.VERCEL_REGION || 'development',
    operations,
    timestamp: Date.now()
  };

  return NextResponse.json(response);
}