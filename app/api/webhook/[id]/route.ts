import { NextRequest } from 'next/server';
import { webhookStore } from '@/app/lib/webhook-store';

async function handleRequest(request: NextRequest, method: string, params: { id: string }) {
  try {
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const parsedBody = await request.json().catch(() => ({}));
    const url = new URL(request.url);
    const query: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      query[key] = value;
    });

    const log = {
      method,
      headers,
      body: parsedBody,
      query,
      path: url.pathname,
      response: {
        status: 200,
        body: { success: true }
      }
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