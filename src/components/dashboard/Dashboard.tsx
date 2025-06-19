'use client'

import { useQuery } from '@apollo/client'
import { useEffect, useRef, useState, useMemo } from 'react'
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
import { Badge } from '../ui/badge'

// Data interfaces for ChainSummary
interface EpochData {
  block_num: string
  blocks_completed: string
  boundary_phase_completion_percentage: number
  boundary_phase_remaining_percentage: number
  epoch: string
  round: string
  timestamp: string
}

interface BlockData {
  BlockNum: number
  Author: string
  AuthorNodeID: string
  NumTx: number
  Round: string
  Timestamp: string
  Epoch: number
}

interface ChainData {
  bucket: string
  blocks: string
  txs: string
  avg_bps: number
  avg_tps: number
  total_gas: string
  avg_tx_per_block: number
  avg_gas_per_block: number
  avg_base_fee_per_tx: number
  avg_priority_fee_per_tx: number
  avg_gas_price: number
  max_tx: number
  avg_block_time_s: string
  avg_block_fullness_pct: number
}

export default function Dashboard() {
  // Simple dark mode toggle using Tailwind's built-in system
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
  }

  const danceRef = useRef<HTMLDivElement>(null)

  // Chain data state management
  const [epochData, setEpochData] = useState<EpochData | null>(null)
  const [recentBlocks, setRecentBlocks] = useState<BlockData[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [realTimeBPS] = useState(0)
  const [avgBlockTime] = useState(0)
  const [httpData, setHttpData] = useState<ChainData | null>(null)
  const [httpLoading, setHttpLoading] = useState(true)

  // Calculate TPS from recent blocks using useMemo
  const realTimeTPS = useMemo(() => {
    if (recentBlocks.length < 2) return 0

    const recent5Blocks = recentBlocks.slice(0, 5)
    const totalTxs = recent5Blocks.reduce((sum, block) => sum + block.NumTx, 0)
    const timeSpan =
      (new Date(recent5Blocks[0].Timestamp).getTime() -
        new Date(recent5Blocks[recent5Blocks.length - 1].Timestamp).getTime()) /
      1000

    return timeSpan > 0 ? totalTxs / timeSpan : 0
  }, [recentBlocks])

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
    magmaStakingWithdrawLoading ||
    httpLoading
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

  // SSE Connection for chain data
  useEffect(() => {
    let eventSource: EventSource | null = null

    const connectSSE = () => {
      try {
        eventSource = new EventSource('https://proxy-tn.gmonads.com/sse')

        eventSource.onopen = () => {
          setIsConnected(true)
          setConnectionError(null)
        }

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)

            switch (data.type) {
              case 'latestEpoch':
                setEpochData(data.payload)
                break

              case 'block_proposal':
                const newBlock = data.payload
                setRecentBlocks((prev) => [newBlock, ...prev.slice(0, 3)]) // Keep 4 most recent, show real data
                break
            }
          } catch (error) {
            console.warn('Failed to parse SSE data:', error)
          }
        }

        eventSource.onerror = (error) => {
          console.error('SSE connection error:', error)
          setIsConnected(false)
          setConnectionError('Connection lost, attempting to reconnect...')

          // Attempt to reconnect after 5 seconds
          setTimeout(() => {
            if (eventSource) {
              eventSource.close()
            }
            connectSSE()
          }, 5000)
        }
      } catch (error) {
        console.error('Failed to establish SSE connection:', error)
        setConnectionError('Failed to connect to real-time data')
      }
    }

    connectSSE()

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [])

  // Fallback HTTP polling for chain data
  useEffect(() => {
    const fetchHttpData = async () => {
      try {
        const response = await fetch('/api/gmonads')
        const result = await response.json()
        if (result.data && result.data.length > 0) {
          setHttpData(result.data[0])
        }
      } catch (error) {
        console.error('HTTP fallback failed:', error)
      } finally {
        setHttpLoading(false)
      }
    }

    fetchHttpData()
    const interval = setInterval(fetchHttpData, 60000)
    return () => clearInterval(interval)
  }, [])

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
        <img src="/anago_loading.gif" alt="Loading" className="w-32 h-32" />
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
              Joon wet himself
            </h2>
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
            <div className="flex items-center gap-3 md:gap-4">
              <div className="relative h-[48px] w-[48px] md:h-[62px] md:w-[62px]">
                <Image
                  src="/logo-removebg-preview.png"
                  alt="Miris"
                  width={62}
                  height={62}
                  className="object-cover w-full h-full border-2 border-accent rounded-xl p-[1px]"
                />
              </div>

              <div className="flex flex-col gap-0">
                <h1 className="text-2xl md:text-3xl font-zen-dots text-gradient">
                  Miris
                </h1>
                <TypingText
                  text="Real-time visualizer"
                  className="text-xs text-muted-foreground"
                  waitTime={1000}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Badge className="hidden md:flex items-center gap-3 bg-muted/80">
                <div className="flex items-center gap-1 p-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">
                    Testnet-1
                  </span>
                </div>
              </Badge>
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
              <ChainSummary
                epochData={epochData}
                recentBlocks={recentBlocks}
                isConnected={isConnected}
                connectionError={connectionError}
                realTimeTPS={realTimeTPS}
                realTimeBPS={realTimeBPS}
                avgBlockTime={avgBlockTime}
                httpData={httpData}
                httpLoading={httpLoading}
              />
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

      <div className="hidden md:block gif-container">
        <img src="/1000012826.gif" alt="Miris" className="gif" />
      </div>

      {/* Interactive dance element */}
      <div className="right">
        <div ref={danceRef} className="dance-container">
          <img src="/dance.gif" alt="Dance" className="dance-gif" />
        </div>
      </div>
    </div>
  )
}
