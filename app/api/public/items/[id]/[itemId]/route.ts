import { NextRequest, NextResponse } from 'next/server'
import { apiStore } from '@/app/lib/api-store'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const items = await apiStore.getItems(params.id)
    const item = items.find(i => i.id === params.itemId)
    
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    const { id, name, description, createdAt, updatedAt } = item
    return NextResponse.json({
      id,
      name,
      description,
      createdAt,
      updatedAt
    })
  } catch (error) {
    console.error('Error in GET /api/public/items/[id]/[itemId]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const body = await request.json()
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
    })

    if (!updatedItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    const { id, name, description, createdAt, updatedAt } = updatedItem
    return NextResponse.json({
      id,
      name,
      description,
      createdAt,
      updatedAt
    })
  } catch (error) {
    console.error('Error in PUT /api/public/items/[id]/[itemId]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const success = await apiStore.deleteItem(params.itemId)
    if (!success) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/public/items/[id]/[itemId]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 