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
import { Package, Send, Activity } from 'lucide-react'
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
  const [isInitialLoad] = useState(true)
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
      <Card className="custom-card">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <CardTitle className="text-lg font-display text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            Wormhole Relayer - Interoperability
          </CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto">
              <Activity className="w-8 h-8 text-muted-foreground animate-pulse" />
            </div>
            <p className="text-muted-foreground">
              {!data
                ? 'Loading interoperability data...'
                : 'No interoperability data available'}
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
            <Activity className="h-4 w-4 text-accent" />
            Wormhole Relayer - Cross-Chain Interoperability
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Total: {totalDeliveryItems.toLocaleString()} deliveries,{' '}
          {totalSendEventItems.toLocaleString()} send events
        </div>
      </CardHeader>
      <CardContent className="p-4">
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
            <div className="enhanced-table">
              <Table>
                <TableHeader>
                  <TableRow className="mx-auto border-b border-border/50 bg-muted/10">
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                      VAA Hash
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                      Source Chain
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                      Recipient
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                      Gas Used
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                      Sequence
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                      Timestamp
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDeliveryData.map((delivery) => (
                    <TableRow
                      key={delivery.id}
                      className={`enhanced-table-row ${
                        isInitialLoad
                          ? 'table-row-staggered'
                          : 'table-row-enter'
                      }`}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            🌉
                          </div>
                          <div className="text-sm">
                            <div className="font-mono text-xs text-muted-foreground">
                              {formatAddress(delivery.deliveryVaaHash)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              VAA Hash
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        >
                          {getChainName(delivery.sourceChain)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="font-mono text-xs text-muted-foreground">
                          {formatAddress(delivery.recipientContract)}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(delivery.status)}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="volume-text text-sm">
                          {delivery.gasUsed}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm text-muted-foreground">
                          #{delivery.sequence}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm text-muted-foreground">
                          {formatTimeAgo(String(delivery.db_write_timestamp))}
                        </div>
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
            <div className="enhanced-table">
              <Table>
                <TableHeader>
                  <TableRow className="mx-auto border-b border-border/50 bg-muted/10">
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                      Event ID
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                      Sequence
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                      Delivery Quote
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                      Extra Payment
                    </TableHead>
                    <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                      Timestamp
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSendEventData.map((sendEvent) => (
                    <TableRow
                      key={sendEvent.id}
                      className={`enhanced-table-row ${
                        isInitialLoad
                          ? 'table-row-staggered'
                          : 'table-row-enter'
                      }`}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            📤
                          </div>
                          <div className="text-sm">
                            <div className="font-mono text-xs text-muted-foreground">
                              {formatAddress(sendEvent.id)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Event ID
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="volume-text text-sm">
                          #{sendEvent.sequence}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        >
                          {sendEvent.deliveryQuote}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="volume-text text-sm">
                          {sendEvent.paymentForExtraReceiverValue}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm text-muted-foreground">
                          {formatTimeAgo(String(sendEvent.db_write_timestamp))}
                        </div>
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
