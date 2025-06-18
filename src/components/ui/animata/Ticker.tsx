'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface TickerProps {
  value: string | number
  className?: string
}

export default function Ticker({ value, className = '' }: TickerProps) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    setDisplayValue(value)
  }, [value])

  return (
    <motion.span
      key={displayValue}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={className}
    >
      {displayValue}
    </motion.span>
  )
}
