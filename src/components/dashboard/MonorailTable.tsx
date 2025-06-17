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
import { Droplets, Hash, Activity } from 'lucide-react'
import { formatAddress, formatTimeAgo } from '@/lib/helpers'

interface MonorailTableProps {
  data: any
}

const formatFee = (fee: string | number) => {
  if (!fee) return '0%'
  const feeNum = typeof fee === 'string' ? parseFloat(fee) : fee
  if (isNaN(feeNum)) return '0%'
  // Convert from basis points to percentage
  return `${(feeNum / 10000).toFixed(2)}%`
}

const formatTickSpacing = (tickSpacing: string | number) => {
  if (!tickSpacing) return 'N/A'
  return tickSpacing.toString()
}

export default function MonorailTable({ data }: MonorailTableProps) {
  const pools = data?.Pool || []

  if (!data || !pools.length) {
    return (
      <Card className="custom-card">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <CardTitle className="text-lg font-display text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            Monorail Pools
          </CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto">
              <Droplets className="w-8 h-8 text-muted-foreground animate-pulse" />
            </div>
            <p className="text-muted-foreground">
              {!data ? 'Loading pools...' : 'No pools available'}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="custom-card py-0 gap-0">
      <CardHeader className="bg-muted/20 px-4 py-4 gap-0 border-b border-border/50 !pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-display font-medium text-foreground flex items-center gap-2">
            <Droplets className="h-4 w-4 text-accent" />
            Monorail Pools
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="enhanced-table px-2">
          <Table>
            <TableHeader>
              <TableRow className="mx-auto border-b border-border/50 bg-muted/10">
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Pool Address
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Token 0
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Token 1
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Fee
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Tick Spacing
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Age
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pools.slice(0, 10).map((pool: any) => (
                <TableRow key={pool.id} className="enhanced-table-row">
                  <TableCell className="py-4">
                    <div className="font-mono text-xs text-muted-foreground">
                      {formatAddress(pool.pool)}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <Hash className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatAddress(pool.token0)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <Hash className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatAddress(pool.token1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="secondary">{formatFee(pool.fee)}</Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline">
                      {formatTickSpacing(pool.tickSpacing)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="text-sm text-muted-foreground">
                      {formatTimeAgo(pool.db_write_timestamp)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
