'use client'

import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
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

export default function Dashboard() {
  // Simple dark mode toggle using Tailwind's built-in system
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
  }

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
              {orderBookError && (
                <p className="custom-card p-3">
                  <span className="font-medium text-destructive">
                    OrderBook:
                  </span>{' '}
                  {orderBookError.message}
                </p>
              )}

              {degenError && (
                <p className="custom-card p-3">
                  <span className="font-medium text-destructive">Degen:</span>{' '}
                  {degenError.message}
                </p>
              )}
              {monorailError && (
                <p className="custom-card p-3">
                  <span className="font-medium text-destructive">
                    Monorail:
                  </span>{' '}
                  {monorailError.message}
                </p>
              )}
              {monorailDexError && (
                <p className="custom-card p-3">
                  <span className="font-medium text-destructive">
                    Monorail DEX:
                  </span>{' '}
                  {monorailDexError.message}
                </p>
              )}
              {aprMONVaultError && (
                <p className="custom-card p-3">
                  <span className="font-medium text-destructive">
                    AprMON Vault:
                  </span>{' '}
                  {aprMONVaultError.message}
                </p>
              )}
              {magmaStakingError && (
                <p className="custom-card p-3">
                  <span className="font-medium text-destructive">
                    Magma Staking:
                  </span>{' '}
                  {magmaStakingError.message}
                </p>
              )}
              {aprMONVaultRedeemError && (
                <p className="custom-card p-3">
                  <span className="font-medium text-destructive">
                    AprMON Vault Redeem:
                  </span>{' '}
                  {aprMONVaultRedeemError.message}
                </p>
              )}
              {magmaStakingWithdrawError && (
                <p className="custom-card p-3">
                  <span className="font-medium text-destructive">
                    Magma Staking Withdraw:
                  </span>{' '}
                  {magmaStakingWithdrawError.message}
                </p>
              )}
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
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-accent via-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-xl blur opacity-60"></div>
              </div>

              <div>
                <h1 className="text-3xl font-display text-gradient">Miris</h1>
                <TypingText
                  text="Real-time monad testnet-1 visualizer"
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
    </div>
  )
}
