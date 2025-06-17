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
import { Button } from '@/components/ui/button'
import {
  ExternalLink,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Zap,
} from 'lucide-react'
import { GET_AMERTIS_DEX_SWAPS } from '@/lib/graphql/queries'
import { formatTimeAgo, formatNumber, formatAddress } from '@/lib/helpers'

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading Amertis DEX Swaps...
          </CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <Button onClick={() => refetch()} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Amertis DEX Swaps
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Token In</TableHead>
                <TableHead>Amount In</TableHead>
                <TableHead>Token Out</TableHead>
                <TableHead>Amount Out</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {swaps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">No swaps found</p>
                  </TableCell>
                </TableRow>
              ) : (
                swaps.slice(0, 10).map((swap: any) => (
                  <TableRow key={swap.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {formatTimeAgo(swap.db_write_timestamp)}
                    </TableCell>

                    <TableCell>
                      <div className="font-mono text-xs">
                        {formatAddress(swap._tokenIn)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="h-3 w-3 text-red-500" />
                        <span className="font-medium text-red-600">
                          {formatTokenAmount(swap._amountIn)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-mono text-xs">
                        {formatAddress(swap._tokenOut)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="font-medium text-green-600">
                          {formatTokenAmount(swap._amountOut)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-mono text-xs">
                        {formatAddress(swap.from)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm text-muted-foreground font-mono">
                        {swap.timeStamp}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">
                          {formatAddress(swap.id)}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() =>
                            window.open(
                              `https://explorer.monad.xyz/tx/${swap.id}`,
                              '_blank',
                            )
                          }
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
