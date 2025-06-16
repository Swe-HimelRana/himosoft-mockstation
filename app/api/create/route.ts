import { NextResponse } from 'next/server';
import { apiStore } from '@/app/lib/api-store';

export async function POST() {
  const instance = apiStore.createInstance('New Instance', 'A new mock API instance');
  return NextResponse.json(instance);
} 