'use client'

import { useMemo } from 'react'
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
import { formatAddress, formatNumber, formatTimeAgo } from '@/lib/helpers'
import { Activity, ArrowUpRight, Heart } from 'lucide-react'
import Link from 'next/link'
import { MONAD_TESTNET_SCAN_URL } from '@/lib/utils'

interface AprMONVaultDeposit {
  id: string
  db_write_timestamp: string
  sender: string
  shares: string
  owner: string
}

interface MagmaStakingDeposit {
  id: string
  db_write_timestamp: string
  depositor: string
  amount: string
  gMonMinted: string
  referralId: string
}

// Normalized deposit interface for display
interface NormalizedDeposit {
  id: string
  protocol: string
  db_write_timestamp: string
  depositor: string
  amount: number
  originalAmount: string
}

interface StakingTableProps {
  aprMONVaultData?: {
    AprMONVault_Deposit?: AprMONVaultDeposit[]
  }
  magmaStakingData?: {
    MagmaStaking_Deposit?: MagmaStakingDeposit[]
  }
}

export default function StakingTable({
  aprMONVaultData,
  magmaStakingData,
}: StakingTableProps) {
  const aprData = aprMONVaultData?.AprMONVault_Deposit || []
  const magmaData = magmaStakingData?.MagmaStaking_Deposit || []

  // Normalize and combine data
  const allDeposits = useMemo(() => {
    // Normalize AprMONVault data
    const normalizedAprDeposits: NormalizedDeposit[] = aprData.map(
      (deposit) => ({
        id: deposit.id,
        protocol: 'AprMON Vault',
        db_write_timestamp: deposit.db_write_timestamp,
        depositor: deposit.sender,
        amount: parseFloat(deposit.shares) || 0,
        originalAmount: deposit.shares,
      }),
    )

    // Normalize MagmaStaking data
    const normalizedMagmaDeposits: NormalizedDeposit[] = magmaData.map(
      (deposit) => ({
        id: deposit.id,
        protocol: 'Magma Staking',
        db_write_timestamp: deposit.db_write_timestamp,
        depositor: deposit.depositor,
        amount: parseFloat(deposit.amount) || 0,
        originalAmount: deposit.amount,
      }),
    )

    // Combine and sort by timestamp (most recent first)
    return [...normalizedAprDeposits, ...normalizedMagmaDeposits].sort(
      (a, b) => {
        const timestampA = new Date(a.db_write_timestamp).getTime() || 0
        const timestampB = new Date(b.db_write_timestamp).getTime() || 0
        return timestampB - timestampA
      },
    )
  }, [aprData, magmaData])

  // Calculate statistics
  const stats = useMemo(() => {
    if (!allDeposits.length)
      return {
        protocolCounts: {},
        topProtocols: [],
        highestVolumes: [],
      }

    // Count deposits by protocol
    const protocolCounts = allDeposits.reduce((acc, deposit) => {
      acc[deposit.protocol] = (acc[deposit.protocol] || 0) + 1
      return acc
    }, {} as { [key: string]: number })

    // Get top 3 protocols by deposit count
    const topProtocols = Object.entries(protocolCounts)
      .map(([protocol, count]) => ({
        protocol,
        count,
        percentage: protocolCounts ? (count / allDeposits.length) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)

    // Get highest volume deposits (top 3)
    const highestVolumes = allDeposits
      .filter((deposit) => deposit.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3)

    return {
      protocolCounts,
      topProtocols,
      highestVolumes,
    }
  }, [allDeposits])

  const getProtocolBadgeColor = (protocol: string) => {
    const colors: { [key: string]: string } = {
      'AprMON Vault':
        'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
      'Magma Staking':
        'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
      default:
        'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200',
    }
    return colors[protocol] || colors.default
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6 min-w-0">
        {/* Main Table */}
        <Card className="custom-card flex-1 min-w-0 py-0 gap-0">
          <CardHeader className="bg-muted/20 py-4 px-4 gap-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-display font-medium text-foreground">
                Staking Deposits
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
                      Protocol
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      Depositor
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      Amount
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      Time
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allDeposits.slice(0, 7).map((deposit) => (
                    <TableRow
                      key={`${deposit.protocol}-${deposit.id}`}
                      className="enhanced-table-row table-row-staggered"
                    >
                      <TableCell className="py-4 whitespace-nowrap">
                        <Badge
                          className={getProtocolBadgeColor(deposit.protocol)}
                        >
                          {deposit.protocol}
                        </Badge>
                      </TableCell>

                      <TableCell className="py-4 whitespace-nowrap">
                        <div className="font-mono text-xs text-muted-foreground">
                          {formatAddress(deposit.depositor)}
                        </div>
                      </TableCell>

                      <TableCell className="py-4 whitespace-nowrap">
                        <div className="font-medium text-sm text-foreground">
                          {formatNumber(deposit.amount, true, 18)}
                        </div>
                      </TableCell>

                      <TableCell className="py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground">
                          {formatTimeAgo(deposit.db_write_timestamp)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Stats Sidebar */}
        <Card className="custom-card py-0 gap-0 min-w-80 lg:w-80 lg:flex-shrink-0">
          <CardHeader className="bg-muted/20 px-4 py-4 gap-0 border-b border-border/50 !pb-4">
            <CardTitle className="text-base font-display text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent" />
              Staking Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-6">
            {/* Top 3 Protocols */}
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
                Top Protocols by Deposits
              </div>
              <div className="space-y-3">
                {stats.topProtocols.map((protocol, index) => (
                  <div key={protocol.protocol} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {protocol.protocol}
                      </span>
                      <span className="text-sm font-mono text-foreground">
                        {protocol.count} deposits
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300 ease-out"
                        style={{
                          width: `${protocol.percentage}%`,
                          backgroundColor:
                            index === 0
                              ? 'hsl(217, 91%, 60%)'
                              : 'hsl(271, 81%, 56%)',
                        }}
                      />
                    </div>
                  </div>
                ))}

                {stats.topProtocols.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-4">
                    No protocols available
                  </div>
                )}
              </div>
            </div>

            {/* Highest Volumes */}
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
                Highest Volume Deposits
              </div>
              <div className="space-y-2">
                {stats.highestVolumes.length > 0 ? (
                  stats.highestVolumes.map((deposit) => (
                    <div
                      key={deposit.id}
                      className="flex flex-row p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 gap-3"
                    >
                      {/* Left side - Protocol indicator */}
                      <div className="flex items-center">
                        <Badge
                          className={`text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center ${getProtocolBadgeColor(
                            deposit.protocol,
                          )}`}
                        >
                          {deposit.protocol.charAt(0)}
                        </Badge>
                      </div>

                      {/* Right side - Amount and tx hash */}
                      <div className="flex-1 space-y-1">
                        <div className="text-sm font-medium font-mono">
                          {formatNumber(deposit.amount, true, 18)}
                        </div>
                        <Link
                          href={`${MONAD_TESTNET_SCAN_URL}/tx/${deposit.id}`}
                          target="_blank"
                          className="text-xs text-muted-foreground hover:text-accent transition-colors font-mono"
                        >
                          {formatAddress(deposit.id)}
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground text-center py-4">
                    No deposits available
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
