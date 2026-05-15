"use client"

import { motion } from "framer-motion"

export default function JaapiDivider() {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-transparent">
      <div className="w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-primary)]/10 to-transparent mb-8" />
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.2 }}
        viewport={{ once: true }}
        className="relative flex items-center justify-center w-16 h-16"
      >
        {/* Assamese Jaapi SVG Motif - Very Subtle */}
        <svg viewBox="0 0 100 100" className="w-12 h-12 text-[var(--accent-primary)]">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" />
          <path d="M50 5 L95 80 L5 80 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="50" cy="50" r="5" fill="currentColor" />
        </svg>
      </motion.div>

      <div className="w-full max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-primary)]/10 to-transparent mt-8" />
    </div>
  )
}
