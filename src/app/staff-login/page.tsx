"use client"

import { useAuth } from "@/lib/auth-context"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
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

  // Step 2: OTP Verification
  const [otpStep, setOtpStep] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState<any>(null)
  const [otpCode, setOtpCode] = useState("")

  useEffect(() => {
    if (user && !loading) {
      if (isAdmin) {
        window.location.assign("/admin")
      } else {
        // Auto-logout guest session if they try to access staff login
        signOut()
      }
    }
  }, [user, isAdmin, loading, signOut])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      if (loginMethod === "email") {
        const cred = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
        const idToken = await cred.user.getIdToken(true)

        // We verify if they are actually an admin before finalizing
        const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@hotel.com").split(",").map(e => e.trim().toLowerCase())
        const isUserAdmin = adminEmails.includes(cred.user.email?.toLowerCase() || "") || cred.user.email?.toLowerCase().includes("admin@")

        if (!isUserAdmin) {
          throw new Error("AUTHORIZED PERSONNEL ONLY: Your account does not have admin privileges.")
        }

        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken })
        })

        window.location.assign("/admin")
      } else {
        // Phone login - Initial request
        const cleanPhone = phone.trim().replace(/\D/g, "")
        const formattedPhone = cleanPhone.length === 10 ? `+91${cleanPhone}` : `+${cleanPhone}`

        const adminPhones = (process.env.NEXT_PUBLIC_ADMIN_PHONE || "").split(",").map(p => p.trim())
        if (!adminPhones.includes(formattedPhone)) {
          throw new Error("ACCESS DENIED: Phone number not found in Staff Registry.")
        }

        // Initialize reCAPTCHA
        if (!(window as any).recaptchaVerifier) {
          const { RecaptchaVerifier } = await import("firebase/auth")
            ; (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
              size: "invisible"
            })
        }

        const { signInWithPhoneNumber } = await import("firebase/auth")
        const result = await signInWithPhoneNumber(auth, formattedPhone, (window as any).recaptchaVerifier)
        setConfirmationResult(result)
        setOtpStep(true)
        setIsSubmitting(false)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || "INVALID CREDENTIALS: Identification failed.")
      setIsSubmitting(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const cred = await confirmationResult.confirm(otpCode)
      const idToken = await cred.user.getIdToken(true)

      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      })

      window.location.assign("/admin")
    } catch (err: any) {
      setError("INVALID OTP: Verification failed.")
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
            <ShieldCheck className="text-rose-500 animate-pulse" size={48} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 animate-pulse">Redirecting...</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black">Opening Management Portal</p>
        </motion.div>
      ) : user && !isAdmin ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel w-full max-w-md p-10 border-2 border-rose-500/20 text-center bg-black/40"
        >
          <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-8">
            <LogOut className="text-rose-500 animate-pulse" size={32} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 animate-pulse">Switching Modes...</h2>
          <p className="text-[11px] text-white/40 leading-relaxed uppercase tracking-widest">
            Clearing guest session for staff entry.
          </p>
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
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${loginMethod === "email" ? "bg-rose-600 text-white shadow-lg" : "opacity-30 hover:opacity-100"
                }`}
            >
              Staff ID
            </button>
            <button
              onClick={() => setLoginMethod("phone")}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${loginMethod === "phone" ? "bg-rose-600 text-white shadow-lg" : "opacity-30 hover:opacity-100"
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

          {/* Invisible reCAPTCHA container */}
          <div id="recaptcha-container" className="absolute invisible"></div>

          {otpStep ? (
            <div className="animate-in fade-in duration-500 w-full">
              <div className="text-center mb-10">
                <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <ShieldCheck className="text-amber-500" size={32} />
                </div>
                <h2 className="text-3xl font-heading font-black tracking-tighter mb-3 text-white">
                  Verify <span className="text-rose-500">OTP Code</span>
                </h2>
                <p className="text-[10px] uppercase tracking-[0.25em] opacity-40 font-black leading-relaxed">
                  Enter the code sent to your registered number
                </p>
              </div>

              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500 rounded-xl text-rose-500 text-[10px] font-black uppercase tracking-widest mb-8 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30 ml-2">Verification Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    pattern="\d{6}"
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="0 0 0 0 0 0"
                    className="w-full bg-black/40 border-2 border-white/5 rounded-xl p-4 text-center text-2xl tracking-[0.5em] font-black text-white focus:border-rose-600/50 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-[0.3em] py-5 rounded-2xl shadow-2xl shadow-rose-600/20 active:scale-95 transition-all text-[11px] mt-4"
                >
                  {isSubmitting ? "VERIFYING..." : "AUTHORIZE ACCESS"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpStep(false);
                    setOtpCode("");
                    setError("");
                  }}
                  className="text-[10px] text-center uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity font-bold mt-2 text-white"
                >
                  ← Back to Login
                </button>
              </form>
            </div>
          ) : (
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
          )}

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
