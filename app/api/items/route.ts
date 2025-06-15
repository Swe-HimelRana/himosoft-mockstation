import { NextRequest, NextResponse } from 'next/server';
import { apiStore } from '@/app/lib/api-store';

function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  if (!apiKey) return false;
  return apiStore.validateApiKey(apiKey);
}

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  const items = apiStore.getAllItems();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const item = apiStore.createItem(data);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
} 