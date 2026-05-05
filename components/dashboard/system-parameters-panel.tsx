'use client'

import { Gauge } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DODataPoint, SystemConfig } from '@/lib/types'

interface SystemParametersPanelProps {
  currentData: DODataPoint | null
  config: SystemConfig
}

export function SystemParametersPanel({ currentData, config }: SystemParametersPanelProps) {
  const saturationDO = 19.8
  const phase = currentData
    ? currentData.timeMins <= 5
      ? 'Initial'
      : currentData.timeMins >= 18.5
      ? 'Saturation'
      : 'Transition'
    : 'N/A'

  const progress = currentData
    ? Math.min(100, Math.max(0, (currentData.DO / saturationDO) * 100))
    : 0

  return (
    <Card className="flex-1">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Gauge className="h-4 w-4 text-primary" />
          Saturation Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl bg-secondary/20 p-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Current Phase</span>
            <span className="font-medium text-foreground">{phase}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Saturation Target</span>
            <span className="font-medium text-foreground">{saturationDO} mg/L</span>
          </div>
          <div className="rounded-full bg-background p-1">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
            <span>DO Progress</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="rounded-lg bg-background/80 p-3 ring-1 ring-border/50">
            <p className="font-medium text-foreground">O₂ in Air</p>
            <p className="mt-1 font-mono">{(config.o2Concentration * 100).toFixed(0)}%</p>
          </div>
          <div className="rounded-lg bg-background/80 p-3 ring-1 ring-border/50">
            <p className="font-medium text-foreground">Water Depth</p>
            <p className="mt-1 font-mono">{config.waterDepth}</p>
          </div>
        </div>

        <div className="text-xs text-center text-muted-foreground pt-1 border-t border-border">
          Live saturation status for {config.name}
        </div>
      </CardContent>
    </Card>
  )
}
