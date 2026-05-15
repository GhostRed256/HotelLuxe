"use client"

import { motion } from "framer-motion"

export default function JaapiDivider() {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-[var(--background)]">
      <div className="w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-primary)]/20 to-transparent mb-12" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative flex items-center justify-center w-24 h-24"
      >
        {/* Assamese Jaapi SVG Motif */}
        <svg viewBox="0 0 100 100" className="w-20 h-20 text-[var(--accent-primary)] drop-shadow-lg">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          <path d="M50 5 L95 80 L5 80 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.8" />
          <path d="M50 20 L80 70 L20 70 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        </svg>
        
        {/* Decorative dots */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-1 h-1 rounded-full bg-[var(--accent-primary)]" />
          <div className="w-1 h-1 rounded-full bg-[var(--gold-primary)]" />
          <div className="w-1 h-1 rounded-full bg-[var(--accent-primary)]" />
        </div>
      </motion.div>

      <div className="mt-8 text-center">
        <span className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40">
          Heritage • Tradition • Hospitality
        </span>
      </div>

      <div className="w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-primary)]/20 to-transparent mt-12" />
    </div>
  )
}
