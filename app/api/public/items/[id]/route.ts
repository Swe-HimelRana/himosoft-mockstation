import { NextRequest, NextResponse } from 'next/server';
import { apiStore } from '@/app/lib/api-store';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
  if (!items) {
    return NextResponse.json({ error: 'Instance not found' }, { status: 404 });
  }

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