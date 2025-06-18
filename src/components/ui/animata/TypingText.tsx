'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface TypingTextProps {
  text: string
  waitTime?: number
  alwaysVisibleCount?: number
  className?: string
}

export default function TypingText({
  text,
  waitTime = 1000,
  alwaysVisibleCount = 0,
  className = '',
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (!isTyping) {
      timeout = setTimeout(() => {
        setIsTyping(true)
        let currentIndex = alwaysVisibleCount

        const typeText = () => {
          if (currentIndex <= text.length) {
            setDisplayedText(text.slice(0, currentIndex))
            currentIndex++
            setTimeout(typeText, 50)
          } else {
            setIsTyping(false)
          }
        }

        typeText()
      }, waitTime)
    }

    return () => clearTimeout(timeout)
  }, [text, waitTime, alwaysVisibleCount, isTyping])

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayedText}
      {isTyping && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="ml-1"
        >
          |
        </motion.span>
      )}
    </motion.span>
  )
}
