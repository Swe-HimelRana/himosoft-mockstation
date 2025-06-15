import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import Header from "./components/header"

export const metadata: Metadata = {
  title: "HimoSoft MockStation",
  description: "Test your API and webhooks with ease using HimoSoft MockStation – your powerful and simple API testing tool.",
  keywords: ["API testing", "test webhook", "test api", "webhook mock", "mock API", "mock webhook", "HimoSoft", "MockStation", "developer tools"],
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://himosoft.com.bd"),
  icons: {
    icon: "https://himosoft.com.bd/shortlogo.png",
    shortcut: "https://himosoft.com.bd/shortlogo.png",
  },
  openGraph: {
    title: "HimoSoft MockStation",
    description: "Test your API and webhooks with ease using HimoSoft MockStation.",
    url: "https://himosoft.com.bd",
    siteName: "HimoSoft MockStation",
    images: [
      {
        url: "https://himosoft.com.bd/shortlogo.png",
        width: 512,
        height: 512,
        alt: "HimoSoft Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HimoSoft MockStation",
    description: "Test your API and webhooks with ease using HimoSoft MockStation.",
    site: "@himosoft",
    images: ["https://himosoft.com.bd/shortlogo.png"],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white min-h-screen">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}