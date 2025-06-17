'use client'

import { useQuery } from '@apollo/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowUpRight,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Zap,
  Activity,
} from 'lucide-react'
import { GET_AMERTIS_DEX_SWAPS } from '@/lib/graphql/queries'
import { formatTimeAgo, formatNumber, formatAddress } from '@/lib/helpers'
import Link from 'next/link'
import { MONAD_TESTNET_SCAN_URL } from '@/lib/utils'

export default function AmertisDexTable() {
  const { data, loading, error, refetch } = useQuery(GET_AMERTIS_DEX_SWAPS, {
    pollInterval: 10000, // Refresh every 10 seconds
  })

  const swaps = data?.Swap || []

  const formatTokenAmount = (amount: string) => {
    // Amertis might use different decimal places, let's try both
    const formatted18 = formatNumber(amount, true, 18)
    const formatted6 = formatNumber(amount, true, 6)

    // If the 18-decimal version is very small (< 0.001), try 6 decimals
    const amount18 = parseFloat(amount) / 1e18
    if (amount18 < 0.001 && amount18 > 0) {
      return formatted6
    }
    return formatted18
  }

  if (loading) {
    return (
      <Card className="custom-card">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <CardTitle className="text-lg font-display text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-white animate-spin" />
            </div>
            Amertis DEX Swaps
          </CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto">
              <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin" />
            </div>
            <p className="text-muted-foreground">
              Loading Amertis DEX Swaps...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="custom-card">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <CardTitle className="text-lg font-display text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            Error Loading Data
          </CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto">
              <Activity className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!swaps.length) {
    return (
      <Card className="custom-card">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <CardTitle className="text-lg font-display text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            Amertis DEX Swaps
          </CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-muted-foreground animate-pulse" />
            </div>
            <p className="text-muted-foreground">No swaps available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="custom-card py-0 gap-0">
      <CardHeader className="bg-muted/20 px-4 py-4 gap-0 border-b border-border/50 !pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-display font-medium text-foreground flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" />
            Amertis DEX Swaps
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
                  Time
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Token In
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Amount In
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Token Out
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Amount Out
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  User
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Timestamp
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Transaction
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {swaps.slice(0, 10).map((swap: any) => (
                <TableRow key={swap.id} className="enhanced-table-row">
                  <TableCell className="py-4">
                    <div className="text-sm text-foreground">
                      {formatTimeAgo(swap.db_write_timestamp)}
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="font-mono text-xs text-muted-foreground">
                      {formatAddress(swap._tokenIn)}
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-3 w-3 text-red-500" />
                      <span className="volume-text text-sm">
                        {formatTokenAmount(swap._amountIn)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="font-mono text-xs text-muted-foreground">
                      {formatAddress(swap._tokenOut)}
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="volume-text text-sm">
                        {formatTokenAmount(swap._amountOut)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="font-mono text-xs text-muted-foreground">
                      {formatAddress(swap.from)}
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <span className="text-sm text-muted-foreground font-mono">
                      {swap.timeStamp}
                    </span>
                  </TableCell>

                  <TableCell className="py-4">
                    <Link
                      href={`${MONAD_TESTNET_SCAN_URL}/tx/${swap.id}`}
                      target="_blank"
                      className="tx-link inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80"
                    >
                      <span className="font-mono">
                        {formatAddress(swap.id)}
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
  )
}
