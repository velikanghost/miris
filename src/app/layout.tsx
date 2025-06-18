import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ApolloProviderWrapper from '@/components/providers/ApolloProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Miris - Advanced Protocol Analytics',
  description:
    'Real-time protocol analytics with cross-chain interoperability insights, advanced yield optimization, and comprehensive risk assessment.',
  keywords: [
    'crypto',
    'cryptocurrency',
    'DeFi',
    'protocol analytics',
    'dashboard',
    'GraphQL',
    'Apollo',
    'Next.js',
  ],
  authors: [{ name: 'Miris Analytics' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-background`}
      >
        <div className="">
          <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
        </div>
      </body>
    </html>
  )
}
