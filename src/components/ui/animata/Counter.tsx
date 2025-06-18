'use client'

import { useEffect, useState } from 'react'

interface CounterProps {
  targetValue: number
  format?: (value: number) => string
  duration?: number
  className?: string
}

export default function Counter({
  targetValue,
  format = (v) => v.toString(),
  duration = 300,
  className = '',
}: CounterProps) {
  const [displayValue, setDisplayValue] = useState(targetValue)

  useEffect(() => {
    if (displayValue === targetValue) return

    const startValue = displayValue
    const difference = targetValue - startValue
    const startTime = Date.now()

    const updateValue = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      if (progress === 1) {
        setDisplayValue(targetValue)
        return
      }

      // Use easeOut animation curve
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.round(startValue + difference * easeOut)
      setDisplayValue(currentValue)

      requestAnimationFrame(updateValue)
    }

    requestAnimationFrame(updateValue)
  }, [targetValue, duration]) // Remove displayValue from deps to avoid loops

  return <span className={className}>{format(displayValue)}</span>
}
