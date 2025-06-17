'use client'

import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../ui/table'

interface AprMonData {
  id: string
  db_write_timestamp: string
  lastUpdatedTimestamp: string
  openTimestamp: string
  c: string // Close TVL (in Wei)
  h: string // High TVL (in Wei)
  l: string // Low TVL (in Wei)
  o: string // Open TVL (in Wei)
}

interface StakingDataResponse {
  AprMonTVL1D: AprMonData[]
}

interface MultiTVLDashboardProps {
  stakingData: StakingDataResponse
}

export default function MultiTVLDashboard({
  stakingData,
}: MultiTVLDashboardProps) {
  // Get the actual array from the stakingData response
  const dataArray = stakingData?.AprMonTVL1D || []

  // Calculate percentage change
  const calculateChange = (open: number, close: number) => {
    return ((close - open) / open) * 100
  }

  // Handle empty data case
  if (!dataArray || dataArray.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center p-8">
          <p className="text-muted-foreground">No TVL data available</p>
        </div>
      </div>
    )
  }

  // Process data for calculations and charts
  const processedData = dataArray
    .map((item: AprMonData) => {
      const open = item.o
      const high = item.h
      const low = item.l
      const close = item.c
      const change = calculateChange(Number(open), Number(close))

      return {
        ...item,
        openEth: open,
        highEth: high,
        lowEth: low,
        closeEth: close,
        change,
        timestamp: parseInt(item.openTimestamp) * 1000,
        formattedDate: new Date(
          parseInt(item.openTimestamp) * 1000,
        ).toLocaleDateString(),
      }
    })
    .sort((a: any, b: any) => a.timestamp - b.timestamp)

  // Format percentage change
  const formatPercentage = (num: number) => {
    return `${num.toFixed(2)}%`
  }

  // Get change indicator styling
  const getChangeIndicator = (change: number) => {
    const isPositive = change >= 0
    return {
      icon: isPositive ? TrendingUp : TrendingDown,
      className: isPositive ? 'crypto-positive' : 'crypto-negative',
      prefix: isPositive ? '+' : '',
    }
  }

  // Get candlestick visualization data
  const getCandlestickIndicator = (
    o: number,
    h: number,
    l: number,
    c: number,
  ) => {
    const isGreen = c >= o // Bullish if close >= open
    const bodyHeight = Math.abs(c - o)
    const upperWick = h - Math.max(o, c)
    const lowerWick = Math.min(o, c) - l

    return {
      isGreen,
      bodyHeight,
      upperWick,
      lowerWick,
      range: h - l,
    }
  }

  return (
    <div className="space-y-8">
      {/* Data Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead>Open TVL</TableHead>
              <TableHead>High TVL</TableHead>
              <TableHead>Low TVL</TableHead>
              <TableHead>Close TVL</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Candlestick</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.slice(0, 10).map((item: any) => {
              const changeInfo = getChangeIndicator(item.change)
              const candlestick = getCandlestickIndicator(
                item.openEth,
                item.highEth,
                item.lowEth,
                item.closeEth,
              )
              const IconComponent = changeInfo.icon

              return (
                <TableRow key={item.id} className="hover:bg-accent/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        📊
                      </div>
                      <div className="text-sm">
                        <div className="font-semibold">
                          {item.openTimestamp}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Period Start
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      {item.openEth} ETH
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {item.highEth} ETH
                  </TableCell>
                  <TableCell className="font-semibold text-red-600 dark:text-red-400">
                    {item.lowEth} ETH
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-gray-50 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                    >
                      {item.closeEth} ETH
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`flex items-center gap-1 ${changeInfo.className}`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="font-semibold">
                        {changeInfo.prefix}
                        {formatPercentage(Math.abs(item.change))}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <div className="relative w-8 h-12 bg-gray-200 dark:bg-gray-700 rounded-sm overflow-hidden">
                        {/* Candlestick visualization */}
                        <div className="absolute inset-x-0 flex flex-col justify-center items-center h-full">
                          {/* Upper wick */}
                          <div
                            className="w-0.5 bg-gray-600 dark:bg-gray-300"
                            style={{
                              height: `${Math.max(
                                (candlestick.upperWick / candlestick.range) *
                                  40,
                                0,
                              )}%`,
                            }}
                          />
                          {/* Body */}
                          <div
                            className={`w-4 ${
                              candlestick.isGreen
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`}
                            style={{
                              height: `${Math.max(
                                (candlestick.bodyHeight / candlestick.range) *
                                  40,
                                2,
                              )}%`,
                            }}
                          />
                          {/* Lower wick */}
                          <div
                            className="w-0.5 bg-gray-600 dark:bg-gray-300"
                            style={{
                              height: `${Math.max(
                                (candlestick.lowerWick / candlestick.range) *
                                  40,
                                0,
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.lastUpdatedTimestamp}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.lastUpdatedTimestamp}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
