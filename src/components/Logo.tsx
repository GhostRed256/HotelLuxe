"use client"
 
 import { useTheme } from "next-themes"
 import { useState, useEffect } from "react"
 
 export default function Logo({ className = "h-14" }: { className?: string }) {
   const { resolvedTheme } = useTheme()
   const [mounted, setMounted] = useState(false)
 
   useEffect(() => setMounted(true), [])
 
   if (!mounted) return <div className={className + " w-14 bg-gray-200 animate-pulse rounded-full"} />
 
   const isDark = resolvedTheme === "dark"
   const pinkAccent = "#D14D7E"
   const goldAccent = "#B88F54"
   const houseBg = isDark ? "#2D111A" : "#FDF4F7"
 
   return (
     <svg 
       viewBox="0 0 200 200" 
       className={className + " w-auto cursor-pointer"}
       onClick={() => window.location.href = "/"}
       xmlns="http://www.w3.org/2000/svg"
     >
       {/* Circular Frame */}
       <circle cx="100" cy="100" r="95" fill="none" stroke={pinkAccent} strokeWidth="2" opacity="0.4" />
       <circle cx="100" cy="100" r="90" fill="none" stroke={goldAccent} strokeWidth="1" opacity="0.3" />
       
       {/* House Outline */}
       <path 
         d="M60 120 L60 80 L100 50 L140 80 L140 120 Z" 
         fill={houseBg} 
         stroke={goldAccent}
         strokeWidth="2"
       />
       
       {/* Internal Warm Light (The "Ambiance") */}
       <radialGradient id="warmLight" cx="100" cy="90" r="30" fx="100" fy="90">
         <stop offset="0%" stopColor="#FFA500" stopOpacity="0.6" />
         <stop offset="100%" stopColor="transparent" stopOpacity="0" />
       </radialGradient>
       <circle cx="100" cy="90" r="30" fill="url(#warmLight)" />
       
       {/* Lamp Icon Inside */}
       <path d="M95 105 L105 105 M100 105 L100 85 M90 85 L110 85 L105 75 L95 75 Z" fill={goldAccent} />
       
       {/* Foliage / Leaves (Pink Vines like in image) */}
       <path 
         d="M40 130 Q50 90 65 70" 
         fill="none" 
         stroke={pinkAccent} 
         strokeWidth="3" 
         strokeLinecap="round"
       />
       <circle cx="45" cy="115" r="4" fill={pinkAccent} />
       <circle cx="40" cy="100" r="4" fill={pinkAccent} />
       <circle cx="48" cy="85" r="4" fill={pinkAccent} />
       
       {/* Assamese Flare - Small Jaapi Motif at bottom */}
       <path d="M85 160 Q100 145 115 160" fill="none" stroke={goldAccent} strokeWidth="1" />
       <circle cx="100" cy="155" r="2" fill={pinkAccent} />
     </svg>
   )
 }
