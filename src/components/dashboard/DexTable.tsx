import { formatTimeAgo, formatAddress, formatNumber } from '@/lib/helpers'
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react'
import { Button } from '../ui/button'
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
      MonorailDEX: 'bg-blue-100 text-blue-800',
      UniswapV2: 'bg-purple-100 text-purple-800',
      SushiSwap: 'bg-orange-100 text-orange-800',
      default: 'bg-gray-100 text-gray-800',
    }
    return colors[exchangeName] || colors.default
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Monorail DEX Swaps
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Exchange</TableHead>
                <TableHead>Token In</TableHead>
                <TableHead>Amount In</TableHead>
                <TableHead>Token Out</TableHead>
                <TableHead>Amount Out</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Gas Used</TableHead>
                <TableHead>Tx Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monorailDexSwaps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <p className="text-muted-foreground">No swaps found</p>
                  </TableCell>
                </TableRow>
              ) : (
                monorailDexSwaps.slice(0, 10).map((swap: MonorailSwap) => (
                  <TableRow key={swap.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {formatTimeAgo(String(swap.db_write_timestamp))}
                    </TableCell>

                    <TableCell>
                      <Badge
                        className={getExchangeBadgeColor(swap.exchangeName)}
                      >
                        {swap.exchangeName || 'Unknown'}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="font-mono text-xs">
                        {formatAddress(swap.tokenInAddress)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="h-3 w-3 text-red-500" />
                        <span className="font-medium text-red-600">
                          {formatNumber(swap.amountIn, true, 18)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-mono text-xs">
                        {formatAddress(swap.tokenOutAddress)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="font-medium text-green-600">
                          {formatNumber(swap.amountOut, true, 18)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-mono text-xs">
                        {formatAddress(swap.userAddress)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(swap.gasUsed, false)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">
                          {formatAddress(swap.transactionHash)}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() =>
                            window.open(
                              `https://explorer.monad.xyz/tx/${swap.transactionHash}`,
                              '_blank',
                            )
                          }
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
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
  )
}

export default DexTable
