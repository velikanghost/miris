'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, BarChart3, DollarSign } from 'lucide-react'
import {
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

  // Calculate percentage change
  const calculateChange = (open: number, close: number) => {
    return ((close - open) / open) * 100
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

  const totalItems = processedData.length

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
        <div className="text-sm text-muted-foreground mt-2">
          Total: {totalItems.toLocaleString()} TVL periods
        </div>
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
      </CardContent>
    </Card>
  )
}
