"use client"
 
 import { useTheme } from "next-themes"
 import { useState, useEffect } from "react"
 import Image from "next/image"
 
 export default function Logo({ className = "h-14" }: { className?: string }) {
   const { resolvedTheme } = useTheme()
   const [mounted, setMounted] = useState(false)
 
   useEffect(() => setMounted(true), [])
 
   if (!mounted) return <div className={className + " w-14 bg-gray-200 animate-pulse rounded-full"} />
 
   const isDark = resolvedTheme === "dark"
   const goldPrimary = "#B88F54"
 
   return (
     <div 
       className={`relative flex items-center justify-center cursor-pointer group ${className}`}
       onClick={() => window.location.href = "/"}
     >
       {/* Ornate Gold Borders around the Jaapi Logo */}
       <div className="absolute inset-[-4px] rounded-full border border-[var(--gold-primary)] opacity-40 group-hover:scale-110 transition-transform duration-700" />
       <div className="absolute inset-[-8px] rounded-full border border-dashed border-[var(--gold-primary)]/20 animate-[spin_30s_linear_infinite]" />
       
       <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-white p-1 shadow-lg border border-[var(--gold-primary)]/30">
         <Image 
           src="/jaapi.png" 
           alt="StayNjoy Logo" 
           fill 
           className="object-contain p-0.5"
         />
       </div>
 
       {/* Luxury Flare */}
       <div className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--gold-primary)] rounded-full animate-pulse shadow-[0_0_10px_var(--gold-primary)]" />
     </div>
   )
 }
