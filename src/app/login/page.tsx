"use client"

import { useAuth } from "@/lib/auth-context"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function Login() {
  const { user, isAdmin, signInWithGoogle, loading } = useAuth()
  
  const [email, setEmail] = useState("")
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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      
      // Explicitly set cookie here to guarantee it finishes before redirect
      const adminEmailStr = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@hotel.com").trim().toLowerCase()
      const isUserAdmin = cred.user.email ? cred.user.email.trim().toLowerCase() === adminEmailStr : false
      
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
        window.location.href = "/"
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials")
      setIsSubmitting(false) // Only stop submitting if it fails
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel"
        style={{ width: "100%", maxWidth: "400px", padding: "2.5rem" }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "1.75rem" }}>
          Admin <span style={{ color: "var(--accent-primary)" }}>Login</span>
        </h2>
        
        {error && (
          <div style={{ padding: "10px", backgroundColor: "rgba(255,0,0,0.1)", color: "red", borderRadius: "5px", marginBottom: "1rem", fontSize: "0.85rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: 500 }}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your email"
              style={{
                width: "100%", padding: "12px", borderRadius: "8px", 
                border: "1px solid var(--border-color)", background: "transparent", color: "inherit"
              }}
              required
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: 500 }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              style={{
                width: "100%", padding: "12px", borderRadius: "8px", 
                border: "1px solid var(--border-color)", background: "transparent", color: "inherit"
              }}
              required
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ marginTop: "1rem" }}>
            {isSubmitting ? "Signing In..." : "Sign In with Email"}
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
