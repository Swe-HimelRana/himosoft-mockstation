import { NextRequest, NextResponse } from 'next/server'
import { apiStore } from '@/app/lib/api-store'
import { apiDb } from '@/app/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get all instances
    const data = await apiDb.read();
    const instances = data.instances || {};
    
    // Collect all items from all instances
    const allItems = await Promise.all(
      Object.values(instances).map(async (instance) => {
        const items = await apiStore.getItems();
        return items.map(item => ({
          ...item,
          instanceId: instance.id,
          instanceName: instance.name
        }));
      })
    );

    return NextResponse.json({
      total: allItems.flat().length,
      items: allItems.flat()
    });
  } catch (error) {
    console.error('Error getting all items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 