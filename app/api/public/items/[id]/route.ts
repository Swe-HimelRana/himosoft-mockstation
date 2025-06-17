import { NextRequest, NextResponse } from 'next/server';
import { apiStore } from '@/app/lib/api-store';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const items = await apiStore.getItems(params.id);
    const simplifiedItems = items.map(({ id, name, description, createdAt, updatedAt }) => ({
      id,
      name,
      description,
      createdAt,
      updatedAt
    }));

    return NextResponse.json({
      total: items.length,
      items: simplifiedItems
    });
  } catch (error) {
    console.error('Error getting items:', error);
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
    const body = await request.json();
    const item = await apiStore.createItem({
      name: body.name,
      description: body.description,
      endpoints: [{
        method: 'POST',
        path: `/items/${params.id}/{itemId}`,
        response: {
          status: 201,
          body: null
        }
      }]
    });

    const { id, name, description, createdAt, updatedAt } = item;
    return NextResponse.json({
      id,
      name,
      description,
      createdAt,
      updatedAt
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 