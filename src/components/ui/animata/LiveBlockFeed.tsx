'use client'

import { Box, User, Clock, Hash } from 'lucide-react'
import Counter from './Counter'

interface BlockData {
  BlockNum: number
  Author: string
  NumTx: number
  Timestamp: string
  Round: string
}

interface LiveBlockFeedProps {
  blocks: BlockData[]
  maxItems?: number
  className?: string
}

export default function LiveBlockFeed({
  blocks,
  maxItems = 3,
  className = '',
}: LiveBlockFeedProps) {
  const recentBlocks = blocks.slice(0, maxItems)

  // Ensure we always have 4 slots, fill empty ones with null
  const blockSlots = Array(3)
    .fill(null)
    .map((_, index) => recentBlocks[index] || null)

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const formatAuthor = (author: string) => {
    return author.split('.')[0] || author.substring(0, 12)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {blockSlots.map((block, index) => (
        <div
          key={`block-slot-${index}`}
          className="custom-card p-3 bg-gradient-to-r from-accent/5 to-primary/5 border-l-2 border-accent min-h-[80px] flex flex-col justify-center"
        >
          {block ? (
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-accent" />
                  <span className="font-mono text-sm font-semibold text-foreground">
                    #<Counter targetValue={block.BlockNum} />
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(block.Timestamp)}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {formatAuthor(block.Author)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Hash className="w-3 h-3 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    <Counter targetValue={block.NumTx} /> txs
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground/50 text-xs">
              Waiting for block...
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
