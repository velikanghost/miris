// Visualization Types for Kuru Protocol Advanced Analytics

export interface VisualizationData {
  id: string
  timestamp: string
  value: number
  metadata?: Record<string, any>
}

// TVL Dashboard Types
export interface TVLData {
  stakingTVL: number
  poolTVL: number
  degenTVL: number
  monorailTVL: number
  total: number
  timestamp: string
}

export interface TVLBreakdown {
  protocol: string
  value: number
  percentage: number
  change24h: number
}

export interface AggregatedTVLData {
  total: number
  breakdown: {
    staking: number
    pools: number
    degen: number
    monorail: number
  }
  percentages: TVLBreakdown[]
  timeSeries: TVLData[]
  totalChange24h: number
}

// Risk Assessment Types
export interface RiskMetric {
  name: string
  value: number
  status: 'low' | 'medium' | 'high' | 'critical'
  description: string
  lastUpdated: string
}

export interface ProtocolRisk {
  protocol: string
  overallRisk: number
  metrics: RiskMetric[]
  trend: 'improving' | 'stable' | 'degrading'
}

export interface RiskAssessment {
  protocols: ProtocolRisk[]
  systemRisk: number
  alerts: RiskAlert[]
}

export interface RiskAlert {
  id: string
  type: 'warning' | 'critical'
  protocol: string
  message: string
  timestamp: string
  acknowledged: boolean
}

// Health Monitoring Types
export interface HealthMetric {
  name: string
  value: number
  threshold: number
  status: 'healthy' | 'warning' | 'critical'
  unit: string
}

export interface ProtocolHealth {
  protocol: string
  uptime: number
  successRate: number
  avgResponseTime: number
  errorRate: number
  lastUpdate: string
  metrics: HealthMetric[]
  status: 'healthy' | 'warning' | 'critical'
}

export interface SystemHealth {
  overall: HealthMetric
  protocols: ProtocolHealth[]
  sla: {
    target: number
    current: number
    period: string
  }
}

// Flow Analysis Types
export interface FlowNode {
  id: string
  name: string
  protocol: string
  value: number
  type: 'source' | 'destination' | 'intermediate'
}

export interface FlowLink {
  source: string
  target: string
  value: number
  token?: string
  timestamp: string
}

export interface ProtocolFlow {
  nodes: FlowNode[]
  links: FlowLink[]
  totalVolume: number
  timeframe: string
}

export interface ArbitrageOpportunity {
  id: string
  sourceProtocol: string
  targetProtocol: string
  token: string
  priceDifference: number
  potentialProfit: number
  volume: number
  timestamp: string
}

// Yield Optimization Types
export interface YieldMetric {
  protocol: string
  pool?: string
  apr: number
  apy: number
  tvl: number
  risk: number
  impermanentLoss: number
  fees24h: number
  volume24h: number
}

export interface YieldComparison {
  metrics: YieldMetric[]
  best: YieldMetric
  riskAdjusted: YieldMetric
  recommendations: string[]
}

// Pattern Discovery Types
export interface TemporalPattern {
  type: 'daily' | 'weekly' | 'seasonal' | 'anomaly'
  description: string
  confidence: number
  startTime: string
  endTime: string
  metrics: Record<string, number>
}

export interface PatternAnalysis {
  patterns: TemporalPattern[]
  anomalies: TemporalPattern[]
  correlations: PatternCorrelation[]
  predictions: PatternPrediction[]
}

export interface PatternCorrelation {
  metric1: string
  metric2: string
  correlation: number
  significance: number
}

export interface PatternPrediction {
  metric: string
  predictedValue: number
  confidence: number
  timeframe: string
}

// Chart Configuration Types
export interface ChartConfig {
  width?: number
  height?: number
  margin?: {
    top: number
    right: number
    bottom: number
    left: number
  }
  colors?: string[]
  theme?: 'light' | 'dark'
  animated?: boolean
}

// Filter Types
export interface TimeFilter {
  start: Date
  end: Date
  period: '1h' | '1d' | '7d' | '30d' | '90d' | 'all'
}

export interface ProtocolFilter {
  protocols: string[]
  includeAll: boolean
}

export interface DataFilter {
  time: TimeFilter
  protocols: ProtocolFilter
  minValue?: number
  maxValue?: number
}

// Component Props Types
export interface MultiTVLDashboardProps {
  stakingData: any[]
  poolData: any[]
  degenData: any[]
  monorailData: any[]
  timeFilter?: TimeFilter
  showBreakdown?: boolean
}

export interface RiskAssessmentMatrixProps {
  data: {
    orderBookData: any[]
    interoperabilityData: any[]
    stakingData: any[]
    degenData: any[]
    monorailData: any[]
  }
  onAlertClick?: (alert: RiskAlert) => void
}

export interface ProtocolHealthDashboardProps {
  data: {
    orderBookData: any[]
    interoperabilityData: any[]
    stakingData: any[]
    degenData: any[]
    monorailData: any[]
  }
  refreshInterval?: number
}

export interface CrossProtocolFlowAnalysisProps {
  orderBookData: any
  interoperabilityData: any
  poolData: any
  monorailData: any
  timeFilter?: TimeFilter
}

export interface YieldOptimizationDashboardProps {
  stakingData: any
  poolData: any
  degenData: any
  monorailData: any
  userWallet?: string
}

export interface TemporalPatternAnalyzerProps {
  allData: {
    orderBook: any[]
    deployment: any[]
    interoperability: any[]
    staking: any[]
    degen: any[]
    monorail: any[]
  }
  analysisType?: 'correlation' | 'anomaly' | 'prediction' | 'all'
}
