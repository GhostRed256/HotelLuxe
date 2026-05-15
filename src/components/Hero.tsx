"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative px-4 hero-bg overflow-hidden pt-20">
      {/* Immersive Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[var(--background)] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[var(--accent-primary)] font-bold tracking-[0.2em] uppercase text-xs mb-4 block animate-pulse">
            StayNjoy Homestay — Tinsukia 🪷
          </span>
          <h1 className="text-5xl md:text-8xl font-heading font-black text-white mb-6 leading-[1.1] drop-shadow-2xl">
            An Escape Into <span className="text-[var(--accent-primary)]">Tranquility</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed backdrop-blur-[2px]"
        >
          Nestled amidst pristine tea gardens & lush wilderness of Tinsukia. Your home away from home.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Link href="/rooms" className="btn-primary min-w-[200px]">
            Reserve Your Stay
          </Link>
          <Link href="/about" className="btn-outline min-w-[200px] !text-white !border-white/30 hover:!bg-white/20">
            Explore More
          </Link>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-xs font-bold tracking-widest uppercase"
      >
        Scroll
      </motion.div>
    </section>
  )
}
