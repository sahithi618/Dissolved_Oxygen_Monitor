'use client'

import { useState, useEffect } from 'react'
import { Calculator, Beaker, Gauge, Clock, Wind } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { calculateKLa, calculateOTE } from '@/lib/do-data'
import type { CalculatorInputs } from '@/lib/types'

export function CalculatorPanel() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    initialDO: 6.68,
    saturationDO: 19.3,
    measuredDO: 18.8,
    volume: 340,
    flowRate: 5,
    time: 18,
    gasType: 'Air',
  })
  
  const [results, setResults] = useState({
    kLa: 0,
    OTE: 0,
  })

  const handleInputChange = (key: keyof CalculatorInputs, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [key]: parseFloat(value) || 0,
    }))
  }

  useEffect(() => {
    const kLa = calculateKLa(
      inputs.saturationDO,
      inputs.initialDO,
      inputs.measuredDO,
      inputs.time,
    )
    const o2Conc = inputs.gasType === 'Air' ? 0.21 : 1.0
    const OTE = calculateOTE(
      kLa,
      inputs.volume,
      inputs.saturationDO,
      inputs.initialDO,
      inputs.flowRate,
      o2Conc,
    )

    console.log('Inputs:', inputs)
    console.log('kLa:', kLa)
    console.log('OTE:', OTE)

    setResults({ kLa, OTE })
  }, [inputs])

  const inputFields = [
    { key: 'initialDO', label: 'Initial DO (C₀)', unit: 'mg/L', icon: Beaker },
    { key: 'saturationDO', label: 'Saturation DO (C*)', unit: 'mg/L', icon: Beaker },
    { key: 'measuredDO', label: 'Measured DO (C)', unit: 'mg/L', icon: Beaker },
    { key: 'volume', label: 'Volume', unit: 'L', icon: Beaker },
    { key: 'flowRate', label: 'Flow Rate', unit: 'LPM', icon: Gauge },
    { key: 'time', label: 'Time', unit: 'min', icon: Clock },
  ] as const

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          Mass Transfer Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          kLa and OTE mass transfer insights
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          {inputFields.map(({ key, label, unit, icon: Icon }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="text-sm flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                {label}
              </Label>
              <div className="relative">
                <Input
                  id={key}
                  type="number"
                  step="0.01"
                  value={inputs[key]}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="pr-12 font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Gas Type Toggle */}
        <div className="space-y-2">
          <Label className="text-sm flex items-center gap-2">
            <Wind className="h-3.5 w-3.5 text-muted-foreground" />
            Gas Type
          </Label>
          <div className="flex gap-2">
            <Button
              variant={inputs.gasType === 'Air' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInputs(prev => ({ ...prev, gasType: 'Air' }))}
              className="flex-1"
            >
              Air (21% O₂)
            </Button>
            <Button
              variant={inputs.gasType === 'Oxygen' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInputs(prev => ({ ...prev, gasType: 'Oxygen' }))}
              className="flex-1"
            >
              Pure O₂ (100%)
            </Button>
          </div>
        </div>

        {/* Results Display */}
        <div className="rounded-xl bg-linear-to-br from-primary/5 to-accent/5 p-4 ring-1 ring-primary/20">
          <p className="text-sm font-medium text-muted-foreground mb-3">Calculated Results</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-background/50 p-3">
              <p className="text-xs text-muted-foreground mb-1">
                kLa (Mass Transfer Coefficient)
              </p>
              <p className="font-mono text-2xl font-bold text-primary">
                {results.kLa.toFixed(6)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">min⁻¹</p>
            </div>
            <div className="rounded-lg bg-background/50 p-3">
              <p className="text-xs text-muted-foreground mb-1">
                OTE (Transfer Efficiency)
              </p>
              <p className="font-mono text-2xl font-bold text-chart-3">
                {results.OTE.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">%</p>
            </div>
          </div>
        </div>

        {/* Tooltips */}
        <div className="space-y-2 text-xs text-muted-foreground">
          <details className="group">
            <summary className="cursor-pointer hover:text-foreground transition-colors">
              What is kLa?
            </summary>
            <p className="mt-2 pl-4 border-l-2 border-border">
              The volumetric mass transfer coefficient (kLa) represents the rate at which oxygen transfers from gas to liquid phase. Higher values indicate more efficient oxygen transfer.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer hover:text-foreground transition-colors">
              What is OTE?
            </summary>
            <p className="mt-2 pl-4 border-l-2 border-border">
              Oxygen Transfer Efficiency (OTE) is the percentage of oxygen supplied that actually dissolves into the water. It&apos;s a key metric for evaluating aeration system performance.
            </p>
          </details>
        </div>
      </CardContent>
    </Card>
  )
}
