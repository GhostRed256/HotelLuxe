"use client"

import { useAuth } from "@/lib/auth-context"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function Login() {
  const { user, isAdmin, signInWithGoogle, loading } = useAuth()
  
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
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

    let loginIdentifier = ""
    
    if (loginMethod === "phone") {
      let cleanPhone = phone.trim().replace(/\D/g, "")
      if (cleanPhone.length === 10) {
        cleanPhone = `+91${cleanPhone}`
      } else if (!cleanPhone.startsWith("+")) {
        // Fallback for other formats
        cleanPhone = `+${cleanPhone}`
      }
      
      // For Admin Phone login, we check if it matches the configured admin phone
      // and then use the admin email to sign in to Firebase Auth.
      // This keeps the Auth account consistent while allowing phone entry.
      const adminPhone = (process.env.NEXT_PUBLIC_ADMIN_PHONE || "+919876543210").trim()
      const adminEmailStr = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@hotel.com").trim().toLowerCase()
      
      if (cleanPhone === adminPhone) {
        loginIdentifier = adminEmailStr
      } else {
        setError("This phone number is not authorized as an admin.")
        setIsSubmitting(false)
        return
      }
    } else {
      loginIdentifier = email.trim().toLowerCase()
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, loginIdentifier, password)
      
      const adminEmailStr = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@hotel.com").trim().toLowerCase()
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
      setError("Invalid credentials. Please check your " + loginMethod + " and password.")
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

        {/* Login Method Toggle */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "2rem", background: "rgba(255,255,255,0.03)", padding: "5px", borderRadius: "12px" }}>
          <button 
            onClick={() => setLoginMethod("email")}
            style={{ 
              flex: 1, padding: "10px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase",
              background: loginMethod === "email" ? "var(--accent-primary)" : "transparent",
              color: loginMethod === "email" ? "white" : "inherit",
              border: "none", cursor: "pointer", transition: "all 0.3s"
            }}
          >
            Email
          </button>
          <button 
            onClick={() => setLoginMethod("phone")}
            style={{ 
              flex: 1, padding: "10px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase",
              background: loginMethod === "phone" ? "var(--accent-primary)" : "transparent",
              color: loginMethod === "phone" ? "white" : "inherit",
              border: "none", cursor: "pointer", transition: "all 0.3s"
            }}
          >
            Phone
          </button>
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
          {loginMethod === "email" ? (
            <div>
              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5 }}>Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hotel.com"
                style={{
                  width: "100%", padding: "14px", borderRadius: "12px", 
                  border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "inherit",
                  fontSize: "0.95rem"
                }}
                required
              />
            </div>
          ) : (
            <div>
              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5 }}>Phone Number</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", opacity: 0.4, fontSize: "0.95rem" }}>+91</span>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  style={{
                    width: "100%", padding: "14px 14px 14px 45px", borderRadius: "12px", 
                    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "inherit",
                    fontSize: "0.95rem"
                  }}
                  required
                />
              </div>
              <p style={{ fontSize: "0.65rem", opacity: 0.3, marginTop: "8px", fontStyle: "italic" }}>Confirm access via your registered staff number.</p>
            </div>
          )}
          
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
