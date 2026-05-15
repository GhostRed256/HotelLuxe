"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export default function Logo({ className = "h-14" }: { className?: string }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className={className + " w-14 bg-gray-200 animate-pulse rounded-full"} />

  const isDark = resolvedTheme === "dark"
  const goldPrimary = "#B88F54"
  const goldLight = "#F5EDE3"
  const accentPrimary = "#D14D7E"

  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className + " w-auto cursor-pointer"}
      onClick={() => window.location.href = "/"}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Decorative Ornate Circle */}
      <circle cx="100" cy="100" r="90" fill="none" stroke={goldPrimary} strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
      <circle cx="100" cy="100" r="85" fill="none" stroke={goldPrimary} strokeWidth="1" />
      
      {/* Crown Icon */}
      <path 
        d="M60 110 L60 80 L80 95 L100 70 L120 95 L140 80 L140 110 Z" 
        fill={isDark ? accentPrimary : goldPrimary} 
        stroke={isDark ? "white" : goldPrimary}
        strokeWidth="2"
      />
      <circle cx="60" cy="80" r="4" fill={goldPrimary} />
      <circle cx="100" cy="70" r="4" fill={goldPrimary} />
      <circle cx="140" cy="80" r="4" fill={goldPrimary} />
      
      {/* Bottom Plate */}
      <rect x="60" y="115" width="80" height="10" rx="2" fill={goldPrimary} />
      
      {/* Gems */}
      <circle cx="80" cy="120" r="2" fill="white" />
      <circle cx="100" cy="120" r="2" fill={isDark ? accentPrimary : "white"} />
      <circle cx="120" cy="120" r="2" fill="white" />

      {/* Luxury Accents */}
      <path d="M40 100 Q10 100 10 70" fill="none" stroke={goldPrimary} strokeWidth="2" opacity="0.6" />
      <path d="M160 100 Q190 100 190 70" fill="none" stroke={goldPrimary} strokeWidth="2" opacity="0.6" />
    </svg>
  )
}
