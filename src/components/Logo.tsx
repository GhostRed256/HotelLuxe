"use client"
 
 import { useTheme } from "next-themes"
 import { useState, useEffect } from "react"
 
 export default function Logo({ className = "h-14" }: { className?: string }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className={className + " aspect-square bg-gray-200 animate-pulse rounded-full"} />

  const isDark = resolvedTheme === "dark"
  const goldPrimary = "#B88F54"
  const goldDark = "#96713F"
  const accentPrimary = "#FF2D55" // Vibrant Pink
  const goldGlow = isDark ? "#FFD700" : "#B88F54"

  return (
    <svg 
      viewBox="0 0 400 400" 
      className={`${className} w-auto cursor-pointer transition-all duration-500 animate-entrance`}
      onClick={() => window.location.href = "/"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes logo-entrance {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes glow-pulse {
            0%, 100% { filter: drop-shadow(0 0 8px ${goldGlow}44) drop-shadow(0 0 12px ${accentPrimary}33); }
            50% { filter: drop-shadow(0 0 20px ${goldGlow}88) drop-shadow(0 0 25px ${accentPrimary}66); }
          }
          @keyframes particle-float {
            0% { transform: translate(0, 0) scale(0); opacity: 0; }
            20% { opacity: 0.6; transform: scale(1); }
            80% { opacity: 0.6; transform: scale(1); }
            100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
          }
          @keyframes shimmer {
            0% { stop-offset: -100%; }
            100% { stop-offset: 200%; }
          }
          .animate-entrance { animation: logo-entrance 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .animate-glow { animation: glow-pulse 4s ease-in-out infinite; }
          .particle { animation: particle-float 6s infinite ease-in-out; pointer-events: none; }
        `}
      </style>

      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: goldDark, stopOpacity: 1 }} />
          <stop offset="20%" style={{ stopColor: goldPrimary, stopOpacity: 1 }} />
          <stop offset="40%" style={{ stopColor: "#FFF", stopOpacity: 1 }} />
          <stop offset="60%" style={{ stopColor: goldPrimary, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: goldDark, stopOpacity: 1 }} />
        </linearGradient>
        
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="2" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="goldTextGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
          <feMerge result="blur">
             <feMergeNode in="blur1" />
             <feMergeNode in="blur2" />
          </feMerge>
          <feFlood floodColor={goldPrimary} floodOpacity="0.5" result="glowColor" />
          <feComposite in="glowColor" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Particles Layer */}
      <g className="particles-layer">
        {[...Array(15)].map((_, i) => (
          <circle
            key={i}
            className="particle"
            r={Math.random() * 2 + 1}
            fill={i % 2 === 0 ? goldPrimary : accentPrimary}
            cx={150 + Math.random() * 100}
            cy={150 + Math.random() * 100}
            style={{
              '--dx': `${(Math.random() - 0.5) * 250}px`,
              '--dy': `${(Math.random() - 0.5) * 250}px`,
              animationDelay: `${Math.random() * 6}s`,
            } as any}
          />
        ))}
      </g>

      {/* Background Disc */}
      <circle 
        cx="200" cy="200" r="190" 
        fill={isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)"} 
        className="transition-colors duration-700"
      />

      {/* Circular Borders */}
      <g className="animate-glow">
        <circle 
          cx="200" cy="200" r="185" 
          fill="none" 
          stroke="url(#goldGradient)" 
          strokeWidth="8" 
        />
        <circle 
          cx="200" cy="200" r="170" 
          fill="none" 
          stroke="url(#goldGradient)" 
          strokeWidth="3" 
          opacity="0.6"
        />
      </g>
      
      {/* Icon and Typography Group */}
      <g className="animate-glow">
        {/* Minimalist House Icon */}
        <g transform="translate(160, 60) scale(0.8)">
          <path 
            d="M10 50 L50 10 L90 50 L90 90 L10 90 Z" 
            fill="none" 
            stroke="url(#goldGradient)" 
            strokeWidth="8" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path 
            d="M65 25 L65 15 L75 15 L75 35" 
            fill="none" 
            stroke="url(#goldGradient)" 
            strokeWidth="6" 
            strokeLinecap="round"
          />
          <rect 
            x="35" y="60" width="30" height="30" 
            fill="none" 
            stroke="url(#goldGradient)" 
            strokeWidth="6"
          />
        </g>

        {/* StayNjoy Typography */}
        <g filter="url(#goldTextGlow)">
          <text 
            x="200" 
            y="245" 
            textAnchor="middle" 
            className="font-heading italic font-black"
            style={{ 
              fontSize: "90px", 
              fill: accentPrimary,
              fontFamily: "var(--font-heading), cursive",
              letterSpacing: "-4px"
            }}
          >
            Stay
          </text>
          
          <text 
            x="200" 
            y="310" 
            textAnchor="middle" 
            className="font-heading italic font-black"
            style={{ 
              fontSize: "90px", 
              fontFamily: "var(--font-heading), cursive",
              letterSpacing: "-4px"
            }}
          >
            <tspan fill="url(#goldGradient)">N</tspan>
            <tspan fill={accentPrimary}>joy</tspan>
          </text>
        </g>
      </g>
    </svg>
  )
}
