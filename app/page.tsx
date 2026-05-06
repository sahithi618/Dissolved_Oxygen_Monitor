'use client'

import { useState, useEffect } from 'react'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/dashboard/header'
import { LiveSensorPanel } from '@/components/dashboard/live-sensor-panel'
import { DOChart } from '@/components/dashboard/do-chart'
import { CalculatorPanel } from '@/components/dashboard/calculator-panel'
import { doData, systemConfig } from '@/lib/do-data'
import type { DODataPoint, SystemConfig } from '@/lib/types'

export default function Dashboard() {
  const data: DODataPoint[] = doData
  const config: SystemConfig = systemConfig

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isStreaming, setIsStreaming] = useState(true)
  const [currentTime, setCurrentTime] = useState('')

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Simulate real-time data streaming
  useEffect(() => {
    if (!isStreaming || data.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= data.length - 1) {
          setIsStreaming(false)
          return prev
        }
        return prev + 1
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isStreaming, data])

  const resetPlayback = () => {
    if (data.length === 0) return
    setCurrentIndex(0)
    setIsStreaming(true)
  }

  const currentData = data[currentIndex] || null

  return (
    <div className="min-h-screen bg-background">
      <Header isStreaming={isStreaming} currentTime={currentTime} />
      
      <main className="container mx-auto px-4 py-4 min-h-screen">
        <div className="grid h-full gap-4 grid-cols-1 lg:grid-cols-12">
          {/* Left side - Chart Only */}
          <div className="lg:col-span-7 min-h-[24rem] lg:min-h-0">
            <DOChart data={data} currentIndex={currentIndex} />
          </div>

          {/* Right side - Calculator */}
          <div className="lg:col-span-5 flex flex-col gap-2 min-h-[24rem] lg:min-h-0">
            <div className="flex-1 min-h-0 overflow-hidden">
              <CalculatorPanel />
            </div>
            <Button 
              variant="outline" 
              onClick={resetPlayback} 
              className="w-full gap-2 h-10 shrink-0"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Demo
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}