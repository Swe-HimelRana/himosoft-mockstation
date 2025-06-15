import { NextRequest } from 'next/server';
import { webhookStore } from '@/app/lib/webhook-store';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Send initial logs
      const logs = webhookStore.getLogs(params.id);
      logs.forEach(log => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(log)}\n\n`));
      });

      // Subscribe to new logs
      const unsubscribe = webhookStore.subscribe(params.id, (logs) => {
        const latestLog = logs[0];
        if (latestLog) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(latestLog)}\n\n`));
        }
      });

      // Keep the connection open
      const interval = setInterval(() => {
        controller.enqueue(encoder.encode(':\n\n'));
      }, 30000);

      // Clean up on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        unsubscribe();
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