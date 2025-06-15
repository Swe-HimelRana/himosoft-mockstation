import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { webhookStore } from '@/app/lib/webhook-store';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url);
  const query = Object.fromEntries(searchParams.entries());
  
  const log = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    method: 'GET',
    headers: Object.fromEntries(request.headers),
    body: null,
    query,
  };

  webhookStore.addLog(params.id, log);
  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url);
  const query = Object.fromEntries(searchParams.entries());
  
  let body;
  const contentType = request.headers.get('content-type') || '';
  
  if (contentType.includes('application/json')) {
    body = await request.json();
  } else if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    body = Object.fromEntries(formData.entries());
  } else {
    body = await request.text();
  }

  const log = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    method: 'POST',
    headers: Object.fromEntries(request.headers),
    body,
    query,
  };

  webhookStore.addLog(params.id, log);
  return NextResponse.json({ success: true });
} 