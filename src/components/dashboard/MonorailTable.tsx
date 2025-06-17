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
import { Droplets, Hash } from 'lucide-react'
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
  if (!data || !data.Pool) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No monorail pool data available
          </p>
        </div>
      </div>
    )
  }

  const pools = data.Pool || []

  return (
    <div className="space-y-6">
      {/* Pools Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            Monorail Pools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pool Address</TableHead>
                  <TableHead>Token 0</TableHead>
                  <TableHead>Token 1</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Tick Spacing</TableHead>
                  <TableHead>Age</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pools.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground"
                    >
                      No pools found
                    </TableCell>
                  </TableRow>
                ) : (
                  pools.slice(0, 10).map((pool: any) => (
                    <TableRow key={pool.id}>
                      <TableCell className="font-mono text-sm">
                        {formatAddress(pool.pool)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <Hash className="h-3 w-3 text-muted-foreground" />
                          {formatAddress(pool.token0)}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <Hash className="h-3 w-3 text-muted-foreground" />
                          {formatAddress(pool.token1)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{formatFee(pool.fee)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatTickSpacing(pool.tickSpacing)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatTimeAgo(pool.db_write_timestamp)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
