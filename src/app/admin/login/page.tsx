"use client"

import { useAuth } from "@/lib/auth-context"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Lock } from "lucide-react"

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
        cleanPhone = `+${cleanPhone}`
      }
      
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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "#0D0D0D" }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel"
        style={{ 
          width: "100%", maxWidth: "440px", padding: "4rem 3rem", 
          border: "1px solid rgba(255,255,255,0.05)",
          background: "linear-gradient(145deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ 
            width: "60px", height: "60px", borderRadius: "50%", background: "rgba(225, 29, 72, 0.1)", 
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" 
          }}>
            <Lock style={{ color: "#e11d48" }} size={24} />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 900, letterSpacing: "0.1em", marginBottom: "0.5rem", textTransform: "uppercase", color: "#F3F4F6" }}>
            Staff <span style={{ color: "#e11d48" }}>Management</span>
          </h2>
          <p style={{ fontSize: "0.75rem", opacity: 0.4, fontWeight: 300, textTransform: "uppercase", letterSpacing: "0.2em" }}>
            Authorized Personnel Only
          </p>
        </div>

        {/* Login Method Toggle */}
        <div style={{ display: "flex", gap: "2px", marginBottom: "2.5rem", background: "rgba(255,255,255,0.02)", padding: "4px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <button 
            onClick={() => setLoginMethod("email")}
            style={{ 
              flex: 1, padding: "12px", borderRadius: "10px", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em",
              background: loginMethod === "email" ? "rgba(255,255,255,0.05)" : "transparent",
              color: loginMethod === "email" ? "white" : "rgba(255,255,255,0.3)",
              border: "none", cursor: "pointer", transition: "all 0.4s ease"
            }}
          >
            Email
          </button>
          <button 
            onClick={() => setLoginMethod("phone")}
            style={{ 
              flex: 1, padding: "12px", borderRadius: "10px", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em",
              background: loginMethod === "phone" ? "rgba(255,255,255,0.05)" : "transparent",
              color: loginMethod === "phone" ? "white" : "rgba(255,255,255,0.3)",
              border: "none", cursor: "pointer", transition: "all 0.4s ease"
            }}
          >
            Phone
          </button>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ padding: "14px", backgroundColor: "rgba(225, 29, 72, 0.05)", color: "#e11d48", borderRadius: "12px", marginBottom: "2rem", fontSize: "0.7rem", textAlign: "center", border: "1px solid rgba(225, 29, 72, 0.15)", fontWeight: 600 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {loginMethod === "email" ? (
            <div>
              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.3 }}>Official Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="id@resort.com"
                style={{
                  width: "100%", padding: "16px", borderRadius: "14px", 
                  border: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)", color: "#FFF",
                  fontSize: "0.9rem", outline: "none"
                }}
                required
              />
            </div>
          ) : (
            <div>
              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.3 }}>Staff Number</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", opacity: 0.2, fontSize: "0.9rem" }}>+91</span>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  style={{
                    width: "100%", padding: "16px 16px 16px 50px", borderRadius: "14px", 
                    border: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)", color: "#FFF",
                    fontSize: "0.9rem", outline: "none"
                  }}
                  required
                />
              </div>
            </div>
          )}
          
          <div>
            <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.3 }}>Passcode</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%", padding: "16px", borderRadius: "14px", 
                border: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)", color: "#FFF",
                fontSize: "0.9rem", outline: "none"
              }}
              required
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ marginTop: "1rem", padding: "16px", borderRadius: "14px", background: "#e11d48", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.75rem" }}>
            {isSubmitting ? "Verifying..." : "Initialize Access"}
          </button>
        </form>

        <div style={{ marginTop: "2.5rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "2rem" }}>
          <p style={{ fontSize: "0.65rem", opacity: 0.3, letterSpacing: "0.05em" }}>
            Problems logging in? Contact System Administrator.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
