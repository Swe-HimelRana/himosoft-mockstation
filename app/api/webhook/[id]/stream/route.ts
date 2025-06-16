import { NextRequest } from 'next/server';
import { webhookStore } from '@/app/lib/webhook-store';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const encoder = new TextEncoder();
  let controller: ReadableStreamDefaultController | null = null;
  let keepAliveInterval: NodeJS.Timeout | null = null;

  const stream = new ReadableStream({
    start(c) {
      controller = c;
    },
    cancel() {
      controller = null;
      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
        keepAliveInterval = null;
      }
    }
  });

  // Get initial logs
  const logs = await webhookStore.getLogs(params.id);
  
  // Send initial logs if controller is still active
  if (controller) {
    logs.forEach(log => {
      try {
        controller?.enqueue(encoder.encode(`data: ${JSON.stringify(log)}\n\n`));
      } catch (error) {
        console.error('Error sending initial log:', error);
      }
    });
  }

  // Subscribe to new logs
  const unsubscribe = webhookStore.subscribe(params.id, (newLogs) => {
    if (controller) {
      newLogs.forEach(log => {
        try {
          controller?.enqueue(encoder.encode(`data: ${JSON.stringify(log)}\n\n`));
        } catch (error) {
          console.error('Error sending new log:', error);
        }
      });
    }
  });

  // Keep connection alive
  keepAliveInterval = setInterval(() => {
    if (controller) {
      try {
        controller.enqueue(encoder.encode(':\n\n'));
      } catch (error) {
        console.error('Error sending keepalive:', error);
        if (keepAliveInterval) {
          clearInterval(keepAliveInterval);
          keepAliveInterval = null;
        }
      }
    } else if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
    }
  }, 30000);

  // Cleanup on close
  request.signal.addEventListener('abort', () => {
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
    }
    unsubscribe();
    try {
      controller?.close();
    } catch (error) {
      console.error('Error closing stream:', error);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
} 