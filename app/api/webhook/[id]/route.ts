import { NextRequest } from 'next/server';
import { webhookStore } from '@/app/lib/webhook-store';

async function handleRequest(request: NextRequest, method: string, params: { id: string }) {
  try {
    const headers = Object.fromEntries(request.headers.entries());
    const query = Object.fromEntries(new URL(request.url).searchParams.entries());
    const body = await request.text();
    let parsedBody: any = {};
    
    try {
      parsedBody = body ? JSON.parse(body) : {};
    } catch (e) {
      parsedBody = { raw: body };
    }

    const log = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      method,
      headers,
      body: parsedBody,
      query,
    };

    await webhookStore.addLog(params.id, log);
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(`Error handling webhook ${method} request:`, error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return handleRequest(request, 'GET', params);
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return handleRequest(request, 'POST', params);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return handleRequest(request, 'PUT', params);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  return handleRequest(request, 'PATCH', params);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return handleRequest(request, 'DELETE', params);
} 