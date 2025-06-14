'use client'

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

interface KuruTrade {
  id: string
  isBuy: boolean
  blockHeight: number
  db_write_timestamp: number
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

interface PoolTableProps {
  pools: { KuruOrderBook_Trade?: KuruTrade[] } | null | undefined
}

export default function PoolTable({ pools }: PoolTableProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e9) {
      return `${(num / 1e9).toFixed(2)}B`
    } else if (num >= 1e6) {
      return `${(num / 1e6).toFixed(2)}M`
    } else if (num >= 1e3) {
      return `${(num / 1e3).toFixed(2)}K`
    }
    return `${num.toFixed(2)}`
  }

  const formatPrice = (num: number) => {
    return `$${num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })}`
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const trades = pools?.KuruOrderBook_Trade || []

  if (!pools || !trades.length) {
    return (
      <Card className="crypto-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">
            Kuru OrderBook Trades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            {!pools ? 'Loading trades...' : 'No trades available'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="crypto-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          Kuru OrderBook Trades
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Maker/Taker</TableHead>
                <TableHead>Filled Size</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Block Height</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.slice(0, 20).map((trade) => {
                return (
                  <TableRow key={trade.id} className="hover:bg-accent/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-background">
                            M
                          </div>
                          <div className="w-6 h-6 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-background">
                            T
                          </div>
                        </div>
                        <div className="text-xs">
                          <div>Maker: {formatAddress(trade.makerAddress)}</div>
                          <div>Taker: {formatAddress(trade.takerAddress)}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      {formatNumber(trade.filledSize)}
                    </TableCell>
                    <TableCell className="crypto-positive">
                      {formatPrice(trade.price)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={trade.isBuy ? 'default' : 'secondary'}
                        className={
                          trade.isBuy
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }
                      >
                        {trade.isBuy ? 'Buy' : 'Sell'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {trade.blockHeight.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {trade.db_write_timestamp}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        {trades.length > 10 && (
          <div className="text-center mt-4 text-sm text-muted-foreground">
            Showing 10 of {trades.length} trades
          </div>
        )}
      </CardContent>
    </Card>
  )
}
