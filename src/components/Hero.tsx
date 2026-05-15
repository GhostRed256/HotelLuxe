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
               backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${images[index]})`,
               backgroundAttachment: 'fixed'
             }}
           />
         </AnimatePresence>
       </div>
 
       <Particles />
 
       {/* Immersive Overlays */}
       <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[var(--background)] pointer-events-none z-[1]" />
       <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-[1]" />
 
       <div className="max-w-6xl mx-auto text-center z-10">
         <motion.div
           initial={{ opacity: 0, y: 50 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
           className="relative"
         >
           {/* Sophisticated Glows behind text (No box) */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-black/20 blur-[120px] rounded-full pointer-events-none z-0" />
 
           <div className="relative z-10">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
             >
               <span className="text-[var(--accent-primary)] font-bold tracking-[0.5em] uppercase text-[10px] md:text-[12px] mb-8 block drop-shadow-lg">
                 StayNjoy • The Soul of Upper Assam
               </span>
             </motion.div>
 
             <h1 className="text-7xl md:text-[11rem] font-heading font-extralight text-white mb-8 leading-none tracking-tighter relative">
               {/* Text Back Glows */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                 <span className="text-[var(--accent-primary)] blur-[60px] opacity-20">Stay N Joy</span>
               </div>
               
               <span className="relative z-10">Stay</span> 
               <span className="relative z-10 text-[var(--accent-primary)] font-black mx-6 italic scale-110 inline-block drop-shadow-[0_0_20px_rgba(209,77,126,0.6)]">N</span> 
               <span className="relative z-10">Joy</span>
             </h1>
             
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
               className="mb-16"
             >
               <h2 className="text-4xl md:text-7xl font-cinzel italic text-white mb-8 leading-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                 Where <span className="text-[var(--accent-primary)]">Heritage</span> Meets the Horizon
               </h2>
               <div className="flex flex-col items-center gap-4">
                 <p className="text-white/80 text-base md:text-xl max-w-2xl mx-auto font-light leading-relaxed tracking-wide drop-shadow-md">
                   Immerse yourself in curated elegance amidst the emerald tea estates of Tinsukia. 
                 </p>
                 <span className="text-[10px] font-bold tracking-[0.4em] text-amber-400 uppercase drop-shadow-lg">A Legacy of Palatial Warmth</span>
               </div>
             </motion.div>
 
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.6 }}
               className="flex flex-col sm:flex-row gap-8 justify-center items-center"
             >
               <Link href="/rooms" className="btn-primary min-w-[260px] !py-5 !bg-[var(--accent-primary)] shadow-[0_20px_50px_rgba(209,77,126,0.5)] hover:scale-105 active:scale-95 text-[12px] font-bold tracking-[0.2em] uppercase">
                 Reserve Your Stay
               </Link>
               <Link href="/about" className="btn-outline min-w-[260px] !py-5 !text-white !border-white/40 hover:!bg-white/10 backdrop-blur-xl text-[12px] font-bold tracking-[0.2em] uppercase">
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
           className="mt-24 text-[12px] font-bold tracking-[0.5em] uppercase text-[var(--accent-primary)] drop-shadow-xl"
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
