import { NextRequest, NextResponse } from 'next/server'
import { apiStore } from '@/app/lib/api-store'

export async function GET(request: NextRequest) {
  try {
    // Get all instances
    const instances = await apiStore.getAllInstances()
    
    // Collect all items from all instances
    const allItems = await Promise.all(
      Object.values(instances).map(async (instance) => {
        const items = await apiStore.getAllItems(instance.id)
        return items.map(item => ({
          ...item,
          instanceId: instance.id,
          instanceName: instance.name
        }))
      })
    )

    // Flatten the array of items
    const flattenedItems = allItems.flat()

    return NextResponse.json({
      total: flattenedItems.length,
      items: flattenedItems
    })
  } catch (error) {
    console.error('Error in GET /api/public/items:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 