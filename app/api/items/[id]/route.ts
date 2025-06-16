import { NextRequest, NextResponse } from 'next/server';
import { apiStore } from '@/app/lib/api-store';

function validateApiKey(request: NextRequest, id: string): boolean {
  const apiKey = request.headers.get('x-api-key');
  console.log('Validating API key in route:', { 
    id, 
    apiKey,
    headers: Object.fromEntries(request.headers.entries())
  });
  if (!apiKey) {
    console.log('No API key provided in headers');
    return false;
  }
  const isValid = apiStore.validateApiKey(id, apiKey);
  console.log('API key validation result:', { id, apiKey, isValid });
  return isValid;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }

    const instance = await apiStore.getInstanceByApiKey(apiKey);
    if (!instance) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    const items = await apiStore.getAllItems(instance.id);
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error in GET /api/items/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }

    const instance = await apiStore.getInstanceByApiKey(apiKey);
    if (!instance) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const item = await apiStore.createItem(instance.id, {
      name: body.name,
      description: body.description,
      method: 'POST',
      path: '/items',
      response: body,
      status: 200,
      headers: {},
      delay: 0
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Failed to create item' },
        { status: 500 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error in POST /api/items/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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
    const itemId = data.id;
    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }
    const updatedItem = apiStore.updateItem(params.id, itemId, data);
    
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

  const searchParams = request.nextUrl.searchParams;
  const itemId = searchParams.get('itemId');
  
  if (!itemId) {
    return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
  }

  const success = apiStore.deleteItem(params.id, itemId);
  if (!success) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
} 