'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function MockApiPage() {
  const params = useParams();
  const [baseUrl, setBaseUrl] = useState('');
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    setBaseUrl(window.location.origin);
    // Get the API key for this instance
    fetch(`/api/key/${params.id}`)
      .then(res => res.json())
      .then(data => setApiKey(data.apiKey))
      .catch(error => console.error('Failed to get API key:', error));
  }, [params.id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Mock API Documentation</h1>
            
            <div className="space-y-8">
              {/* API Key Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">API Key</h2>
                <div className="flex items-center space-x-4">
                  <code className="bg-gray-100 px-4 py-2 rounded flex-1">{apiKey}</code>
                  <button
                    onClick={() => copyToClipboard(apiKey)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Copy
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Include this API key in the <code className="bg-gray-100 px-1 py-0.5 rounded">x-api-key</code> header for all requests.
                </p>
              </div>

              {/* Example Commands */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Example Commands</h2>
                
                {/* Create Item */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Create Item</h3>
                  <div className="relative">
                    <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                      <code>{`curl -X POST ${baseUrl}/api/items/${params.id} \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{
    "name": "Example Item",
    "description": "This is an example item"
  }'`}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(`curl -X POST ${baseUrl}/api/items/${params.id} \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{
    "name": "Example Item",
    "description": "This is an example item"
  }'`)}
                      className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* Get All Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Get All Items</h3>
                  <div className="relative">
                    <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                      <code>{`curl ${baseUrl}/api/items/${params.id} \\
  -H "x-api-key: ${apiKey}"`}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(`curl ${baseUrl}/api/items/${params.id} \\
  -H "x-api-key: ${apiKey}"`)}
                      className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* Get Single Item */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Get Single Item</h3>
                  <div className="relative">
                    <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                      <code>{`curl ${baseUrl}/api/items/${params.id}/ITEM_ID \\
  -H "x-api-key: ${apiKey}"`}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(`curl ${baseUrl}/api/items/${params.id}/ITEM_ID \\
  -H "x-api-key: ${apiKey}"`)}
                      className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* Update Item */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Update Item</h3>
                  <div className="relative">
                    <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                      <code>{`curl -X PUT ${baseUrl}/api/items/${params.id}/ITEM_ID \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{
    "name": "Updated Item",
    "description": "This item has been updated"
  }'`}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(`curl -X PUT ${baseUrl}/api/items/${params.id}/ITEM_ID \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{
    "name": "Updated Item",
    "description": "This item has been updated"
  }'`)}
                      className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* Delete Item */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Item</h3>
                  <div className="relative">
                    <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                      <code>{`curl -X DELETE ${baseUrl}/api/items/${params.id}/ITEM_ID \\
  -H "x-api-key: ${apiKey}"`}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(`curl -X DELETE ${baseUrl}/api/items/${params.id}/ITEM_ID \\
  -H "x-api-key: ${apiKey}"`)}
                      className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Important Notes</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>This is a temporary mock API. Data will be cleared when the server restarts.</li>
                  <li>Each instance has its own unique API key and data store.</li>
                  <li>All requests must include the <code className="bg-gray-100 px-1 py-0.5 rounded">x-api-key</code> header.</li>
                  <li>Replace <code className="bg-gray-100 px-1 py-0.5 rounded">ITEM_ID</code> with the actual item ID in the example commands.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 