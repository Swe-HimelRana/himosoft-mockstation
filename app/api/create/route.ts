import { NextResponse } from 'next/server';
import { apiStore } from '@/app/lib/api-store';

export async function POST() {
  const { id, apiKey } = apiStore.createInstance();
  return NextResponse.json({ id, apiKey });
} 