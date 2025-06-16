"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { getInstance } from "@/app/actions"
import {
  Copy,
  CheckCircle,
  Key,
  Database,
  Globe,
  AlertTriangle,
  Terminal,
  Eye,
  EyeOff,
  BookOpen,
  Code2,
  ArrowRight,
  ArrowLeft,
  Server,
} from "lucide-react"

export default function MockApiInstancePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [instance, setInstance] = useState<any>(null)
  const hasInitialized = useRef(false)
  const [baseUrl, setBaseUrl] = useState("")
  const [copied, setCopied] = useState<string | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null)
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null)

  useEffect(() => {
    // Only run initialization once
    if (hasInitialized.current) return
    hasInitialized.current = true

    const init = async () => {
      try {
        console.log("Instance Page: Loading instance:", params.id)
        const instance = await getInstance(params.id)
        console.log("Instance Page: Instance loaded:", instance)

        if (!instance) {
          throw new Error("Instance not found")
        }

        // Log the full instance data
        console.log("Instance Page: Full instance data:", JSON.stringify(instance, null, 2))

        setInstance(instance)
        setLoading(false)
        setBaseUrl(window.location.origin)
      } catch (err) {
        console.error("Instance Page: Error loading instance:", err)
        setError("Failed to load API instance. Please try again.")
        setLoading(false)
      }
    }

    init()
  }, [params.id])

  // Log instance data when it changes
  useEffect(() => {
    if (instance) {
      console.log("Instance Page: Instance state updated:", JSON.stringify(instance, null, 2))
    }
  }, [instance])

  const handleBack = () => {
    // Navigate to home instead of back
    router.replace("/")
  }

  const handleRetry = () => {
    hasInitialized.current = false
    setLoading(true)
    setError(null)
    window.location.reload()
  }

  const copyToClipboard = (text: string, endpointId?: string) => {
    navigator.clipboard.writeText(text)
    if (endpointId) {
      setCopiedEndpoint(endpointId)
      setTimeout(() => setCopiedEndpoint(null), 2000)
    } else {
      setCopied("apiKey")
      setTimeout(() => setCopied(null), 2000)
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
  -H "x-api-key: ${instance?.apiKey}" \\
  -d '{"name": "Example Item", "description": "This is an example item"}'`,
    },
    {
      id: "getAll",
      method: "GET",
      title: "Get All Items",
      color: "blue",
      command: `curl ${baseUrl}/api/items/${params.id} \\
  -H "x-api-key: ${instance?.apiKey}"`,
    },
    {
      id: "getSingle",
      method: "GET",
      title: "Get Single Item",
      color: "blue",
      command: `curl ${baseUrl}/api/items/${params.id}/ITEM_ID \\
  -H "x-api-key: ${instance?.apiKey}"`,
    },
    {
      id: "update",
      method: "PUT",
      title: "Update Item",
      color: "orange",
      command: `curl -X PUT ${baseUrl}/api/items/${params.id}/ITEM_ID \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${instance?.apiKey}" \\
  -d '{"name": "Updated Item", "description": "This item has been updated"}'`,
    },
    {
      id: "delete",
      method: "DELETE",
      title: "Delete Item",
      color: "red",
      command: `curl -X DELETE ${baseUrl}/api/items/${params.id}/ITEM_ID \\
  -H "x-api-key: ${instance?.apiKey}"`,
    },
  ]

  const publicEndpoints = [
    {
      method: "GET",
      path: `/api/public/items/${params.id}`,
      title: "Get All Items",
      description: "Get all items for this API instance",
      color: "cyan",
      response: `{
  "instance": {
    "id": "${params.id}",
    "name": "Instance Name",
    "description": "Instance Description"
  },
  "total": 2,
  "items": [
    {
      "id": "item1",
      "name": "Item Name",
      "description": "Item Description",
      "method": "POST",
      "path": "/items",
      "response": {},
      "status": 200,
      "headers": {},
      "delay": 0
    }
  ]
}`,
    },
    {
      method: "GET",
      path: `/api/public/items/${params.id}/:itemId`,
      title: "Get Single Item",
      description: "Get a specific item by ID",
      color: "cyan",
      response: `{
  "id": "item1",
  "name": "Item Name",
  "description": "Item Description",
  "method": "POST",
  "path": "/items",
  "response": {},
  "status": 200,
  "headers": {},
  "delay": 0
}`,
    },
    {
      method: "POST",
      path: `/api/public/items/${params.id}`,
      title: "Create Item",
      description: "Create a new item",
      color: "green",
      requestBody: `{
  "name": "Item Name",
  "description": "Item Description"
}`,
    },
    {
      method: "PUT",
      path: `/api/public/items/${params.id}/:itemId`,
      title: "Update Item",
      description: "Update an existing item",
      color: "orange",
      requestBody: `{
  "name": "Updated Name",
  "description": "Updated Description"
}`,
    },
    {
      method: "DELETE",
      path: `/api/public/items/${params.id}/:itemId`,
      title: "Delete Item",
      description: "Delete an item",
      color: "red",
      response: `{
  "success": true
}`,
    },
  ]

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-red-400 via-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-500/30">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 via-red-300 to-red-300 bg-clip-text text-transparent mb-4">
              Error Loading API
            </h1>
            <p className="text-gray-400 text-lg mb-8">{error}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/30 animate-pulse">
                <Database className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent mb-4">
              Loading API Instance
            </h1>
            <p className="text-gray-400 text-lg mb-8">Setting up your API environment...</p>
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12 mt-4">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/30">
              <Database className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-2xl font-bold bg-gradient-to-r from-green-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent mb-4">
            {instance.name}
          </h1>
          <p className="text-gray-400 text-lg mb-8">{instance.description}</p>
          <div className="flex justify-center">
            <button
              onClick={handleBack}
              className="px-3 py-1 bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white rounded-xl hover:bg-gray-700/50 transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* API Key Section */}
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Key className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-100">API Key</h2>
                  <p className="text-gray-400 text-sm">Authentication token</p>
                </div>
              </div>
              <div className="bg-gray-900/60 border border-gray-600/50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <code className="text-green-300 font-mono flex-1 text-sm break-all">
                    {showApiKey ? instance.apiKey : "•".repeat(32)}
                  </code>
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    {showApiKey ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(instance.apiKey)}
                    className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    {copied === "apiKey" ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Base URL for private endpoints Section */}
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-100">Base URL of Private Endpoints</h2>
                  <p className="text-gray-400 text-sm">API endpoint</p>
                </div>
              </div>
              <div className="bg-gray-900/60 border border-gray-600/50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <code className="text-blue-300 font-mono flex-1 text-sm break-all">
                    {baseUrl}/api/items/{params.id}
                  </code>
                  <button
                    onClick={() => copyToClipboard(`${baseUrl}/api/items/${params.id}`)}
                    className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    {copied === "baseUrl" ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {/* Public Base URL for public endpoints Section */}
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-100">Base of Public Endpoints</h2>
                  <p className="text-gray-400 text-sm">API endpoint</p>
                </div>
              </div>
              <div className="bg-gray-900/60 border border-gray-600/50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <code className="text-blue-300 font-mono flex-1 text-sm break-all">
                    {baseUrl}/api/public/items/{params.id}
                  </code>
                  <button
                    onClick={() => copyToClipboard(`${baseUrl}/api/items/${params.id}`)}
                    className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    {copied === "baseUrl" ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {/* Quick Documentation */}
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-100">Quick Start</h2>
                  <p className="text-gray-400 text-sm">Getting started guide</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-900/60 border border-gray-600/50 rounded-xl p-4">
                  <h3 className="text-gray-100 font-medium mb-2 flex items-center">
                    <Terminal className="w-4 h-4 text-emerald-400 mr-2" />
                    Example Request
                  </h3>
                  <pre className="text-xs text-gray-300 font-mono bg-gray-800/50 rounded-lg p-3 overflow-x-auto">
                    {`curl ${baseUrl}/api/items/${params.id} \\
  -H "x-api-key: ${instance.apiKey}"`}
                  </pre>
                </div>
                <div className="text-gray-300 text-sm">
                  <p className="mb-2">
                    Include your API key in the{" "}
                    <code className="bg-gray-700/50 px-2 py-1 rounded text-green-300">x-api-key</code> header with every
                    request.
                  </p>
                  <p>All endpoints return JSON responses with proper error handling.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Endpoints */}
          <div className="space-y-6">
            {/* API Endpoints Section */}
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <Terminal className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-100">Authenticated Endpoints</h2>
                  <p className="text-gray-400 text-sm">Requires API key</p>
                </div>
              </div>
              <div className="space-y-4">
                {endpoints.map((endpoint) => (
                  <div key={endpoint.id} className="bg-gray-900/60 border border-gray-600/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            endpoint.color === "green"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : endpoint.color === "blue"
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                : endpoint.color === "orange"
                                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                  : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {endpoint.method}
                        </span>
                        <h3 className="text-gray-100 font-medium">{endpoint.title}</h3>
                      </div>
                      <button
                        onClick={() => copyToClipboard(endpoint.command, endpoint.id)}
                        className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                      >
                        {copiedEndpoint === endpoint.id ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <pre className="text-xs text-gray-300 font-mono bg-gray-800/50 rounded-lg p-3 overflow-x-auto">
                      <code>{endpoint.command}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Public Endpoints Section */}
        <div className="mt-8">
          <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Server className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-100">Public Endpoints</h2>
                <p className="text-gray-400 text-sm">No authentication required</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {publicEndpoints.map((endpoint, index) => (
                <div key={index} className="bg-gray-900/60 border border-gray-600/50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        endpoint.color === "green"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : endpoint.color === "cyan"
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                            : endpoint.color === "orange"
                              ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {endpoint.method}
                    </span>
                    <h3 className="text-gray-100 font-medium">{endpoint.title}</h3>
                  </div>

                  <div className="mb-4">
                    <code className="text-cyan-300 text-sm font-mono break-all">{endpoint.path}</code>
                    <p className="text-gray-400 text-sm mt-2">{endpoint.description}</p>
                  </div>

                  {endpoint.requestBody && (
                    <div className="mb-4">
                      <h4 className="text-gray-200 font-medium text-sm mb-2 flex items-center">
                        <Code2 className="w-4 h-4 text-blue-400 mr-2" />
                        Request Body
                      </h4>
                      <pre className="text-xs text-gray-300 font-mono bg-gray-800/50 rounded-lg p-3 overflow-x-auto border border-gray-600/30">
                        {endpoint.requestBody}
                      </pre>
                    </div>
                  )}

                  {endpoint.response && (
                    <div>
                      <h4 className="text-gray-200 font-medium text-sm mb-2 flex items-center">
                        <ArrowRight className="w-4 h-4 text-green-400 mr-2" />
                        Response
                      </h4>
                      <pre className="text-xs text-gray-300 font-mono bg-gray-800/50 rounded-lg p-3 overflow-x-auto border border-gray-600/30">
                        {endpoint.response}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Example Usage */}
            <div className="mt-8 bg-gray-900/60 border border-gray-600/50 rounded-xl p-5">
              <h3 className="text-gray-100 font-medium text-lg mb-4 flex items-center">
                <Terminal className="w-5 h-5 text-cyan-400 mr-2" />
                Example Usage
              </h3>
              <p className="text-gray-400 text-sm mb-4">Using curl to interact with the public API:</p>
              <pre className="text-xs text-gray-300 font-mono bg-gray-800/50 rounded-lg p-4 overflow-x-auto border border-gray-600/30">
                {`# Get all items
curl ${baseUrl}/api/public/items/${params.id}

# Get a specific item
curl ${baseUrl}/api/public/items/${params.id}/item1

# Create a new item
curl -X POST ${baseUrl}/api/public/items/${params.id} \\
  -H "Content-Type: application/json" \\
  -d '{"name": "New Item", "description": "Item Description"}'

# Update an item
curl -X PUT ${baseUrl}/api/public/items/${params.id}/item1 \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Updated Item", "description": "Updated Description"}'

# Delete an item
curl -X DELETE ${baseUrl}/api/public/items/${params.id}/item1`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
