"use client"
 
 import { motion, AnimatePresence } from "framer-motion"
 import Link from "next/link"
 import { useState, useEffect } from "react"
 
 const images = [
   "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=2000",
   "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000",
   "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=2000"
 ]
 
 export default function Hero() {
   const [index, setIndex] = useState(0)
 
   useEffect(() => {
     const timer = setInterval(() => {
       setIndex((prev) => (prev + 1) % images.length)
     }, 6000)
     return () => clearInterval(timer)
   }, [])
 
   return (
     <section className="min-h-screen flex items-center justify-center relative px-4 overflow-hidden pt-20">
       {/* Background Image Slider */}
       <div className="absolute inset-0 z-0">
         <AnimatePresence mode="wait">
           <motion.div
             key={index}
             initial={{ opacity: 0, scale: 1.1 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 1.05 }}
             transition={{ duration: 2, ease: "easeInOut" }}
             className="absolute inset-0 bg-cover bg-center bg-no-repeat"
             style={{ 
               backgroundImage: `linear-gradient(rgba(10, 3, 7, 0.4), rgba(10, 3, 7, 0.4)), url(${images[index]})`,
               backgroundAttachment: 'fixed'
             }}
           />
         </AnimatePresence>
       </div>
 
       {/* Immersive Overlay */}
       <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[var(--background)] pointer-events-none z-[1]" />
 
       <div className="max-w-4xl mx-auto text-center z-10">
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
         >
           <div className="flex flex-col items-center mb-4">
             <span className="text-[var(--accent-primary)] font-bold tracking-[0.3em] uppercase text-[10px] mb-2 block animate-pulse">
               অতিথি দেৱো ভৱ • Guest is God
             </span>
             <div className="h-[1px] w-12 bg-[var(--accent-primary)] opacity-40" />
           </div>

           <h1 className="text-6xl md:text-9xl font-script text-[var(--accent-primary)] mb-4 leading-none drop-shadow-[0_5px_15px_rgba(209,77,126,0.3)]">
             Stay <span className="text-[var(--gold-primary)] italic">N</span> Joy
           </h1>
           <p className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-60 mb-8">
             H O M E S T A Y
           </p>
           
           <div className="mb-10">
             <p className="text-white text-sm md:text-lg font-light italic opacity-90 mb-2">
               "Hospitality that feels like home"
             </p>
             <div className="flex justify-center gap-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[var(--gold-primary)]">
               <span>Warm Hospitality</span>
               <span>•</span>
               <span>Beautiful Ambiance</span>
               <span>•</span>
               <span>Aesthetic Looks</span>
             </div>
           </div>
         </motion.div>
 
         <motion.p
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
           className="text-white/90 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed"
         >
           Stay Amazing, Stay Affordable. <br/>
           <span className="text-sm opacity-60">Nestled in the lush greenery of Upper Assam.</span>
         </motion.p>
 
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
           className="flex flex-col sm:flex-row gap-6 justify-center items-center"
         >
           <Link href="/rooms" className="btn-primary min-w-[200px] !bg-[var(--accent-primary)]">
             Reserve Your Stay
           </Link>
           <Link href="/about" className="btn-outline min-w-[200px] !text-white !border-white/30 hover:!bg-white/10">
             Explore Palace
           </Link>
         </motion.div>

         {/* Assamese Flare - Welcome in Assamese */}
         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 0.4 }}
           transition={{ delay: 1, duration: 2 }}
           className="mt-16 text-[10px] font-bold tracking-[0.3em] uppercase"
         >
           আপোনালৈ স্বাগতম — Welcome to StayNJoy
         </motion.div>
       </div>
 
       {/* Floating Scroll Indicator */}
       <motion.div 
         animate={{ y: [0, 10, 0] }}
         transition={{ duration: 2, repeat: Infinity }}
         className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-xs font-bold tracking-widest uppercase z-10"
       >
         Scroll
       </motion.div>
     </section>
   )
 }
