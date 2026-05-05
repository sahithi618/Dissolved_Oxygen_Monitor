'use client'

import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import type { DODataPoint } from '@/lib/types'

interface DOChartProps {
  data: DODataPoint[]
  currentIndex: number
}

export function DOChart({ data, currentIndex }: DOChartProps) {
  const visibleData = useMemo(() => {
    return data.slice(0, currentIndex + 1).map(d => ({
      ...d,
      time: d.timeSeconds,
    }))
  }, [data, currentIndex])

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">DO vs Time</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Real-time oxygen concentration monitoring
          </p>
        </div>
      </CardHeader>
      <CardContent className="h-full min-h-0">
        <div className="h-full w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={visibleData}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <defs>
                <linearGradient id="doGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.72 0.19 175)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.72 0.19 175)" stopOpacity={0} />
                </linearGradient>
              </defs>
              
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.28 0.01 250)"
                vertical={false}
              />
              
              
              <XAxis
                dataKey="time"
                stroke="oklch(0.65 0 0)"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: 'oklch(0.28 0.01 250)' }}
                label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -10, fill: 'oklch(0.65 0 0)' }}
              />
              
              <YAxis
                stroke="oklch(0.65 0 0)"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: 'oklch(0.28 0.01 250)' }}
                domain={[0, 22]}
                ticks={[0, 5, 10, 15, 20]}
                label={{ value: 'DO (mg/L)', angle: -90, position: 'insideLeft', fill: 'oklch(0.65 0 0)' }}
              />
              
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.16 0.01 250)',
                  border: '1px solid oklch(0.28 0.01 250)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
                labelStyle={{ color: 'oklch(0.95 0 0)' }}
                itemStyle={{ color: 'oklch(0.72 0.19 175)' }}
                formatter={(value: number) => [`${value.toFixed(2)} mg/L`, 'DO']}
                labelFormatter={(label) => `Time: ${label}s`}
              />
              
              <Legend
                verticalAlign="top"
                height={36}
                formatter={() => 'Dissolved Oxygen'}
              />
              
              
              <Line
                type="monotone"
                dataKey="DO"
                stroke="oklch(0.72 0.19 175)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: 'oklch(0.72 0.19 175)',
                  stroke: 'oklch(0.13 0.01 250)',
                  strokeWidth: 2,
                }}
                fill="url(#doGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
