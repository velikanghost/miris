import {
  TemporalPattern,
  PatternAnalysis,
  PatternCorrelation,
  PatternPrediction,
} from '@/types/visualizations'
import _ from 'lodash'
import * as math from 'mathjs'

// Extract timestamps and values from data
export const extractTimeSeries = (
  data: any[],
  valueKey: string,
  timestampKey: string = 'db_write_timestamp',
): { timestamp: Date; value: number }[] => {
  return data
    .map((item) => ({
      timestamp: new Date(item[timestampKey]),
      value: parseFloat(item[valueKey]) || 0,
    }))
    .filter((item) => !isNaN(item.value) && item.value > 0)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}

// Calculate moving average
export const calculateMovingAverage = (
  series: number[],
  window: number,
): number[] => {
  const result: number[] = []
  for (let i = 0; i < series.length; i++) {
    const start = Math.max(0, i - window + 1)
    const subset = series.slice(start, i + 1)
    const average = subset.reduce((sum, val) => sum + val, 0) / subset.length
    result.push(average)
  }
  return result
}

// Detect anomalies using statistical methods
export const detectAnomalies = (
  series: number[],
  threshold: number = 2,
): number[] => {
  if (series.length < 10) return []

  const mean = series.reduce((sum, val) => sum + val, 0) / series.length
  const variance =
    series.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    series.length
  const stdDev = Math.sqrt(variance)

  return series
    .map((value, index) => {
      const zScore = Math.abs((value - mean) / stdDev)
      return zScore > threshold ? index : -1
    })
    .filter((index) => index !== -1)
}

// Detect seasonal patterns
export const detectSeasonalPatterns = (
  timeSeries: { timestamp: Date; value: number }[],
): TemporalPattern[] => {
  if (timeSeries.length < 24) return []

  const patterns: TemporalPattern[] = []

  // Daily patterns (hourly analysis)
  const hourlyData = _.groupBy(timeSeries, (item) => item.timestamp.getHours())
  const hourlyAverages = Object.entries(hourlyData).map(([hour, data]) => ({
    hour: parseInt(hour),
    average: data.reduce((sum, item) => sum + item.value, 0) / data.length,
    count: data.length,
  }))

  // Find peak hours
  const maxHourly = _.maxBy(hourlyAverages, 'average')
  const minHourly = _.minBy(hourlyAverages, 'average')

  if (maxHourly && minHourly && maxHourly.average > minHourly.average * 1.5) {
    patterns.push({
      type: 'daily',
      description: `Peak activity at ${maxHourly.hour}:00, lowest at ${minHourly.hour}:00`,
      confidence: Math.min(
        95,
        (maxHourly.average / minHourly.average - 1) * 50,
      ),
      startTime: `${minHourly.hour}:00`,
      endTime: `${maxHourly.hour}:00`,
      metrics: {
        peakHour: maxHourly.hour,
        lowHour: minHourly.hour,
        ratio: maxHourly.average / minHourly.average,
      },
    })
  }

  // Weekly patterns (if enough data)
  if (timeSeries.length >= 7 * 24) {
    const weeklyData = _.groupBy(timeSeries, (item) => item.timestamp.getDay())
    const weeklyAverages = Object.entries(weeklyData).map(([day, data]) => ({
      day: parseInt(day),
      average: data.reduce((sum, item) => sum + item.value, 0) / data.length,
      count: data.length,
    }))

    const maxWeekly = _.maxBy(weeklyAverages, 'average')
    const minWeekly = _.minBy(weeklyAverages, 'average')

    if (maxWeekly && minWeekly && maxWeekly.average > minWeekly.average * 1.3) {
      const dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ]
      patterns.push({
        type: 'weekly',
        description: `Peak on ${dayNames[maxWeekly.day]}, lowest on ${
          dayNames[minWeekly.day]
        }`,
        confidence: Math.min(
          90,
          (maxWeekly.average / minWeekly.average - 1) * 40,
        ),
        startTime: dayNames[minWeekly.day],
        endTime: dayNames[maxWeekly.day],
        metrics: {
          peakDay: maxWeekly.day,
          lowDay: minWeekly.day,
          ratio: maxWeekly.average / minWeekly.average,
        },
      })
    }
  }

  return patterns
}

// Detect anomalous patterns
export const detectAnomalousPatterns = (
  timeSeries: { timestamp: Date; value: number }[],
): TemporalPattern[] => {
  if (timeSeries.length < 10) return []

  const values = timeSeries.map((item) => item.value)
  const anomalyIndices = detectAnomalies(values)

  return anomalyIndices.map((index) => {
    const anomalyPoint = timeSeries[index]
    const baseline = values
      .slice(Math.max(0, index - 5), index)
      .concat(values.slice(index + 1, Math.min(values.length, index + 6)))
    const baselineAvg =
      baseline.reduce((sum, val) => sum + val, 0) / baseline.length

    return {
      type: 'anomaly',
      description: `Anomalous ${
        anomalyPoint.value > baselineAvg ? 'spike' : 'drop'
      } detected`,
      confidence: Math.min(
        95,
        (Math.abs(anomalyPoint.value - baselineAvg) / baselineAvg) * 100,
      ),
      startTime: anomalyPoint.timestamp.toISOString(),
      endTime: anomalyPoint.timestamp.toISOString(),
      metrics: {
        value: anomalyPoint.value,
        baseline: baselineAvg,
        deviation:
          (Math.abs(anomalyPoint.value - baselineAvg) / baselineAvg) * 100,
      },
    }
  })
}

// Calculate correlation between two time series
export const calculateTimeSeriesCorrelation = (
  series1: number[],
  series2: number[],
): number => {
  if (series1.length !== series2.length || series1.length < 2) return 0

  try {
    const correlation = math.corr(series1, series2)
    return isNaN(correlation as number) ? 0 : (correlation as number)
  } catch (error) {
    console.error(error)
    return 0
  }
}

// Find correlations between different metrics
export const findMetricCorrelations = (data: {
  orderBook: any[]
  deployment: any[]
  interoperability: any[]
  staking: any[]
  degen: any[]
  monorail: any[]
}): PatternCorrelation[] => {
  const correlations: PatternCorrelation[] = []

  // Extract time series for different metrics
  const stakingTVL = extractTimeSeries(data.staking, 'c')
  const orderBookVolume = data.orderBook.map((trade) => ({
    timestamp: new Date(trade.db_write_timestamp),
    value: parseFloat(trade.filledSize) * parseFloat(trade.price) || 0,
  }))

  const deploymentRate =
    data.deployment.length > 0
      ? _.groupBy(data.deployment, (item) =>
          new Date(item.db_write_timestamp).toDateString(),
        )
      : {}

  const deploymentSeries = Object.values(deploymentRate).map(
    (deployments: any) => deployments.length,
  )

  // Calculate correlations
  if (stakingTVL.length >= 5 && orderBookVolume.length >= 5) {
    const minLength = Math.min(stakingTVL.length, orderBookVolume.length)
    const stakingValues = stakingTVL.slice(-minLength).map((item) => item.value)
    const volumeValues = orderBookVolume
      .slice(-minLength)
      .map((item) => item.value)

    const correlation = calculateTimeSeriesCorrelation(
      stakingValues,
      volumeValues,
    )

    correlations.push({
      metric1: 'Staking TVL',
      metric2: 'Order Book Volume',
      correlation,
      significance:
        Math.abs(correlation) > 0.5
          ? 0.95
          : Math.abs(correlation) > 0.3
          ? 0.8
          : 0.5,
    })
  }

  // Add more correlation analyses
  if (deploymentSeries.length >= 5 && orderBookVolume.length >= 5) {
    const minLength = Math.min(deploymentSeries.length, orderBookVolume.length)
    const deployValues = deploymentSeries.slice(-minLength)
    const volumeValues = orderBookVolume
      .slice(-minLength)
      .map((item) => item.value)

    const correlation = calculateTimeSeriesCorrelation(
      deployValues,
      volumeValues,
    )

    correlations.push({
      metric1: 'Token Deployments',
      metric2: 'Trading Volume',
      correlation,
      significance:
        Math.abs(correlation) > 0.4
          ? 0.9
          : Math.abs(correlation) > 0.2
          ? 0.7
          : 0.4,
    })
  }

  return correlations.filter((corr) => Math.abs(corr.correlation) > 0.1)
}

// Generate predictions based on patterns
export const generatePredictions = (
  patterns: TemporalPattern[],
  timeSeries: { timestamp: Date; value: number }[],
): PatternPrediction[] => {
  if (timeSeries.length < 10) return []

  const predictions: PatternPrediction[] = []
  const values = timeSeries.map((item) => item.value)
  const recentValues = values.slice(-7) // Last 7 data points

  // Trend-based prediction
  if (recentValues.length >= 3) {
    const trend =
      (recentValues[recentValues.length - 1] - recentValues[0]) /
      recentValues.length
    const nextValue = recentValues[recentValues.length - 1] + trend

    predictions.push({
      metric: 'General Trend',
      predictedValue: Math.max(0, nextValue),
      confidence: Math.min(
        80,
        100 - (Math.abs(trend) / recentValues[recentValues.length - 1]) * 100,
      ),
      timeframe: 'Next period',
    })
  }

  // Seasonal prediction
  const dailyPattern = patterns.find((p) => p.type === 'daily')
  if (dailyPattern) {
    const currentHour = new Date().getHours()
    const peakHour = dailyPattern.metrics.peakHour as number
    const ratio = dailyPattern.metrics.ratio as number

    const currentValue = recentValues[recentValues.length - 1]
    const hoursUntilPeak =
      peakHour > currentHour
        ? peakHour - currentHour
        : 24 - currentHour + peakHour

    if (hoursUntilPeak <= 6) {
      predictions.push({
        metric: 'Daily Peak',
        predictedValue: currentValue * Math.sqrt(ratio),
        confidence: dailyPattern.confidence,
        timeframe: `${hoursUntilPeak} hours`,
      })
    }
  }

  return predictions
}

// Main pattern analysis function
export const analyzeTemporalPatterns = (allData: {
  orderBook: any[]
  deployment: any[]
  interoperability: any[]
  staking: any[]
  degen: any[]
  monorail: any[]
}): PatternAnalysis => {
  // Extract primary time series (staking TVL as main metric)
  const primarySeries = extractTimeSeries(allData.staking, 'c')

  // Detect patterns
  const seasonalPatterns = detectSeasonalPatterns(primarySeries)
  const anomalies = detectAnomalousPatterns(primarySeries)

  // Find correlations
  const correlations = findMetricCorrelations(allData)

  // Generate predictions
  const predictions = generatePredictions(
    [...seasonalPatterns, ...anomalies],
    primarySeries,
  )

  return {
    patterns: seasonalPatterns,
    anomalies,
    correlations,
    predictions,
  }
}
