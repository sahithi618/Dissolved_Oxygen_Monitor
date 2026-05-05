'use client'

import { Activity, Wifi, Clock } from 'lucide-react'

interface HeaderProps {
  isStreaming: boolean
  currentTime: string
}

export function Header({ isStreaming, currentTime }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                IoT-Based Dissolved Oxygen Monitoring System
              </h1>
              <p className="text-sm text-muted-foreground">
                Real-time Oxygen Transfer Analysis
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 ring-1 ring-success/20">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="text-sm font-medium text-success">Sensor Connected</span>
            </div>
            
            {isStreaming && (
              <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 ring-1 ring-primary/20">
                <Wifi className="h-3.5 w-3.5 text-primary" />
                <span className="streaming-indicator flex gap-0.5 text-sm font-medium text-primary">
                  Streaming
                  <span className="text-primary">.</span>
                  <span className="text-primary">.</span>
                  <span className="text-primary">.</span>
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-mono text-sm text-muted-foreground">{currentTime}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
