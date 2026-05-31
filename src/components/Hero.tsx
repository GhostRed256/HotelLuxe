"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { ShieldCheck } from "lucide-react"

const images = [
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=60&w=1200",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=60&w=1200",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=60&w=1200"
]

// Pre-compute particle data outside render to satisfy react-hooks/purity rule
const PARTICLE_DATA = [...Array(8)].map(() => ({
  initY: Math.random() * 1000,
  initX: Math.random() * 2000,
  animY: Math.random() * -1000,
  scale: Math.random() * 2,
  duration: Math.random() * 10 + 10,
  delay: Math.random() * 10,
}))

// Subtle particle effect — reduced count for mobile performance
const Particles = ({ theme }: { theme: string | undefined }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
    {PARTICLE_DATA.map((p, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: p.initY, x: p.initX }}
        animate={{
          y: [null, p.animY],
          opacity: [0, theme === 'dark' ? 0.4 : 0.2, 0],
          scale: [0, p.scale, 0]
        }}
        transition={{
          duration: p.duration,
          repeat: Infinity,
          ease: "linear",
          delay: p.delay
        }}
        className={`absolute w-1 h-1 rounded-full blur-[1px] ${theme === 'dark' ? 'bg-white' : 'bg-[var(--accent-primary)]'}`}
      />
    ))}
  </div>
)

export default function Hero() {
  const [index, setIndex] = useState(0)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check for mobile screen size
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 8000)
    return () => {
      clearInterval(timer)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === 'dark'

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative px-4 overflow-hidden pt-20 bg-[var(--background)]">
      {/* Background Image Slider (Seamless Crossfade) */}
      <div className="absolute inset-0 z-0 bg-[var(--background)]">
        {images.map((src, i) => (
          <motion.div
            key={src}
            initial={false}
            animate={{
              opacity: index === i ? 1 : 0,
              zIndex: index === i ? 1 : 0
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(${isDark ? '0,0,0,0.7' : '255,255,255,0.55'}), rgba(${isDark ? '0,0,0,0.7' : '255,255,255,0.55'})), url(${src})`,
            }}
          />
        ))}
      </div>

      {/* Disable particles on mobile for performance */}
      {!isMobile && <Particles theme={resolvedTheme} />}

      {/* Immersive Overlays */}
      <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)] pointer-events-none z-[1] ${isDark ? 'from-black/60' : 'from-white/60'}`} />

      <div className="max-w-6xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Reduced glow effect on mobile to save performance */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] blur-[60px] md:blur-[120px] rounded-full pointer-events-none z-0 ${isDark ? 'bg-black/20' : 'bg-[var(--accent-primary)]/5'}`} />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className={`font-bold tracking-[0.5em] uppercase text-[10px] md:text-[12px] mb-8 block ${isDark ? 'text-[var(--accent-primary)]' : '!text-[#1A0811]'}`}>
                StayNJoy • The Soul of Upper Assam
              </span>
            </motion.div>

            <h1 className={`text-7xl md:text-[10rem] font-heading font-extralight mb-8 leading-none tracking-tighter relative transition-colors duration-700 text-[var(--foreground)]`}>
              <span className="relative z-10">Stay</span>
              <span className="relative z-10 text-[var(--accent-primary)] font-black mx-6 italic scale-110 inline-block">N</span>
              <span className="relative z-10">Joy</span>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-16"
            >
              <h2 className={`text-4xl md:text-7xl font-cinzel italic mb-8 leading-tight transition-colors duration-700 text-[var(--foreground)] dark:drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]`}>
                Where <span className="text-[var(--accent-primary)]">Heritage</span> Meets the Horizon
              </h2>
              <div className="flex flex-col items-center gap-4">
                <p className={`text-base md:text-xl max-w-2xl mx-auto font-light leading-relaxed tracking-wide transition-colors duration-700 text-[var(--foreground)] dark:drop-shadow-md`}>
                  Immerse yourself in curated elegance amidst the emerald tea estates of Tinsukia.
                </p>
                <span className="text-[10px] font-bold tracking-[0.4em] text-[var(--gold-primary)] uppercase drop-shadow-sm border-y border-[var(--gold-primary)]/20 py-2">A Legacy of Palatial Warmth</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center"
            >
              <Link href="/rooms" className="btn-primary min-w-[240px] !py-5 !bg-[var(--accent-primary)] shadow-[0_20px_50px_rgba(209,77,126,0.3)] hover:scale-105 active:scale-95 text-[11px] md:text-[12px] font-bold tracking-[0.2em] uppercase border-none">
                Reserve Your Stay
              </Link>
              <a
                href="https://airbnb.co.in/h/staynjoytinsukia"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline min-w-[240px] !py-5 md:backdrop-blur-xl text-[11px] md:text-[12px] font-bold tracking-[0.2em] uppercase transition-all !text-[#FF5A5F] !border-[#FF5A5F]/40 hover:!bg-[#FF5A5F]/10 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <svg viewBox="0 0 32 32" className="w-4 h-4 fill-current">
                  <path d="M16 1c-2.007 0-3.666 1.488-3.957 3.42C9.489 8.283 5 15.65 5 21.053c0 5.485 4.433 9.947 9.9 9.947 2.007 0 3.666-1.488 3.957-3.42 2.554-3.863 7.043-11.23 7.043-16.633C25.9 5.462 21.467 1 16 1zm0 2.21c4.27 0 7.733 3.479 7.733 7.766 0 4.148-3.714 10.457-6.076 14.07a3.972 3.972 0 0 1-3.314 1.764c-2.207 0-4-1.797-4-4.004 0-4.148 3.714-10.457 6.076-14.07A3.972 3.972 0 0 1 16 3.21zm0 6.643a1.996 1.996 0 0 0-2 2c0 1.102.898 2 2 2s2-.898 2-2c0-1.102-.898-2-2-2z" />
                </svg>
                Book via Airbnb
              </a>
              <Link href="/about" className={`btn-outline min-w-[240px] !py-5 md:backdrop-blur-xl text-[11px] md:text-[12px] font-bold tracking-[0.2em] uppercase transition-all ${isDark ? '!text-white !border-[var(--gold-primary)]/40 hover:!bg-[var(--gold-primary)]/10' : '!text-[var(--foreground)] !border-[var(--gold-primary)]/40 hover:!bg-[var(--gold-primary)]/5'}`}>
                Explore More
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Simple Assamese Greeting */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
          className="mt-24 flex items-center justify-center gap-6"
        >
          <div className="w-12 h-[1px] bg-[var(--gold-primary)] opacity-30" />
          <span className="text-[12px] font-bold tracking-[0.5em] uppercase text-[var(--gold-primary)]">
            আপোনালৈ স্বাগতম • Welcome
          </span>
          <div className="w-12 h-[1px] bg-[var(--gold-primary)] opacity-30" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 2 }}
          className="mt-8 flex justify-center"
        >
          <Link
            href="/staff-login"
            className={`flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors ${isDark ? 'text-white/40 hover:text-white' : 'text-black/40 hover:text-black'}`}
          >
            <ShieldCheck size={14} />
            Admin / Staff Sign In
          </Link>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-[0.5em] uppercase z-10 ${isDark ? 'text-white/30' : '!text-[#1A0811]'}`}
      >
        Scroll
      </motion.div>
    </section>
  )
}
