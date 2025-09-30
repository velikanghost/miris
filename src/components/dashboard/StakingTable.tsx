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
import {
  formatAddress,
  formatEther,
  formatNumber,
  formatPrice,
} from '@/lib/helpers'
import { Heart } from 'lucide-react'

interface AprMonDeposit {
  id: string
  assets: string
  owner: string
  sender: string
  shares: string
}

interface MagmaDeposit {
  id: string
  amount: string
  depositor: string
  gMonMinted: string
  referralId: string
}

interface AprMonRedeem {
  id: string
  assets: string
  shares: string
  controller: string
  fee: string
  receiver: string
  requestId: string
}

interface MagmaWithdraw {
  id: string
  amount: string
  withdrawer: string
  gMonBurned: string
}

// Normalized deposit interface for display
interface NormalizedDeposit {
  id: string
  protocol: string
  depositor: string
  amount: number
  originalAmount: string
}

// Normalized withdrawal interface for display
interface NormalizedWithdrawal {
  id: string
  protocol: string
  withdrawer: string
  amount: number
  originalAmount: string
}

interface StakingTableProps {
  aprMonDepositData?: {
    AprMon_Deposit?: AprMonDeposit[]
  }
  magmaDepositData?: {
    Magma_Deposit?: MagmaDeposit[]
  }
  aprMonRedeemData?: {
    AprMon_Redeem?: AprMonRedeem[]
  }
  magmaWithdrawData?: {
    Magma_Withdraw?: MagmaWithdraw[]
  }
}

export default function StakingTable({
  aprMonDepositData,
  magmaDepositData,
  aprMonRedeemData,
  magmaWithdrawData,
}: StakingTableProps) {
  const aprData = aprMonDepositData?.AprMon_Deposit || []
  const magmaData = magmaDepositData?.Magma_Deposit || []
  const aprRedeemData = aprMonRedeemData?.AprMon_Redeem || []
  const magmaWithdraws = magmaWithdrawData?.Magma_Withdraw || []

  // Normalize and combine deposit data
  const allDeposits = useMemo(() => {
    // Normalize AprMon data
    const normalizedAprDeposits: NormalizedDeposit[] = aprData.map(
      (deposit) => ({
        id: deposit.id,
        protocol: 'AprMon',
        depositor: deposit.sender,
        amount: parseFloat(deposit.shares) || 0,
        originalAmount: deposit.shares,
      }),
    )

    // Normalize Magma data
    const normalizedMagmaDeposits: NormalizedDeposit[] = magmaData.map(
      (deposit) => ({
        id: deposit.id,
        protocol: 'Magma',
        depositor: deposit.depositor,
        amount: parseFloat(deposit.amount) || 0,
        originalAmount: deposit.amount,
      }),
    )

    // Combine data (no sorting since we don't have timestamps)
    return [...normalizedAprDeposits, ...normalizedMagmaDeposits]
  }, [aprData, magmaData])

  // Normalize and combine withdrawal data
  const allWithdrawals = useMemo(() => {
    // Normalize AprMon redeem data
    const normalizedAprRedeems: NormalizedWithdrawal[] = aprRedeemData.map(
      (redeem) => ({
        id: redeem.id,
        protocol: 'AprMon',
        withdrawer: redeem.receiver,
        amount: parseFloat(redeem.shares) || 0,
        originalAmount: redeem.shares,
      }),
    )

    // Normalize Magma withdraw data
    const normalizedMagmaWithdraws: NormalizedWithdrawal[] = magmaWithdraws.map(
      (withdraw) => ({
        id: withdraw.id,
        protocol: 'Magma',
        withdrawer: withdraw.withdrawer,
        amount: parseFloat(withdraw.amount) || 0,
        originalAmount: withdraw.amount,
      }),
    )

    // Combine data (no sorting since we don't have timestamps)
    return [...normalizedAprRedeems, ...normalizedMagmaWithdraws]
  }, [aprRedeemData, magmaWithdrawData])

  const getProtocolBadgeColor = (protocol: string) => {
    const colors: { [key: string]: string } = {
      AprMon:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
      Magma:
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
                          {formatEther(deposit.amount)}
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
                          {formatEther(withdrawal.amount)}
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
