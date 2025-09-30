import {
  formatAddress,
  formatEther,
  formatNumber,
  formatPrice,
} from '@/lib/helpers'
import { ArrowUpRight, Activity, Zap, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../ui/table'
import Link from 'next/link'
import { MONAD_TESTNET_SCAN_URL } from '@/lib/utils'
import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useTokenData } from '@/lib/hooks/useTokenData'

interface AmbientSwap {
  id: string
  base: string
  baseFlow: string
  inBaseQty: boolean
  isBuy: boolean
  limitPrice: string
  minOut: string
  poolIdx: string
  qty: string
  quote: string
  quoteFlow: string
  reserveFlags: string
  tip: string
}

interface CloberSwap {
  id: string
  amountIn: string
  amountOut: string
  inToken: string
  method: string
  outToken: string
  router: string
  user: string
}

// Normalized swap interface for display
interface NormalizedSwap {
  id: string
  transactionHash: string
  exchangeName: string
  tokenIn: string
  tokenOut: string
  amountIn: number
  amountOut: number
  userAddress: string
}

interface DexTableProps {
  ambientData?: {
    Ambient_CrocSwap?: AmbientSwap[]
  }
  cloberData?: {
    Clober_Swap?: CloberSwap[]
  }
}

const DexTable = ({ ambientData, cloberData }: DexTableProps) => {
  const ambientSwaps = ambientData?.Ambient_CrocSwap || []
  const cloberSwaps = cloberData?.Clober_Swap || []
  const [isInitialLoad] = useState(true)

  // Token data hook for resolving addresses to names/symbols
  const {
    getTokenInfo,
    loading: tokenLoading,
    error: tokenError,
  } = useTokenData()

  // Normalize Ambient data
  const normalizedAmbientSwaps: NormalizedSwap[] = ambientSwaps.map((swap) => ({
    id: swap.id,
    transactionHash: swap.id, // Use id as transaction hash
    exchangeName: 'Ambient',
    tokenIn: swap.isBuy ? swap.quote : swap.base,
    tokenOut: swap.isBuy ? swap.base : swap.quote,
    amountIn: parseFloat(swap.qty),
    amountOut: parseFloat(swap.qty), // Simplified for now
    userAddress: swap.id, // Use id as user address placeholder
  }))

  // Normalize Clober data
  const normalizedCloberSwaps: NormalizedSwap[] = cloberSwaps.map((swap) => ({
    id: swap.id,
    transactionHash: swap.id, // Use id as transaction hash
    exchangeName: 'Clober',
    tokenIn: swap.inToken,
    tokenOut: swap.outToken,
    amountIn: parseFloat(swap.amountIn),
    amountOut: parseFloat(swap.amountOut),
    userAddress: swap.user,
  }))

  // Combine data (no sorting since we don't have timestamps)
  const allSwaps = [...normalizedAmbientSwaps, ...normalizedCloberSwaps]

  // Calculate swap statistics
  const stats = useMemo(() => {
    if (!allSwaps.length)
      return {
        totalVolume: 0,
        exchangeCounts: {},
        pieData: [],
        topRoutes: [],
      }

    const totalVolume = allSwaps.reduce((sum, swap) => sum + swap.amountIn, 0)

    // Count swaps by exchange
    const exchangeCounts = allSwaps.reduce((acc, swap) => {
      acc[swap.exchangeName] = (acc[swap.exchangeName] || 0) + 1
      return acc
    }, {} as { [key: string]: number })

    // Pie chart data for exchange distribution
    const exchangeColors: { [key: string]: string } = {
      Ambient: 'hsl(217, 91%, 60%)', // Blue
      Clober: 'hsl(142, 76%, 36%)', // Green
    }

    const pieData = Object.entries(exchangeCounts).map(([exchange, count]) => ({
      name: exchange,
      value: count,
      color: exchangeColors[exchange] || 'hsl(210, 40%, 60%)',
    }))

    // Get top 5 routes sorted by swap count
    const topRoutes = Object.entries(exchangeCounts)
      .map(([exchange, count]) => ({
        name: exchange,
        swaps: count,
        color: exchangeColors[exchange] || 'hsl(210, 40%, 60%)',
        // Calculate percentage for bar width
        percentage: exchangeCounts
          ? (count / Math.max(...Object.values(exchangeCounts))) * 100
          : 0,
      }))
      .sort((a, b) => b.swaps - a.swaps)
      .slice(0, 5)

    return {
      totalVolume,
      exchangeCounts,
      pieData,
      topRoutes,
    }
  }, [allSwaps])

  const getExchangeBadgeColor = (exchangeName: string) => {
    const colors: { [key: string]: string } = {
      Ambient:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
      Clober:
        'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
      default:
        'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200',
    }
    return colors[exchangeName] || colors.default
  }

  if (!allSwaps.length) {
    return (
      <Card className="custom-card">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <CardTitle className="text-lg font-display text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            DEX Swaps
          </CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto">
              <Activity className="w-8 h-8 text-muted-foreground animate-pulse" />
            </div>
            <p className="text-muted-foreground">
              {tokenLoading ? 'Loading token data...' : 'No swaps available'}
            </p>
            {tokenError && (
              <p className="text-red-500 text-sm">
                Token resolution error: {tokenError}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row gap-6 min-w-0">
        {/* Main Table */}
        <Card className="custom-card flex-1 min-w-0 py-0 gap-0">
          <CardHeader className="bg-muted/20 py-4 px-4 gap-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-display font-medium text-foreground flex items-center gap-2">
                DEX Swaps
                {tokenLoading && (
                  <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                )}
              </CardTitle>
              <div className="flex items-center gap-3">
                {tokenError && (
                  <span className="text-xs text-red-500">Token Error</span>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground">Live</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="enhanced-table px-2 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="mx-auto border-b border-border/50 bg-muted/10">
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      Exchange
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      Swap
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      Size
                    </TableHead>
                    {/* <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  User
                    </TableHead> */}
                    {/* <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      Transaction
                    </TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allSwaps.slice(0, 7).map((swap: NormalizedSwap) => (
                    <TableRow
                      key={`${swap.exchangeName}-${swap.id}`}
                      className={`enhanced-table-row ${
                        isInitialLoad
                          ? 'table-row-staggered'
                          : 'table-row-enter'
                      }`}
                    >
                      <TableCell className="py-4 whitespace-nowrap">
                        <Badge
                          className={getExchangeBadgeColor(swap.exchangeName)}
                        >
                          {swap.exchangeName}
                        </Badge>
                      </TableCell>

                      <TableCell className="py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-sm text-foreground">
                            {getTokenInfo(swap.tokenIn).displayName}
                          </div>
                          <ArrowRight className="w-3 h-3 text-muted-foreground" />
                          <div className="font-medium text-sm text-foreground">
                            {getTokenInfo(swap.tokenOut).displayName}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4 whitespace-nowrap">
                        <div className="font-mono text-xs text-muted-foreground">
                          {formatEther(swap.amountOut)}
                        </div>
                      </TableCell>

                      {/* <TableCell className="py-4 whitespace-nowrap">
                        <Link
                          href={`${MONAD_TESTNET_SCAN_URL}/tx/${swap.transactionHash}`}
                          target="_blank"
                          className="tx-link inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80"
                        >
                          <span className="font-mono">
                            {formatAddress(swap.)}
                          </span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Stats Sidebar */}
        <Card className="custom-card py-0 gap-0 min-w-80 lg:w-80 lg:flex-shrink-0">
          <CardHeader className="bg-muted/20 px-4 py-4 gap-0 border-b border-border/50 !pb-4">
            <CardTitle className="text-base font-display text-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              Swap Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {/* Exchange Distribution Pie Chart */}
            <div className="">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                Exchange Distribution
              </div>

              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={60}
                      paddingAngle={1}
                      dataKey="value"
                    >
                      {stats.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `${value} swaps`,
                        name,
                      ]}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top 7 Routes */}
            <div className="mt-8">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
                Top Routes
              </div>
              <div className="space-y-3">
                {stats.topRoutes.map((route) => (
                  <div key={route.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {route.name}
                      </span>
                      <span className="text-sm font-mono text-foreground">
                        {route.swaps.toLocaleString()} swaps
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300 ease-out"
                        style={{
                          width: `${route.percentage}%`,
                          backgroundColor: route.color,
                        }}
                      />
                    </div>
                  </div>
                ))}

                {stats.topRoutes.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-4">
                    No routes available
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DexTable
