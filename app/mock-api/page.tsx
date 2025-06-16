"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createNewInstance } from "../actions"
import {
  Database,
  AlertTriangle,
} from "lucide-react"

export default function MockApiPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasInitialized = useRef(false)

  useEffect(() => {
    // Only run initialization once
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const init = async () => {
      try {
        console.log('Page: Starting instance creation...')
        const result = await createNewInstance()
        console.log('Page: Instance created:', result)
        
        if (result && result.id) {
          console.log('Page: Redirecting to:', `/mock-api/${result.id}`)
          // Use replace instead of push to prevent back navigation
          router.replace(`/mock-api/${result.id}`)
        } else {
          throw new Error('Invalid response from server')
        }
      } catch (err) {
        console.error('Page: Error creating instance:', err)
        setError('Failed to create API instance. Please try again.')
        setLoading(false)
      }
    }

    init()
  }, [router])

  const handleRetry = () => {
    hasInitialized.current = false
    setLoading(true)
    setError(null)
    window.location.reload()
  }

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
              Error Creating API
            </h1>
            <p className="text-gray-400 text-lg mb-8">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
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

  return null
}
