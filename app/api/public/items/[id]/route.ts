import { NextRequest, NextResponse } from 'next/server';
import { apiStore } from '@/app/lib/api-store';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const instance = await apiStore.getInstance(params.id);
    if (!instance) {
      return NextResponse.json(
        { error: 'Instance not found' },
        { status: 404 }
      );
    }

    const items = await apiStore.getAllItems(instance.id);
    return NextResponse.json({
      instance: {
        id: instance.id,
        name: instance.name,
        description: instance.description
      },
      total: items.length,
      items: items
    });
  } catch (error) {
    console.error('Error in GET /api/public/items/[id]:', error);
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
    const instance = await apiStore.getInstance(params.id);
    if (!instance) {
      return NextResponse.json(
        { error: 'Instance not found' },
        { status: 404 }
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
    console.error('Error in POST /api/public/items/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 