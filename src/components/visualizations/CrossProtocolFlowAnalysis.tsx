'use client'

import React, { useMemo, useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowRight,
  Network,
  TrendingUp,
  DollarSign,
  Shuffle,
  Target,
  Activity,
  Info,
} from 'lucide-react'
import { motion } from 'framer-motion'
import * as d3 from 'd3'
import { sankey, sankeyLinkHorizontal, SankeyNode, SankeyLink } from 'd3-sankey'
import { CrossProtocolFlowAnalysisProps } from '@/types/visualizations'
import {
  analyzeProtocolFlows,
  detectArbitrageOpportunities,
  identifyFlowPatterns,
  calculateLiquidityMigration,
} from '@/lib/calculations/flow-analysis'
import { formatNumber } from '@/lib/helpers'

interface SankeyDiagramProps {
  data: {
    nodes: Array<{ id: string; name: string; value: number }>
    links: Array<{ source: string; target: string; value: number }>
  }
  width: number
  height: number
}

const SankeyDiagram: React.FC<SankeyDiagramProps> = ({
  data,
  width,
  height,
}) => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 30, bottom: 20, left: 30 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const container = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Prepare data for d3-sankey
    const sankeyData = {
      nodes: data.nodes.map((d) => ({ ...d })),
      links: data.links.map((d) => ({
        source: data.nodes.findIndex((n) => n.id === d.source),
        target: data.nodes.findIndex((n) => n.id === d.target),
        value: d.value,
      })),
    }

    const sankeyGenerator = sankey<SankeyNode<any, any>, SankeyLink<any, any>>()
      .nodeId((d: any) => d.id)
      .nodeWidth(15)
      .nodePadding(10)
      .extent([
        [1, 1],
        [innerWidth - 1, innerHeight - 5],
      ])

    const sankeyResult = sankeyGenerator(sankeyData as any)

    // Color scale
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

    // Draw links
    container
      .append('g')
      .selectAll('.link')
      .data(sankeyResult.links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', sankeyLinkHorizontal())
      .style('stroke', (d: any) => colorScale(d.source.id))
      .style('stroke-opacity', 0.5)
      .style('stroke-width', (d: any) => Math.max(1, d.width))
      .style('fill', 'none')
      .append('title')
      .text(
        (d: any) =>
          `${d.source.name} → ${d.target.name}: ${formatNumber(d.value)}`,
      )

    // Draw nodes
    container
      .append('g')
      .selectAll('.node')
      .data(sankeyResult.nodes)
      .enter()
      .append('rect')
      .attr('class', 'node')
      .attr('x', (d: any) => d.x0)
      .attr('y', (d: any) => d.y0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('width', (d: any) => d.x1 - d.x0)
      .style('fill', (d: any) => colorScale(d.id))
      .style('stroke', '#000')
      .style('stroke-width', 1)
      .append('title')
      .text((d: any) => `${d.name}: ${formatNumber(d.value)}`)

    // Add node labels
    container
      .append('g')
      .selectAll('.node-label')
      .data(sankeyResult.nodes)
      .enter()
      .append('text')
      .attr('class', 'node-label')
      .attr('x', (d: any) => (d.x0 < innerWidth / 2 ? d.x1 + 6 : d.x0 - 6))
      .attr('y', (d: any) => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d: any) =>
        d.x0 < innerWidth / 2 ? 'start' : 'end',
      )
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text((d: any) => d.name)
  }, [data, width, height])

  return <svg ref={svgRef} className="w-full h-full" />
}

export default function CrossProtocolFlowAnalysis({
  orderBookData,
  interoperabilityData,
  poolData,
  monorailData,
}: CrossProtocolFlowAnalysisProps) {
  const [selectedView, setSelectedView] = useState<
    'sankey' | 'network' | 'arbitrage'
  >('sankey')

  const flowData = useMemo(
    () =>
      analyzeProtocolFlows({
        orderBookData,
        interoperabilityData,
        poolData,
        monorailData,
      }),
    [orderBookData, interoperabilityData, poolData, monorailData],
  )

  const arbitrageOpportunities = useMemo(
    () =>
      detectArbitrageOpportunities({
        orderBookData,
        interoperabilityData,
        poolData,
        monorailData,
      }),
    [orderBookData, interoperabilityData, poolData, monorailData],
  )

  const flowPatterns = useMemo(
    () => identifyFlowPatterns(flowData.links),
    [flowData.links],
  )

  const liquidityMigration = useMemo(
    () => calculateLiquidityMigration(flowData.links),
    [flowData.links],
  )

  const sankeyData = useMemo(
    () => ({
      nodes: flowData.nodes.map((node) => ({
        id: node.id,
        name: node.name,
        value: node.value,
      })),
      links: flowData.links.map((link) => ({
        source: link.source,
        target: link.target,
        value: link.value,
      })),
    }),
    [flowData],
  )

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
  }: {
    title: string
    value: string | number
    subtitle?: string
    icon: any
    color: string
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div
            className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900`}
          >
            <Icon
              className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Flow Volume"
          value={formatNumber(flowData.totalVolume)}
          subtitle={`${flowData.timeframe} timeframe`}
          icon={DollarSign}
          color="blue"
        />
        <StatCard
          title="Active Flows"
          value={flowData.links.length}
          subtitle="Cross-protocol connections"
          icon={Network}
          color="green"
        />
        <StatCard
          title="Arbitrage Opportunities"
          value={arbitrageOpportunities.length}
          subtitle="Profitable price differences"
          icon={Target}
          color="orange"
        />
        <StatCard
          title="Flow Velocity"
          value="12.5M/h"
          subtitle="Value movement rate"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Main Visualization */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Cross-Protocol Flow Analysis
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Visualize token flows and liquidity movements between protocols
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Tabs
                value={selectedView}
                onValueChange={(value: any) => setSelectedView(value)}
              >
                <TabsList>
                  <TabsTrigger value="sankey">Flow Diagram</TabsTrigger>
                  <TabsTrigger value="network">Network View</TabsTrigger>
                  <TabsTrigger value="arbitrage">Arbitrage</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedView} className="w-full">
            <TabsContent value="sankey" className="space-y-4">
              <div className="h-[500px] w-full border rounded-lg bg-muted/20">
                <SankeyDiagram data={sankeyData} width={800} height={500} />
              </div>
            </TabsContent>

            <TabsContent value="network" className="space-y-4">
              <div className="h-[500px] w-full border rounded-lg bg-muted/20 flex items-center justify-center">
                <div className="text-center">
                  <Network className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">
                    Network View
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Interactive network graph visualization would be rendered
                    here
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="arbitrage" className="space-y-4">
              <div className="grid gap-4">
                {arbitrageOpportunities.length > 0 ? (
                  arbitrageOpportunities.map((opportunity, index) => (
                    <motion.div
                      key={opportunity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {opportunity.sourceProtocol}
                                </Badge>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                <Badge variant="outline">
                                  {opportunity.targetProtocol}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Token: {opportunity.token.slice(0, 10)}...
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm font-medium text-green-600">
                                  +{opportunity.priceDifference.toFixed(2)}%
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Profit:{' '}
                                  {formatNumber(opportunity.potentialProfit)}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  opportunity.priceDifference > 5
                                    ? 'default'
                                    : 'secondary'
                                }
                              >
                                {opportunity.priceDifference > 5
                                  ? 'High'
                                  : 'Medium'}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium text-muted-foreground">
                        No arbitrage opportunities detected
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Price differences between protocols are within normal
                        ranges
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Flow Analysis Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flow Patterns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shuffle className="h-5 w-5" />
              Dominant Flow Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {flowPatterns.dominant.length > 0 ? (
                flowPatterns.dominant.map((pattern, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{pattern.from}</Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">{pattern.to}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${Math.min(100, pattern.share)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {pattern.share.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No dominant flow patterns detected
                </p>
              )}

              {(flowPatterns.hubs.length > 0 ||
                flowPatterns.bottlenecks.length > 0) && (
                <div className="mt-6 pt-4 border-t border-border">
                  {flowPatterns.hubs.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-2">Flow Hubs:</p>
                      <div className="flex flex-wrap gap-1">
                        {flowPatterns.hubs.map((hub) => (
                          <Badge key={hub} variant="default">
                            {hub}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {flowPatterns.bottlenecks.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Bottlenecks:</p>
                      <div className="flex flex-wrap gap-1">
                        {flowPatterns.bottlenecks.map((bottleneck) => (
                          <Badge key={bottleneck} variant="destructive">
                            {bottleneck}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Liquidity Migration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Liquidity Migration Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Migration Direction</span>
                <Badge
                  variant={
                    liquidityMigration.direction === 'inbound'
                      ? 'default'
                      : liquidityMigration.direction === 'outbound'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {liquidityMigration.direction.toUpperCase()}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Migration Rate</span>
                <span className="font-medium">
                  {(liquidityMigration.migrationRate * 100).toFixed(1)}%
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">Top Destinations:</p>
                {liquidityMigration.topDestinations.map((dest, index) => (
                  <div
                    key={dest.protocol}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        #{index + 1}
                      </span>
                      <Badge variant="outline">{dest.protocol}</Badge>
                    </div>
                    <span className="text-sm font-medium">
                      {dest.volume >= 0 ? '+' : ''}
                      {formatNumber(dest.volume)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Migration Analysis:</p>
                    <p>
                      Positive values indicate net inflow, negative values
                      indicate net outflow
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
