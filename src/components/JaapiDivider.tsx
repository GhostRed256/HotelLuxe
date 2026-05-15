"use client"
 
 import { motion } from "framer-motion"
 import Image from "next/image"
 
 export default function JaapiDivider() {
   return (
     <div className="flex flex-col items-center justify-center py-24 bg-transparent relative overflow-hidden">
       {/* Ornate Gold Lines */}
       <div className="flex items-center gap-8 w-full max-w-5xl px-4">
         <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold-primary)] to-transparent opacity-40" />
         
         <motion.div 
           initial={{ opacity: 0, scale: 0.8 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1.5 }}
           className="relative flex items-center justify-center w-40 h-40"
         >
           {/* Patterned Border Container - Pure Gold Motifs */}
           <div className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--gold-primary)] opacity-40 animate-[spin_25s_linear_infinite]" />
           <div className="absolute inset-[-6px] rounded-full border border-[var(--gold-primary)] opacity-25" />
           <div className="absolute inset-[-12px] rounded-full border border-dashed border-[var(--gold-primary)]/15 animate-[spin_35s_linear_infinite_reverse]" />
           
           {/* The Jaapi PNG itself - Transparent and Large */}
           <div className="relative w-32 h-32 flex items-center justify-center">
             <Image 
               src="/jaapi.png" 
               alt="Assamese Jaapi Artifact" 
               fill 
               className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
             />
           </div>
 
           {/* Atmospheric Gold Glow */}
           <div className="absolute inset-0 bg-[var(--gold-primary)]/15 rounded-full blur-3xl -z-10" />
         </motion.div>
 
         <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold-primary)] to-transparent opacity-40" />
       </div>
       
       <div className="mt-10 text-[11px] font-bold tracking-[0.7em] uppercase text-[var(--gold-primary)] opacity-60 flex items-center gap-6">
         <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold-primary)] animate-pulse" />
         The Soul of Assam
         <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold-primary)] animate-pulse" />
       </div>
     </div>
   )
 }
