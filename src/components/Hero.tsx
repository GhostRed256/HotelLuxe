"use client"
 
 import { motion, AnimatePresence } from "framer-motion"
 import Link from "next/link"
 import { useState, useEffect } from "react"
 import { useTheme } from "next-themes"
 
 const images = [
   "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=2000",
   "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000",
   "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=2000"
 ]
 
 // Subtle particle effect
 const Particles = ({ theme }: { theme: string | undefined }) => (
   <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
     {[...Array(20)].map((_, i) => (
       <motion.div
         key={i}
         initial={{ opacity: 0, y: Math.random() * 1000, x: Math.random() * 2000 }}
         animate={{ 
           y: [null, Math.random() * -1000],
           opacity: [0, theme === 'dark' ? 0.4 : 0.2, 0],
           scale: [0, Math.random() * 2, 0]
         }}
         transition={{ 
           duration: Math.random() * 10 + 10, 
           repeat: Infinity,
           ease: "linear",
           delay: Math.random() * 10
         }}
         className={`absolute w-1 h-1 rounded-full blur-[1px] ${theme === 'dark' ? 'bg-white' : 'bg-[var(--accent-primary)]'}`}
       />
     ))}
   </div>
 )
 
 export default function Hero() {
   const [index, setIndex] = useState(0)
   const { resolvedTheme } = useTheme()
   const [mounted, setMounted] = useState(false)
 
   useEffect(() => {
     setMounted(true)
     const timer = setInterval(() => {
       setIndex((prev) => (prev + 1) % images.length)
     }, 8000)
     return () => clearInterval(timer)
   }, [])
 
   if (!mounted) return null
 
   const isDark = resolvedTheme === 'dark'
 
   return (
     <section className="min-h-screen flex items-center justify-center relative px-4 overflow-hidden pt-20 bg-[var(--background)]">
       {/* Background Image Slider (Side-to-Side) */}
       <div className="absolute inset-0 z-0">
         <AnimatePresence initial={false}>
           <motion.div
             key={index}
             initial={{ x: "100%" }}
             animate={{ x: 0 }}
             exit={{ x: "-100%" }}
             transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
             className="absolute inset-0 bg-cover bg-center bg-no-repeat"
             style={{ 
               backgroundImage: `linear-gradient(rgba(${isDark ? '0,0,0,0.7' : '255,255,255,0.55'}), rgba(${isDark ? '0,0,0,0.7' : '255,255,255,0.55'})), url(${images[index]})`,
               backgroundAttachment: 'fixed'
             }}
           />
         </AnimatePresence>
       </div>
 
       <Particles theme={resolvedTheme} />
 
       {/* Immersive Overlays */}
       <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)] pointer-events-none z-[1] ${isDark ? 'from-black/60' : 'from-white/60'}`} />
 
       <div className="max-w-6xl mx-auto text-center z-10">
         <motion.div
           initial={{ opacity: 0, y: 50 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
           className="relative"
         >
           {/* Subtle glow effect */}
           <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] blur-[120px] rounded-full pointer-events-none z-0 ${isDark ? 'bg-black/20' : 'bg-[var(--accent-primary)]/5'}`} />
 
           <div className="relative z-10">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
             >
               <span className={`font-bold tracking-[0.5em] uppercase text-[10px] md:text-[12px] mb-8 block ${isDark ? 'text-[var(--accent-primary)]' : '!text-[#1A0811]'}`}>
                 StayNjoy • The Soul of Upper Assam
               </span>
             </motion.div>
 
             <h1 className={`text-7xl md:text-[10rem] font-heading font-extralight mb-8 leading-none tracking-tighter relative transition-colors duration-700 ${isDark ? 'text-white' : 'text-[var(--foreground)]'}`}>
               <span className="relative z-10">Stay</span> 
               <span className="relative z-10 text-[var(--accent-primary)] font-black mx-6 italic scale-110 inline-block">N</span> 
               <span className="relative z-10">Joy</span>
             </h1>
             
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
               className="mb-16"
             >
               <h2 className={`text-4xl md:text-7xl font-cinzel italic mb-8 leading-tight transition-colors duration-700 ${isDark ? 'text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]' : 'text-[var(--foreground)]'}`}>
                 Where <span className="text-[var(--accent-primary)]">Heritage</span> Meets the Horizon
               </h2>
               <div className="flex flex-col items-center gap-4">
                 <p className={`text-base md:text-xl max-w-2xl mx-auto font-light leading-relaxed tracking-wide transition-colors duration-700 ${isDark ? 'text-white/80 drop-shadow-md' : 'text-[var(--foreground)]/80'}`}>
                   Immerse yourself in curated elegance amidst the emerald tea estates of Tinsukia. 
                 </p>
                 <span className="text-[10px] font-bold tracking-[0.4em] text-[var(--gold-primary)] uppercase drop-shadow-sm border-y border-[var(--gold-primary)]/20 py-2">A Legacy of Palatial Warmth</span>
               </div>
             </motion.div>
 
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.6 }}
               className="flex flex-col sm:flex-row gap-8 justify-center items-center"
             >
               <Link href="/rooms" className="btn-primary min-w-[260px] !py-5 !bg-[var(--accent-primary)] shadow-[0_20px_50px_rgba(209,77,126,0.3)] hover:scale-105 active:scale-95 text-[12px] font-bold tracking-[0.2em] uppercase border-none">
                 Reserve Your Stay
               </Link>
               <Link href="/about" className={`btn-outline min-w-[260px] !py-5 backdrop-blur-xl text-[12px] font-bold tracking-[0.2em] uppercase transition-all ${isDark ? '!text-white !border-[var(--gold-primary)]/40 hover:!bg-[var(--gold-primary)]/10' : '!text-[var(--foreground)] !border-[var(--gold-primary)]/40 hover:!bg-[var(--gold-primary)]/5'}`}>
                 Explore More
               </Link>
             </motion.div>
           </div>
         </motion.div>
 
         {/* Simple Assamese Greeting */}
         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1, duration: 2 }}
           className="mt-24 flex items-center justify-center gap-6"
         >
           <div className="w-12 h-[1px] bg-[var(--gold-primary)] opacity-30" />
           <span className="text-[12px] font-bold tracking-[0.5em] uppercase text-[var(--gold-primary)]">
             আপোনালৈ স্বাগতম • Welcome
           </span>
           <div className="w-12 h-[1px] bg-[var(--gold-primary)] opacity-30" />
         </motion.div>
       </div>
 
       {/* Floating Scroll Indicator */}
       <motion.div 
         animate={{ y: [0, 10, 0] }}
         transition={{ duration: 2, repeat: Infinity }}
         className={`absolute bottom-10 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-[0.5em] uppercase z-10 ${isDark ? 'text-white/30' : '!text-[#1A0811]'}`}
       >
         Scroll
       </motion.div>
     </section>
   )
 }
