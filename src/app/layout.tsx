import type { Metadata } from 'next'
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
  title: 'Crypto Dashboard - Real-time Data Visualization',
  description:
    'A modern cryptocurrency data dashboard built with Next.js, Apollo Client, and GraphQL. Track tokens, pools, and DeFi metrics in real-time.',
  keywords: [
    'crypto',
    'cryptocurrency',
    'DeFi',
    'dashboard',
    'GraphQL',
    'Apollo',
    'Next.js',
  ],
  authors: [{ name: 'Crypto Dashboard' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
      </body>
    </html>
  )
}
