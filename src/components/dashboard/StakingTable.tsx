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
import { Heart } from 'lucide-react'

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

interface AprMONVaultRedeem {
  id: string
  db_write_timestamp: string
  assets: string
  controller: string
  fee: string
  receiver: string
  requestId: string
  shares: string
}

interface MagmaStakingWithdraw {
  id: string
  db_write_timestamp: string
  gMonBurned: string
  amount: string
  withdrawer: string
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

// Normalized withdrawal interface for display
interface NormalizedWithdrawal {
  id: string
  protocol: string
  db_write_timestamp: string
  withdrawer: string
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
  aprMONVaultRedeemData?: {
    AprMONVault_Redeem?: AprMONVaultRedeem[]
  }
  magmaStakingWithdrawData?: {
    MagmaStaking_Withdraw?: MagmaStakingWithdraw[]
  }
}

export default function StakingTable({
  aprMONVaultData,
  magmaStakingData,
  aprMONVaultRedeemData,
  magmaStakingWithdrawData,
}: StakingTableProps) {
  const aprData = aprMONVaultData?.AprMONVault_Deposit || []
  const magmaData = magmaStakingData?.MagmaStaking_Deposit || []
  const aprRedeemData = aprMONVaultRedeemData?.AprMONVault_Redeem || []
  const magmaWithdrawData =
    magmaStakingWithdrawData?.MagmaStaking_Withdraw || []

  // Normalize and combine deposit data
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

  // Normalize and combine withdrawal data
  const allWithdrawals = useMemo(() => {
    // Normalize AprMONVault redeem data
    const normalizedAprRedeems: NormalizedWithdrawal[] = aprRedeemData.map(
      (redeem) => ({
        id: redeem.id,
        protocol: 'AprMON Vault',
        db_write_timestamp: redeem.db_write_timestamp,
        withdrawer: redeem.receiver,
        amount: parseFloat(redeem.shares) || 0,
        originalAmount: redeem.shares,
      }),
    )

    // Normalize MagmaStaking withdraw data
    const normalizedMagmaWithdraws: NormalizedWithdrawal[] =
      magmaWithdrawData.map((withdraw) => ({
        id: withdraw.id,
        protocol: 'Magma Staking',
        db_write_timestamp: withdraw.db_write_timestamp,
        withdrawer: withdraw.withdrawer,
        amount: parseFloat(withdraw.amount) || 0,
        originalAmount: withdraw.amount,
      }))

    // Combine and sort by timestamp (most recent first)
    return [...normalizedAprRedeems, ...normalizedMagmaWithdraws].sort(
      (a, b) => {
        const timestampA = new Date(a.db_write_timestamp).getTime() || 0
        const timestampB = new Date(b.db_write_timestamp).getTime() || 0
        return timestampB - timestampA
      },
    )
  }, [aprRedeemData, magmaWithdrawData])

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

  if (!allDeposits.length && !allWithdrawals.length) {
    return (
      <Card className="custom-card">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <CardTitle className="text-lg font-display text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            Staking
          </CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-muted-foreground animate-pulse" />
            </div>
            <p className="text-muted-foreground">No staking data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6 min-w-0">
        {/* Deposits Table */}
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
                      key={`deposit-${deposit.protocol}-${deposit.id}`}
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

        {/* Withdrawals Table */}
        <Card className="custom-card flex-1 min-w-0 py-0 gap-0">
          <CardHeader className="bg-muted/20 py-4 px-4 gap-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-display font-medium text-foreground">
                Staking Withdrawals
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
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
                      Withdrawer
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
                  {allWithdrawals.slice(0, 7).map((withdrawal) => (
                    <TableRow
                      key={`withdrawal-${withdrawal.protocol}-${withdrawal.id}`}
                      className="enhanced-table-row table-row-staggered"
                    >
                      <TableCell className="py-4 whitespace-nowrap">
                        <Badge
                          className={getProtocolBadgeColor(withdrawal.protocol)}
                        >
                          {withdrawal.protocol}
                        </Badge>
                      </TableCell>

                      <TableCell className="py-4 whitespace-nowrap">
                        <div className="font-mono text-xs text-muted-foreground">
                          {formatAddress(withdrawal.withdrawer)}
                        </div>
                      </TableCell>

                      <TableCell className="py-4 whitespace-nowrap">
                        <div className="font-medium text-sm text-foreground">
                          {formatNumber(withdrawal.amount, true, 18)}
                        </div>
                      </TableCell>

                      <TableCell className="py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground">
                          {formatTimeAgo(withdrawal.db_write_timestamp)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
