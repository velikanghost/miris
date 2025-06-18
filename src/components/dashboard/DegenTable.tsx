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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatAddress, formatNumber, formatTimeAgo } from '@/lib/helpers'
import { Activity, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { MONAD_TESTNET_SCAN_URL } from '@/lib/utils'
import { useState } from 'react'

interface DegenTableProps {
  data: any
}

export default function DegenTable({ data }: DegenTableProps) {
  const [isInitialLoad] = useState(true)

  if (!data) {
    return (
      <Card className="custom-card">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <CardTitle className="text-lg font-display text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            Degen Data
          </CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto">
              <Activity className="w-8 h-8 text-muted-foreground animate-pulse" />
            </div>
            <p className="text-muted-foreground">No degen data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { IBondingCurveFactory_Create = [], BondingCurve_Sync = [] } = data

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6 min-w-0">
        <Card className="flex-1 min-w-0 custom-card py-0 gap-0">
          <CardHeader className="bg-muted/20 px-4 py-4 gap-0 border-b border-border/50 !pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-display font-medium text-foreground">
                Token Creates
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="enhanced-table px-2 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="mx-auto border-b border-border/50 bg-muted/10">
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      Name
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      Dev
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      Token
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      Age
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {IBondingCurveFactory_Create.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground py-8"
                      >
                        No token creates found
                      </TableCell>
                    </TableRow>
                  ) : (
                    IBondingCurveFactory_Create.slice(0, 7).map((item: any) => (
                      <TableRow
                        key={item.id}
                        className={`enhanced-table-row ${
                          isInitialLoad
                            ? 'table-row-staggered'
                            : 'table-row-enter'
                        }`}
                      >
                        <TableCell className="py-4 whitespace-nowrap">
                          <div className="font-medium text-foreground flex flex-col gap-2">
                            <Badge
                              variant="secondary"
                              className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-foreground font-bold text-xs px-2 py-1 rounded-md border border-blue-400/30 w-fit shadow-sm"
                            >
                              {item.symbol || 'N/A'}
                            </Badge>
                            <span className="text-sm">
                              {item.name && item.name.length > 20
                                ? `${item.name.substring(0, 20)}...`
                                : item.name || 'N/A'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 whitespace-nowrap">
                          <div className="font-mono text-xs text-muted-foreground">
                            {formatAddress(item.owner)}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 whitespace-nowrap">
                          <Link
                            href={`${MONAD_TESTNET_SCAN_URL}/address/${item.token}`}
                            target="_blank"
                            className="tx-link inline-flex items-center gap-2 text-xs text-accent hover:text-accent/80"
                          >
                            <span className="font-mono">
                              {formatAddress(item.token)}
                            </span>
                            <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        </TableCell>
                        <TableCell className="py-4 whitespace-nowrap">
                          <div className="text-sm text-muted-foreground">
                            {formatTimeAgo(item.db_write_timestamp)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 min-w-0 custom-card py-0 gap-0 max-w-80">
          <CardHeader className="bg-muted/20 px-4 py-4 gap-0 border-b border-border/50 !pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-display font-medium text-foreground">
                Bonding Curve Syncs
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="enhanced-table px-2 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="mx-auto border-b border-border/50 bg-muted/10">
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap text-left">
                      Token
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap text-right">
                      Synced
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {BondingCurve_Sync.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground py-8"
                      >
                        No syncs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    BondingCurve_Sync.slice(0, 7).map((item: any) => (
                      <TableRow
                        key={item.id}
                        className={`enhanced-table-row ${
                          isInitialLoad
                            ? 'table-row-staggered'
                            : 'table-row-enter'
                        }`}
                      >
                        <TableCell className="py-4 whitespace-nowrap">
                          <Link
                            href={`${MONAD_TESTNET_SCAN_URL}/address/${item.token}`}
                            target="_blank"
                            className="tx-link inline-flex items-center gap-2 text-xs text-accent hover:text-accent/80"
                          >
                            <span className="font-mono">
                              {formatAddress(item.token)}
                            </span>
                            <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        </TableCell>
                        <TableCell className="py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-muted-foreground">
                            {formatTimeAgo(item.db_write_timestamp)}
                          </div>
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
    </div>
  )
}
