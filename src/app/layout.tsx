import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Zen_Dots } from 'next/font/google'
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

const zenDots = Zen_Dots({
  variable: '--font-zen-dots',
  subsets: ['latin'],
  weight: '400',
})

export const metadata: Metadata = {
  title: 'Miris - See monad',
  description: 'Real-time monad testnet-1 visualizer',
  keywords: [
    'crypto',
    'cryptocurrency',
    'DeFi',
    'protocol analytics',
    'dashboard',
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
        className={`${geistSans.variable} ${geistMono.variable} ${zenDots.variable} antialiased h-full bg-background`}
      >
        <div className="">
          <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
        </div>
      </body>
    </html>
  )
}
