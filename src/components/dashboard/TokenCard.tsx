'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface TokenCardProps {
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: number
  marketCap: number
}

export default function TokenCard({
  symbol,
  name,
  price,
  change24h,
  volume24h,
  marketCap,
}: TokenCardProps) {
  const isPositive = change24h >= 0

  const formatNumber = (num: number) => {
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`
    } else if (num >= 1e3) {
      return `$${(num / 1e3).toFixed(2)}K`
    }
    return `$${num.toFixed(2)}`
  }

  return (
    <Card className="crypto-card crypto-glow hover:scale-105 transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
              {symbol.slice(0, 2)}
            </div>
            <div>
              <div className="font-semibold">{symbol}</div>
              <div className="text-xs text-muted-foreground">{name}</div>
            </div>
          </div>
        </CardTitle>
        <Badge
          variant={isPositive ? 'default' : 'destructive'}
          className={`${
            isPositive
              ? 'crypto-positive bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'crypto-negative'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1" />
          )}
          {isPositive ? '+' : ''}
          {change24h.toFixed(2)}%
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          {formatNumber(price)}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <p className="text-muted-foreground">Volume 24h</p>
            <p className="font-semibold">{formatNumber(volume24h)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Market Cap</p>
            <p className="font-semibold">{formatNumber(marketCap)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
