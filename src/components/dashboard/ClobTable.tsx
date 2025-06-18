'use client'

import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Counter from '@/components/ui/animata/Counter'
import Ticker from '@/components/ui/animata/Ticker'

import { formatAddress, formatNumber, formatTimeAgo } from '@/lib/helpers'
import {
  ArrowUpRight,
  Activity,
  TrendingUp,
  TrendingDown,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { MONAD_TESTNET_SCAN_URL } from '@/lib/utils'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface KuruTrade {
  id: string
  isBuy: boolean
  blockHeight: number
  db_write_timestamp: number | string
  filledSize: number
  makerAddress: string
  orderBookAddress: string
  orderId: string
  price: number
  takerAddress: string
  transactionHash: string
  txOrigin: string
  updatedSize: number
}

interface ClobTableProps {
  clobData: { KuruOrderBook_Trade?: KuruTrade[] } | null | undefined
}

export default function ClobTable({ clobData }: ClobTableProps) {
  const trades = clobData?.KuruOrderBook_Trade || []
  const [isInitialLoad] = useState(true)

  //Calculate trade statistics
  const stats = useMemo(() => {
    if (!trades.length)
      return {
        totalVolume: 0,
        buyOrders: 0,
        sellOrders: 0,
        pieData: [],
        highVolumeTrades: [],
      }

    const totalVolume = trades.reduce((sum, trade) => sum + trade.filledSize, 0)
    const buyOrders = trades.filter((trade) => trade.isBuy).length
    const sellOrders = trades.length - buyOrders

    // Pie chart data for order distribution
    const pieData = [
      {
        name: 'Buy Orders',
        value: buyOrders,
        color: 'hsl(142, 76%, 36%)', // Green
      },
      {
        name: 'Sell Orders',
        value: sellOrders,
        color: 'hsl(0, 84%, 60%)', // Red
      },
    ]

    // Get high volume trades (>= 100 MON), sorted by size descending, take top 4
    const highVolumeTrades = trades
      .filter((trade) => trade.filledSize >= 100)
      .sort((a, b) => b.filledSize - a.filledSize)
      .slice(0, 3)

    return {
      totalVolume,
      buyOrders,
      sellOrders,
      pieData,
      highVolumeTrades,
    }
  }, [trades])

  if (!clobData || !trades.length) {
    return (
      <Card className="custom-card">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <CardTitle className="text-lg font-display text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <Ticker value="Kuru OrderBook Trades" />
          </CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto">
              <Activity className="w-8 h-8 text-muted-foreground animate-pulse" />
            </div>
            <p className="text-muted-foreground">
              {!clobData ? 'Loading trades...' : 'No trades available'}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Table */}
        <Card className="custom-card flex-1 py-0 gap-0">
          <CardHeader className="bg-muted/20 py-4 px-4 gap-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-display font-medium text-foreground">
                <Ticker value="CLOBs" />
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="enhanced-table px-2">
              <Table>
                <TableHeader>
                  <TableRow className="mx-auto border-b border-border/50 bg-muted/10">
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                      Protocol
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                      Volume
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                      Type
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                      Time
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                      Transaction
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.slice(0, 7).map((trade) => {
                    return (
                      <TableRow
                        key={trade.id}
                        className={`enhanced-table-row ${
                          isInitialLoad
                            ? 'table-row-staggered'
                            : 'table-row-enter'
                        }`}
                      >
                        <TableCell className="py-4">
                          <div className="font-medium text-foreground">
                            <Ticker value="Kuru" />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Block #
                            <Counter
                              targetValue={trade.blockHeight}
                              format={(v) => Math.floor(v).toLocaleString()}
                            />
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="volume-text text-base">
                              <Counter
                                targetValue={trade.filledSize}
                                format={(v) => formatNumber(v, true, 10)}
                                className="text-foreground"
                              />{' '}
                              MON
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`trade-badge ${
                                trade.isBuy
                                  ? 'trade-badge-buy'
                                  : 'trade-badge-sell'
                              }`}
                            >
                              {trade.isBuy ? (
                                <TrendingUp className="w-3 h-3 mr-1" />
                              ) : (
                                <TrendingDown className="w-3 h-3 mr-1" />
                              )}
                              {trade.isBuy ? 'BUY' : 'SELL'}
                            </Badge>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="text-sm text-foreground">
                              {formatTimeAgo(
                                trade.db_write_timestamp as string,
                              )}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <Link
                            href={`${MONAD_TESTNET_SCAN_URL}/tx/${trade.transactionHash}`}
                            target="_blank"
                            className="tx-link inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80"
                          >
                            <span className="font-mono">
                              {formatAddress(trade.transactionHash)}
                            </span>
                            <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Stats Sidebar */}
        <Card className="custom-card py-0 gap-0 min-w-80">
          <CardHeader className="bg-muted/20 px-4 py-4 gap-0 border-b border-border/50 !pb-4">
            <CardTitle className="text-base font-display text-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <Ticker value="Trading Stats" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {/* Order Distribution Pie Chart */}
            <div className="">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                Order Distribution
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
                        `${value} orders`,
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

              {/* Legend */}
              <div className="flex justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                  <span className="text-xs">
                    Buys (<Counter targetValue={stats.buyOrders} />)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
                  <span className="text-xs">
                    Sells (<Counter targetValue={stats.sellOrders} />)
                  </span>
                </div>
              </div>
            </div>

            {/* High Volume Trades */}
            <div className="mt-10">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                High Volume Trades (≥100 MON)
              </div>
              <div className="space-y-2 mt-4">
                {stats.highVolumeTrades.length > 0 ? (
                  stats.highVolumeTrades.map((trade) => (
                    <div
                      key={trade.id}
                      className="flex flex-row p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 gap-3"
                    >
                      {/* Left side - B/S indicator */}
                      <div className="flex items-center">
                        <Badge
                          variant={trade.isBuy ? 'default' : 'secondary'}
                          className={`text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center ${
                            trade.isBuy
                              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                              : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                          }`}
                        >
                          {trade.isBuy ? 'B' : 'S'}
                        </Badge>
                      </div>

                      {/* Right side - Size and tx hash */}
                      <div className="flex-1 space-y-1">
                        <div className="text-sm font-medium font-mono">
                          <Counter
                            targetValue={trade.filledSize}
                            format={(v) => formatNumber(v, true, 10)}
                          />{' '}
                          MON
                        </div>
                        <Link
                          href={`${MONAD_TESTNET_SCAN_URL}/tx/${trade.transactionHash}`}
                          target="_blank"
                          className="text-xs text-muted-foreground hover:text-accent transition-colors font-mono"
                        >
                          {formatAddress(trade.transactionHash)}
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground text-center py-4">
                    No high volume trades available
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
