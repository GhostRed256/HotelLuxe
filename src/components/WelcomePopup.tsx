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
    const timer = setTimeout(() => setIsOpen(true), 1500)
    const hideTimer = setTimeout(() => setIsOpen(false), 9500)

    return () => {
      clearTimeout(timer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!mounted) return null

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
            className="relative glass-panel p-10 max-w-lg w-full text-center ornate-border cursor-default homestay-bg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Premium Gold Corner Accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[var(--gold-primary)] opacity-40 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[var(--gold-primary)] opacity-40 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[var(--gold-primary)] opacity-40 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[var(--gold-primary)] opacity-40 rounded-br-3xl" />

            {/* Subtle Gold Radial Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(184,143,84,0.05)_0%,transparent_70%)] pointer-events-none" />

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-2xl opacity-50 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>

            {/* Unified Branding Header */}
            <div className="mb-8 flex flex-col items-center gap-6">
              <Logo className="h-16" />

              {/* Heritage Artifact with Enhanced Gold Glow */}
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-2 border-[var(--gold-primary)]/30 animate-ping" />
                <div className="absolute inset-[-4px] rounded-full border border-[var(--gold-primary)]/20 shadow-[0_0_20px_rgba(184,143,84,0.3)]" />
                <Image
                  src="/jaapi.png"
                  alt="Heritage Artifact"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <h2 className="text-3xl font-heading font-black mb-2">Welcome to <span className="text-[var(--accent-primary)]">StayNJoy</span></h2>
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40 mb-8">Homestay Experience Reimagined</p>

            <p className="font-light text-lg md:text-xl leading-relaxed italic mb-10 text-[var(--foreground)]/70">
              Discover the perfect blend of tradition and modern elegance in the heart of Tinsukia.
            </p>

            <button
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full shadow-[0_10px_30px_rgba(209,77,126,0.3)] hover:shadow-[0_20px_40px_rgba(184,143,84,0.4)] !bg-[var(--accent-primary)] border-2 border-[var(--gold-primary)]/30 transition-all duration-500 uppercase tracking-[0.2em] font-bold"
            >
              Enter the Experience
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
