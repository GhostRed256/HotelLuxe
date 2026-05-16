"use client"

import { useAuth } from "@/lib/auth-context"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Phone, Mail, Lock, User, Globe, ChevronDown } from "lucide-react"

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

    // Phone validation
    if (isRegister && phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number")
      setIsSubmitting(false)
      return
    }

    try {
      // If email is optional and not provided, use phone-based dummy email
      const finalEmail = email || `${phone}@staynjoy.com`
      
      if (isRegister) {
        await register(finalEmail, password, {
          displayName: name,
          phoneNumber: `${countryCode}${phone}`,
          email: email // Original email if provided
        })
      } else {
        // For login, if email is empty, we assume they used phone to register
        // This is a simplification; ideally we'd look up the email by phone
        await signIn(finalEmail, password)
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed")
      setIsSubmitting(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "")
    if (val.length <= 10) setPhone(val)
  }

  if (loading) return <div className="h-screen flex items-center justify-center opacity-20 italic">Loading...</div>

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-md p-10 border-white/5 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-primary)]/5 blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--gold-primary)]/5 blur-3xl -ml-16 -mb-16" />

        <div className="text-center mb-10 relative z-10">
          <h2 className="text-3xl font-heading font-black tracking-tight mb-2">
            {isRegister ? "Create " : "Welcome "} 
            <span className="text-[var(--accent-primary)]">{isRegister ? "Account" : "Back"}</span>
          </h2>
          <p className="text-sm opacity-40 font-light">
            {isRegister ? "Join the StayNjoy family today." : "Please sign in to continue your journey."}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-medium mb-6"
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
                className="flex flex-col gap-5"
              >
                <div>
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                    <input 
                      type="text" required value={name} onChange={e => setName(e.target.value)}
                      placeholder="John Doe" className="form-input !pl-12" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Phone Number</label>
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
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">
              Email Address {isRegister && <span className="opacity-40 italic">(Optional)</span>}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
              <input 
                type="email" 
                required={!isRegister || !!phone} 
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" className="form-input !pl-12" 
              />
            </div>
            {!isRegister && !email && phone && (
              <p className="text-[9px] opacity-30 mt-2 italic">Tip: If you registered with phone only, use your phone-email or just provide email.</p>
            )}
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
              <input 
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" className="form-input !pl-12" 
              />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary !py-4 shadow-xl hover:shadow-2xl transition-all">
            {isSubmitting ? "Processing..." : (isRegister ? "Create Account" : "Sign In")}
          </button>
        </form>

        <div className="my-8 flex items-center gap-4 opacity-20">
          <div className="h-[1px] flex-1 bg-white" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">OR</span>
          <div className="h-[1px] flex-1 bg-white" />
        </div>

        <button 
          onClick={signInWithGoogle} 
          className="btn-outline w-full flex items-center justify-center gap-3 !py-4"
        >
          <Globe size={18} className="text-[var(--accent-primary)]" />
          <span>Continue with Google</span>
        </button>

        <div className="mt-10 text-center">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs font-bold tracking-widest uppercase text-[var(--accent-primary)] hover:opacity-70 transition-opacity"
          >
            {isRegister ? "Already have an account? Sign In" : "Don't have an account? Register"}
          </button>
          
          <div className="mt-8 pt-8 border-t border-white/5">
            <a href="/admin/login" className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-30 hover:opacity-100 transition-opacity">
              Hotel Staff Login →
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
