import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { League_Spartan } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-league-spartan",
})

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
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${leagueSpartan.variable} antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen flex flex-col">
            <div className="absolute top-4 right-4 z-50">
              <ThemeToggle />
            </div>
            <Suspense fallback={null}>{children}</Suspense>
          </div>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
