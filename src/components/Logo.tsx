"use client"
 
 import { useTheme } from "next-themes"
 import { useState, useEffect } from "react"
 import Image from "next/image"
 
 export default function Logo({ className = "h-14" }: { className?: string }) {
   const { resolvedTheme } = useTheme()
   const [mounted, setMounted] = useState(false)
 
   useEffect(() => setMounted(true), [])
 
   if (!mounted) return <div className={className + " w-32 bg-gray-200 animate-pulse rounded-lg"} />
 
   const isDark = resolvedTheme === "dark"
   const isLight = resolvedTheme === "light"
 
   return (
     <div 
       className={`relative flex items-center gap-4 cursor-pointer group ${className}`}
       onClick={() => window.location.href = "/"}
     >
       {/* Ornate Jaapi Mark */}
       <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
         <div className="absolute inset-[-4px] rounded-full border border-[var(--gold-primary)] opacity-40 group-hover:scale-110 transition-transform duration-700" />
         <div className="absolute inset-[-6px] rounded-full border border-dashed border-[var(--gold-primary)]/20 animate-[spin_30s_linear_infinite]" />
         
         <div className="relative w-full h-full rounded-full overflow-hidden bg-white p-1 shadow-md border border-[var(--gold-primary)]/30">
           <Image 
             src="/jaapi.png" 
             alt="StayNjoy Mark" 
             fill 
             className="object-contain p-0.5"
           />
         </div>
       </div>
 
       {/* Brand Text */}
       <div className="flex flex-col">
         <span className={`text-xl md:text-2xl font-bold font-heading tracking-tighter leading-none ${isDark ? "text-white" : "text-[#1A0811]"}`}>
           Stay<span className="text-[var(--accent-primary)] mx-0.5 italic">N</span>joy
         </span>
         <span className={`text-[8px] font-bold tracking-[0.3em] uppercase opacity-50 ${isDark ? "text-white" : "text-[#1A0811]"}`}>
           Resort • Homestay
         </span>
       </div>
 
       {/* Luxury Accent Flare */}
       <div className="absolute -top-1 -left-1 w-2 h-2 bg-[var(--gold-primary)] rounded-full animate-pulse shadow-[0_0_10px_var(--gold-primary)]" />
     </div>
   )
 }
