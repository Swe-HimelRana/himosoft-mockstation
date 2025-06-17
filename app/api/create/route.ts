import { NextResponse } from 'next/server';
import { apiStore } from '@/app/lib/api-store';

export async function POST() {
  const instance = await apiStore.createInstance('main', {
    name: 'New Instance',
    description: 'A new mock API instance'
  });
  return NextResponse.json(instance);
} 