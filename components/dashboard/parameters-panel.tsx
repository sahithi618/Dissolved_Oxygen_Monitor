'use client'

import { Calculator, Zap, Clock, Percent, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SystemParameters } from '@/lib/types'

interface ParametersPanelProps {
  parameters: SystemParameters
  isUpdating: boolean
}

export function ParametersPanel({ parameters, isUpdating }: ParametersPanelProps) {
  const parameterCards = [
    {
      label: 'Saturation DO (C*)',
      value: parameters.cStar.toFixed(2),
      unit: 'mg/L',
      icon: Activity,
      description: 'Maximum oxygen concentration at equilibrium',
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
    {
      label: 'kLa',
      value: parameters.kLa.toFixed(6),
      unit: 'min⁻¹',
      icon: Zap,
      description: 'Volumetric mass transfer coefficient',
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
    },
    {
      label: 'OTR',
      value: parameters.OTR.toFixed(4),
      unit: 'mg/L·min',
      icon: Calculator,
      description: 'Oxygen Transfer Rate',
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
    {
      label: 't₉₀',
      value: parameters.t90.toFixed(1),
      unit: 'min',
      icon: Clock,
      description: 'Time to reach 90% saturation',
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
    {
      label: 'OTE',
      value: parameters.OTE.toFixed(2),
      unit: '%',
      icon: Percent,
      description: 'Oxygen Transfer Efficiency',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5 text-primary" />
            Calculated Parameters
          </CardTitle>
          {isUpdating && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Auto-updating
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Real-time calculated oxygen transfer metrics
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {parameterCards.map((param) => (
            <div
              key={param.label}
              className={`flex items-center justify-between rounded-lg p-3 ${param.bgColor} ring-1 ring-border/50 transition-all hover:ring-border`}
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-lg bg-background/50 p-2`}>
                  <param.icon className={`h-4 w-4 ${param.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{param.label}</p>
                  <p className="text-xs text-muted-foreground">{param.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-mono text-lg font-semibold ${param.color}`}>
                  {param.value}
                </p>
                <p className="text-xs text-muted-foreground">{param.unit}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Formulas Reference */}
        <div className="mt-4 rounded-lg bg-secondary/30 p-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Key Formulas:</p>
          <div className="grid gap-1 text-xs text-muted-foreground font-mono">
            <p>kLa = ln[(C*-C₀)/(C*-C)] / t</p>
            <p>OTR = kLa × (C* - C)</p>
            <p>OTE = (O₂ transferred / O₂ supplied) × 100</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
