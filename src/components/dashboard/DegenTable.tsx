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
import { formatAddress, formatNumber, formatTimeAgo } from '@/lib/helpers'
import { Activity, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { MONAD_TESTNET_SCAN_URL } from '@/lib/utils'

interface DegenTableProps {
  data: any
}

export default function DegenTable({ data }: DegenTableProps) {
  if (!data) {
    return (
      <Card className="custom-card">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <CardTitle className="text-lg font-display text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            Degen Data
          </CardTitle>
        </CardHeader>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto">
              <Activity className="w-8 h-8 text-muted-foreground animate-pulse" />
            </div>
            <p className="text-muted-foreground">No degen data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const {
    IBondingCurveFactory_Create = [],
    BondingCurve_Listing = [],
    BondingCurve_Sync = [],
  } = data

  return (
    <div className="space-y-6">
      <Tabs defaultValue="creates" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-transparent border-b rounded-none">
          <TabsTrigger value="creates">Token Creates</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="syncs">Curve Syncs</TabsTrigger>
        </TabsList>

        <TabsContent value="creates">
          <Card className="custom-card py-0 gap-0">
            <CardHeader className="bg-muted/20 px-4 py-4 gap-0 border-b border-border/50 !pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-display font-medium text-foreground">
                  Token Creates
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
                        Name
                      </TableHead>
                      <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                        Symbol
                      </TableHead>
                      <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                        Dev
                      </TableHead>
                      <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                        Token
                      </TableHead>
                      <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                        Age
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {IBondingCurveFactory_Create.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-muted-foreground py-8"
                        >
                          No token creates found
                        </TableCell>
                      </TableRow>
                    ) : (
                      IBondingCurveFactory_Create.slice(0, 10).map(
                        (item: any) => (
                          <TableRow
                            key={item.id}
                            className="enhanced-table-row"
                          >
                            <TableCell className="py-4">
                              <div className="font-medium text-foreground">
                                {item.name || 'N/A'}
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <Badge variant="secondary">
                                {item.symbol || 'N/A'}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="font-mono text-xs text-muted-foreground">
                                {formatAddress(item.owner)}
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="font-mono text-xs text-muted-foreground">
                                {formatAddress(item.token)}
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="text-sm text-muted-foreground">
                                {formatTimeAgo(item.db_write_timestamp)}
                              </div>
                            </TableCell>
                          </TableRow>
                        ),
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings" className="mt-6">
          <Card className="custom-card py-0 gap-0">
            <CardHeader className="bg-muted/20 px-4 py-4 gap-0 border-b border-border/50 !pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-display font-medium text-foreground">
                  Bonding Curve Listings
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
                        Token
                      </TableHead>
                      <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                        Curve
                      </TableHead>
                      <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                        Pair
                      </TableHead>
                      <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                        Token Amount
                      </TableHead>
                      <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                        Native Amount
                      </TableHead>
                      <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                        Listed
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {BondingCurve_Listing.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-muted-foreground py-8"
                        >
                          No listings found
                        </TableCell>
                      </TableRow>
                    ) : (
                      BondingCurve_Listing.map((item: any) => (
                        <TableRow key={item.id} className="enhanced-table-row">
                          <TableCell className="py-4">
                            <div className="font-mono text-xs text-muted-foreground">
                              {formatAddress(item.token)}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="font-mono text-xs text-muted-foreground">
                              {formatAddress(item.curve)}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="font-mono text-xs text-muted-foreground">
                              {formatAddress(item.pair)}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="volume-text text-sm">
                              {formatNumber(item.listingTokenAmount)}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="volume-text text-sm">
                              {formatNumber(item.listingWNativeAmount)}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="text-sm text-muted-foreground">
                              {formatTimeAgo(item.db_write_timestamp)}
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
        </TabsContent>

        <TabsContent value="syncs" className="mt-6">
          <Card className="custom-card py-0 gap-0">
            <CardHeader className="bg-muted/20 px-4 py-4 gap-0 border-b border-border/50 !pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-display font-medium text-foreground">
                  Bonding Curve Syncs
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
                        Token
                      </TableHead>
                      <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                        Reserve Token
                      </TableHead>
                      <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                        Reserve Native
                      </TableHead>
                      <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                        Virtual Native
                      </TableHead>
                      <TableHead className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
                        Synced
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {BondingCurve_Sync.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-muted-foreground py-8"
                        >
                          No syncs found
                        </TableCell>
                      </TableRow>
                    ) : (
                      BondingCurve_Sync.map((item: any) => (
                        <TableRow key={item.id} className="enhanced-table-row">
                          <TableCell className="py-4">
                            <div className="font-mono text-xs text-muted-foreground">
                              {formatAddress(item.token)}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="volume-text text-sm">
                              {formatNumber(item.reserveToken)}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="volume-text text-sm">
                              {formatNumber(item.reserveWNative)}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="volume-text text-sm">
                              {formatNumber(item.virtualWNative)}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="text-sm text-muted-foreground">
                              {formatTimeAgo(item.db_write_timestamp)}
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
