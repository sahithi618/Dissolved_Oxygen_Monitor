'use client'

import { useState } from 'react'
import { BarChart3, ChevronDown, Zap, TrendingUp, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { systemComparisons } from '@/lib/do-data'
import type { SystemComparison } from '@/lib/types'

type SystemKey = keyof typeof systemComparisons

export function ComparisonPanel() {
  const [selectedSystem, setSelectedSystem] = useState<SystemKey>('vitus')
  const system: SystemComparison = systemComparisons[selectedSystem]

  const getEfficiencyColor = (efficiency: string) => {
    switch (efficiency) {
      case 'High':
        return 'text-success bg-success/10 ring-success/20'
      case 'Medium':
        return 'text-warning bg-warning/10 ring-warning/20'
      case 'Low':
        return 'text-destructive bg-destructive/10 ring-destructive/20'
      default:
        return 'text-muted-foreground bg-muted'
    }
  }

  const getProgressWidth = (value: number, max: number) => {
    return `${(value / max) * 100}%`
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            System Comparison
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {system.name}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.entries(systemComparisons).map(([key, sys]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setSelectedSystem(key as SystemKey)}
                  className={selectedSystem === key ? 'bg-accent' : ''}
                >
                  {sys.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground">
          Compare aeration system performance metrics
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* System Info Card */}
        <div className="rounded-lg bg-secondary/30 p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-medium">{system.name}</h4>
              <p className="text-sm text-muted-foreground">{system.description}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${getEfficiencyColor(system.efficiency)}`}>
              {system.efficiency} Efficiency
            </span>
          </div>
        </div>

        {/* Metrics Comparison */}
        <div className="space-y-4">
          {/* kLa Comparison */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-chart-2" />
                <span>kLa (min⁻¹)</span>
              </div>
              <span className="font-mono font-medium">{system.kLa.toFixed(4)}</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-chart-2/70 to-chart-2 transition-all duration-500"
                style={{ width: getProgressWidth(system.kLa, 0.006) }}
              />
            </div>
          </div>

          {/* OTE Comparison */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-chart-3" />
                <span>OTE (%)</span>
              </div>
              <span className="font-mono font-medium">{system.OTE.toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-chart-3/70 to-chart-3 transition-all duration-500"
                style={{ width: getProgressWidth(system.OTE, 25) }}
              />
            </div>
          </div>
        </div>

        {/* All Systems Comparison Table */}
        <div className="mt-4 rounded-lg ring-1 ring-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-3 py-2 text-left font-medium">System</th>
                <th className="px-3 py-2 text-right font-medium">kLa</th>
                <th className="px-3 py-2 text-right font-medium">OTE</th>
                <th className="px-3 py-2 text-center font-medium">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Object.entries(systemComparisons).map(([key, sys]) => (
                <tr
                  key={key}
                  className={`transition-colors ${selectedSystem === key ? 'bg-primary/5' : 'hover:bg-secondary/30'}`}
                >
                  <td className="px-3 py-2 font-medium">
                    <div className="flex items-center gap-2">
                      {key === 'vitus' && <Award className="h-4 w-4 text-primary" />}
                      {sys.name}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right font-mono">{sys.kLa.toFixed(4)}</td>
                  <td className="px-3 py-2 text-right font-mono">{sys.OTE.toFixed(1)}%</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getEfficiencyColor(sys.efficiency)}`}>
                      {sys.efficiency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
