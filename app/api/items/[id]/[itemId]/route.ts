import { NextRequest, NextResponse } from 'next/server';
import { apiStore } from '@/app/lib/api-store';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }

    const isValid = await apiStore.validateApiKey(params.id, apiKey);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    const items = await apiStore.getItems(params.id);
    const item = items.find(i => i.id === params.itemId);
    
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    const { id, name, description, createdAt, updatedAt } = item;
    return NextResponse.json({
      id,
      name,
      description,
      createdAt,
      updatedAt
    });
  } catch (error) {
    console.error('Error in GET /api/items/[id]/[itemId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }

    const isValid = await apiStore.validateApiKey(params.id, apiKey);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Updating item with body:', body);
    
    const updatedItem = await apiStore.updateItem(params.itemId, {
      name: body.name,
      description: body.description,
      endpoints: [{
        method: 'PUT',
        path: `/items/${params.id}/{itemId}`,
        response: {
          status: 200,
          body: null
        }
      }]
    });

    if (!updatedItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    const { id, name, description, createdAt, updatedAt } = updatedItem;
    return NextResponse.json({
      id,
      name,
      description,
      createdAt,
      updatedAt
    });
  } catch (error) {
    console.error('Error in PUT /api/items/[id]/[itemId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
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

    const success = await apiStore.deleteItem(params.itemId);
    if (!success) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/items/[id]/[itemId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
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
    const item = await apiStore.createItem({
      name: body.name,
      description: body.description,
      endpoints: [{
        method: 'POST',
        path: `/items/${params.id}`,
        response: {
          status: 201,
          body: body
        }
      }]
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error in POST /api/items/[id]/[itemId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 