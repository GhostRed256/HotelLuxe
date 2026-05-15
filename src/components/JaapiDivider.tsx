"use client"
 
 import { motion } from "framer-motion"
 
 export default function JaapiDivider() {
   return (
     <div className="flex flex-col items-center justify-center py-24 bg-transparent relative overflow-hidden">
       {/* Ornate Gold Lines */}
       <div className="flex items-center gap-8 w-full max-w-4xl px-4">
         <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold-primary)] to-transparent opacity-40" />
         
         <motion.div 
           initial={{ opacity: 0, scale: 0.8 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1.5 }}
           className="relative flex items-center justify-center w-24 h-24"
         >
           {/* Assamese Motif with Gold Accent */}
           <div className="absolute inset-0 bg-[var(--gold-primary)]/5 rounded-full blur-2xl" />
           <svg viewBox="0 0 100 100" className="w-16 h-16 text-[var(--gold-primary)] drop-shadow-[0_0_10px_rgba(184,143,84,0.3)]">
             <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="opacity-30" />
             <path d="M50 10 L90 85 L10 85 Z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
             <path d="M50 20 L80 80 L20 80 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-50" />
             <circle cx="50" cy="56" r="6" fill="currentColor" />
             {/* Small flares */}
             <circle cx="50" cy="10" r="2" fill="currentColor" />
             <circle cx="10" cy="85" r="2" fill="currentColor" />
             <circle cx="90" cy="85" r="2" fill="currentColor" />
           </svg>
         </motion.div>
 
         <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold-primary)] to-transparent opacity-40" />
       </div>
       
       <div className="mt-8 text-[9px] font-bold tracking-[0.6em] uppercase text-[var(--gold-primary)] opacity-40">
         Assam • Heritage • Soul
       </div>
     </div>
   )
 }
