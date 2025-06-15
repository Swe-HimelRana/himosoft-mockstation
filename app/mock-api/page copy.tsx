'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ApiInstance {
  id: string;
  apiKey: string;
}

export default function MockApiPage() {
  const router = useRouter();
  const [apiInstance, setApiInstance] = useState<ApiInstance | null>(null);
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBaseUrl(window.location.origin);
    
    // Create a new API instance
    fetch('/api/create', { method: 'POST' })
      .then(res => res.json())
      .then((data: ApiInstance) => {
        setApiInstance(data);
        // Update URL with the instance ID
        router.push(`/mock-api/${data.id}`);
      })
      .catch(error => {
        console.error('Failed to create API instance:', error);
        setLoading(false);
      });
  }, [router]);

  const copyToClipboard = () => {
    if (!apiInstance) return;
    navigator.clipboard.writeText(apiInstance.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Creating Mock API Instance...</h1>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!apiInstance) {
    return (
      <main className="min-h-screen p-4 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Creating your API instance...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-6">Mock API Documentation</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">API Key</h2>
            <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
              <code className="font-mono">{apiInstance.apiKey}</code>
              <button
                onClick={copyToClipboard}
                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Include this API key in the x-api-key header for all requests
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Create Item</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`curl -X POST \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiInstance.apiKey}" \\
  -d '{"name":"Test Item","description":"This is a test item"}' \\
  ${baseUrl}/api/items/${apiInstance.id}`}
                </pre>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Get All Items</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`curl -H "x-api-key: ${apiInstance.apiKey}" \\
  ${baseUrl}/api/items/${apiInstance.id}`}
                </pre>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Get Item by ID</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`curl -H "x-api-key: ${apiInstance.apiKey}" \\
  ${baseUrl}/api/items/${apiInstance.id}/ITEM_ID`}
                </pre>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Update Item</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`curl -X PUT \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiInstance.apiKey}" \\
  -d '{"name":"Updated Item","description":"This is an updated item"}' \\
  ${baseUrl}/api/items/${apiInstance.id}/ITEM_ID`}
                </pre>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Delete Item</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`curl -X DELETE \\
  -H "x-api-key: ${apiInstance.apiKey}" \\
  ${baseUrl}/api/items/${apiInstance.id}/ITEM_ID`}
                </pre>
              </div>
            </section>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Important Notes</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>The API key is temporary and will change when the server restarts</li>
              <li>All data is stored in memory and will be cleared on server restart</li>
              <li>Include the x-api-key header in all requests</li>
              <li>For POST and PUT requests, send data in JSON format</li>
              <li>Your unique API endpoint: {baseUrl}/api/items/{apiInstance.id}</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
} 