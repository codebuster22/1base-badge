import React from 'react'

interface CircularProgressProps {
  transactions: number // Changed to match prop name from ContributionBadge
  color: string
}

export function CircularProgress({ transactions, color }: CircularProgressProps) {
  // Calculate percentage or ppm based on total transactions
  const oneBillion = 1000000000
  const ratio = transactions / oneBillion
  const isPercentage = ratio >= 0.0001 // Use percentage if >= 0.0001 (0.01%)
  
  const value = isPercentage 
    ? (ratio * 100)
    : (ratio * 1000000) // Convert to parts per million

  const displayValue = Number(value.toFixed(2)) || 0 // Fallback to 0 if NaN
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (value / (isPercentage ? 100 : 1000000)) * circumference

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-muted-foreground"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {displayValue}
          {isPercentage ? (
            <span>%</span>
          ) : (
            <span className="text-xs align-super">ppm</span>
          )}
        </span>
      </div>
    </div>
  )
}