"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Copy,
  CheckCircle,
  Key,
  Code,
  Database,
  Globe,
  AlertTriangle,
  Zap,
  Terminal,
  Play,
  Eye,
  EyeOff,
} from "lucide-react"

interface ApiInstance {
  id: string
  apiKey: string
}

export default function MockApiPage() {
  const router = useRouter()
  const [apiInstance, setApiInstance] = useState<ApiInstance | null>(null)
  const [copied, setCopied] = useState(false)
  const [baseUrl, setBaseUrl] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [showApiKey, setShowApiKey] = useState(false)
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null)

  useEffect(() => {
    setBaseUrl(window.location.origin)

    // Create a new API instance
    fetch("/api/create", { method: "POST" })
      .then((res) => res.json())
      .then((data: ApiInstance) => {
        setApiInstance(data)
        // Update URL with the instance ID
        router.push(`/mock-api/${data.id}`)
      })
      .catch((error) => {
        console.error("Failed to create API instance:", error)
        setLoading(false)
      })
  }, [router])

  const copyToClipboard = () => {
    if (!apiInstance) return
    navigator.clipboard.writeText(apiInstance.apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const endpoints = [
    {
      id: "create",
      method: "POST",
      title: "Create Item",
      description: "Create a new item in your mock database",
      color: "green",
      curl: `curl -X POST \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiInstance?.apiKey}" \\
  -d '{"name":"Test Item","description":"This is a test item"}' \\
  ${baseUrl}/api/items/${apiInstance?.id}`,
    },
    {
      id: "getAll",
      method: "GET",
      title: "Get All Items",
      description: "Retrieve all items from your mock database",
      color: "blue",
      curl: `curl -H "x-api-key: ${apiInstance?.apiKey}" \\
  ${baseUrl}/api/items/${apiInstance?.id}`,
    },
    {
      id: "getById",
      method: "GET",
      title: "Get Item by ID",
      description: "Retrieve a specific item by its unique identifier",
      color: "blue",
      curl: `curl -H "x-api-key: ${apiInstance?.apiKey}" \\
  ${baseUrl}/api/items/${apiInstance?.id}/ITEM_ID`,
    },
    {
      id: "update",
      method: "PUT",
      title: "Update Item",
      description: "Update an existing item in your mock database",
      color: "orange",
      curl: `curl -X PUT \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiInstance?.apiKey}" \\
  -d '{"name":"Updated Item","description":"This is an updated item"}' \\
  ${baseUrl}/api/items/${apiInstance?.id}/ITEM_ID`,
    },
    {
      id: "delete",
      method: "DELETE",
      title: "Delete Item",
      description: "Remove an item from your mock database",
      color: "red",
      curl: `curl -X DELETE \\
  -H "x-api-key: ${apiInstance?.apiKey}" \\
  ${baseUrl}/api/items/${apiInstance?.id}/ITEM_ID`,
    },
  ]

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
              Initializing Mock API
            </h1>
            <p className="text-gray-400 text-lg mb-8">Setting up your personalized API environment...</p>
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!apiInstance) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Creating your API instance...</p>
        </div>
      </main>
    )
  }

  return null; // This page will redirect to the instance page
}
