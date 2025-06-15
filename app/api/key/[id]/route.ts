import { NextResponse } from 'next/server';
import { apiStore } from '@/app/lib/api-store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const apiKey = apiStore.getApiKey(params.id);
  if (!apiKey) {
    return NextResponse.json({ error: 'Instance not found' }, { status: 404 });
  }
  return NextResponse.json({ apiKey });
} 