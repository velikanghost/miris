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
import { ExternalLink } from 'lucide-react'

interface PumpingTimeData {
  id: string
  db_write_timestamp: number
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
  const formatNumber = (num: number) => {
    if (num >= 1e9) {
      return `${(num / 1e9).toFixed(2)}B`
    } else if (num >= 1e6) {
      return `${(num / 1e6).toFixed(2)}M`
    } else if (num >= 1e3) {
      return `${(num / 1e3).toFixed(2)}K`
    }
    return `${num.toLocaleString()}`
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const pumpingTimeData = pools?.KuruDeployer_PumpingTime || []

  if (!pools || !pumpingTimeData.length) {
    return (
      <Card className="crypto-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">
            Kuru Deployer - Pumping Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            {!pools
              ? 'Loading pumping time data...'
              : 'No pumping time data available'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="crypto-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          Kuru Deployer - Pumping Time Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Developer</TableHead>
                <TableHead>Market</TableHead>
                <TableHead>Supply to Dev</TableHead>
                <TableHead>Token URI</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pumpingTimeData.slice(0, 10).map((item) => {
                return (
                  <TableRow key={item.id} className="hover:bg-accent/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          🚀
                        </div>
                        <div className="text-sm">
                          <div className="font-semibold">
                            {formatAddress(item.token)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Token Address
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          👨‍💻
                        </div>
                        <div className="text-sm">
                          <div className="font-mono">
                            {formatAddress(item.dev)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Developer
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          📈
                        </div>
                        <div className="text-sm">
                          <div className="font-mono">
                            {formatAddress(item.market)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Market Address
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      <Badge
                        variant="outline"
                        className="bg-orange-50 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                      >
                        {formatNumber(item.supplyToDev)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.tokenURI ? (
                          <a
                            href={item.tokenURI}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View URI
                          </a>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            No URI
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatTimestamp(item.db_write_timestamp)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        {pumpingTimeData.length > 10 && (
          <div className="text-center mt-4 text-sm text-muted-foreground">
            Showing 10 of {pumpingTimeData.length} pumping time events
          </div>
        )}
      </CardContent>
    </Card>
  )
}
