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
import { TrendingUp, TrendingDown, BarChart3, DollarSign } from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

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

interface StakingTableProps {
  data: { AprMonTVL1D?: AprMonData[] } | null | undefined
}

export default function StakingTable({ data }: StakingTableProps) {
  // Convert Wei to ETH/Token amount
  const weiToEth = (weiString: string): number => {
    return parseFloat(weiString) / 1e18
  }

  // Format large numbers with appropriate suffixes
  const formatTVL = (num: number, decimals: number = 2) => {
    if (num >= 1e9) {
      return `${(num / 1e9).toFixed(decimals)}B`
    } else if (num >= 1e6) {
      return `${(num / 1e6).toFixed(decimals)}M`
    } else if (num >= 1e3) {
      return `${(num / 1e3).toFixed(decimals)}K`
    }
    return `${num.toFixed(decimals)}`
  }

  // Format percentage change
  const formatPercentage = (num: number) => {
    return `${num.toFixed(2)}%`
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString()
  }

  // Calculate percentage change
  const calculateChange = (open: number, close: number) => {
    return ((close - open) / open) * 100
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

  const aprMonData = data?.AprMonTVL1D || []

  if (!data || !aprMonData.length) {
    return (
      <Card className="crypto-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">
            APR MON - TVL Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            {!data ? 'Loading TVL data...' : 'No TVL data available'}
          </p>
        </CardContent>
      </Card>
    )
  }

  // Process data for calculations and charts
  const processedData = aprMonData
    .map((item) => {
      const open = weiToEth(item.o)
      const high = weiToEth(item.h)
      const low = weiToEth(item.l)
      const close = weiToEth(item.c)
      const change = calculateChange(open, close)

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
    .sort((a, b) => a.timestamp - b.timestamp) // Sort by timestamp for proper chart display

  // Calculate summary statistics
  const latestData = processedData[processedData.length - 1] // Most recent
  const currentTVL = latestData?.closeEth || 0
  const averageTVL =
    processedData.reduce((sum, item) => sum + item.closeEth, 0) /
    processedData.length
  const highestTVL = Math.max(...processedData.map((item) => item.highEth))
  const lowestTVL = Math.min(...processedData.map((item) => item.lowEth))

  // Prepare chart data
  const chartData = processedData.map((item) => ({
    date: item.formattedDate,
    timestamp: item.timestamp,
    open: item.openEth,
    high: item.highEth,
    low: item.lowEth,
    close: item.closeEth,
    change: item.change,
  }))

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600">Open: {formatTVL(data.open)} ETH</p>
            <p className="text-green-600">High: {formatTVL(data.high)} ETH</p>
            <p className="text-red-600">Low: {formatTVL(data.low)} ETH</p>
            <p className="text-gray-600">Close: {formatTVL(data.close)} ETH</p>
            <p className={data.change >= 0 ? 'text-green-600' : 'text-red-600'}>
              Change: {formatPercentage(data.change)}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="crypto-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          APR MON - TVL Analytics & Charts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current TVL</p>
                  <p className="text-xl font-bold text-primary">
                    {formatTVL(currentTVL)} ETH
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average TVL</p>
                  <p className="text-xl font-bold text-primary">
                    {formatTVL(averageTVL)} ETH
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Highest TVL</p>
                  <p className="text-xl font-bold text-primary">
                    {formatTVL(highestTVL)} ETH
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lowest TVL</p>
                  <p className="text-xl font-bold text-primary">
                    {formatTVL(lowestTVL)} ETH
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* TVL Trend Line Chart */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">TVL Trend Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatTVL(value)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="close"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* OHLC Bar Chart */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">OHLC Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatTVL(value)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="high" fill="#10b981" name="High" />
                  <Bar dataKey="low" fill="#ef4444" name="Low" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedData
                .slice(-10)
                .reverse()
                .map((item) => {
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
                              {formatTimestamp(item.openTimestamp)}
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
                          {formatTVL(item.openEth)} ETH
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatTVL(item.highEth)} ETH
                      </TableCell>
                      <TableCell className="font-semibold text-red-600 dark:text-red-400">
                        {formatTVL(item.lowEth)} ETH
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-gray-50 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                        >
                          {formatTVL(item.closeEth)} ETH
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
                                    (candlestick.upperWick /
                                      candlestick.range) *
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
                                    (candlestick.bodyHeight /
                                      candlestick.range) *
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
                                    (candlestick.lowerWick /
                                      candlestick.range) *
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
                        {formatTimestamp(item.lastUpdatedTimestamp)}
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </div>
        {processedData.length > 10 && (
          <div className="text-center mt-4 text-sm text-muted-foreground">
            Showing latest 10 of {processedData.length} TVL periods
          </div>
        )}
      </CardContent>
    </Card>
  )
}
