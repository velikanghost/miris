import { formatTimeAgo, formatAddress, formatNumber } from '@/lib/helpers'
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Activity,
  Zap,
  ArrowRight,
} from 'lucide-react'
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

interface MonorailSwap {
  id: string
  db_write_timestamp: number | string
  amountIn: number
  amountOut: number
  tokenInAddress: string
  tokenOutAddress: string
  userAddress: string
  exchangeName: string
  exchangeAddress: string
  fee: number
  gasUsed: number
  gasPrice: number
  timestamp: number
  transactionHash: string
}

interface AmertisSwap {
  id: string
  db_write_timestamp: string
  from: string
  _tokenIn: string
  _tokenOut: string
  _amountIn: string
  _amountOut: string
  timeStamp: string
}

// Normalized swap interface for display
interface NormalizedSwap {
  id: string
  transactionHash: string
  db_write_timestamp: string
  exchangeName: string
  tokenIn: string
  tokenOut: string
  amountIn: number
  amountOut: number
  userAddress: string
  timestamp: string
}

interface DexTableProps {
  data: {
    SwapEvent?: MonorailSwap[]
  }
  amertisData?: {
    Swap?: AmertisSwap[]
  }
}

const DexTable = ({ data, amertisData }: DexTableProps) => {
  const monorailDexSwaps = data?.SwapEvent || []
  const amertisDexSwaps = amertisData?.Swap?.slice(0, 10) || []
  const [isInitialLoad] = useState(true)

  // Token data hook for resolving addresses to names/symbols
  const {
    tokens,
    getTokenInfo,
    loading: tokenLoading,
    error: tokenError,
  } = useTokenData()

  // Normalize Monorail data
  const normalizedMonorailSwaps: NormalizedSwap[] = monorailDexSwaps.map(
    (swap) => ({
      id: swap.id,
      transactionHash: swap.transactionHash,
      db_write_timestamp: String(swap.db_write_timestamp),
      exchangeName: swap.exchangeName || 'Monorail',
      tokenIn: swap.tokenInAddress,
      tokenOut: swap.tokenOutAddress,
      amountIn: swap.amountIn,
      amountOut: swap.amountOut,
      userAddress: swap.userAddress,
      timestamp: String(swap.timestamp),
    }),
  )

  // Normalize Amertis data
  const normalizedAmertisSwaps: NormalizedSwap[] = amertisDexSwaps.map(
    (swap) => ({
      id: swap.id,
      transactionHash: swap.id, // id is the transaction hash for Amertis
      db_write_timestamp: swap.db_write_timestamp,
      exchangeName: 'Amertis',
      tokenIn: swap._tokenIn,
      tokenOut: swap._tokenOut,
      amountIn: parseFloat(swap._amountIn),
      amountOut: parseFloat(swap._amountOut),
      userAddress: swap.from,
      timestamp: swap.timeStamp,
    }),
  )

  // Combine and sort by timestamp (most recent first)
  const allSwaps = [...normalizedMonorailSwaps, ...normalizedAmertisSwaps].sort(
    (a, b) => {
      const timestampA = parseInt(a.timestamp) || 0
      const timestampB = parseInt(b.timestamp) || 0
      return timestampB - timestampA
    },
  )

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
      'octoswap-v2': 'hsl(217, 91%, 60%)', // Blue
      'monda-v2': 'hsl(271, 81%, 56%)', // Purple
      'crystal-ob': 'hsl(142, 76%, 36%)', // Green
      'uniswap-v3': 'hsl(25, 95%, 53%)', // Orange
      'zkswap-v2': 'hsl(330, 81%, 60%)', // Pink
      'bean-v2': 'hsl(45, 93%, 47%)', // Yellow
      'monad-wrapper': 'hsl(195, 85%, 50%)', // Cyan
      'kuru-ob': 'hsl(15, 86%, 55%)', // Red-Orange
      'madness-v2': 'hsl(255, 75%, 65%)', // Indigo
      'uniswap-v2': 'hsl(180, 70%, 50%)', // Teal
      'pancakeswap-v2': 'hsl(120, 65%, 55%)', // Lime
      amertis: 'hsl(300, 70%, 60%)', // Violet
      'atlantis-v2': 'hsl(200, 85%, 60%)', // Sky Blue
      'nadfun-v2': 'hsl(350, 80%, 65%)', // Coral
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
      'octoswap-v2':
        'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
      'crystal-ob':
        'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
      'monda-v2':
        'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
      'uniswap-v3':
        'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200',
      'zkswap-v2':
        'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200',
      'bean-v2':
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
      'monad-wrapper':
        'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-200',
      'kuru-ob': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
      'madness-v2':
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200',
      'uniswap-v2':
        'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200',
      'pancakeswap-v2':
        'bg-lime-100 text-lime-800 dark:bg-lime-900/50 dark:text-lime-200',
      amertis:
        'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200',
      'atlantis-v2':
        'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200',
      'nadfun-v2':
        'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200',
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
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      Time
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      Transaction
                    </TableHead>
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
                          {formatAddress(swap.userAddress)}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground">
                          {formatTimeAgo(swap.db_write_timestamp)}
                        </div>
                      </TableCell>

                      <TableCell className="py-4 whitespace-nowrap">
                        <Link
                          href={`${MONAD_TESTNET_SCAN_URL}/tx/${swap.transactionHash}`}
                          target="_blank"
                          className="tx-link inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80"
                        >
                          <span className="font-mono">
                            {formatAddress(swap.transactionHash)}
                          </span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </TableCell>
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
                {stats.topRoutes.map((route, index) => (
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
