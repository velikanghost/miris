'use client'

import { useState } from 'react'
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
import { Package, Send } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { formatAddress, formatTimeAgo } from '@/lib/helpers'

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
  db_write_timestamp: number | string
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
  const [deliveryCurrentPage, setDeliveryCurrentPage] = useState(1)
  const [sendEventCurrentPage, setSendEventCurrentPage] = useState(1)
  const itemsPerPage = 10

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

  // Delivery pagination
  const totalDeliveryItems = deliveryData.length
  const totalDeliveryPages = Math.ceil(totalDeliveryItems / itemsPerPage)
  const deliveryStartIndex = (deliveryCurrentPage - 1) * itemsPerPage
  const deliveryEndIndex = deliveryStartIndex + itemsPerPage
  const paginatedDeliveryData = deliveryData.slice(
    deliveryStartIndex,
    deliveryEndIndex,
  )

  // Send Event pagination
  const totalSendEventItems = sendEventData.length
  const totalSendEventPages = Math.ceil(totalSendEventItems / itemsPerPage)
  const sendEventStartIndex = (sendEventCurrentPage - 1) * itemsPerPage
  const sendEventEndIndex = sendEventStartIndex + itemsPerPage
  const paginatedSendEventData = sendEventData.slice(
    sendEventStartIndex,
    sendEventEndIndex,
  )

  const handleDeliveryPageChange = (page: number) => {
    setDeliveryCurrentPage(page)
  }

  const handleSendEventPageChange = (page: number) => {
    setSendEventCurrentPage(page)
  }

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
        <div className="text-sm text-muted-foreground mt-2">
          Total: {totalDeliveryItems.toLocaleString()} deliveries,{' '}
          {totalSendEventItems.toLocaleString()} send events
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deliveries" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[300px]">
            <TabsTrigger value="deliveries" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Deliveries ({totalDeliveryItems.toLocaleString()})
            </TabsTrigger>
            <TabsTrigger value="sendevents" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send Events ({totalSendEventItems.toLocaleString()})
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
                  {paginatedDeliveryData.map((delivery) => (
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
                        {delivery.gasUsed}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        #{delivery.sequence}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatTimeAgo(String(delivery.db_write_timestamp))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalDeliveryPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {deliveryStartIndex + 1} to{' '}
                  {Math.min(deliveryEndIndex, totalDeliveryItems)} of{' '}
                  {totalDeliveryItems.toLocaleString()} deliveries
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          handleDeliveryPageChange(
                            Math.max(1, deliveryCurrentPage - 1),
                          )
                        }
                        className={
                          deliveryCurrentPage === 1
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>

                    {/* Show first page */}
                    {deliveryCurrentPage > 2 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handleDeliveryPageChange(1)}
                          className="cursor-pointer"
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Show ellipsis if needed */}
                    {deliveryCurrentPage > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Show current page and adjacent pages */}
                    {[
                      deliveryCurrentPage - 1,
                      deliveryCurrentPage,
                      deliveryCurrentPage + 1,
                    ].map((page) => {
                      if (page >= 1 && page <= totalDeliveryPages) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handleDeliveryPageChange(page)}
                              isActive={page === deliveryCurrentPage}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      }
                      return null
                    })}

                    {/* Show ellipsis if needed */}
                    {deliveryCurrentPage < totalDeliveryPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Show last page */}
                    {deliveryCurrentPage < totalDeliveryPages - 1 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() =>
                            handleDeliveryPageChange(totalDeliveryPages)
                          }
                          className="cursor-pointer"
                        >
                          {totalDeliveryPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          handleDeliveryPageChange(
                            Math.min(
                              totalDeliveryPages,
                              deliveryCurrentPage + 1,
                            ),
                          )
                        }
                        className={
                          deliveryCurrentPage === totalDeliveryPages
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
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
                  {paginatedSendEventData.map((sendEvent) => (
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
                          {sendEvent.deliveryQuote}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {sendEvent.paymentForExtraReceiverValue}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatTimeAgo(String(sendEvent.db_write_timestamp))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalSendEventPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {sendEventStartIndex + 1} to{' '}
                  {Math.min(sendEventEndIndex, totalSendEventItems)} of{' '}
                  {totalSendEventItems.toLocaleString()} send events
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          handleSendEventPageChange(
                            Math.max(1, sendEventCurrentPage - 1),
                          )
                        }
                        className={
                          sendEventCurrentPage === 1
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>

                    {/* Show first page */}
                    {sendEventCurrentPage > 2 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handleSendEventPageChange(1)}
                          className="cursor-pointer"
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Show ellipsis if needed */}
                    {sendEventCurrentPage > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Show current page and adjacent pages */}
                    {[
                      sendEventCurrentPage - 1,
                      sendEventCurrentPage,
                      sendEventCurrentPage + 1,
                    ].map((page) => {
                      if (page >= 1 && page <= totalSendEventPages) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handleSendEventPageChange(page)}
                              isActive={page === sendEventCurrentPage}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      }
                      return null
                    })}

                    {/* Show ellipsis if needed */}
                    {sendEventCurrentPage < totalSendEventPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Show last page */}
                    {sendEventCurrentPage < totalSendEventPages - 1 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() =>
                            handleSendEventPageChange(totalSendEventPages)
                          }
                          className="cursor-pointer"
                        >
                          {totalSendEventPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          handleSendEventPageChange(
                            Math.min(
                              totalSendEventPages,
                              sendEventCurrentPage + 1,
                            ),
                          )
                        }
                        className={
                          sendEventCurrentPage === totalSendEventPages
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
