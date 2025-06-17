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
import { formatAddress, formatTimeAgo } from '@/lib/helpers'
import { Activity, Zap } from 'lucide-react'

interface PumpingTimeData {
  id: string
  db_write_timestamp: number | string
  dev: string
  market: string
  supplyToDev: number
  token: string
  tokenURI: string
}

interface PumpingTimeTableProps {
  pools: { KuruDeployer_PumpingTime?: PumpingTimeData[] } | null | undefined
}

export default function PumpingTimeTable({ pools }: PumpingTimeTableProps) {
  const pumpingTimeData = pools?.KuruDeployer_PumpingTime || []

  if (!pools || !pumpingTimeData.length) {
    return (
      <Card className="custom-card">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <CardTitle className="text-lg font-display text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            Kuru Deployer - Pumping Time
          </CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-muted-foreground animate-pulse" />
            </div>
            <p className="text-muted-foreground">
              {!pools
                ? 'Loading pumping time data...'
                : 'No pumping time data available'}
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
            <Zap className="h-4 w-4 text-accent" />
            Kuru Deployer - Pumping Time Events
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
                  Name
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Symbol
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Dev
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Token
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Age
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pumpingTimeData.slice(0, 10).map((item) => {
                return (
                  <TableRow key={item.id} className="enhanced-table-row">
                    <TableCell className="py-4">
                      <div className="font-medium text-foreground">N/A</div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-medium text-foreground">SYM</div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          👨‍💻
                        </div>
                        <div className="text-sm">
                          <div className="font-mono text-xs text-muted-foreground">
                            {formatAddress(item.dev)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Developer
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          🚀
                        </div>
                        <div className="text-sm">
                          <div className="font-mono text-xs text-muted-foreground">
                            {formatAddress(item.token)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Token Address
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-muted-foreground">
                        {formatTimeAgo(item.db_write_timestamp as string)}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
