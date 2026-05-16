"use client"

import { useAuth } from "@/lib/auth-context"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Phone, Mail, Lock, User, Globe, ChevronDown, LogIn, UserPlus } from "lucide-react"
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

    if (loginMethod === "phone" && phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number")
      setIsSubmitting(false)
      return
    }

    try {
      const finalEmail = loginMethod === "email" ? email : `${countryCode}${phone}@staynjoy.com`
      
      if (isRegister) {
        await register(finalEmail, password, {
          displayName: name,
          phoneNumber: `${countryCode}${phone}`,
          email: email
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
      } else {
        setError("Authentication failed. Please check your credentials.")
      }
      setIsSubmitting(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "")
    if (val.length <= 10) setPhone(val)
  }

  if (loading) return <div className="h-screen flex items-center justify-center opacity-20 italic">Loading Guest Experience...</div>

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)]">
      {/* Top Identity Banner */}
      <div className="fixed top-0 w-full bg-[#E5B8AD] text-[#1A0811] py-2 text-center text-[10px] font-black tracking-[0.3em] uppercase z-[60] shadow-md border-b border-black/5">
        Customer Reservation Portal — Guest Access Only
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-md p-10 border-white/5 relative overflow-hidden"
        style={{ background: "rgba(229, 184, 173, 0.05)" }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-primary)]/5 blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--gold-primary)]/5 blur-3xl -ml-16 -mb-16" />

        <div className="text-center mb-10 relative z-10">
          <div className="w-16 h-16 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center mx-auto mb-6">
            {isRegister ? <UserPlus className="text-[var(--accent-primary)]" size={28} /> : <LogIn className="text-[var(--accent-primary)]" size={28} />}
          </div>
          <h2 className="text-3xl font-heading font-black tracking-tight mb-2">
            {isRegister ? "Join " : "Guest "} 
            <span className="text-[var(--accent-primary)]">{isRegister ? "StayNjoy" : "Access"}</span>
          </h2>
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">
            {isRegister ? "Create your customer profile" : "Sign in to manage your reservations"}
          </p>
        </div>

        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 mb-8">
          <button
            onClick={() => setLoginMethod("email")}
            className={`flex-1 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase rounded-xl transition-all ${
              loginMethod === "email" ? "bg-[var(--accent-primary)] text-white shadow-lg" : "opacity-40 hover:opacity-100"
            }`}
          >
            Email Login
          </button>
          <button
            onClick={() => setLoginMethod("phone")}
            className={`flex-1 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase rounded-xl transition-all ${
              loginMethod === "phone" ? "bg-[var(--accent-primary)] text-white shadow-lg" : "opacity-40 hover:opacity-100"
            }`}
          >
            Phone Login
          </button>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-[10px] font-bold uppercase tracking-widest text-center mb-6"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleAuth} className="flex flex-col gap-5 relative z-10">
          <AnimatePresence mode="wait">
            {isRegister && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-5 overflow-hidden"
              >
                <div>
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block ml-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                    <input 
                      type="text" required value={name} onChange={e => setName(e.target.value)}
                      placeholder="John Doe" className="form-input !pl-12" 
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loginMethod === "email" ? (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block ml-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                <input 
                  type="email" 
                  required 
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" className="form-input !pl-12" 
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block ml-2">
                Phone Number
              </label>
              <div className="flex gap-2">
                <div className="relative w-28">
                  <select 
                    value={countryCode} 
                    onChange={e => setCountryCode(e.target.value)}
                    className="form-input !pr-8 appearance-none cursor-pointer"
                  >
                    {countryCodes.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" size={14} />
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                  <input 
                    type="tel" required value={phone} onChange={handlePhoneChange}
                    placeholder="10-digit number" className="form-input !pl-12" 
                  />
                </div>
              </div>
            </div>
          )}

          {isRegister && loginMethod === "phone" && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block ml-2">
                Email Address <span className="opacity-40 italic">(Optional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                <input 
                  type="email" 
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" className="form-input !pl-12" 
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block ml-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
              <input 
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" className="form-input !pl-12" 
              />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary !py-5 shadow-xl hover:shadow-2xl transition-all font-black tracking-[0.2em] uppercase text-[11px] mt-2">
            {isSubmitting ? "PROCESSING..." : (isRegister ? "CREATE ACCOUNT" : "SIGN IN")}
          </button>
        </form>

        <div className="my-10 flex items-center gap-4 opacity-10">
          <div className="h-[1px] flex-1 bg-white" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">OR</span>
          <div className="h-[1px] flex-1 bg-white" />
        </div>

        <button 
          onClick={signInWithGoogle} 
          className="btn-outline w-full flex items-center justify-center gap-3 !py-4 text-[10px] font-bold tracking-widest uppercase"
        >
          <Globe size={18} className="text-[var(--accent-primary)]" />
          <span>Continue with Google</span>
        </button>

        <div className="mt-12 text-center">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-[10px] font-black tracking-[0.2em] uppercase text-[var(--accent-primary)] hover:opacity-70 transition-opacity"
          >
            {isRegister ? "Already have an account? Sign In" : "Need an account? Register Now"}
          </button>
          
          <div className="mt-10 pt-10 border-t border-white/5">
            <p className="text-[8px] opacity-20 uppercase tracking-[0.2em] mb-4 font-black">Authorized Staff Entry Only</p>
            <Link href="/admin/login" className="inline-block px-8 py-3 rounded-full border border-rose-500/30 text-[10px] font-black tracking-[0.2em] uppercase text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/5">
              Staff Portal Access →
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
