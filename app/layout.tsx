import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "hi, i'm yeswanth.", // Update as needed
  description: '19, trying to learn by breaking things', // Optional but recommended for OG
  openGraph: {
    title: "hi, i'm yeswanth.", // OG-specific title
    description: '19, trying to learn by breaking things', // OG-specific description
    url: 'https://yesh.pecup.in', // Your production URL
    siteName: "Yeshh's portfolio",
    images: [
      {
        url: '/portfolio-og.png', // Path relative to public/ (e.g., /placeholder.jpg if using that)
        width: 1200, // Recommended width
        height: 630, // Recommended height
        alt: "hi, i'm yeswanth.", // For accessibility
      },
    ],
    locale: 'en_US', // Optional
    type: 'website', // Or 'article' for blog pages
  },
  twitter: {
    card: 'summary_large_image',
    title: "hi, i'm yeswanth.",
    description: '19, trying to learn by breaking things',
    images: ['/portfolio-og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased bg-black text-gray-300`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
