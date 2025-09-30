'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface IndexerUnavailableProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export default function IndexerUnavailable({
  title = 'Indexer Currently Unavailable',
  description = 'The data indexer is temporarily unavailable. Please try again later.',
  onRetry,
}: IndexerUnavailableProps) {
  return (
    <Card className="custom-card">
      <CardHeader className="border-b border-border/50 bg-muted/30">
        <CardTitle className="text-lg font-display text-foreground flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-12">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="w-16 h-16 bg-yellow-500/10 border-2 border-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Service Temporarily Unavailable
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
