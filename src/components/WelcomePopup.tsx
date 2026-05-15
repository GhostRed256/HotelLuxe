"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"

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
            <div className="mb-6 animate-float flex justify-center">
              {mounted ? (
                <img 
                  src={resolvedTheme === "dark" ? "/logo-dark.png" : "/logo-light.png"} 
                  alt="StayNjoy Logo" 
                  className="h-24 w-auto"
                  style={{ objectFit: "contain" }}
                />
              ) : (
                <div className="h-24"></div>
              )}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gold-gradient-text gold-shimmer">
              Welcome to StayNjoy
            </h2>
            <p className="opacity-80 italic text-lg leading-relaxed">
              Your cozy homestay in Tinsukia. Rooms from ₹1399/night with free WiFi, projector & more!
            </p>
            <button 
              onClick={() => setIsOpen(false)}
              className="mt-8 btn-primary text-sm px-10 py-3"
            >
              Explore Rooms
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
