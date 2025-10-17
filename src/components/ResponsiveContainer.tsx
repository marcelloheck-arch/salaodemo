'use client'

import { useEffect, useState } from 'react'

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
}

export default function ResponsiveContainer({ children, className = '' }: ResponsiveContainerProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  const containerClasses = `
    w-full
    ${isMobile ? 'px-2 py-1' : 'px-4 py-2'}
    ${isTablet ? 'px-6 py-3' : ''}
    transition-all duration-300 ease-in-out
    ${className}
  `

  return (
    <div className={containerClasses.trim()}>
      {children}
    </div>
  )
}
