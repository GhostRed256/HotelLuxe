"use client"

import { useAuth } from "@/lib/auth-context"
import { motion } from "framer-motion"
import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Lock, ShieldCheck, ArrowLeft, LogOut, LayoutDashboard } from "lucide-react"
import Link from "next/link"

export default function Login() {
  const { user, isAdmin, loading, signOut } = useAuth()
  
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // If already logged in as someone else, we MUST sign out first to login as staff
    if (user && !isAdmin) {
      await signOut()
    }

    let loginIdentifier = ""
    
    if (loginMethod === "phone") {
      let cleanPhone = phone.trim().replace(/\D/g, "")
      if (cleanPhone.length === 10) {
        cleanPhone = `+91${cleanPhone}`
      } else if (!cleanPhone.startsWith("+")) {
        cleanPhone = `+${cleanPhone}`
      }
      
      const adminPhones = (process.env.NEXT_PUBLIC_ADMIN_PHONE || "+919876543210")
        .split(",")
        .map(p => p.trim())
      
      const adminEmailStr = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@homestay.com").split(",")[0].trim().toLowerCase()
      
      if (adminPhones.includes(cleanPhone)) {
        // Map phone to the primary admin email for Firebase Auth login
        loginIdentifier = adminEmailStr
      } else {
        setError("ACCESS DENIED: Phone number not found in Staff Registry.")
        setIsSubmitting(false)
        return
      }
    } else {
      loginIdentifier = email.trim().toLowerCase()
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, loginIdentifier, password)
      
      const adminEmailStr = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@homestay.com").trim().toLowerCase()
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
        // NO AUTOMATIC REDIRECT - User stays on page to see success
        setIsSubmitting(false)
      } else {
        setError("AUTHORIZED PERSONNEL ONLY: Your account does not have admin privileges.")
        setIsSubmitting(false)
      }
    } catch (err: any) {
      setError("INVALID CREDENTIALS: Identification failed.")
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-rose-500 font-black tracking-widest animate-pulse">VERIFYING STAFF IDENTITY...</div>
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: "#050505" }}>
      {/* Top Identity Banner */}
      <div className="fixed top-0 w-full bg-rose-600 text-white py-3 text-center text-[10px] font-black tracking-[0.4em] uppercase z-[100] shadow-2xl">
        Official Resort Management Portal — Secure Staff Entry Only
      </div>

      {user && isAdmin ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel w-full max-w-md p-12 border-2 border-rose-500/30 text-center bg-black/40"
        >
          <div className="w-24 h-24 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-8 border border-rose-500/20">
            <ShieldCheck className="text-rose-500" size={48} />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Staff Identity Verified</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black mb-10">Access Granted to Management Panel</p>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => window.location.assign("/admin")}
              className="w-full bg-rose-600 text-white font-black py-5 rounded-2xl tracking-[0.3em] uppercase text-[12px] hover:bg-rose-700 transition-all shadow-2xl shadow-rose-600/30 flex items-center justify-center gap-3"
            >
              <LayoutDashboard size={18} />
              Open Admin Panel
            </button>
            <button 
              onClick={() => signOut()}
              className="w-full py-4 text-[10px] font-black tracking-[0.2em] uppercase text-white/30 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </motion.div>
      ) : user && !isAdmin ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel w-full max-w-md p-10 border-2 border-rose-500/20 text-center bg-black/40"
        >
          <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-8">
            <LogOut className="text-rose-500" size={32} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Switch to Staff Account</h2>
          <p className="text-[11px] text-white/40 leading-relaxed mb-10 uppercase tracking-widest">
            You are currently logged in as a Guest. You must sign out to access the Management Portal.
          </p>
          <button 
            onClick={() => signOut()}
            className="w-full bg-rose-600 text-white font-black py-5 rounded-2xl tracking-[0.2em] uppercase text-[11px] hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20"
          >
            Sign Out of Guest Session
          </button>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel relative"
          style={{ 
            width: "100%", maxWidth: "460px", padding: "4rem 3.5rem", 
            border: "2px solid rgba(225, 29, 72, 0.2)",
            background: "linear-gradient(165deg, #0A0A0A 0%, #111 100%)",
            boxShadow: "0 0 100px rgba(225, 29, 72, 0.1)"
          }}
        >
          {/* Visual Badge */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-rose-600 flex items-center justify-center shadow-2xl border-4 border-[#050505]">
            <ShieldCheck className="text-white" size={40} />
          </div>

          <div className="text-center mb-10 mt-4">
            <h2 className="text-2xl font-black tracking-tighter uppercase mb-2 text-white">
              Staff <span className="text-rose-500">Authorization</span>
            </h2>
            <div className="h-1 w-12 bg-rose-600 mx-auto rounded-full mb-4" />
            <p className="text-[10px] opacity-40 font-bold uppercase tracking-[0.2em]">
              Identity Verification Required
            </p>
          </div>

          {/* Login Method Toggle */}
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 mb-8 shadow-inner">
            <button 
              onClick={() => setLoginMethod("email")}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                loginMethod === "email" ? "bg-rose-600 text-white shadow-lg" : "opacity-30 hover:opacity-100"
              }`}
            >
              Staff ID
            </button>
            <button 
              onClick={() => setLoginMethod("phone")}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                loginMethod === "phone" ? "bg-rose-600 text-white shadow-lg" : "opacity-30 hover:opacity-100"
              }`}
            >
              Phone
            </button>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-rose-600/10 border border-rose-600/30 rounded-xl text-rose-500 text-[10px] font-black uppercase tracking-widest text-center mb-8"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            {loginMethod === "email" ? (
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30 ml-2">Official Email ID</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hotel.com"
                  className="w-full bg-black/40 border-2 border-white/5 rounded-xl p-4 text-white placeholder:opacity-20 outline-none focus:border-rose-600/50 transition-all font-medium"
                  required
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30 ml-2">Registered Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500 font-bold">+91</span>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-black/40 border-2 border-white/5 rounded-xl p-4 pl-14 text-white placeholder:opacity-20 outline-none focus:border-rose-600/50 transition-all font-medium"
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30 ml-2">Secure Passcode</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/40 border-2 border-white/5 rounded-xl p-4 text-white placeholder:opacity-20 outline-none focus:border-rose-600/50 transition-all font-medium"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="mt-4 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-[0.3em] py-5 rounded-2xl shadow-2xl shadow-rose-600/20 active:scale-95 transition-all text-[11px]"
            >
              {isSubmitting ? "VERIFYING..." : "INITIALIZE ENTRY"}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <Link href="/" className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all">
              <ArrowLeft size={14} />
              Return to Resort
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}
