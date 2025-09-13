import { NextRequest, NextResponse } from 'next/server';

export interface ApiTestResponse {
  success: boolean;
  message: string;
  serverTime: number;
  processingTime: number;
  region: string;
  method: string;
  headers: Record<string, string>;
  timestamp: number;
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  // Extract delay parameter from URL
  const delay = parseInt(request.nextUrl.searchParams.get('delay') || '100', 10);
  
  // Simulate some processing time
  await new Promise(resolve => setTimeout(resolve, Math.max(0, Math.min(delay, 2000))));
  
  const endTime = Date.now();
  const processingTime = endTime - startTime;
  
  const response: ApiTestResponse = {
    success: true,
    message: `GET API route completed with ${delay}ms delay`,
    serverTime: Date.now(),
    processingTime,
    region: process.env.VERCEL_REGION || 'development',
    method: 'GET',
    headers: {
      'user-agent': request.headers.get('user-agent') || 'unknown',
      'x-forwarded-for': request.headers.get('x-forwarded-for') || 'unknown',
      'x-vercel-ip-country': request.headers.get('x-vercel-ip-country') || 'unknown'
    },
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
  
  const delay = Math.max(0, Math.min(body.delay || 100, 2000));
  
  // Simulate some processing time
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Simulate some data processing
  const mockProcessing = {
    itemsProcessed: Math.floor(Math.random() * 100) + 1,
    dataSize: body.data ? JSON.stringify(body.data).length : 0
  };
  
  const endTime = Date.now();
  const processingTime = endTime - startTime;
  
  const response: ApiTestResponse = {
    success: true,
    message: `POST API route processed ${mockProcessing.itemsProcessed} items with ${mockProcessing.dataSize} bytes of data`,
    serverTime: Date.now(),
    processingTime,
    region: process.env.VERCEL_REGION || 'development',
    method: 'POST',
    headers: {
      'user-agent': request.headers.get('user-agent') || 'unknown',
      'x-forwarded-for': request.headers.get('x-forwarded-for') || 'unknown',
      'x-vercel-ip-country': request.headers.get('x-vercel-ip-country') || 'unknown'
    },
    timestamp: Date.now()
  };

  return NextResponse.json(response);
}