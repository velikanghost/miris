'use client'
import { motion } from 'framer-motion'
import { Activity, Zap, Box, Clock } from 'lucide-react'
import Counter from '@/components/ui/animata/Counter'
import Ticker from '@/components/ui/animata/Ticker'
import RingChart from '@/components/ui/animata/RingChart'
import LiveBlockFeed from '@/components/ui/animata/LiveBlockFeed'

interface EpochData {
  block_num: string
  blocks_completed: string
  boundary_phase_completion_percentage: number
  boundary_phase_remaining_percentage: number
  epoch: string
  round: string
  timestamp: string
}

interface BlockData {
  BlockNum: number
  Author: string
  AuthorNodeID: string
  NumTx: number
  Round: string
  Timestamp: string
  Epoch: number
}

interface ChainData {
  bucket: string
  blocks: string
  txs: string
  avg_bps: number
  avg_tps: number
  total_gas: string
  avg_tx_per_block: number
  avg_gas_per_block: number
  avg_base_fee_per_tx: number
  avg_priority_fee_per_tx: number
  avg_gas_price: number
  max_tx: number
  avg_block_time_s: string
  avg_block_fullness_pct: number
}

interface ChainSummaryProps {
  epochData: EpochData | null
  recentBlocks: BlockData[]
  isConnected: boolean
  connectionError: string | null
  realTimeTPS: number
  realTimeBPS: number
  avgBlockTime: number
  httpData: ChainData | null
  httpLoading: boolean
}

export default function ChainSummary({
  epochData,
  recentBlocks,
  isConnected,
  connectionError,
  realTimeTPS,
  realTimeBPS,
  avgBlockTime,
  httpData,
  httpLoading,
}: ChainSummaryProps) {
  const formatNumber = (num: number | string): string => {
    const n = typeof num === 'string' ? parseFloat(num) : num
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B'
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M'
    if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K'
    return n.toFixed(2)
  }

  if (httpLoading && !epochData && recentBlocks.length === 0) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <img src="/anago_loading.gif" alt="Loading" className="w-24 h-24" />
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {connectionError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="custom-card p-3 bg-yellow-500/10 border-yellow-500/20 border"
        >
          <p className="text-yellow-600 dark:text-yellow-400 text-sm">
            {connectionError}
          </p>
        </motion.div>
      )}

      {/* Real-time metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Real-time TPS */}
        <motion.div
          className="custom-card flex flex-col justify-between p-6 group hover:scale-105 transition-all duration-300"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <div className="text-right">
              <Counter
                targetValue={realTimeTPS || httpData?.avg_tps || 0}
                format={(v) => v.toFixed(1)}
                className="text-2xl font-bold text-gradient"
              />
              <div className="text-xs text-muted-foreground">TPS</div>
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">
              {isConnected ? 'Real-time' : 'Last known'} transactions/sec
            </div>
            <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent to-secondary"
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(
                    ((realTimeTPS || httpData?.avg_tps || 0) / 200) * 100,
                    100,
                  )}%`,
                }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Real-time BPS */}
        <motion.div
          className="custom-card flex flex-col justify-between p-6 group hover:scale-105 transition-all duration-300"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Box className="w-5 h-5 text-primary" />
            </div>
            <div className="text-right">
              <Counter
                targetValue={realTimeBPS || httpData?.avg_bps || 0}
                format={(v) => v.toFixed(1)}
                className="text-2xl font-bold text-gradient"
              />
              <div className="text-xs text-muted-foreground">BPS</div>
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">
              Blocks per second
            </div>
            <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                animate={{
                  width: `${Math.min(
                    ((realTimeBPS || httpData?.avg_bps || 0) / 5) * 100,
                    100,
                  )}%`,
                }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Block Time */}
        <motion.div
          className="custom-card flex flex-col justify-between p-6 group hover:scale-105 transition-all duration-300"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Clock className="w-5 h-5 text-secondary" />
            </div>
            <div className="text-right">
              <Ticker
                value={`${(
                  avgBlockTime || parseFloat(httpData?.avg_block_time_s || '0')
                ).toFixed(2)}s`}
                className="text-2xl font-bold text-gradient"
              />
              <div className="text-xs text-muted-foreground">Block Time</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Average processing time
          </div>
        </motion.div>

        {/* Current Epoch Progress */}
        <motion.div
          className="custom-card flex flex-col justify-between  p-6 group hover:scale-105 transition-all duration-300"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-accent-orange/10 rounded-lg">
              <RingChart
                progress={epochData?.boundary_phase_completion_percentage || 0}
                size={40}
                strokeWidth={4}
                className="text-gradient"
              />
            </div>
            <div className="text-right">
              <Counter
                targetValue={
                  epochData?.boundary_phase_completion_percentage || 0
                }
                format={(v) => `${v.toFixed(1)}%`}
                className="text-2xl font-bold text-gradient"
              />
              <div className="text-xs text-muted-foreground">
                Epoch Progress
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Boundary phase completion
          </div>
        </motion.div>
      </div>

      {/* Live Block Stream & Epoch Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Block Feed */}
        <div className="custom-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
            <Box className="w-5 h-5 text-accent" />
            Live Block Stream
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-3 h-3 border border-accent border-t-transparent rounded-full"
            />
          </h3>

          {recentBlocks.length > 0 ? (
            <LiveBlockFeed blocks={recentBlocks} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Box className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Waiting for live blocks...</p>
            </div>
          )}
        </div>

        {/* Epoch Information */}
        <div className="custom-card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
            <Activity className="w-5 h-5 text-accent" />
            Network Status
          </h3>

          <div className="space-y-3">
            {epochData && (
              <>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Current Epoch
                  </span>
                  <Ticker
                    value={epochData.epoch}
                    className="font-mono text-sm font-medium text-foreground"
                  />
                </div>

                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Latest Block
                  </span>
                  <Counter
                    targetValue={parseInt(epochData.block_num)}
                    format={(v) => `#${Math.floor(v).toLocaleString()}`}
                    className="font-mono text-sm font-medium text-foreground"
                  />
                </div>

                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Blocks Completed
                  </span>
                  <Counter
                    targetValue={parseInt(epochData.blocks_completed)}
                    format={(v) => Math.floor(v).toLocaleString()}
                    className="font-mono text-sm font-medium text-foreground"
                  />
                </div>
              </>
            )}

            {httpData && (
              <>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Avg Gas per TX
                  </span>
                  <span className="font-mono text-sm font-medium text-foreground">
                    {formatNumber(httpData.avg_base_fee_per_tx)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Network Utilization
                  </span>
                  <span className="font-mono text-sm font-medium text-foreground">
                    {httpData.avg_block_fullness_pct.toFixed(1)}%
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
