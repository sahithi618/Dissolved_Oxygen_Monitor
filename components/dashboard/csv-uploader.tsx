'use client'

import { useCallback } from 'react'
import { Upload, FileSpreadsheet, CheckCircle2, RotateCcw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Papa from 'papaparse'
import type { DODataPoint } from '@/lib/types'

interface CSVUploaderProps {
  onDataLoaded: (data: DODataPoint[]) => void
  hasData: boolean
  onReset: () => void
}

export function CSVUploader({ onDataLoaded, hasData, onReset }: CSVUploaderProps) {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      complete: (results) => {
        const parsedData: DODataPoint[] = []
        const rows = results.data as string[][]
        
        // Skip header row and parse data
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i]
          if (row[0] && row[1]) {
            const timeSeconds = parseFloat(row[0])
            const DO = parseFloat(row[1])
            const timeMins = parseFloat(row[2]) || timeSeconds / 60
            
            if (!isNaN(timeSeconds) && !isNaN(DO)) {
              parsedData.push({
                timeSeconds,
                timeMins,
                DO,
                cStarMinusC: row[6] ? parseFloat(row[6]) : undefined,
                ln: row[7] ? parseFloat(row[7]) : undefined,
              })
            }
          }
        }
        
        if (parsedData.length > 0) {
          onDataLoaded(parsedData)
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error)
      }
    })
  }, [onDataLoaded])

  return (
    <Card className="border-dashed">
      <CardContent className="py-4">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          {hasData ? (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium">Dataset Loaded</p>
                <p className="text-xs text-muted-foreground">
                  Vitus Machine data
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Upload Dataset</p>
                <p className="text-xs text-muted-foreground">
                  CSV format
                </p>
              </div>
            </>
          )}
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onReset} className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
            <Button variant="outline" size="sm" className="relative gap-1.5">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
