import { NextRequest } from 'next/server';
import { webhookStore } from '@/app/lib/webhook-store';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Get initial logs
      const logs = await webhookStore.getLogs(params.id);
      
      // Send initial logs
      logs.forEach(log => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(log)}\n\n`));
      });

      // Subscribe to new logs
      webhookStore.subscribe(params.id, (newLogs) => {
        newLogs.forEach(log => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(log)}\n\n`));
        });
      });

      // Keep connection alive
      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(':\n\n'));
      }, 30000);

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(keepAlive);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
} 