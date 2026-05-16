"use client"

import { useAuth } from "@/lib/auth-context"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Phone, Mail, Lock, User, Globe, ChevronDown, LogIn, UserPlus, ShieldAlert } from "lucide-react"
import Link from "next/link"

const countryCodes = [
  { code: "+91", country: "India" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+971", country: "UAE" },
  { code: "+61", country: "Australia" },
]

export default function LoginPage() {
  const { user, isAdmin, signIn, register, signInWithGoogle, loading } = useAuth()
  const router = useRouter()
  
  const [isRegister, setIsRegister] = useState(false)
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+91")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      if (isAdmin) {
        router.push("/admin")
      } else {
        router.push("/")
      }
    }
  }, [user, isAdmin, loading, router])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // In registration, phone is ALWAYS mandatory
    if (isRegister) {
      if (phone.length !== 10) {
        setError("Please enter a valid 10-digit phone number for registration")
        setIsSubmitting(false)
        return
      }
      if (!name.trim()) {
        setError("Full name is required")
        setIsSubmitting(false)
        return
      }
    } else {
      // In login, check the selected method
      if (loginMethod === "phone" && phone.length !== 10) {
        setError("Please enter your 10-digit phone number")
        setIsSubmitting(false)
        return
      }
    }

    try {
      // Registration logic: Use real email if provided, otherwise dummy
      const registrationEmail = email || `${countryCode}${phone}@staynjoy.com`
      
      // Login logic: Use method
      const loginEmail = loginMethod === "email" ? email : `${countryCode}${phone}@staynjoy.com`
      
      const finalEmail = isRegister ? registrationEmail : loginEmail
      
      if (isRegister) {
        await register(finalEmail, password, {
          displayName: name,
          phoneNumber: `${countryCode}${phone}`,
          email: email // Real email stored only if provided
        })
      } else {
        await signIn(finalEmail, password)
      }
    } catch (err: any) {
      const msg = err.message || ""
      if (msg.includes("auth/user-not-found")) {
        setError("Account not found. Please register first.")
      } else if (msg.includes("auth/wrong-password")) {
        setError("Incorrect password. Please try again.")
      } else if (msg.includes("email-already-in-use")) {
        setError("This account already exists. Please sign in instead.")
      } else {
        setError("Authentication failed. Please check your details.")
      }
      setIsSubmitting(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "")
    if (val.length <= 10) setPhone(val)
  }

  if (loading) return <div className="h-screen flex items-center justify-center bg-white dark:bg-black text-rose-500 font-bold tracking-widest animate-pulse">VERIFYING SESSION...</div>

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)] relative overflow-hidden">
      {/* IDENTITY BANNER */}
      <div className="fixed top-0 left-0 w-full bg-[#E5B8AD] text-[#1A0811] py-3 text-center text-[11px] font-black tracking-[0.4em] uppercase z-[100] shadow-2xl border-b-2 border-black/10">
        GUEST & CUSTOMER RESERVATION PORTAL
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel w-full max-w-md p-10 border-white/10 relative z-10"
        style={{ background: "rgba(229, 184, 173, 0.08)", backdropFilter: "blur(40px)" }}
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-2xl bg-[var(--accent-primary)]/10 flex items-center justify-center mx-auto mb-6 rotate-3 shadow-inner">
            {isRegister ? <UserPlus className="text-[var(--accent-primary)]" size={32} /> : <LogIn className="text-[var(--accent-primary)]" size={32} />}
          </div>
          <h2 className="text-4xl font-heading font-black tracking-tighter mb-3 text-[var(--foreground)]">
            {isRegister ? "Join " : "Guest "} 
            <span className="text-[var(--accent-primary)]">{isRegister ? "StayNjoy" : "Access"}</span>
          </h2>
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-black">
            {isRegister ? "Start your luxury journey" : "Manage your resort reservations"}
          </p>
        </div>

        {/* Login Method Toggle - ONLY SHOW ON LOGIN */}
        {!isRegister && (
          <div className="flex p-1.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-white/5 mb-10 shadow-inner">
            <button
              onClick={() => setLoginMethod("email")}
              className={`flex-1 py-3 text-[10px] font-black tracking-[0.2em] uppercase rounded-xl transition-all duration-300 ${
                loginMethod === "email" ? "bg-[var(--accent-primary)] text-white shadow-xl scale-105" : "opacity-30 hover:opacity-100"
              }`}
            >
              Email Sign In
            </button>
            <button
              onClick={() => setLoginMethod("phone")}
              className={`flex-1 py-3 text-[10px] font-black tracking-[0.2em] uppercase rounded-xl transition-all duration-300 ${
                loginMethod === "phone" ? "bg-[var(--accent-primary)] text-white shadow-xl scale-105" : "opacity-30 hover:opacity-100"
              }`}
            >
              Phone Sign In
            </button>
          </div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-rose-500/10 border-l-4 border-rose-500 rounded-r-xl text-rose-500 text-[10px] font-black uppercase tracking-widest mb-8"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleAuth} className="flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {isRegister ? (
              <motion.div
                key="register-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-6 overflow-hidden"
              >
                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ml-2">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" size={18} />
                    <input 
                      type="text" required value={name} onChange={e => setName(e.target.value)}
                      placeholder="e.g. John Doe" className="form-input !pl-12 !py-4" 
                    />
                  </div>
                </div>

                {/* Mandatory Phone */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ml-2">Phone Number (Mandatory)</label>
                  <div className="flex gap-2">
                    <div className="relative w-28">
                      <select 
                        value={countryCode} 
                        onChange={e => setCountryCode(e.target.value)}
                        className="form-input !pr-8 appearance-none cursor-pointer !py-4 text-center font-bold text-xs"
                      >
                        {countryCodes.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" size={12} />
                    </div>
                    <div className="relative flex-1 group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" size={18} />
                      <input 
                        type="tel" required value={phone} onChange={handlePhoneChange}
                        placeholder="10-digit number" className="form-input !pl-12 !py-4" 
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ml-2">Email Address (Optional)</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" size={18} />
                    <input 
                      type="email" 
                      value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com" className="form-input !pl-12 !py-4" 
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="login-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-6"
              >
                {loginMethod === "email" ? (
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ml-2">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" size={18} />
                      <input 
                        type="email" required value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="your@email.com" className="form-input !pl-12 !py-4" 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ml-2">Phone Number</label>
                    <div className="flex gap-2">
                      <div className="relative w-28">
                        <select 
                          value={countryCode} 
                          onChange={e => setCountryCode(e.target.value)}
                          className="form-input !pr-8 appearance-none cursor-pointer !py-4 text-center font-bold text-xs"
                        >
                          {countryCodes.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" size={12} />
                      </div>
                      <div className="relative flex-1 group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" size={18} />
                        <input 
                          type="tel" required value={phone} onChange={handlePhoneChange}
                          placeholder="10-digit number" className="form-input !pl-12 !py-4" 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Password - Always Shown */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ml-2">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" size={18} />
              <input 
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" className="form-input !pl-12 !py-4" 
              />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary !py-5 shadow-2xl hover:shadow-rose-500/20 active:scale-95 transition-all font-black tracking-[0.3em] uppercase text-[12px] mt-4">
            {isSubmitting ? "PROCESSING..." : (isRegister ? "CREATE GUEST PROFILE" : "SIGN IN TO ACCOUNT")}
          </button>
        </form>

        <div className="my-10 flex items-center gap-4 opacity-10">
          <div className="h-[1px] flex-1 bg-white" />
          <span className="text-[10px] font-black tracking-[0.3em] uppercase">OR</span>
          <div className="h-[1px] flex-1 bg-white" />
        </div>

        <button 
          onClick={signInWithGoogle} 
          className="btn-outline w-full flex items-center justify-center gap-4 !py-5 text-[11px] font-black tracking-widest uppercase hover:bg-white hover:text-black transition-all"
        >
          <Globe size={20} className="text-[var(--accent-primary)]" />
          <span>Continue with Google</span>
        </button>

        <div className="mt-12 text-center">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-[11px] font-black tracking-[0.2em] uppercase text-[var(--accent-primary)] hover:opacity-70 transition-all underline decoration-2 underline-offset-8 decoration-[var(--accent-primary)]/30"
          >
            {isRegister ? "Already have an account? Sign In" : "New guest? Create Account"}
          </button>
          
          {/* STAFF LOGIN SECTION */}
          <div className="mt-14 pt-10 border-t border-white/5 bg-rose-500/5 -mx-10 px-10 rounded-b-3xl">
            <div className="flex items-center justify-center gap-2 mb-4 text-rose-500 animate-pulse">
              <ShieldAlert size={14} />
              <p className="text-[9px] uppercase tracking-[0.2em] font-black">Authorized Staff Personnel Only</p>
            </div>
            <a 
              href="/admin/login" 
              className="inline-block w-full py-4 rounded-xl border-2 border-rose-500/40 text-[11px] font-black tracking-[0.3em] uppercase text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-500/10 cursor-pointer text-center no-underline"
              style={{ position: 'relative', zIndex: 50 }}
            >
              STAFF PORTAL ACCESS →
            </a>
            <p className="mt-4 text-[8px] opacity-20 uppercase tracking-widest font-bold">Registration is not available for staff.</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
