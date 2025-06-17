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
                <TableHead>Name</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Dev</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Age</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pumpingTimeData.slice(0, 10).map((item) => {
                return (
                  <TableRow key={item.id} className="hover:bg-accent/50">
                    <TableCell className="font-medium">{'N/A'}</TableCell>
                    <TableCell className="font-medium">{'SYM'}</TableCell>
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
                    <TableCell className="text-sm text-muted-foreground">
                      {formatTimeAgo(item.db_write_timestamp as string)}
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
