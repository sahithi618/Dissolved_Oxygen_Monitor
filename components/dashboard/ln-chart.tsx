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
  ReferenceLine,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingDown } from 'lucide-react'
import type { DODataPoint } from '@/lib/types'

interface LnChartProps {
  data: DODataPoint[]
  currentIndex: number
}

export function LnChart({ data, currentIndex }: LnChartProps) {
  const visibleData = useMemo(() => {
    return data
      .slice(0, currentIndex + 1)
      .filter(d => d.ln !== undefined && !isNaN(d.ln) && isFinite(d.ln))
      .map(d => ({
        time: d.timeMins,
        ln: d.ln,
      }))
  }, [data, currentIndex])

  // Calculate slope (kLa) from linear regression
  const { slope } = useMemo(() => {
    if (visibleData.length < 2) return { slope: 0, intercept: 0 }
    
    const n = visibleData.length
    const sumX = visibleData.reduce((sum, d) => sum + d.time, 0)
    const sumY = visibleData.reduce((sum, d) => sum + (d.ln || 0), 0)
    const sumXY = visibleData.reduce((sum, d) => sum + d.time * (d.ln || 0), 0)
    const sumX2 = visibleData.reduce((sum, d) => sum + d.time * d.time, 0)
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n
    
    return { slope, intercept }
  }, [visibleData])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingDown className="h-5 w-5 text-chart-2" />
          ln(C* - C) vs Time
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Linear regression for kLa determination • Slope = {Math.abs(slope).toFixed(5)} min⁻¹
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={visibleData}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
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
                label={{ value: 'Time (min)', position: 'insideBottom', offset: -10, fill: 'oklch(0.65 0 0)' }}
              />
              
              <YAxis
                stroke="oklch(0.65 0 0)"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: 'oklch(0.28 0.01 250)' }}
                domain={[-3, 3]}
                label={{ value: 'ln(C* - C)', angle: -90, position: 'insideLeft', fill: 'oklch(0.65 0 0)' }}
              />
              
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.16 0.01 250)',
                  border: '1px solid oklch(0.28 0.01 250)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
                labelStyle={{ color: 'oklch(0.95 0 0)' }}
                itemStyle={{ color: 'oklch(0.55 0.22 260)' }}
                formatter={(value: number) => [value.toFixed(3), 'ln(C*-C)']}
                labelFormatter={(label) => `Time: ${label} min`}
              />
              
              <ReferenceLine
                y={0}
                stroke="oklch(0.65 0 0)"
                strokeDasharray="3 3"
              />
              
              <Line
                type="monotone"
                dataKey="ln"
                stroke="oklch(0.55 0.22 260)"
                strokeWidth={2}
                dot={{
                  r: 3,
                  fill: 'oklch(0.55 0.22 260)',
                  stroke: 'oklch(0.13 0.01 250)',
                  strokeWidth: 1,
                }}
                activeDot={{
                  r: 5,
                  fill: 'oklch(0.55 0.22 260)',
                  stroke: 'oklch(0.13 0.01 250)',
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-3 rounded-lg bg-secondary/30 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Understanding the Graph:</p>
          <p>A linear relationship in this plot confirms first-order mass transfer kinetics. The negative slope equals kLa, the volumetric mass transfer coefficient.</p>
        </div>
      </CardContent>
    </Card>
  )
}
