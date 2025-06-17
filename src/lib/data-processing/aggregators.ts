import { format, subDays } from 'date-fns'
import * as math from 'mathjs'
import {
  AggregatedTVLData,
  TVLData,
  TVLBreakdown,
} from '@/types/visualizations'
import { formatNumber } from '../helpers'

// // Convert Wei to ETH/Token amount
// export const weiToEth = (weiString: string | number): number => {
//   const weiValue =
//     typeof weiString === 'string' ? parseFloat(weiString) : weiString
//   return isNaN(weiValue) ? 0 : weiValue / 1e18
// }

// Calculate staking TVL from APR MON data
export const calculateStakingTVL = (stakingData: any): number => {
  // Handle different data structures
  if (!stakingData) return 0

  // If stakingData is an array
  if (Array.isArray(stakingData)) {
    if (stakingData.length === 0) return 0

    // Get latest TVL data point
    const latestData = stakingData
      .filter((item: any) => item.c && item.c !== '0')
      .sort(
        (a: any, b: any) =>
          new Date(b.db_write_timestamp).getTime() -
          new Date(a.db_write_timestamp).getTime(),
      )[0]

    return latestData ? Number(formatNumber(latestData.c, true, 18)) : 0
  }

  // If stakingData is an object with arrays
  if (typeof stakingData === 'object') {
    let latestData = null
    let latestTimestamp = 0

    Object.values(stakingData).forEach((dataArray: any) => {
      if (Array.isArray(dataArray)) {
        const arrayLatest = dataArray
          .filter((item: any) => item.c && item.c !== '0')
          .sort(
            (a: any, b: any) =>
              new Date(b.db_write_timestamp).getTime() -
              new Date(a.db_write_timestamp).getTime(),
          )[0]

        if (arrayLatest) {
          const timestamp = new Date(arrayLatest.db_write_timestamp).getTime()
          if (timestamp > latestTimestamp) {
            latestTimestamp = timestamp
            latestData = arrayLatest
          }
        }
      }
    })

    return latestData
      ? Number(formatNumber((latestData as any).c, true, 18))
      : 0
  }

  return 0
}

// Calculate pool TVL from order book data (estimate based on volume)
export const calculatePoolTVL = (poolData: any): number => {
  // Handle different data structures
  if (!poolData) return 0

  let dataArray: any[] = []

  if (Array.isArray(poolData)) {
    dataArray = poolData
  } else if (typeof poolData === 'object') {
    // Extract arrays from object
    Object.values(poolData).forEach((value: any) => {
      if (Array.isArray(value)) {
        dataArray = dataArray.concat(value)
      }
    })
  }

  if (dataArray.length === 0) return 0

  // Estimate TVL based on recent trading volume and prices
  const recentTrades = dataArray
    .filter((trade) => trade.filledSize && trade.price)
    .slice(0, 100) // Last 100 trades

  const totalVolume = recentTrades.reduce((sum, trade) => {
    const volume = parseFloat(trade.filledSize) * parseFloat(trade.price)
    return sum + (isNaN(volume) ? 0 : volume)
  }, 0)

  // Rough estimate: TVL is approximately 10x recent volume
  return totalVolume * 10
}

// Calculate degen TVL from bonding curve data
export const calculateDegenTVL = (degenData: any): number => {
  if (!degenData) return 0

  let totalTVL = 0

  // Calculate from bonding curve sync data
  if (degenData.BondingCurve_Sync) {
    totalTVL += degenData.BondingCurve_Sync.reduce((sum: number, sync: any) => {
      const reserveToken = parseFloat(sync.reserveToken) || 0
      const reserveWNative =
        Number(formatNumber(sync.reserveWNative, true, 18)) || 0
      return sum + reserveToken + reserveWNative
    }, 0)
  }

  // Add UniswapV2 pair reserves
  if (degenData.UniswapV2Pair_Sync) {
    totalTVL += degenData.UniswapV2Pair_Sync.reduce(
      (sum: number, sync: any) => {
        const reserve0 = Number(formatNumber(sync.reserve0, true, 18)) || 0
        const reserve1 = Number(formatNumber(sync.reserve1, true, 18)) || 0
        return sum + reserve0 + reserve1
      },
      0,
    )
  }

  return totalTVL
}

// Calculate monorail TVL (estimate based on pool count and average TVL)
export const calculateMonorailTVL = (monorailData: any): number => {
  if (!monorailData || !monorailData.Pool) return 0

  const poolCount = monorailData.Pool.length
  // Estimate average TVL per pool
  const averageTVLPerPool = 50000 // Conservative estimate

  return poolCount * averageTVLPerPool
}

// Calculate percentage breakdown
export const calculatePercentages = (values: number[]): TVLBreakdown[] => {
  const total = values.reduce((sum, value) => sum + value, 0)
  const protocols = ['Staking', 'Order Book', 'Degen', 'Monorail']

  return values.map((value, index) => ({
    protocol: protocols[index],
    value,
    percentage: total > 0 ? (value / total) * 100 : 0,
    change24h: Math.random() * 20 - 10, // Mock 24h change for now
  }))
}

// Generate time series data for TVL evolution
export const generateTVLTimeSeries = (
  stakingData: any,
  poolData: any,
  degenData: any,
  monorailData: any,
  days: number = 30,
): TVLData[] => {
  const timeSeries: TVLData[] = []
  const now = new Date()

  // Generate data points for each day
  for (let i = days; i >= 0; i--) {
    const date = subDays(now, i)

    // Calculate TVL for this date (simplified for demo)
    const stakingTVL =
      calculateStakingTVL(stakingData) * (0.8 + Math.random() * 0.4)
    const poolTVL = calculatePoolTVL(poolData) * (0.8 + Math.random() * 0.4)
    const degenTVL = calculateDegenTVL(degenData) * (0.8 + Math.random() * 0.4)
    const monorailTVL =
      calculateMonorailTVL(monorailData) * (0.8 + Math.random() * 0.4)

    timeSeries.push({
      stakingTVL,
      poolTVL,
      degenTVL,
      monorailTVL,
      total: stakingTVL + poolTVL + degenTVL + monorailTVL,
      timestamp: format(date, 'yyyy-MM-dd'),
    })
  }

  return timeSeries
}

// Main aggregation function
export const aggregateTVLData = (
  stakingData: any,
  poolData: any,
  degenData: any,
  monorailData: any,
): AggregatedTVLData => {
  // Calculate current TVL values
  const stakingTVL = calculateStakingTVL(stakingData)
  const poolTVL = calculatePoolTVL(poolData)
  const degenTVL = calculateDegenTVL(degenData)
  const monorailTVL = calculateMonorailTVL(monorailData)

  const total = stakingTVL + poolTVL + degenTVL + monorailTVL

  const breakdown = {
    staking: stakingTVL,
    pools: poolTVL,
    degen: degenTVL,
    monorail: monorailTVL,
  }

  const percentages = calculatePercentages([
    stakingTVL,
    poolTVL,
    degenTVL,
    monorailTVL,
  ])
  const timeSeries = generateTVLTimeSeries(
    stakingData,
    poolData,
    degenData,
    monorailData,
  )

  // Calculate 24h change
  const yesterday = timeSeries[timeSeries.length - 2]
  const today = timeSeries[timeSeries.length - 1]
  const totalChange24h =
    yesterday && today
      ? ((today.total - yesterday.total) / yesterday.total) * 100
      : 0

  return {
    total,
    breakdown,
    percentages,
    timeSeries,
    totalChange24h,
  }
}

// Utility function to format large numbers
export const formatTVL = (num: number, decimals: number = 2): string => {
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(decimals)}B`
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(decimals)}M`
  } else if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(decimals)}K`
  }
  return `$${num.toFixed(decimals)}`
}

// Calculate correlation between different protocols
export const calculateProtocolCorrelation = (
  timeSeries: TVLData[],
  protocol1: keyof TVLData,
  protocol2: keyof TVLData,
): number => {
  const values1 = timeSeries
    .map((data) => data[protocol1] as number)
    .filter((v) => typeof v === 'number')
  const values2 = timeSeries
    .map((data) => data[protocol2] as number)
    .filter((v) => typeof v === 'number')

  if (values1.length < 2 || values2.length < 2) return 0

  try {
    // Calculate Pearson correlation coefficient
    const correlation = math.corr(values1, values2)
    return isNaN(correlation as number) ? 0 : (correlation as number)
  } catch (error) {
    console.warn('Error calculating correlation:', error)
    return 0
  }
}

// Statistical analysis utilities
export const calculateVolatility = (values: number[]): number => {
  if (values.length < 2) return 0

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    values.length

  return Math.sqrt(variance)
}

// Growth rate calculation
export const calculateGrowthRate = (
  oldValue: number,
  newValue: number,
): number => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0
  return ((newValue - oldValue) / oldValue) * 100
}

// Data quality assessment
export const assessDataQuality = (
  data: any,
): {
  completeness: number
  freshness: number
  consistency: number
} => {
  // Handle different data structures
  const getDataArray = (data: any): any[] => {
    if (Array.isArray(data)) return data
    if (data?.data && Array.isArray(data.data)) return data.data
    if (data?.poolsByUser && Array.isArray(data.poolsByUser))
      return data.poolsByUser
    if (
      data?.PumpingTime_TradeAction &&
      Array.isArray(data.PumpingTime_TradeAction)
    )
      return data.PumpingTime_TradeAction
    if (
      data?.WormholeRelayer_Delivery &&
      Array.isArray(data.WormholeRelayer_Delivery)
    )
      return data.WormholeRelayer_Delivery
    if (data?.stakingData && Array.isArray(data.stakingData))
      return data.stakingData
    return []
  }

  const dataArray = getDataArray(data)
  if (!dataArray || dataArray.length === 0) {
    return { completeness: 0, freshness: 0, consistency: 0 }
  }

  // Calculate completeness (% of non-null entries)
  const totalFields = dataArray.length * Object.keys(dataArray[0] || {}).length
  const completeFields = dataArray.reduce((count: number, item: any) => {
    return (
      count +
      Object.values(item || {}).filter(
        (value) => value !== null && value !== undefined && value !== '',
      ).length
    )
  }, 0)

  const completeness =
    totalFields > 0 ? (completeFields / totalFields) * 100 : 0

  // Calculate freshness (based on timestamps)
  const now = new Date().getTime()
  const timestamps = dataArray
    .map((item: any) =>
      new Date(
        item.db_write_timestamp || item.timestamp || Date.now(),
      ).getTime(),
    )
    .filter((ts: number) => !isNaN(ts))

  const avgAge =
    timestamps.length > 0
      ? (now -
          timestamps.reduce((sum: number, ts: number) => sum + ts, 0) /
            timestamps.length) /
        (1000 * 60 * 60)
      : 24

  const freshness = Math.max(0, 100 - (avgAge / 24) * 100) // Fresher = higher score

  // Calculate consistency (variance in data intervals)
  const intervals = timestamps
    .slice(1)
    .map((ts: number, i: number) => Math.abs(ts - timestamps[i]))
    .filter((interval: number) => interval > 0)

  const avgInterval =
    intervals.length > 0
      ? intervals.reduce((sum: number, interval: number) => sum + interval, 0) /
        intervals.length
      : 0

  const consistency =
    avgInterval > 0
      ? Math.max(0, 100 - (calculateVolatility(intervals) / avgInterval) * 100)
      : 0

  return {
    completeness: Math.round(completeness),
    freshness: Math.round(freshness),
    consistency: Math.round(consistency),
  }
}
