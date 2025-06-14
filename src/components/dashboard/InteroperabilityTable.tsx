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
import { ExternalLink, Package, Send } from 'lucide-react'

interface DeliveryData {
  id: string
  db_write_timestamp: number
  additionalStatusInfo: string
  deliveryVaaHash: string
  gasUsed: number
  overridesInfo: string
  refundStatus: string
  recipientContract: string
  sourceChain: number
  status: number
  sequence: number
}

interface SendEventData {
  id: string
  db_write_timestamp: number
  sequence: number
  deliveryQuote: number
  paymentForExtraReceiverValue: number
}

interface InteroperabilityTableProps {
  data:
    | {
        WormholeRelayer_Delivery?: DeliveryData[]
        WormholeRelayer_SendEvent?: SendEventData[]
      }
    | null
    | undefined
}

export default function InteroperabilityTable({
  data,
}: InteroperabilityTableProps) {
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
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const getStatusBadge = (status: number) => {
    const statusMap: {
      [key: number]: {
        label: string
        variant: 'default' | 'secondary' | 'destructive' | 'outline'
      }
    } = {
      0: { label: 'Pending', variant: 'outline' },
      1: { label: 'Success', variant: 'default' },
      2: { label: 'Failed', variant: 'destructive' },
      3: { label: 'Partial', variant: 'secondary' },
    }

    const statusInfo = statusMap[status] || {
      label: 'Unknown',
      variant: 'outline',
    }

    return (
      <Badge
        variant={statusInfo.variant}
        className={`${
          statusInfo.variant === 'default'
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
            : ''
        }`}
      >
        {statusInfo.label}
      </Badge>
    )
  }

  const getChainName = (chainId: number) => {
    const chainMap: { [key: number]: string } = {
      1: 'Ethereum',
      2: 'BSC',
      3: 'Polygon',
      4: 'Avalanche',
      5: 'Fantom',
      6: 'Arbitrum',
      7: 'Optimism',
      8: 'Base',
      // Add more chains as needed
    }
    return chainMap[chainId] || `Chain ${chainId}`
  }

  const deliveryData = data?.WormholeRelayer_Delivery || []
  const sendEventData = data?.WormholeRelayer_SendEvent || []

  if (!data || (!deliveryData.length && !sendEventData.length)) {
    return (
      <Card className="crypto-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">
            Wormhole Relayer - Interoperability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            {!data
              ? 'Loading interoperability data...'
              : 'No interoperability data available'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="crypto-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          Wormhole Relayer - Cross-Chain Interoperability
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deliveries" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[300px]">
            <TabsTrigger value="deliveries" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Deliveries ({deliveryData.length})
            </TabsTrigger>
            <TabsTrigger value="sendevents" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send Events ({sendEventData.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deliveries" className="mt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>VAA Hash</TableHead>
                    <TableHead>Source Chain</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Gas Used</TableHead>
                    <TableHead>Sequence</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveryData.slice(0, 10).map((delivery) => (
                    <TableRow key={delivery.id} className="hover:bg-accent/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            🌉
                          </div>
                          <div className="text-sm">
                            <div className="font-mono text-xs">
                              {formatAddress(delivery.deliveryVaaHash)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              VAA Hash
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        >
                          {getChainName(delivery.sourceChain)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatAddress(delivery.recipientContract)}
                      </TableCell>
                      <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                      <TableCell className="font-semibold text-primary">
                        {formatNumber(delivery.gasUsed)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        #{delivery.sequence}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatTimestamp(delivery.db_write_timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {deliveryData.length > 10 && (
              <div className="text-center mt-4 text-sm text-muted-foreground">
                Showing 10 of {deliveryData.length} deliveries
              </div>
            )}
          </TabsContent>

          <TabsContent value="sendevents" className="mt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event ID</TableHead>
                    <TableHead>Sequence</TableHead>
                    <TableHead>Delivery Quote</TableHead>
                    <TableHead>Extra Payment</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sendEventData.slice(0, 10).map((sendEvent) => (
                    <TableRow key={sendEvent.id} className="hover:bg-accent/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            📤
                          </div>
                          <div className="text-sm">
                            <div className="font-mono text-xs">
                              {formatAddress(sendEvent.id)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Event ID
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-primary">
                        #{sendEvent.sequence}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        >
                          {formatNumber(sendEvent.deliveryQuote)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatNumber(sendEvent.paymentForExtraReceiverValue)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatTimestamp(sendEvent.db_write_timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {sendEventData.length > 10 && (
              <div className="text-center mt-4 text-sm text-muted-foreground">
                Showing 10 of {sendEventData.length} send events
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
