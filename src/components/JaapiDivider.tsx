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
           className="relative flex items-center justify-center w-32 h-32"
         >
           {/* Patterned Border Container */}
           <div className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--gold-primary)] opacity-30 animate-[spin_20s_linear_infinite]" />
           <div className="absolute inset-[-4px] rounded-full border border-[var(--gold-primary)] opacity-20" />
           <div className="absolute inset-[-8px] rounded-full border border-dashed border-[var(--gold-primary)]/10 animate-[spin_30s_linear_infinite_reverse]" />
           
           <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-[0_0_30px_rgba(184,143,84,0.3)] bg-white p-1">
             <Image 
               src="/jaapi.png" 
               alt="Assamese Jaapi" 
               fill 
               className="object-contain p-1"
             />
           </div>
 
           {/* Atmospheric Glow */}
           <div className="absolute inset-0 bg-[var(--gold-primary)]/10 rounded-full blur-3xl -z-10" />
         </motion.div>
 
         <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold-primary)] to-transparent opacity-40" />
       </div>
       
       <div className="mt-10 text-[10px] font-bold tracking-[0.6em] uppercase text-[var(--gold-primary)] opacity-50 flex items-center gap-4">
         <span className="w-2 h-2 rounded-full bg-[var(--gold-primary)]/20" />
         The Spirit of Assam
         <span className="w-2 h-2 rounded-full bg-[var(--gold-primary)]/20" />
       </div>
     </div>
   )
 }
