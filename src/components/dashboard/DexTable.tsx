import { formatTimeAgo, formatAddress, formatNumber } from '@/lib/helpers'
import { TrendingUp, TrendingDown, ArrowUpRight, Activity } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../ui/table'
import Link from 'next/link'
import { MONAD_TESTNET_SCAN_URL } from '@/lib/utils'

interface MonorailSwap {
  id: string
  db_write_timestamp: number | string
  amountIn: number
  amountOut: number
  tokenInAddress: string
  tokenOutAddress: string
  userAddress: string
  exchangeName: string
  exchangeAddress: string
  fee: number
  gasUsed: number
  gasPrice: number
  timestamp: number
  transactionHash: string
}

interface DexTableProps {
  data: {
    SwapEvent?: MonorailSwap[]
  }
}

const DexTable = ({ data }: DexTableProps) => {
  // Access the SwapEvent array from the GraphQL response
  const monorailDexSwaps = data?.SwapEvent || []

  const getExchangeBadgeColor = (exchangeName: string) => {
    const colors: { [key: string]: string } = {
      MonorailDEX:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
      UniswapV2:
        'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
      SushiSwap:
        'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200',
      default:
        'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200',
    }
    return colors[exchangeName] || colors.default
  }

  if (!data || !monorailDexSwaps.length) {
    return (
      <Card className="custom-card">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <CardTitle className="text-lg font-display text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            Monorail DEX Swaps
          </CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto">
              <Activity className="w-8 h-8 text-muted-foreground animate-pulse" />
            </div>
            <p className="text-muted-foreground">
              {!data ? 'Loading swaps...' : 'No swaps available'}
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
            <TrendingUp className="h-4 w-4 text-accent" />
            Monorail DEX Swaps
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
                  Time
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Exchange
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Token In
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Amount In
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Token Out
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Amount Out
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  User
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Gas Used
                </TableHead>
                <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                  Transaction
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monorailDexSwaps.slice(0, 10).map((swap: MonorailSwap) => (
                <TableRow key={swap.id} className="enhanced-table-row">
                  <TableCell className="py-4">
                    <div className="text-sm text-foreground">
                      {formatTimeAgo(String(swap.db_write_timestamp))}
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <Badge className={getExchangeBadgeColor(swap.exchangeName)}>
                      {swap.exchangeName || 'Unknown'}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="font-mono text-xs text-muted-foreground">
                      {formatAddress(swap.tokenInAddress)}
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-3 w-3 text-red-500" />
                      <span className="volume-text text-sm">
                        {formatNumber(swap.amountIn, true, 18)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="font-mono text-xs text-muted-foreground">
                      {formatAddress(swap.tokenOutAddress)}
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="volume-text text-sm">
                        {formatNumber(swap.amountOut, true, 18)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="font-mono text-xs text-muted-foreground">
                      {formatAddress(swap.userAddress)}
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(swap.gasUsed, false)}
                    </span>
                  </TableCell>

                  <TableCell className="py-4">
                    <Link
                      href={`${MONAD_TESTNET_SCAN_URL}/tx/${swap.transactionHash}`}
                      target="_blank"
                      className="tx-link inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80"
                    >
                      <span className="font-mono">
                        {formatAddress(swap.transactionHash)}
                      </span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
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

export default DexTable
