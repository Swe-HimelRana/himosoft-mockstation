import { NextRequest, NextResponse } from 'next/server'
import { apiStore } from '@/app/lib/api-store'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const instance = await apiStore.getInstance(params.id)
    if (!instance) {
      return NextResponse.json(
        { error: 'Instance not found' },
        { status: 404 }
      )
    }

    const item = await apiStore.getItem(instance.id, params.itemId)
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
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
    const instance = await apiStore.getInstance(params.id)
    if (!instance) {
      return NextResponse.json(
        { error: 'Instance not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const item = await apiStore.updateItem(instance.id, params.itemId, {
      name: body.name,
      description: body.description,
      method: 'PUT',
      path: `/items/${params.itemId}`,
      response: body,
      status: 200,
      headers: {},
      delay: 0
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
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
    const instance = await apiStore.getInstance(params.id)
    if (!instance) {
      return NextResponse.json(
        { error: 'Instance not found' },
        { status: 404 }
      )
    }

    const success = await apiStore.deleteItem(instance.id, params.itemId)
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