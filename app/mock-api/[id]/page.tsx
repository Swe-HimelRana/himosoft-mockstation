"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
  Copy,
  CheckCircle,
  Key,
  Database,
  Globe,
  AlertTriangle,
  Terminal,
  Play,
  Eye,
  EyeOff,
  Zap,
  FileText,
  BookOpen,
  Code2,
  ArrowRight,
} from "lucide-react"

export default function MockApiPage() {
  const params = useParams()
  const [baseUrl, setBaseUrl] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [copied, setCopied] = useState<string | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null)

  useEffect(() => {
    setBaseUrl(window.location.origin)
    // Get the API key for this instance
    fetch(`/api/key/${params.id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Instance not found")
        }
        return res.json()
      })
      .then((data) => {
        setApiKey(data.apiKey)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Failed to get API key:", error)
        // If instance not found, redirect to create new instance
        window.location.href = "/mock-api"
      })
  }, [params.id])

  const copyToClipboard = (text: string, endpointId?: string) => {
    navigator.clipboard.writeText(text)
    if (endpointId) {
      setCopiedEndpoint(endpointId)
      setTimeout(() => setCopiedEndpoint(null), 2000)
    }
  }

  const endpoints = [
    {
      id: "create",
      method: "POST",
      title: "Create Item",
      color: "green",
      command: `curl -X POST ${baseUrl}/api/items/${params.id} \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{"name": "Example Item", "description": "This is an example item"}'`,
    },
    {
      id: "getAll",
      method: "GET",
      title: "Get All Items",
      color: "blue",
      command: `curl ${baseUrl}/api/items/${params.id} \\
  -H "x-api-key: ${apiKey}"`,
    },
    {
      id: "getSingle",
      method: "GET",
      title: "Get Single Item",
      color: "blue",
      command: `curl ${baseUrl}/api/items/${params.id}/ITEM_ID \\
  -H "x-api-key: ${apiKey}"`,
    },
    {
      id: "update",
      method: "PUT",
      title: "Update Item",
      color: "orange",
      command: `curl -X PUT ${baseUrl}/api/items/${params.id}/ITEM_ID \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{"name": "Updated Item", "description": "This item has been updated"}'`,
    },
    {
      id: "delete",
      method: "DELETE",
      title: "Delete Item",
      color: "red",
      command: `curl -X DELETE ${baseUrl}/api/items/${params.id}/ITEM_ID \\
  -H "x-api-key: ${apiKey}"`,
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading API instance...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25 mr-3">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
                Mock API Instance
              </h1>
              <p className="text-gray-400 text-sm">ID: {params.id}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - API Key */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-5 shadow-xl h-fit">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/25 mr-3">
                    <Key className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-100">API Key</h2>
                    <p className="text-gray-400 text-xs">Authentication</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-2 text-gray-400 hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-700/30"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="bg-gray-900/60 border border-gray-600/50 rounded-xl p-3 mb-3">
                <code className="font-mono text-green-300 text-xs break-all block mb-2">
                  {showApiKey ? apiKey : "•".repeat(Math.max(apiKey.length, 32))}
                </code>
                <button
                  onClick={() => copyToClipboard(apiKey, "apikey")}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  {copied === "apikey" ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center text-xs text-gray-400">
                <Terminal className="w-3 h-3 mr-1" />
                Include in <code className="bg-gray-700/50 px-1 py-0.5 rounded mx-1 text-green-300">x-api-key</code>{" "}
                header
              </div>
            </div>

            {/* Important Notes - Compact */}
            <div className="mt-6 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/25 mr-3">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-orange-300">Important Notes</h2>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <Zap className="w-3 h-3 text-orange-400 mr-2 mt-1 flex-shrink-0" />
                  <p className="text-orange-200/70 text-xs">Data cleared on server restart</p>
                </div>
                <div className="flex items-start">
                  <Database className="w-3 h-3 text-orange-400 mr-2 mt-1 flex-shrink-0" />
                  <p className="text-orange-200/70 text-xs">Unique instance with own data store</p>
                </div>
                <div className="flex items-start">
                  <Key className="w-3 h-3 text-orange-400 mr-2 mt-1 flex-shrink-0" />
                  <p className="text-orange-200/70 text-xs">x-api-key header required for all requests</p>
                </div>
                <div className="flex items-start">
                  <FileText className="w-3 h-3 text-orange-400 mr-2 mt-1 flex-shrink-0" />
                  <p className="text-orange-200/70 text-xs">Replace ITEM_ID with actual item IDs</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-900/30 rounded-xl border border-orange-500/20">
                <div className="flex items-center">
                  <Globe className="w-4 h-4 text-orange-400 mr-2" />
                  <div>
                    <span className="text-orange-200 font-medium text-xs">Base URL: </span>
                    <code className="bg-gray-800/50 px-2 py-1 rounded text-green-300 font-mono text-xs break-all">
                      {baseUrl}/api/items/{params.id}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - API Endpoints */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-100 mb-2">API Endpoints</h2>
              <p className="text-gray-400">Click any endpoint to view its cURL command</p>
            </div>

            <div className="grid gap-4 mb-8">
              {endpoints.map((endpoint) => (
                <div
                  key={endpoint.id}
                  className={`bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-gray-600/50 ${
                    activeEndpoint === endpoint.id ? "ring-2 ring-green-500/50" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div
                        className={`w-12 h-7 rounded-lg flex items-center justify-center mr-3 border text-xs font-bold ${
                          endpoint.color === "green"
                            ? "bg-green-500/20 border-green-500/30 text-green-400"
                            : endpoint.color === "blue"
                              ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                              : endpoint.color === "orange"
                                ? "bg-orange-500/20 border-orange-500/30 text-orange-400"
                                : "bg-red-500/20 border-red-500/30 text-red-400"
                        }`}
                      >
                        {endpoint.method}
                      </div>
                      <h3 className="text-lg font-bold text-gray-100">{endpoint.title}</h3>
                    </div>
                    <button
                      onClick={() => setActiveEndpoint(activeEndpoint === endpoint.id ? null : endpoint.id)}
                      className="p-2 text-gray-400 hover:text-green-400 transition-colors rounded-lg hover:bg-gray-700/30"
                    >
                      <Play
                        className={`w-4 h-4 transition-transform ${activeEndpoint === endpoint.id ? "rotate-90" : ""}`}
                      />
                    </button>
                  </div>

                  {activeEndpoint === endpoint.id && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                      <div className="bg-gray-900/60 border border-gray-600/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Terminal className="w-3 h-3 text-green-400 mr-2" />
                            <span className="text-xs font-medium text-gray-300">cURL Command</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(endpoint.command, endpoint.id)}
                            className="text-xs text-gray-400 hover:text-green-400 transition-colors flex items-center px-2 py-1 rounded hover:bg-gray-700/30"
                          >
                            {copiedEndpoint === endpoint.id ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap">
                          {endpoint.command}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Example Commands - Modernized */}
            <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 mr-4">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-100">Detailed Examples</h2>
                  <p className="text-gray-400 text-sm">Complete API usage examples with responses</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Public Get All Items */}
                <div className="bg-gray-900/40 border border-gray-600/50 rounded-xl p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-cyan-500/20 border border-cyan-500/30 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-cyan-400 text-xs font-bold">PUB</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-100">Public Get All Items</h3>
                  </div>

                  <div className="bg-gray-900/60 border border-gray-600/50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Terminal className="w-4 h-4 text-cyan-400 mr-2" />
                        <span className="text-sm font-medium text-gray-300">cURL Command</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(`curl ${baseUrl}/api/public/items/${params.id}?page=1&limit=5`)}
                        className="text-sm text-gray-400 hover:text-cyan-400 transition-colors flex items-center px-3 py-1 rounded-lg hover:bg-gray-700/30"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </button>
                    </div>
                    <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                      {`curl ${baseUrl}/api/public/items/${params.id}?page=1&limit=5`}
                    </pre>
                  </div>

                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-2">
                      <Globe className="w-4 h-4 text-cyan-400 mr-2" />
                      <span className="text-sm font-medium text-cyan-300">Public Endpoint</span>
                    </div>
                    <p className="text-cyan-200/70 text-sm">This endpoint is public and doesn't require an API key.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-200 mb-3 flex items-center">
                        <ArrowRight className="w-4 h-4 text-blue-400 mr-2" />
                        Pagination Parameters
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <code className="bg-gray-700/50 px-2 py-1 rounded text-green-300 text-xs mr-2">page</code>
                          <span className="text-gray-400 text-xs">Page number (default: 1)</span>
                        </div>
                        <div className="flex items-center">
                          <code className="bg-gray-700/50 px-2 py-1 rounded text-green-300 text-xs mr-2">limit</code>
                          <span className="text-gray-400 text-xs">Items per page (default: 5)</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-200 mb-3 flex items-center">
                        <Code2 className="w-4 h-4 text-green-400 mr-2" />
                        Response Format
                      </h4>
                      <pre className="text-xs text-gray-300 font-mono overflow-x-auto bg-gray-900/50 p-3 rounded border border-gray-600/30">
                        {`{
  "items": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 12,
    "itemsPerPage": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Get All Items */}
                <div className="bg-gray-900/40 border border-gray-600/50 rounded-xl p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-blue-400 text-xs font-bold">GET</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-100">Get All Items (Authenticated)</h3>
                  </div>

                  <div className="bg-gray-900/60 border border-gray-600/50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Terminal className="w-4 h-4 text-blue-400 mr-2" />
                        <span className="text-sm font-medium text-gray-300">cURL Command</span>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(`curl ${baseUrl}/api/items/${params.id}?page=1&limit=5 \\
  -H "x-api-key: ${apiKey}"`)
                        }
                        className="text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-center px-3 py-1 rounded-lg hover:bg-gray-700/30"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </button>
                    </div>
                    <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                      {`curl ${baseUrl}/api/items/${params.id}?page=1&limit=5 \\
  -H "x-api-key: ${apiKey}"`}
                    </pre>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-200 mb-3 flex items-center">
                        <ArrowRight className="w-4 h-4 text-blue-400 mr-2" />
                        Pagination Parameters
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <code className="bg-gray-700/50 px-2 py-1 rounded text-green-300 text-xs mr-2">page</code>
                          <span className="text-gray-400 text-xs">Page number (default: 1)</span>
                        </div>
                        <div className="flex items-center">
                          <code className="bg-gray-700/50 px-2 py-1 rounded text-green-300 text-xs mr-2">limit</code>
                          <span className="text-gray-400 text-xs">Items per page (default: 5)</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-200 mb-3 flex items-center">
                        <Code2 className="w-4 h-4 text-green-400 mr-2" />
                        Response Format
                      </h4>
                      <pre className="text-xs text-gray-300 font-mono overflow-x-auto bg-gray-900/50 p-3 rounded border border-gray-600/30">
                        {`{
  "items": [
    {
      "id": "item_id",
      "name": "Example Item",
      "description": "This is an example item",
      "createdAt": "2024-02-20T12:34:56.789Z",
      "updatedAt": "2024-02-20T12:34:56.789Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 12,
    "itemsPerPage": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Create Item */}
                <div className="bg-gray-900/40 border border-gray-600/50 rounded-xl p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-green-400 text-xs font-bold">POST</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-100">Create Item</h3>
                  </div>

                  <div className="bg-gray-900/60 border border-gray-600/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Terminal className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-sm font-medium text-gray-300">cURL Command</span>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `curl -X POST ${baseUrl}/api/items/${params.id} \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{"name": "Example Item", "description": "This is an example item"}'`,
                            "create",
                          )
                        }
                        className="text-sm text-gray-400 hover:text-green-400 transition-colors flex items-center px-3 py-1 rounded-lg hover:bg-gray-700/30"
                      >
                        {copiedEndpoint === "create" ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                      {`curl -X POST ${baseUrl}/api/items/${params.id} \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}" \\
  -d '{"name": "Example Item", "description": "This is an example item"}'`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
