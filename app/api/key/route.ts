import { NextResponse } from 'next/server';
import { apiStore } from '@/app/lib/api-store';

export async function GET() {
  const apiKey = apiStore.getApiKey();
  return NextResponse.json({ apiKey });
} 