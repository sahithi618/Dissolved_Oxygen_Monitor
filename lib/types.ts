export interface DODataPoint {
  timeSeconds: number
  timeMins: number
  DO: number
  cStarMinusC?: number
  ln?: number
}

export interface SystemParameters {
  cStar: number // Saturation DO (mg/L)
  kLa: number // Volumetric mass transfer coefficient (1/min)
  OTR: number // Oxygen Transfer Rate
  t90: number // Time to reach 90% saturation
  OTE: number // Oxygen Transfer Efficiency (%)
}

export interface CalculatorInputs {
  initialDO: number // C₀ (mg/L)
  saturationDO: number // C* (mg/L)
  measuredDO: number // Ct (mg/L)
  volume: number // L
  flowRate: number // LPM
  time: number // min
  gasType: 'Air' | 'Oxygen'
}

export interface SystemConfig {
  name: string
  flowRate: number
  volume: number
  waterDepth: string
  o2Concentration: number
}

export interface SystemComparison {
  name: string
  description: string
  efficiency: 'High' | 'Medium' | 'Low'
  kLa: number
  OTE: number
}
