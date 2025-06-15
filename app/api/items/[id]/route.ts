import { NextRequest, NextResponse } from 'next/server';
import { apiStore } from '@/app/lib/api-store';

function validateApiKey(request: NextRequest, id: string): boolean {
  const apiKey = request.headers.get('x-api-key');
  console.log('Validating API key in route:', { id, apiKey });
  if (!apiKey) return false;
  return apiStore.validateApiKey(id, apiKey);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!validateApiKey(request, params.id)) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5');

  // Validate page and limit
  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: 'Invalid page number' }, { status: 400 });
  }
  if (isNaN(limit) || limit < 1) {
    return NextResponse.json({ error: 'Invalid limit' }, { status: 400 });
  }

  const items = apiStore.getAllItems(params.id);

  // Calculate pagination
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = items.slice(startIndex, endIndex);

  return NextResponse.json({
    items: paginatedItems,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!validateApiKey(request, params.id)) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  try {
    const data = await request.json();
    console.log('Creating item:', { id: params.id, data });
    const item = apiStore.createItem(params.id, data);
    if (!item) {
      return NextResponse.json({ error: 'Instance not found' }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!validateApiKey(request, params.id)) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const updatedItem = apiStore.updateItem(params.id, data);
    
    if (!updatedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!validateApiKey(request, params.id)) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  const success = apiStore.deleteItem(params.id);
  if (!success) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
} 