'use client'

import { useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  KuruOrderBook_Trade,
  KuruDeployer_PumpingTime,
  WormholeRelayer_Combined,
  AprMonTVL1D,
} from '@/lib/graphql/queries'
import PoolTable from './PoolTable'
import PumpingTimeTable from './PumpingTimeTable'
import InteroperabilityTable from './InteroperabilityTable'
import StakingTable from './StakingTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  RefreshCw,
  Search,
  Activity,
  Rocket,
  Globe,
  TrendingUp,
} from 'lucide-react'

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')

  const {
    data: orderBookData,
    loading: orderBookLoading,
    error: orderBookError,
  } = useQuery(KuruOrderBook_Trade)

  const {
    data: pumpingTimeData,
    loading: pumpingTimeLoading,
    error: pumpingTimeError,
  } = useQuery(KuruDeployer_PumpingTime)

  const {
    data: interoperabilityData,
    loading: interoperabilityLoading,
    error: interoperabilityError,
  } = useQuery(WormholeRelayer_Combined)

  const {
    data: stakingData,
    loading: stakingLoading,
    error: stakingError,
  } = useQuery(AprMonTVL1D)

  console.log('Order Book Data:', orderBookData)
  console.log('Loading:', orderBookLoading)
  console.log('Error:', orderBookError)
  console.log('Pumping Time Data:', pumpingTimeData)
  console.log('Pumping Time Loading:', pumpingTimeLoading)
  console.log('Pumping Time Error:', pumpingTimeError)
  console.log('Interoperability Data:', interoperabilityData)
  console.log('Interoperability Loading:', interoperabilityLoading)
  console.log('Interoperability Error:', interoperabilityError)
  console.log('Staking Data:', stakingData)
  console.log('Staking Loading:', stakingLoading)
  console.log('Staking Error:', stakingError)

  const formatNumber = (num: number) => {
    if (num >= 1e12) {
      return `$${(num / 1e12).toFixed(2)}T`
    } else if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`
    }
    return `$${num.toFixed(2)}`
  }

  const isLoading =
    orderBookLoading ||
    pumpingTimeLoading ||
    interoperabilityLoading ||
    stakingLoading
  const hasError =
    orderBookError || pumpingTimeError || interoperabilityError || stakingError

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Kuru Protocol data...</p>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading data:</p>
          {orderBookError && (
            <p className="text-muted-foreground text-sm mb-2">
              OrderBook: {orderBookError.message}
            </p>
          )}
          {pumpingTimeError && (
            <p className="text-muted-foreground text-sm mb-2">
              PumpingTime: {pumpingTimeError.message}
            </p>
          )}
          {interoperabilityError && (
            <p className="text-muted-foreground text-sm mb-2">
              Interoperability: {interoperabilityError.message}
            </p>
          )}
          {stakingError && (
            <p className="text-muted-foreground text-sm">
              Staking: {stakingError.message}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Kuru Protocol Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-time Kuru protocol data visualization and cross-chain
              interoperability
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="pl-10 w-64"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs for different data views */}
        <Tabs defaultValue="orderbook" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[800px]">
            <TabsTrigger value="orderbook" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Order Book
            </TabsTrigger>
            <TabsTrigger value="deployer" className="flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Deployer
            </TabsTrigger>
            <TabsTrigger
              value="interoperability"
              className="flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Interoperability
            </TabsTrigger>
            <TabsTrigger value="staking" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Staking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orderbook" className="mt-6">
            <PoolTable pools={orderBookData} />
          </TabsContent>

          <TabsContent value="deployer" className="mt-6">
            <PumpingTimeTable pools={pumpingTimeData} />
          </TabsContent>

          <TabsContent value="interoperability" className="mt-6">
            <InteroperabilityTable data={interoperabilityData} />
          </TabsContent>

          <TabsContent value="staking" className="mt-6">
            <StakingTable data={stakingData} />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-muted-foreground py-8">
          <p>
            Data updated every 30 seconds • Powered by GraphQL & Apollo Client
          </p>
        </div>
      </div>
    </div>
  )
}
