'use client'

import { useQuery } from '@apollo/client'
import { useEffect, useState, useRef, useCallback } from 'react'
import {
  KuruOrderBook_Trade,
  NadFun_Combined,
  Monorail_Pools,
  Monorail_SwapEvent,
  Amertis_Swap,
  AprMONVault_Deposit,
  MagmaStaking_Deposit,
  AprMONVault_Redeem,
  MagmaStaking_Withdraw,
} from '@/lib/graphql/queries'
import StakingTable from './StakingTable'
import DegenTable from './DegenTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Activity,
  Zap,
  Droplets,
  Heart,
  Shuffle,
  Moon,
  Sun,
  Github,
  BarChart3,
} from 'lucide-react'
import ClobTable from './ClobTable'
import DexTable from './DexTable'
import PoolTable from './PoolTable'
import ChainSummary from './ChainSummary'
import TypingText from '../ui/animata/TypingText'
import Image from 'next/image'

export default function Dashboard() {
  // Simple dark mode toggle using Tailwind's built-in system
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
  }

  // Interactive animation state
  const [portPosition, setPortPosition] = useState({
    top: '30%',
  })
  const [isPortHovered, setIsPortHovered] = useState(false)
  const animationFrameRef = useRef<number>(0)
  const portRef = useRef<HTMLDivElement>(null)
  const danceRef = useRef<HTMLDivElement>(null)

  // Animation loop
  useEffect(() => {
    const checkCollision = () => {
      if (!portRef.current || !danceRef.current) return false

      const portRect = portRef.current.getBoundingClientRect()
      const danceRect = danceRef.current.getBoundingClientRect()

      return !(
        portRect.right < danceRect.left ||
        portRect.left > danceRect.right ||
        portRect.bottom < danceRect.top ||
        portRect.top > danceRect.bottom
      )
    }

    const getDancePosition = () => {
      if (!danceRef.current) return { centerY: 0 }
      const rect = danceRef.current.getBoundingClientRect()
      return {
        centerY: rect.top + rect.height / 4,
      }
    }

    const movePortAway = () => {
      if (isPortHovered) return

      const dancePos = getDancePosition()
      const windowHeight = window.innerHeight
      const safeDistance = 120
      let newTop =
        (parseFloat(portPosition.top.replace('%', '')) / 100) * windowHeight

      if (Math.abs(dancePos.centerY - newTop) < safeDistance) {
        if (dancePos.centerY > windowHeight / 2) {
          newTop = Math.max(50, dancePos.centerY - safeDistance)
        } else {
          newTop = Math.min(windowHeight - 100, dancePos.centerY + safeDistance)
        }

        if (newTop < 100) {
          newTop = windowHeight - 120
        }
        if (newTop > windowHeight - 120) {
          newTop = 80
        }

        setPortPosition({
          top: `${(newTop / windowHeight) * 100}%`,
        })
      }
    }

    const animate = () => {
      if (checkCollision() && isPortHovered) {
        alert('anagoooo')
        setIsPortHovered(false)
      } else {
        movePortAway()
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [portPosition, isPortHovered])

  const {
    data: orderBookData,
    loading: orderBookLoading,
    error: orderBookError,
    startPolling: orderBookStartPolling,
  } = useQuery(KuruOrderBook_Trade)

  const {
    data: degenData,
    loading: degenLoading,
    error: degenError,
    startPolling: degenStartPolling,
  } = useQuery(NadFun_Combined)

  const {
    data: monorailData,
    loading: monorailLoading,
    error: monorailError,
    startPolling: monorailStartPolling,
  } = useQuery(Monorail_Pools)

  const {
    data: monorailDexData,
    loading: monorailDexLoading,
    error: monorailDexError,
    startPolling: monorailDexStartPolling,
  } = useQuery(Monorail_SwapEvent)

  const {
    data: amertisDexData,
    loading: amertisDexLoading,
    error: amertisDexError,
    startPolling: amertisDexStartPolling,
  } = useQuery(Amertis_Swap)

  const {
    data: aprMONVaultData,
    loading: aprMONVaultLoading,
    error: aprMONVaultError,
    startPolling: aprMONVaultStartPolling,
  } = useQuery(AprMONVault_Deposit)

  const {
    data: magmaStakingData,
    loading: magmaStakingLoading,
    error: magmaStakingError,
    startPolling: magmaStakingStartPolling,
  } = useQuery(MagmaStaking_Deposit)

  const {
    data: aprMONVaultRedeemData,
    loading: aprMONVaultRedeemLoading,
    error: aprMONVaultRedeemError,
    startPolling: aprMONVaultRedeemStartPolling,
  } = useQuery(AprMONVault_Redeem)

  const {
    data: magmaStakingWithdrawData,
    loading: magmaStakingWithdrawLoading,
    error: magmaStakingWithdrawError,
    startPolling: magmaStakingWithdrawStartPolling,
  } = useQuery(MagmaStaking_Withdraw)

  const isLoading =
    orderBookLoading ||
    degenLoading ||
    monorailLoading ||
    monorailDexLoading ||
    amertisDexLoading ||
    aprMONVaultLoading ||
    magmaStakingLoading ||
    aprMONVaultRedeemLoading ||
    magmaStakingWithdrawLoading
  const hasError =
    orderBookError ||
    degenError ||
    monorailError ||
    monorailDexError ||
    amertisDexError ||
    aprMONVaultError ||
    magmaStakingError ||
    aprMONVaultRedeemError ||
    magmaStakingWithdrawError

  useEffect(() => {
    orderBookStartPolling(3000)
    degenStartPolling(3000)
    monorailStartPolling(3000)
    monorailDexStartPolling(3000)
    amertisDexStartPolling(3000)
    aprMONVaultStartPolling(3000)
    magmaStakingStartPolling(3000)
    aprMONVaultRedeemStartPolling(3000)
    magmaStakingWithdrawStartPolling(3000)
  }, [
    orderBookStartPolling,
    degenStartPolling,
    monorailStartPolling,
    monorailDexStartPolling,
    amertisDexStartPolling,
    aprMONVaultStartPolling,
    magmaStakingStartPolling,
    aprMONVaultRedeemStartPolling,
    magmaStakingWithdrawStartPolling,
  ])

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center geometric-pattern">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-accent via-primary to-secondary rounded-2xl flex items-center justify-center shadow-2xl mx-auto">
              <Activity className="w-8 h-8 text-primary-foreground animate-pulse" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-2xl blur-lg opacity-60 animate-pulse-glow"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-display text-gradient">Loading...</h2>
            <p className="text-muted-foreground">
              Fetching real-time blockchain analytics
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center geometric-pattern">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 bg-destructive/10 border-2 border-destructive/20 rounded-2xl flex items-center justify-center mx-auto">
            <Activity className="w-8 h-8 text-destructive" />
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-display text-foreground">
              Connection Error
            </h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="custom-card p-3">Loading failed</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-4">
              <div className="relative h-[62px] w-[62px]">
                <Image
                  src="/logo-removebg-preview.png"
                  alt="Miris"
                  width={62}
                  height={62}
                  className="object-cover w-full h-full border-2 border-accent rounded-xl p-[1px]"
                />
              </div>

              <div>
                <h1 className="text-3xl font-display text-gradient">Miris</h1>
                <TypingText
                  text="Real-time visualizer"
                  className="text-xs text-muted-foreground"
                  waitTime={1000}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-10 w-10 p-0 theme-toggle dark:text-white rounded-full"
              >
                <Sun className="h-4 w-4 sun-icon" />
                <Moon className="h-4 w-4 moon-icon" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 dark:text-white rounded-full"
                asChild
              >
                <a
                  href="https://github.com/velikanghost/miris"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="">
        <div className="mx-auto max-w-5xl px-6 py-8 space-y-8">
          <Tabs defaultValue="chain" className="w-full">
            <TabsList className="flex justify-between text-xs bg-muted/50 h-10 w-full">
              <TabsTrigger
                value="chain"
                className="flex items-center gap-1 px-2"
              >
                <BarChart3 className="w-3 h-3" />
                <span className="hidden sm:inline">Chain</span>
              </TabsTrigger>
              <TabsTrigger
                value="orderbook"
                className="flex items-center gap-1 px-2"
              >
                <Activity className="w-3 h-3" />
                <span className="hidden sm:inline">OrderBook</span>
              </TabsTrigger>
              <TabsTrigger value="dex" className="flex items-center gap-1 px-2">
                <Shuffle className="w-3 h-3" />
                <span className="hidden sm:inline">DEX</span>
              </TabsTrigger>
              <TabsTrigger
                value="degen"
                className="flex items-center gap-1 px-2"
              >
                <Zap className="w-3 h-3" />
                <span className="hidden sm:inline">Degen</span>
              </TabsTrigger>
              <TabsTrigger
                value="monorail"
                className="flex items-center gap-1 px-2"
              >
                <Droplets className="w-3 h-3" />
                <span className="hidden sm:inline">Pools</span>
              </TabsTrigger>
              <TabsTrigger
                value="staking"
                className="flex items-center gap-1 px-2"
              >
                <Heart className="w-3 h-3" />
                <span className="hidden sm:inline">Staking</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chain" className="mt-6">
              <ChainSummary />
            </TabsContent>

            <TabsContent value="orderbook" className="mt-6">
              <ClobTable clobData={orderBookData} />
            </TabsContent>

            <TabsContent value="dex" className="mt-6">
              <DexTable data={monorailDexData} amertisData={amertisDexData} />
            </TabsContent>

            <TabsContent value="degen" className="mt-6">
              <DegenTable data={degenData} />
            </TabsContent>

            <TabsContent value="monorail" className="mt-6">
              <PoolTable data={monorailData} />
            </TabsContent>

            <TabsContent value="staking" className="mt-6">
              <StakingTable
                aprMONVaultData={aprMONVaultData}
                magmaStakingData={magmaStakingData}
                aprMONVaultRedeemData={aprMONVaultRedeemData}
                magmaStakingWithdrawData={magmaStakingWithdrawData}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <div className="gif-container">
        <img src="/1000012826.gif" alt="Miris" className="gif" />
      </div>

      {/* Interactive dance and port elements */}
      <div className="right">
        <div ref={danceRef} className="dance-container">
          <img src="/dance.gif" alt="Dance" className="dance-gif" />
        </div>

        <div
          ref={portRef}
          className={`port-container ${isPortHovered ? 'fixed' : ''}`}
          style={{
            top: portPosition.top,
          }}
          onMouseEnter={() => setIsPortHovered(true)}
          onMouseLeave={() => setIsPortHovered(false)}
        >
          <img src="/port.png" alt="Port" className="port-image" />
        </div>
      </div>
    </div>
  )
}
