"use client"
 
 import { motion, AnimatePresence } from "framer-motion"
 import Link from "next/link"
 import { useState, useEffect } from "react"
 
 const images = [
   "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=2000",
   "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000",
   "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=2000"
 ]
 
 // Subtle particle effect
 const Particles = () => (
   <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
     {[...Array(20)].map((_, i) => (
       <motion.div
         key={i}
         initial={{ opacity: 0, y: Math.random() * 1000, x: Math.random() * 2000 }}
         animate={{ 
           y: [null, Math.random() * -1000],
           opacity: [0, 0.4, 0],
           scale: [0, Math.random() * 2, 0]
         }}
         transition={{ 
           duration: Math.random() * 10 + 10, 
           repeat: Infinity,
           ease: "linear",
           delay: Math.random() * 10
         }}
         className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
       />
     ))}
   </div>
 )
 
 export default function Hero() {
   const [index, setIndex] = useState(0)
 
   useEffect(() => {
     const timer = setInterval(() => {
       setIndex((prev) => (prev + 1) % images.length)
     }, 8000)
     return () => clearInterval(timer)
   }, [])
 
   return (
     <section className="min-h-screen flex items-center justify-center relative px-4 overflow-hidden pt-20 bg-black">
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
               backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${images[index]})`,
               backgroundAttachment: 'fixed'
             }}
           />
         </AnimatePresence>
       </div>
 
       <Particles />
 
       {/* Immersive Overlay */}
       <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[var(--background)] pointer-events-none z-[1]" />
 
       <div className="max-w-4xl mx-auto text-center z-10">
         {/* Glass UI Container */}
         <motion.div
           initial={{ opacity: 0, scale: 0.9, y: 50 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
           className="glass-panel border-white/10 bg-white/5 backdrop-blur-[12px] p-12 md:p-20 relative overflow-hidden group shadow-[0_32px_120px_-20px_rgba(0,0,0,0.5)]"
         >
           {/* Inner Glows */}
           <div className="absolute -top-24 -left-24 w-48 h-48 bg-[var(--accent-primary)]/20 blur-[100px] rounded-full" />
           <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 blur-[100px] rounded-full" />

           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
           >
             <span className="text-[var(--accent-primary)] font-bold tracking-[0.5em] uppercase text-[10px] mb-6 block drop-shadow-sm">
               StayNjoy • Tinsukia, Assam
             </span>
           </motion.div>
 
           <h1 className="text-6xl md:text-9xl font-heading font-extralight text-white mb-6 leading-tight tracking-tighter relative">
             {/* Text Back Glows */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
               <span className="text-[var(--accent-primary)] blur-[40px] opacity-15">Stay N Joy</span>
               <span className="absolute text-amber-400 blur-[60px] opacity-10">Stay N Joy</span>
             </div>
             
             <span className="relative z-10 opacity-90">Stay</span> 
             <span className="relative z-10 text-[var(--accent-primary)] font-black mx-4 italic scale-110 inline-block drop-shadow-[0_0_15px_rgba(209,77,126,0.5)]">N</span> 
             <span className="relative z-10 opacity-90">Joy</span>
           </h1>
           
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="mb-12"
           >
             <h2 className="text-3xl md:text-6xl font-cinzel italic text-white mb-6 leading-tight drop-shadow-lg opacity-95">
               An Escape Into <span className="text-[var(--accent-primary)]">Tranquility</span>
             </h2>
             <p className="text-white/70 text-sm md:text-lg max-w-xl mx-auto font-light leading-relaxed tracking-wide">
               Nestled amidst pristine tea gardens & lush wilderness. <br/>
               <span className="text-[10px] font-bold tracking-[0.3em] text-amber-500/80 uppercase mt-2 block">Hospitality That Feels Like Home</span>
             </p>
           </motion.div>
 
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.6 }}
             className="flex flex-col sm:flex-row gap-6 justify-center items-center"
           >
             <Link href="/rooms" className="btn-primary min-w-[240px] !bg-[var(--accent-primary)] shadow-[0_0_40px_rgba(209,77,126,0.4)] hover:scale-105 active:scale-95 text-[11px] font-bold tracking-[0.2em] uppercase">
               Reserve Your Stay
             </Link>
             <Link href="/about" className="btn-outline min-w-[240px] !text-white !border-white/30 hover:!bg-white/10 backdrop-blur-md text-[11px] font-bold tracking-[0.2em] uppercase">
               Explore More
             </Link>
           </motion.div>
         </motion.div>
 
         {/* Simple Assamese Greeting */}
         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 0.8 }}
           transition={{ delay: 1, duration: 2 }}
           className="mt-16 text-[11px] font-bold tracking-[0.4em] uppercase text-[var(--accent-primary)] drop-shadow-md"
         >
           আপোনালৈ স্বাগতম • Welcome
         </motion.div>
       </div>
 
       {/* Floating Scroll Indicator */}
       <motion.div 
         animate={{ y: [0, 10, 0] }}
         transition={{ duration: 2, repeat: Infinity }}
         className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-[9px] font-bold tracking-[0.5em] uppercase z-10"
       >
         Scroll
       </motion.div>
     </section>
   )
 }
