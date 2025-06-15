'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { WebhookLog } from '@/app/lib/webhook-store';

export default function WebhookPage() {
  const params = useParams();
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    setWebhookUrl(`${window.location.origin}/api/webhook/${params.id}`);
    const eventSource = new EventSource(`/api/webhook/${params.id}/stream`);

    eventSource.onmessage = (event) => {
      const log = JSON.parse(event.data);
      setLogs(prevLogs => [log, ...prevLogs]);
    };

    return () => {
      eventSource.close();
    };
  }, [params.id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Webhook Endpoint</h1>
            
            <div className="space-y-8">
              {/* Webhook URL Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Webhook URL</h2>
                <div className="flex items-center space-x-4">
                  <code className="bg-gray-100 px-4 py-2 rounded flex-1">{webhookUrl}</code>
                  <button
                    onClick={() => copyToClipboard(webhookUrl)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Copy
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Send POST or GET requests to this URL to test your webhook.
                </p>
              </div>

              {/* Request Logs Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Logs</h2>
                <div className="space-y-4">
                  {logs.length === 0 ? (
                    <p className="text-gray-500">No requests received yet.</p>
                  ) : (
                    logs.map((log, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            {log.method} Request
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <h3 className="text-sm font-medium text-gray-700">Headers</h3>
                            <pre className="mt-1 text-sm text-gray-600 bg-gray-100 p-2 rounded overflow-x-auto">
                              {JSON.stringify(log.headers, null, 2)}
                            </pre>
                          </div>
                          {log.body && (
                            <div>
                              <h3 className="text-sm font-medium text-gray-700">Body</h3>
                              <pre className="mt-1 text-sm text-gray-600 bg-gray-100 p-2 rounded overflow-x-auto">
                                {JSON.stringify(log.body, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 