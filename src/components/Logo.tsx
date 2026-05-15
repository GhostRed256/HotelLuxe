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
   const accentPrimary = "#D14D7E" // Plum/Pink accent
   const plumDark = "#1A0811"
 
   return (
     <svg 
       viewBox="0 0 400 400" 
       className={className + " w-auto cursor-pointer drop-shadow-2xl transition-transform hover:scale-105"}
       onClick={() => window.location.href = "/"}
       xmlns="http://www.w3.org/2000/svg"
     >
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
       </defs>
 
       {/* Background Disc for contrast in dark mode if needed */}
       <circle cx="200" cy="200" r="190" fill={isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)"} />
 
       {/* Double Gold Circular Borders */}
       <circle 
         cx="200" 
         cy="200" 
         r="185" 
         fill="none" 
         stroke="url(#goldGradient)" 
         strokeWidth="8" 
       />
       <circle 
         cx="200" 
         cy="200" 
         r="170" 
         fill="none" 
         stroke="url(#goldGradient)" 
         strokeWidth="3" 
         opacity="0.6"
       />
       
       {/* Minimalist House Icon */}
       <g transform="translate(160, 80) scale(0.8)">
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
 
       {/* Stay'n Joy Typography */}
       <g filter="url(#shadow)">
         <text 
           x="200" 
           y="260" 
           textAnchor="middle" 
           className="font-heading italic font-black"
           style={{ 
             fontSize: "85px", 
             fill: isDark ? "#E8639A" : "#8B1A4A",
             fontFamily: "var(--font-heading), cursive",
             letterSpacing: "-2px"
           }}
         >
           Stay
         </text>
         
         <text 
           x="200" 
           y="320" 
           textAnchor="middle" 
           className="font-heading"
           style={{ 
             fontSize: "60px", 
             fill: "url(#goldGradient)",
             fontFamily: "var(--font-heading)",
             fontWeight: "900"
           }}
         >
           'n
         </text>
         
         <text 
           x="200" 
           y="380" 
           textAnchor="middle" 
           className="font-heading italic font-black"
           style={{ 
             fontSize: "85px", 
             fill: isDark ? "#E8639A" : "#8B1A4A",
             fontFamily: "var(--font-heading), cursive",
             letterSpacing: "-2px"
           }}
         >
           Joy
         </text>
       </g>
     </svg>
   )
 }
