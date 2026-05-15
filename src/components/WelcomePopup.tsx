"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import Logo from "./Logo"

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setIsOpen(true), 1500)
    const hideTimer = setTimeout(() => setIsOpen(false), 9500)
    
    return () => {
      clearTimeout(timer)
      clearTimeout(hideTimer)
    }
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative glass-panel p-10 max-w-lg w-full text-center ornate-border cursor-default palace-bg"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-2xl opacity-50 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
            <div className="mb-8 flex justify-center">
              <Logo className="h-24" />
            </div>
            <h2 className="text-4xl md:text-6xl font-heading font-black mb-6 tracking-tight leading-none">
              Luxury Awaits <span className="text-[var(--accent-primary)]">You</span>
            </h2>
            <p className="opacity-70 font-light text-lg md:text-xl leading-relaxed italic mb-10">
              Discover the perfect blend of tradition and modern elegance in the heart of Tinsukia.
            </p>
            <button 
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full shadow-none hover:shadow-2xl"
            >
              Enter the Experience
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
