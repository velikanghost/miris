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

interface DegenTableProps {
  data: any
}

export default function DegenTable({ data }: DegenTableProps) {
  if (!data) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground">No degen data available</p>
        </div>
      </div>
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
          <Card>
            <CardContent>
              <div className="rounded-md border">
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
                    {IBondingCurveFactory_Create.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center text-muted-foreground"
                        >
                          No token creates found
                        </TableCell>
                      </TableRow>
                    ) : (
                      IBondingCurveFactory_Create.slice(0, 10).map(
                        (item: any) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              {item.name || 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {item.symbol || 'N/A'}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {formatAddress(item.owner)}
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {formatAddress(item.token)}
                            </TableCell>

                            <TableCell className="text-muted-foreground">
                              {formatTimeAgo(item.db_write_timestamp)}
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
          <Card>
            <CardHeader>
              <CardTitle>Bonding Curve Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Token</TableHead>
                      <TableHead>Curve</TableHead>
                      <TableHead>Pair</TableHead>
                      <TableHead>Token Amount</TableHead>
                      <TableHead>Native Amount</TableHead>
                      <TableHead>Listed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {BondingCurve_Listing.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-muted-foreground"
                        >
                          No listings found
                        </TableCell>
                      </TableRow>
                    ) : (
                      BondingCurve_Listing.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-sm">
                            {formatAddress(item.token)}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {formatAddress(item.curve)}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {formatAddress(item.pair)}
                          </TableCell>
                          <TableCell>
                            {formatNumber(item.listingTokenAmount)}
                          </TableCell>
                          <TableCell>
                            {formatNumber(item.listingWNativeAmount)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatTimeAgo(item.db_write_timestamp)}
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
          <Card>
            <CardHeader>
              <CardTitle>Bonding Curve Syncs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Token</TableHead>
                      <TableHead>Reserve Token</TableHead>
                      <TableHead>Reserve Native</TableHead>
                      <TableHead>Virtual Native</TableHead>
                      <TableHead>Synced</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {BondingCurve_Sync.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-muted-foreground"
                        >
                          No syncs found
                        </TableCell>
                      </TableRow>
                    ) : (
                      BondingCurve_Sync.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-sm">
                            {formatAddress(item.token)}
                          </TableCell>
                          <TableCell>
                            {formatNumber(item.reserveToken)}
                          </TableCell>
                          <TableCell>
                            {formatNumber(item.reserveWNative)}
                          </TableCell>
                          <TableCell>
                            {formatNumber(item.virtualWNative)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatTimeAgo(item.db_write_timestamp)}
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
