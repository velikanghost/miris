import {
  FlowNode,
  FlowLink,
  ProtocolFlow,
  ArbitrageOpportunity,
} from '@/types/visualizations'
import _ from 'lodash'

// Helper function to ensure we have an array
const ensureArray = (data: any): any[] => {
  if (Array.isArray(data)) return data
  if (data?.data && Array.isArray(data.data)) return data.data
  if (data && typeof data === 'object') {
    // Try to extract arrays from nested objects
    const possibleArrays = Object.values(data).filter(Array.isArray)
    if (possibleArrays.length > 0) {
      return possibleArrays.flat()
    }
  }
  return []
}

// Extract token addresses from different data sources
export const extractTokens = (data: {
  orderBookData: any
  interoperabilityData: any
  poolData: any
  monorailData: any
}): Set<string> => {
  const tokens = new Set<string>()

  // From order book data
  const orderBookArray = ensureArray(data.orderBookData)
  orderBookArray.forEach((trade) => {
    if (trade.orderBookAddress) tokens.add(trade.orderBookAddress)
  })

  // From monorail pools
  if (data.monorailData?.Pool) {
    data.monorailData.Pool.forEach((pool: any) => {
      if (pool.token0) tokens.add(pool.token0)
      if (pool.token1) tokens.add(pool.token1)
    })
  }

  // From interoperability data (cross-chain tokens)
  if (data.interoperabilityData?.WormholeRelayer_Delivery) {
    data.interoperabilityData.WormholeRelayer_Delivery.forEach(
      (delivery: any) => {
        if (delivery.recipientContract) tokens.add(delivery.recipientContract)
      },
    )
  }

  return tokens
}

// Calculate volume for each protocol
export const calculateProtocolVolumes = (data: {
  orderBookData: any
  interoperabilityData: any
  poolData: any
  monorailData: any
}): Record<string, number> => {
  const volumes: Record<string, number> = {
    'Order Book': 0,
    'Cross-Chain': 0,
    Monorail: 0,
    External: 0,
  }

  // Order book volume
  const orderBookArray = ensureArray(data.orderBookData)
  volumes['Order Book'] = orderBookArray.reduce((sum, trade) => {
    const volume = parseFloat(trade.filledSize) * parseFloat(trade.price)
    return sum + (isNaN(volume) ? 0 : volume)
  }, 0)

  // Cross-chain volume (estimated from gas usage)
  if (data.interoperabilityData?.WormholeRelayer_Delivery) {
    volumes['Cross-Chain'] =
      data.interoperabilityData.WormholeRelayer_Delivery.reduce(
        (sum: number, delivery: any) => {
          const gasValue = parseInt(delivery.gasUsed) || 0
          return sum + gasValue / 1e6 // Convert to reasonable volume estimate
        },
        0,
      )
  }

  // Monorail volume (estimated from pool count)
  if (data.monorailData?.Pool) {
    volumes['Monorail'] = data.monorailData.Pool.length * 10000 // Rough estimate
  }

  return volumes
}

// Detect token flows between protocols
export const detectTokenFlows = (data: {
  orderBookData: any
  interoperabilityData: any
  poolData: any
  monorailData: any
}): FlowLink[] => {
  const flows: FlowLink[] = []
  const tokens = extractTokens(data)

  // Create flows based on token presence in multiple protocols
  tokens.forEach((token) => {
    // Check if token appears in order book
    const orderBookArray = ensureArray(data.orderBookData)
    const inOrderBook = orderBookArray.some(
      (trade) => trade.orderBookAddress === token,
    )

    // Check if token appears in monorail
    const inMonorail = data.monorailData?.Pool?.some(
      (pool: any) => pool.token0 === token || pool.token1 === token,
    )

    // Check if token appears in cross-chain
    const inCrossChain =
      data.interoperabilityData?.WormholeRelayer_Delivery?.some(
        (delivery: any) => delivery.recipientContract === token,
      )

    // Create flows between protocols that share tokens
    if (inOrderBook && inMonorail) {
      flows.push({
        source: 'Order Book',
        target: 'Monorail',
        value: Math.random() * 50000 + 10000, // Mock volume
        token,
        timestamp: new Date().toISOString(),
      })
    }

    if (inOrderBook && inCrossChain) {
      flows.push({
        source: 'Order Book',
        target: 'Cross-Chain',
        value: Math.random() * 30000 + 5000,
        token,
        timestamp: new Date().toISOString(),
      })
    }

    if (inMonorail && inCrossChain) {
      flows.push({
        source: 'Monorail',
        target: 'Cross-Chain',
        value: Math.random() * 20000 + 3000,
        token,
        timestamp: new Date().toISOString(),
      })
    }
  })

  return flows
}

// Create flow nodes for visualization
export const createFlowNodes = (
  volumes: Record<string, number>,
): FlowNode[] => {
  return Object.entries(volumes).map(([protocol, volume]) => ({
    id: protocol,
    name: protocol,
    protocol,
    value: volume,
    type: protocol === 'External' ? 'destination' : 'source',
  }))
}

// Analyze cross-protocol flows
export const analyzeProtocolFlows = (data: {
  orderBookData: any
  interoperabilityData: any
  poolData: any
  monorailData: any
}): ProtocolFlow => {
  const volumes = calculateProtocolVolumes(data)
  const nodes = createFlowNodes(volumes)
  const links = detectTokenFlows(data)

  const totalVolume = Object.values(volumes).reduce((sum, vol) => sum + vol, 0)

  return {
    nodes,
    links,
    totalVolume,
    timeframe: '24h',
  }
}

// Detect arbitrage opportunities
export const detectArbitrageOpportunities = (data: {
  orderBookData: any
  interoperabilityData: any
  poolData: any
  monorailData: any
}): ArbitrageOpportunity[] => {
  const opportunities: ArbitrageOpportunity[] = []
  const tokens = extractTokens(data)

  // Mock arbitrage detection - in reality would compare prices across protocols
  tokens.forEach((token) => {
    // Simulate price differences between protocols
    const orderBookPrice = Math.random() * 100 + 50
    const monorailPrice = orderBookPrice * (0.95 + Math.random() * 0.1) // ±5% difference

    const priceDifference = Math.abs(orderBookPrice - monorailPrice)
    const percentageDiff = (priceDifference / orderBookPrice) * 100

    // Only flag opportunities with >2% price difference
    if (percentageDiff > 2) {
      const volume = Math.random() * 10000 + 1000
      const potentialProfit = (priceDifference / orderBookPrice) * volume * 0.7 // Account for fees

      opportunities.push({
        id: `arb-${token}-${Date.now()}`,
        sourceProtocol:
          orderBookPrice > monorailPrice ? 'Monorail' : 'Order Book',
        targetProtocol:
          orderBookPrice > monorailPrice ? 'Order Book' : 'Monorail',
        token,
        priceDifference: percentageDiff,
        potentialProfit,
        volume,
        timestamp: new Date().toISOString(),
      })
    }
  })

  // Sort by potential profit
  return _.orderBy(opportunities, 'potentialProfit', 'desc').slice(0, 10)
}

// Calculate flow velocity (how quickly value moves between protocols)
export const calculateFlowVelocity = (
  flows: FlowLink[],
  timeWindowHours: number = 24,
): number => {
  if (flows.length === 0) return 0

  const totalValue = flows.reduce((sum, flow) => sum + flow.value, 0)
  const flowsPerHour = flows.length / timeWindowHours

  return (totalValue * flowsPerHour) / 1000000 // Normalize to millions
}

// Identify dominant flow patterns
export const identifyFlowPatterns = (
  flows: FlowLink[],
): {
  dominant: { from: string; to: string; share: number }[]
  bottlenecks: string[]
  hubs: string[]
} => {
  // Calculate flow shares
  const totalFlow = flows.reduce((sum, flow) => sum + flow.value, 0)
  const flowPairs = _.groupBy(flows, (flow) => `${flow.source}-${flow.target}`)

  const dominant = Object.entries(flowPairs)
    .map(([pair, flowList]) => {
      const [from, to] = pair.split('-')
      const totalValue = flowList.reduce((sum, flow) => sum + flow.value, 0)
      return {
        from,
        to,
        share: (totalValue / totalFlow) * 100,
      }
    })
    .filter((item) => item.share > 5) // Only significant flows
    .sort((a, b) => b.share - a.share)

  // Identify bottlenecks (protocols with high inflow but low outflow)
  const protocolFlows = _.groupBy(flows, 'source')
  // const protocolInflows = _.groupBy(flows, 'target')

  const bottlenecks: string[] = []
  const hubs: string[] = []

  Object.keys(protocolFlows).forEach((protocol) => {
    const outflow = flows
      .filter((f) => f.source === protocol)
      .reduce((sum, f) => sum + f.value, 0)
    const inflow = flows
      .filter((f) => f.target === protocol)
      .reduce((sum, f) => sum + f.value, 0)

    if (inflow > outflow * 2) {
      bottlenecks.push(protocol)
    } else if (outflow > inflow * 2) {
      hubs.push(protocol)
    }
  })

  return { dominant, bottlenecks, hubs }
}

// Calculate liquidity migration trends
export const calculateLiquidityMigration = (
  flows: FlowLink[],
): {
  migrationRate: number
  direction: 'inbound' | 'outbound' | 'balanced'
  topDestinations: { protocol: string; volume: number }[]
} => {
  const protocolVolumes: Record<string, { inbound: number; outbound: number }> =
    {}

  flows.forEach((flow) => {
    if (!protocolVolumes[flow.source]) {
      protocolVolumes[flow.source] = { inbound: 0, outbound: 0 }
    }
    if (!protocolVolumes[flow.target]) {
      protocolVolumes[flow.target] = { inbound: 0, outbound: 0 }
    }

    protocolVolumes[flow.source].outbound += flow.value
    protocolVolumes[flow.target].inbound += flow.value
  })

  const totalInbound = Object.values(protocolVolumes).reduce(
    (sum, vol) => sum + vol.inbound,
    0,
  )
  const totalOutbound = Object.values(protocolVolumes).reduce(
    (sum, vol) => sum + vol.outbound,
    0,
  )

  const migrationRate =
    Math.abs(totalInbound - totalOutbound) /
    Math.max(totalInbound, totalOutbound)

  let direction: 'inbound' | 'outbound' | 'balanced' = 'balanced'
  if (totalInbound > totalOutbound * 1.1) direction = 'inbound'
  else if (totalOutbound > totalInbound * 1.1) direction = 'outbound'

  const topDestinations = Object.entries(protocolVolumes)
    .map(([protocol, volumes]) => ({
      protocol,
      volume: volumes.inbound - volumes.outbound,
    }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5)

  return {
    migrationRate,
    direction,
    topDestinations,
  }
}
