"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import type { WebhookLog } from "@/app/lib/webhook-store"
import { Copy, Globe, Clock, Code, FileText, CheckCircle, Activity, ChevronRight } from "lucide-react"

export default function WebhookPage() {
  const params = useParams()
  const [logs, setLogs] = useState<WebhookLog[]>([])
  const [webhookUrl, setWebhookUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null)

  useEffect(() => {
    setWebhookUrl(`${window.location.origin}/api/webhook/${params.id}`)
    const eventSource = new EventSource(`/api/webhook/${params.id}/stream`)

    eventSource.onmessage = (event) => {
      const log = JSON.parse(event.data)
      setLogs((prevLogs) => {
        const newLogs = [log, ...prevLogs]
        // Auto-select the first (newest) request only if no log is currently selected
        setSelectedLog((currentSelected) => currentSelected || log)
        return newLogs
      })
    }

    return () => {
      eventSource.close()
    }
  }, [params.id])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-gray-800/50 border-r border-gray-700 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/25 mr-3">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-100">Webhook Requests</h1>
                <p className="text-sm text-gray-400">
                  {logs.length} request{logs.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Request List */}
          <div className="flex-1 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-400 text-sm">No requests yet</p>
                <p className="text-gray-500 text-xs mt-1">Waiting for webhooks...</p>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {logs.map((log, index) => (
                  <button
                    key={index}
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      setSelectedLog(log)
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      selectedLog === log
                        ? "bg-green-500/20 border border-green-500/30"
                        : "bg-gray-700/30 hover:bg-gray-700/50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          log.method === "POST" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {log.method}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          selectedLog === log ? "text-green-400 rotate-90" : "text-gray-500"
                        }`}
                      />
                    </div>
                    <div className="text-sm text-gray-300 mb-1">{formatTime(log.timestamp)}</div>
                    <div className="text-xs text-gray-500">{formatDate(log.timestamp)}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/25 mr-3">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                Webhook Endpoint
              </h1>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {!selectedLog ? (
              /* Webhook URL Section - Show when no request is selected */
              <div className="max-w-2xl">
                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <Code className="w-5 h-5 text-green-400 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-100">Webhook URL</h2>
                  </div>
                  <div className="flex items-center space-x-4 mb-4">
                    <code className="bg-gray-900/50 border border-gray-600 text-green-300 px-4 py-3 rounded-lg flex-1 font-mono text-sm break-all">
                      {webhookUrl}
                    </code>
                    <button
                      onClick={() => copyToClipboard(webhookUrl)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transform hover:scale-105 flex items-center space-x-2"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-400">
                    Send POST or GET requests to this URL to test your webhook integration.
                  </p>
                </div>

                {logs.length > 0 && (
                  <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-blue-300 text-sm">💡 Select a request from the sidebar to view its details</p>
                  </div>
                )}
              </div>
            ) : (
              /* Request Details - Show when a request is selected */
              <div className="max-w-4xl">
                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedLog.method === "POST"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {selectedLog.method}
                      </span>
                      <span className="font-medium text-gray-100">Request Details</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(selectedLog.timestamp).toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                        <Code className="w-4 h-4 mr-1" />
                        Headers
                      </h3>
                      <pre className="text-sm text-gray-300 bg-gray-900/50 border border-gray-600 p-4 rounded-lg overflow-x-auto font-mono">
                        {JSON.stringify(selectedLog.headers, null, 2)}
                      </pre>
                    </div>
                    {selectedLog.body && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          Body
                        </h3>
                        <pre className="text-sm text-gray-300 bg-gray-900/50 border border-gray-600 p-4 rounded-lg overflow-x-auto font-mono">
                          {JSON.stringify(selectedLog.body, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
