"use client"

import { useAuth } from "@/lib/auth-context"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function Login() {
  const { user, isAdmin, signInWithGoogle, loading } = useAuth()
  
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      if (isAdmin) {
        window.location.href = "/admin"
      } else {
        window.location.href = "/"
      }
    }
  }, [user, isAdmin, loading])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    let loginIdentifier = identifier.trim()
    
    // Auto-prefix +91 if it's a 10-digit number
    if (/^\d{10}$/.test(loginIdentifier)) {
      loginIdentifier = `+91${loginIdentifier}`
    }

    try {
      // For phone-based login, we assume the account follows the phone-email pattern
      const finalEmail = loginIdentifier.includes("@") ? loginIdentifier : `${loginIdentifier}@hotel.com`

      const cred = await signInWithEmailAndPassword(auth, finalEmail, password)
      
      const adminEmailStr = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@hotel.com").trim().toLowerCase()
      // Check if user matches admin email or is explicitly marked as admin in Firestore if needed
      // For now, checking email match as per original logic
      const isUserAdmin = cred.user.email?.trim().toLowerCase() === adminEmailStr || 
                          cred.user.email?.trim().toLowerCase().includes("admin")
      
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: cred.user.email, 
          uid: cred.user.uid,
          isAdmin: isUserAdmin
        })
      })

      if (isUserAdmin) {
        window.location.href = "/admin"
      } else {
        setError("Authorized admin account required.")
        setIsSubmitting(false)
      }
    } catch (err: any) {
      setError("Invalid credentials. Please use your registered admin email or phone.")
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center opacity-20 italic">Verifying Staff Session...</div>
  }

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel"
        style={{ width: "100%", maxWidth: "420px", padding: "3rem", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
            Staff <span style={{ color: "var(--accent-primary)" }}>Portal</span>
          </h2>
          <p style={{ fontSize: "0.8rem", opacity: 0.4, fontWeight: 300 }}>Secure entry for hotel management only.</p>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: "12px", backgroundColor: "rgba(225, 29, 72, 0.1)", color: "#e11d48", borderRadius: "12px", marginBottom: "1.5rem", fontSize: "0.75rem", textAlign: "center", border: "1px solid rgba(225, 29, 72, 0.2)" }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5 }}>
              Email or Phone <span style={{ textTransform: "none", opacity: 0.6, fontWeight: 400 }}>(e.g. 9876543210)</span>
            </label>
            <input 
              type="text" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Admin ID or Number"
              style={{
                width: "100%", padding: "14px", borderRadius: "12px", 
                border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "inherit",
                fontSize: "0.95rem"
              }}
              required
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5 }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%", padding: "14px", borderRadius: "12px", 
                border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "inherit",
                fontSize: "0.95rem"
              }}
              required
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ marginTop: "1rem", padding: "14px", borderRadius: "12px" }}>
            {isSubmitting ? "Authenticating..." : "Authorize Access"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", margin: "1.5rem 0", opacity: 0.6 }}>
          <hr style={{ flex: 1, borderColor: "var(--border-color)" }} />
          <span style={{ padding: "0 10px", fontSize: "0.85rem" }}>OR</span>
          <hr style={{ flex: 1, borderColor: "var(--border-color)" }} />
        </div>

        <button 
          onClick={signInWithGoogle} 
          className="btn-outline" 
          style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}
        >
          Sign In with Google
        </button>
      </motion.div>
    </div>
  )
}
