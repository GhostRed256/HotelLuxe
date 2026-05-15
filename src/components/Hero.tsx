"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function Hero() {
  return (
    <section style={{
      minHeight: "80vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      padding: "2rem",
      overflow: "hidden"
    }}>
      {/* Dynamic Background Element */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        height: "100%",
        background: "radial-gradient(circle at center, rgba(209, 77, 126, 0.12) 0%, transparent 70%)",
        opacity: 0.5,
        zIndex: -1
      }} />

      <div style={{ textAlign: "center", maxWidth: "800px", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span style={{ 
            color: "var(--accent-primary)", 
            fontWeight: 600, 
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontSize: "0.9rem",
            display: "block",
            marginBottom: "1rem"
          }}>
            StayNjoy Homestay – Tinsukia ✨
          </span>
          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: "1.5rem",
            letterSpacing: "-1px"
          }}>
            Your <span style={{ color: "var(--accent-primary)" }}>Home</span> Away From Home
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          style={{
            fontSize: "1.1rem",
            opacity: 0.8,
            marginBottom: "2.5rem",
            lineHeight: 1.6
          }}
        >
          Cozy rooms, deluxe stays, and full houses with free WiFi, projector setups & 24/7 water.
          Located in Chaliha Nagar, Bordoloi Nagar, Tinsukia.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link href="/rooms" className="btn-primary" style={{ padding: "16px 32px", fontSize: "1.1rem" }}>
            Book Your Stay
          </Link>
          <a href="tel:7002475079" className="btn-outline" style={{ padding: "16px 32px", fontSize: "1.1rem" }}>
            📞 Call Now
          </a>
        </motion.div>
      </div>
    </section>
  )
}
