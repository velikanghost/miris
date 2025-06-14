'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface ChartDataPoint {
  time: string
  value: number
}

interface ChartCardProps {
  title: string
  data?: ChartDataPoint[]
  color?: string
}

const generateMockData = (): ChartDataPoint[] => {
  const data: ChartDataPoint[] = []
  const now = new Date()

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    const value = Math.random() * 1000 + 2000 + Math.sin(i * 0.1) * 500
    data.push({
      time: time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      value: Math.round(value * 100) / 100,
    })
  }

  return data
}

export default function ChartCard({
  title,
  data = generateMockData(),
  color = '#10b981',
}: ChartCardProps) {
  const formatTooltipValue = (value: number) => {
    return `$${value.toLocaleString()}`
  }

  return (
    <Card className="crypto-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value: number) => [
                  formatTooltipValue(value),
                  'Price',
                ]}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
