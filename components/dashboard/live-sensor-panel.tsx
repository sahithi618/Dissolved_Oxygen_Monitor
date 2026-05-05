'use client'

import { Droplets, Timer, Gauge, Beaker } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DODataPoint, SystemConfig } from '@/lib/types'

interface LiveSensorPanelProps {
  currentData: DODataPoint | null
  config: SystemConfig
  isStreaming: boolean
}

export function LiveSensorPanel({ currentData, config, isStreaming }: LiveSensorPanelProps) {
  const doValue = currentData?.DO.toFixed(2) || '--'
  const timeElapsed = currentData?.timeMins.toFixed(1) || '--'
  
  return (
    <Card className="relative overflow-hidden h-full">
      {isStreaming && (
        <div className="absolute inset-0 animate-pulse-glow pointer-events-none opacity-30" />
      )}
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Droplets className="h-5 w-5 text-primary" />
          Live Sensor Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current DO Value - Big Display */}
        <div className="relative rounded-xl bg-linear-to-br from-primary/5 to-primary/10 p-6 ring-1 ring-primary/20">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Dissolved Oxygen (DO)
            </p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="font-mono text-5xl font-bold tracking-tight text-primary">
                {doValue}
              </span>
              <span className="text-xl text-muted-foreground">mg/L</span>
            </div>
            {isStreaming && (
              <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                Updating in real-time
              </div>
            )}
          </div>
        </div>

        {/* Other Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Timer className="h-4 w-4 text-chart-2" />
              <span className="text-xs text-muted-foreground">Elapsed</span>
            </div>
            <p className="font-mono text-lg font-semibold">{timeElapsed} min</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Gauge className="h-4 w-4 text-chart-3" />
              <span className="text-xs text-muted-foreground">Flow Rate</span>
            </div>
            <p className="font-mono text-lg font-semibold">{config.flowRate} LPM</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Beaker className="h-4 w-4 text-chart-4" />
              <span className="text-xs text-muted-foreground">Volume</span>
            </div>
            <p className="font-mono text-lg font-semibold">{config.volume} L</p>
          </div>
        </div>
        
        {/* System Info */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>System</span>
            <span className="font-medium text-foreground">{config.name}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Water Depth</span>
            <span className="font-medium text-foreground">{config.waterDepth}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>O₂ in Air</span>
            <span className="font-medium text-foreground">{(config.o2Concentration * 100).toFixed(0)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
