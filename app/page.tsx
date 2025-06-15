"use client"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { useRouter } from "next/navigation"
import { Webhook, Zap, ArrowRight, Globe, Code2, Shield, Mail, Phone, MapPin, ExternalLink } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const createWebhook = () => {
    setIsCreating(true)
    const webhookId = uuidv4()
    router.push(`/webhook/${webhookId}`)
  }

  const goToMockApi = () => {
    router.push("/mock-api")
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                API Testing
              </span>
              <br />
              <span className="text-gray-100">Made Simple</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Test webhooks, mock APIs, and debug your integrations with our powerful developer tools
            </p>
          </div>

          {/* Main Cards */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Webhook Testing Card */}
            <div className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                    <Webhook className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold ml-4 text-gray-100">Webhook Testing</h2>
                </div>

                <p className="text-gray-400 mb-6 leading-relaxed">
                  Create instant webhook endpoints to test your integrations. Monitor requests, inspect payloads, and
                  debug with ease.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm text-gray-300">
                    <Shield className="w-4 h-4 text-green-400 mr-2" />
                    Secure HTTPS endpoints
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Code2 className="w-4 h-4 text-green-400 mr-2" />
                    Real-time request inspection
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Zap className="w-4 h-4 text-green-400 mr-2" />
                    Instant webhook creation
                  </div>
                </div>

                <button
                  onClick={createWebhook}
                  disabled={isCreating}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
                >
                  {isCreating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Creating Webhook...
                    </>
                  ) : (
                    <>
                      Create New Webhook
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Mock API Card */}
            <div className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold ml-4 text-gray-100">Mock API</h2>
                </div>

                <p className="text-gray-400 mb-6 leading-relaxed">
                  Simulate API responses for testing and development. Perfect for frontend development and integration
                  testing.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm text-gray-300">
                    <Shield className="w-4 h-4 text-emerald-400 mr-2" />
                    Custom response formats
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Code2 className="w-4 h-4 text-emerald-400 mr-2" />
                    RESTful API simulation
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Zap className="w-4 h-4 text-emerald-400 mr-2" />
                    Instant API endpoints
                  </div>
                </div>

                <button
                  onClick={goToMockApi}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transform hover:scale-[1.02] flex items-center justify-center group"
                >
                  Start Mock API
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="max-w-4xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-gray-400 text-sm">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">50ms</div>
              <div className="text-gray-400 text-sm">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">10K+</div>
              <div className="text-gray-400 text-sm">Requests/Day</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-400 text-sm">Monitoring</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/25 mr-3">
                  <Zap className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                    HIMOSOFT
                  </h3>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                Delivering cutting-edge software development services to help your business thrive in the digital world.
              </p>
              <div className="text-sm text-gray-500">© 2025 HimoSoft. All rights reserved.</div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-100 mb-6">Quick Links</h4>
              <div className="space-y-3">
                <a
                  href="https://himosoft.com.bd/#about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-green-400 transition-colors duration-200 group"
                >
                  <span>Home</span>
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a
                  href="https://himosoft.com.bd/#services"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-green-400 transition-colors duration-200 group"
                >
                  <span>Services</span>
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a
                  href="https://himosoft.com.bd/#about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-green-400 transition-colors duration-200 group"
                >
                  <span>About</span>
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a
                  href="https://himosoft.com.bd/#about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-green-400 transition-colors duration-200 group"
                >
                  <span>Team</span>
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a
                  href="https://himosoft.com.bd/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-green-400 transition-colors duration-200 group"
                >
                  <span>Terms of Service</span>
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a
                  href="https://himosoft.com.bd/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-green-400 transition-colors duration-200 group"
                >
                  <span>Privacy Policy</span>
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-gray-100 mb-6">Get in Touch</h4>
              <div className="space-y-4">
                <a
                  href="mailto:info@himosoft.com.bd"
                  className="flex items-start text-gray-400 hover:text-green-400 transition-colors duration-200 group"
                >
                  <Mail className="w-5 h-5 mr-3 mt-0.5 text-green-400 group-hover:text-green-300" />
                  <span className="break-all">info@himosoft.com.bd</span>
                </a>
                <div className="flex items-start text-gray-400">
                  <Phone className="w-5 h-5 mr-3 mt-0.5 text-green-400" />
                  <div className="space-y-1">
                    <a href="tel:+8801870955054" className="block hover:text-green-400 transition-colors duration-200">
                      +8801870955054
                    </a>
                    <a href="tel:+8801315770487" className="block hover:text-green-400 transition-colors duration-200">
                      +8801315770487
                    </a>
                  </div>
                </div>
                <div className="flex items-start text-gray-400">
                  <MapPin className="w-5 h-5 mr-3 mt-0.5 text-green-400 flex-shrink-0" />
                  <span className="leading-relaxed">
                    Tapir Bari, Sreepur, Gazipur,
                    <br />
                    Tengra-1740
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Border */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-500 mb-4 md:mb-0">
                Powered by HIMOSOFT MockStation - Professional API Testing Tools
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
