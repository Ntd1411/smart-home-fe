'use client'

import { cn } from '@/shared/lib/utils'
import { useEffect, useRef, useState } from 'react'
import FastMarquee from 'react-fast-marquee'

type Props = {
  text: string
  active?: boolean
  className?: string
  delay?: number
}

export function HoverMarquee({ text, active = false, className, delay = 300 }: Props) {
  const [shouldShowMarquee, setShouldShowMarquee] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  // Kiểm tra overflow
  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const textWidth = textRef.current.scrollWidth
        setIsOverflowing(textWidth > containerWidth)
      }
    }

    // Check sau khi render
    const timeoutId = setTimeout(checkOverflow, 100)

    window.addEventListener('resize', checkOverflow)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', checkOverflow)
    }
  }, [text])

  const handleMouseEnter = () => {
    if (!isOverflowing && !active) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setShouldShowMarquee(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setShouldShowMarquee(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const showMarquee = (shouldShowMarquee || active) && isOverflowing

  return (
    <span
      ref={containerRef}
      className={cn('relative inline-block w-full overflow-hidden', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMarquee ? (
        <FastMarquee gradient={false} pauseOnHover={false} speed={40}>
          {text}&nbsp;&nbsp;&nbsp;&nbsp;
        </FastMarquee>
      ) : (
        <span ref={textRef} className='block overflow-hidden text-ellipsis whitespace-nowrap'>
          {text}
        </span>
      )}
    </span>
  )
}
