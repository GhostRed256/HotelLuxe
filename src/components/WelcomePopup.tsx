"use client"
 
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Logo from "./Logo"
 
export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Only show once per session
    const hasSeen = sessionStorage.getItem("hasSeenWelcome")
    if (!hasSeen) {
      const timer = setTimeout(() => setIsOpen(true), 1500)
      const hideTimer = setTimeout(() => {
        setIsOpen(false)
        sessionStorage.setItem("hasSeenWelcome", "true")
      }, 15000)
      
      return () => {
        clearTimeout(timer)
        clearTimeout(hideTimer)
      }
    }
  }, [])

  const closePopup = () => {
    setIsOpen(false)
    sessionStorage.setItem("hasSeenWelcome", "true")
  }

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePopup}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
        >
          {/* Shimmering Gold Particles Layer */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: "100%" }}
                animate={{ 
                  opacity: [0, 0.5, 0], 
                  y: "-100%",
                  x: `${Math.random() * 100}%`
                }}
                transition={{ 
                  duration: Math.random() * 5 + 5, 
                  repeat: Infinity,
                  delay: Math.random() * 10
                }}
                className="absolute w-1 h-1 bg-[var(--gold-primary)] rounded-full blur-[1px]"
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative glass-panel p-10 max-w-lg w-full text-center border-2 border-[var(--gold-primary)] shadow-[0_0_50px_rgba(184,143,84,0.3)] cursor-default palace-bg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ultra Premium Gold Corner Accents */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-[var(--gold-primary)] rounded-tl-[2rem]" />
            <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-[var(--gold-primary)] rounded-tr-[2rem]" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-[var(--gold-primary)] rounded-bl-[2rem]" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-[var(--gold-primary)] rounded-br-[2rem]" />
            
            {/* Shimmering Pattern */}
            <div className="absolute inset-0 opacity-[0.03] jaapi-motif pointer-events-none" />

            <button 
              onClick={closePopup}
              className="absolute top-6 right-6 text-2xl text-[var(--gold-primary)] hover:scale-110 transition-transform z-20"
            >
              ✕
            </button>
            
            <div className="mb-10 flex flex-col items-center gap-8 relative z-10">
              <Logo className="h-20" />
              
              <div className="relative w-32 h-32 group">
                <div className="absolute inset-[-10px] rounded-full border-2 border-[var(--gold-primary)]/40 animate-pulse scale-110" />
                <div className="absolute inset-[-20px] rounded-full border border-[var(--gold-primary)]/10 animate-ping" />
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(184,143,84,0.2)_0%,transparent_70%)] group-hover:scale-150 transition-transform duration-1000" />
                <Image 
                  src="/jaapi.png" 
                  alt="Heritage Artifact" 
                  fill 
                  className="object-contain drop-shadow-[0_0_15px_rgba(184,143,84,0.5)]"
                />
              </div>
            </div>

            <h2 className="text-5xl md:text-7xl font-heading font-black mb-6 tracking-tighter leading-none relative z-10">
              <span className="gold-shimmer block mb-3">Welcome to</span>
              <span className="text-[var(--foreground)]">StayNjoy</span>
            </h2>
            
            <p className="font-light text-xl md:text-2xl leading-relaxed italic mb-12 text-[var(--foreground)]/80 relative z-10">
              Your royal sanctuary in the heart of Tinsukia.
            </p>
            
            <button 
              onClick={closePopup}
              className="btn-primary w-full !py-6 text-lg shadow-[0_15px_40px_rgba(184,143,84,0.25)] hover:shadow-[0_25px_60px_rgba(184,143,84,0.4)] !bg-[var(--foreground)] !text-[var(--gold-primary)] border-2 border-[var(--gold-primary)] transition-all duration-700 uppercase tracking-[0.4em] font-black relative z-10"
            >
              Enter the Palace
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
