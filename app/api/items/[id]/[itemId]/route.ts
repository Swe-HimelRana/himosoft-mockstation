import { NextRequest, NextResponse } from 'next/server';
import { apiStore } from '@/app/lib/api-store';

function validateApiKey(request: NextRequest, id: string): boolean {
  const apiKey = request.headers.get('x-api-key');
  if (!apiKey) return false;
  return apiStore.validateApiKey(id, apiKey);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  if (!validateApiKey(request, params.id)) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  const item = apiStore.getItem(params.id, params.itemId);
  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  if (!validateApiKey(request, params.id)) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const item = apiStore.updateItem(params.id, params.itemId, data);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  if (!validateApiKey(request, params.id)) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  const success = apiStore.deleteItem(params.id, params.itemId);
  if (!success) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
} 