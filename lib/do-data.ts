import type { DODataPoint, SystemConfig } from './types'

// DO Monitoring Data
export const doData: DODataPoint[] = [
  { timeSeconds: 30, timeMins: 0.5, DO: 6.9 },
  { timeSeconds: 60, timeMins: 1, DO: 7.5 },
  { timeSeconds: 90, timeMins: 1.5, DO: 8.5 },
  { timeSeconds: 120, timeMins: 2, DO: 9.2 },
  { timeSeconds: 150, timeMins: 2.5, DO: 9.6 },
  { timeSeconds: 180, timeMins: 3, DO: 10.1 },
  { timeSeconds: 210, timeMins: 3.5, DO: 10.6 },
  { timeSeconds: 240, timeMins: 4, DO: 11.5 },
  { timeSeconds: 270, timeMins: 4.5, DO: 11.8 },
  { timeSeconds: 300, timeMins: 5, DO: 12.5 },
  { timeSeconds: 330, timeMins: 5.5, DO: 13.1 },
  { timeSeconds: 360, timeMins: 6, DO: 13.2 },
  { timeSeconds: 390, timeMins: 6.5, DO: 14.0 },
  { timeSeconds: 420, timeMins: 7, DO: 13.8 },
  { timeSeconds: 450, timeMins: 7.5, DO: 14.7 },
  { timeSeconds: 480, timeMins: 8, DO: 15.0 },
  { timeSeconds: 510, timeMins: 8.5, DO: 15.3 },
  { timeSeconds: 540, timeMins: 9, DO: 15.4 },
  { timeSeconds: 570, timeMins: 9.5, DO: 15.9 },
  { timeSeconds: 600, timeMins: 10, DO: 16.2 },
  { timeSeconds: 630, timeMins: 10.5, DO: 16.3 },
  { timeSeconds: 660, timeMins: 11, DO: 16.3 },
  { timeSeconds: 690, timeMins: 11.5, DO: 16.4 },
  { timeSeconds: 720, timeMins: 12, DO: 16.6 },
  { timeSeconds: 750, timeMins: 12.5, DO: 17.2 },
  { timeSeconds: 780, timeMins: 13, DO: 17.2 },
  { timeSeconds: 810, timeMins: 13.5, DO: 17.5 },
  { timeSeconds: 840, timeMins: 14, DO: 17.8 },
  { timeSeconds: 870, timeMins: 14.5, DO: 17.7 },
  { timeSeconds: 900, timeMins: 15, DO: 17.8 },
  { timeSeconds: 930, timeMins: 15.5, DO: 18.5 },
  { timeSeconds: 960, timeMins: 16, DO: 18.4 },
  { timeSeconds: 990, timeMins: 16.5, DO: 18.7 },
  { timeSeconds: 1020, timeMins: 17, DO: 18.2 },
  { timeSeconds: 1050, timeMins: 17.5, DO: 18.4 },
  { timeSeconds: 1080, timeMins: 18, DO: 18.8 },
  { timeSeconds: 1110, timeMins: 18.5, DO: 19.0 },
  { timeSeconds: 1140, timeMins: 19, DO: 19.0 },
  { timeSeconds: 1170, timeMins: 19.5, DO: 19.3 },
  { timeSeconds: 1200, timeMins: 20, DO: 18.9 },
  { timeSeconds: 1230, timeMins: 20.5, DO: 19.1 },
  { timeSeconds: 1260, timeMins: 21, DO: 19.6 },
  { timeSeconds: 1290, timeMins: 21.5, DO: 19.2 },
  { timeSeconds: 1320, timeMins: 22, DO: 19.8 },
  { timeSeconds: 1350, timeMins: 22.5, DO: 19.0 },
  { timeSeconds: 1380, timeMins: 23, DO: 19.4 },
  { timeSeconds: 1410, timeMins: 23.5, DO: 19.8 },
  { timeSeconds: 1440, timeMins: 24, DO: 19.4 },
]

export const systemConfig: SystemConfig = {
  name: 'Vitus Machine',
  flowRate: 5, // LPM
  volume: 340, // L
  waterDepth: '25"',
  o2Concentration: 0.21,
}

export const systemComparisons = {
  vitus: {
    name: 'Vitus Machine',
    description: 'High-efficiency aeration system with optimized diffuser design',
    efficiency: 'High',
    kLa: 0.0052,
    OTE: 18.5,
  },
  standard: {
    name: 'Standard Diffuser',
    description: 'Conventional aeration system with basic diffuser setup',
    efficiency: 'Medium',
    kLa: 0.0038,
    OTE: 12.3,
  },
  basic: {
    name: 'Basic Aeration',
    description: 'Entry-level aeration system with minimal optimization',
    efficiency: 'Low',
    kLa: 0.0021,
    OTE: 8.7,
  },
} as const

// Calculate statistics from the data
export function calculateStatistics(data: DODataPoint[]) {
  if (data.length === 0) return null
  
  const doValues = data.map(d => d.DO)
  const minDO = Math.min(...doValues)
  const maxDO = Math.max(...doValues)
  const avgDO = doValues.reduce((a, b) => a + b, 0) / doValues.length
  const totalTime = data[data.length - 1].timeMins
  const doChange = maxDO - minDO
  const rateOfChange = doChange / totalTime // ppm per minute
  
  // Calculate C* (saturation DO) - estimated from max value plateau
  const lastValues = doValues.slice(-10)
  const cStar = Math.max(...lastValues)
  
  // Calculate kLa using the two-film theory
  // ln((C* - C0)/(C* - Ct)) = kLa * t
  const c0 = doValues[0]
  const cFinal = doValues[doValues.length - 1]
  const kLa = Math.log((cStar - c0) / (cStar - cFinal)) / (totalTime * 60)
  
  return {
    minDO,
    maxDO,
    avgDO,
    totalTime,
    doChange,
    rateOfChange,
    cStar,
    kLa,
    samples: data.length,
  }
}

// Calculate kLa using two-film theory
// kLa = ln((C* - C0)/(C* - Ct)) / t
export function calculateKLa(
  cStar: number,
  c0: number,
  cFinal: number,
  timeMinutes: number
): number {
  if (cStar <= cFinal || cStar <= c0) return 0
  const kLa = Math.log((cStar - c0) / (cStar - cFinal)) / timeMinutes
  return kLa
}

// Calculate Oxygen Transfer Efficiency (OTE)
// OTE = (kLa * V * (C* - C0) * time) / (Q * O2_in * ρ_O2 * time) * 100
export function calculateOTE(
  kLa: number,
  volume: number,        // liters
  cStar: number,         // mg/L
  c0: number,            // mg/L (initial DO)
  flowRate: number,      // LPM
  o2Fraction: number,    // 0.21 for air, 1.0 for pure O2
  time: number           // minutes
): number {
  const rhoO2 = 1.429 // g/L density of O2 at STP
  const o2MassFlowRate = flowRate * o2Fraction * rhoO2 * 1000 * time // mg
  
  if (o2MassFlowRate === 0) return 0
  
  const otr = volume * (cStar - c0)  // mg
  const ote = (otr / o2MassFlowRate) * 100
  
  return Math.min(ote, 100) // Cap at 100%
}
