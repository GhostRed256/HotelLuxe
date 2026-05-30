"use client"

import { useAuth } from "@/lib/auth-context"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Phone, Mail, Lock, User, Globe, ChevronDown, LogIn, UserPlus, ShieldAlert, LogOut, CheckCircle2, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { formatGuestIdentifierForDisplay } from "@/lib/utils"
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  linkWithCredential,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth, app } from "@/lib/firebase";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const countryCodes = [
  { code: "+91", country: "India" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+971", country: "UAE" },
  { code: "+61", country: "Australia" },
]

export default function LoginPage() {
  const { user, userData, isAdmin, signIn, signInWithGoogle, signOut, loading } = useAuth()
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

  // OTP Verification States
  const [otpStep, setOtpStep] = useState<"none" | "register_otp" | "login_otp">("none")
  const [otpCode, setOtpCode] = useState("")
  const [otpVerificationId, setOtpVerificationId] = useState<string | null>(null)
  const [confirmationResult, setConfirmationResult] = useState<any | null>(null)

  // Clear reCAPTCHA widget if switching modes
  useEffect(() => {
    return () => {
      if ((window as any).recaptchaWidgetId !== undefined) {
        try {
          (window as any).recaptchaVerifier?.clear();
          delete (window as any).recaptchaVerifier;
        } catch (e) {
          console.error(e);
        }
      }
    };
  }, [isRegister, loginMethod]);

  const initRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA solved");
        }
      });
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    if (isRegister) {
      if (phone.length < 10) {
        setError("Please enter a valid 10-digit phone number")
        setIsSubmitting(false)
        return
      }
      if (!name.trim()) {
        setError("Full name is required")
        setIsSubmitting(false)
        return
      }
      if (!email.trim() || !email.includes("@")) {
        setError("Please enter a valid email address")
        setIsSubmitting(false)
        return
      }
    } else {
      if (loginMethod === "phone" && phone.length < 10) {
        setError("Please enter your 10-digit phone number")
        setIsSubmitting(false)
        return
      }
    }

    try {
      if (isRegister) {
        // Create user with email and password first
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Initialize reCAPTCHA and send verification OTP
        initRecaptcha();
        const appVerifier = (window as any).recaptchaVerifier;
        const provider = new PhoneAuthProvider(auth);

        const verificationId = await provider.verifyPhoneNumber(
          `${countryCode}${phone}`,
          appVerifier
        );

        setOtpVerificationId(verificationId);
        setOtpStep("register_otp");
        setIsSubmitting(false);
      } else {
        if (loginMethod === "email") {
          await signIn(email, password)
        } else {
          // Direct Phone Login via OTP
          initRecaptcha();
          const appVerifier = (window as any).recaptchaVerifier;
          const result = await signInWithPhoneNumber(auth, `${countryCode}${phone}`, appVerifier);
          setConfirmationResult(result);
          setOtpStep("login_otp");
          setIsSubmitting(false);
        }
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.message || ""
      if (msg.includes("auth/user-not-found")) {
        setError("Account not found. Please register first.")
      } else if (msg.includes("auth/wrong-password")) {
        setError("Incorrect password. Please try again.")
      } else if (msg.includes("email-already-in-use")) {
        setError("This email account already exists. Please sign in instead.")
      } else if (msg.includes("invalid-phone-number")) {
        setError("Invalid phone number format. Please check the code and digits.")
      } else {
        setError("Authentication request failed. Please check details and try again.")
      }
      setIsSubmitting(false);
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    if (otpCode.length !== 6) {
      setError("Please enter a 6-digit OTP code")
      setIsSubmitting(false)
      return
    }

    try {
      if (otpStep === "register_otp") {
        if (!otpVerificationId) throw new Error("Verification reference lost. Please refresh and try again.");

        // 1. Link phone number to current email account
        const credential = PhoneAuthProvider.credential(otpVerificationId, otpCode);
        await linkWithCredential(auth.currentUser!, credential);

        // 2. Save profile details in Firestore
        const db = getFirestore(app);
        await setDoc(doc(db, "customers", auth.currentUser!.uid), {
          uid: auth.currentUser!.uid,
          displayName: name,
          phoneNumber: `${countryCode}${phone}`,
          email: email,
          phoneVerified: true,
          createdAt: new Date()
        });

        // 3. Register server session cookie
        const idToken = await auth.currentUser!.getIdToken(true);
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken })
        });

        router.refresh();
        window.location.assign("/");
      } else if (otpStep === "login_otp") {
        if (!confirmationResult) throw new Error("Login session lost. Please request a new code.");

        const userCredential = await confirmationResult.confirm(otpCode);
        const user = userCredential.user;

        // Verify Firestore profile exists, create if missing
        const db = getFirestore(app);
        const docRef = doc(db, "customers", user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          await setDoc(docRef, {
            uid: user.uid,
            displayName: user.displayName || "Guest",
            phoneNumber: user.phoneNumber || `${countryCode}${phone}`,
            email: user.email || "",
            phoneVerified: true,
            createdAt: new Date()
          });
        }

        router.refresh();
        window.location.assign("/");
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/invalid-verification-code") {
        setError("The verification code you entered is invalid. Please try again.");
      } else if (err.code === "auth/credential-already-in-use") {
        setError("This phone number is already linked to another account.");
      } else {
        setError(err.message || "OTP verification failed. Please try again.");
      }
      setIsSubmitting(false);
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "")
    if (val.length <= 10) setPhone(val)
  }

  const navigateToStaff = async () => {
    await signOut()
    window.location.assign("/staff-login")
  }

  if (loading) return <div className="h-screen bg-[#050505] flex items-center justify-center text-rose-500 font-black tracking-widest animate-pulse uppercase">Authenticating...</div>

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)] relative overflow-hidden"
      onClick={() => {
        if (user && !isAdmin && otpStep === "none") {
          window.location.assign("/")
        }
      }}
    >
      {/* Invisible reCAPTCHA container for Firebase Phone Verification */}
      <div id="recaptcha-container" className="absolute invisible"></div>

      {/* IDENTITY BANNER */}
      <div className="fixed top-0 left-0 w-full bg-[#E5B8AD] text-[#1A0811] py-3 text-center text-[11px] font-black tracking-[0.4em] uppercase z-[110] shadow-2xl border-b-2 border-black/10">
        GUEST & CUSTOMER RESERVATION PORTAL
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-panel w-full max-w-md p-10 border-white/10 relative z-10"
        style={{ background: "rgba(229, 184, 173, 0.08)", backdropFilter: "blur(40px)" }}
      >
        {user && !isAdmin && otpStep === "none" ? (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="text-emerald-500" size={32} />
            </div>
            <h2 className="text-3xl font-heading font-black text-white mb-4">Signed In</h2>
            <p className="text-[11px] text-white/40 uppercase tracking-[0.3em] mb-2 font-black">
              Welcome back, {userData?.displayName || "Guest"}
            </p>
            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] mb-10 font-bold">
              {userData?.email || user?.email || userData?.phoneNumber || ""}
            </p>
            <div className="flex flex-col gap-4">
              <Link href="/bookings" className="btn-primary !py-5 shadow-2xl font-black tracking-[0.3em] uppercase text-[11px]">
                View My Reservations
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center justify-center gap-3 py-4 text-[11px] font-black tracking-[0.2em] uppercase text-white/40 hover:text-white transition-all"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>

            <div className="mt-12 pt-10 border-t border-white/5">
              <p className="text-[9px] uppercase tracking-[0.2em] font-black text-rose-500/50 mb-4">Are you a staff member?</p>
              <button
                onClick={navigateToStaff}
                className="w-full py-4 rounded-xl border border-rose-500/30 text-[10px] font-black tracking-[0.2em] uppercase text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
              >
                Go to Staff Portal →
              </button>
            </div>
          </div>
        ) : otpStep !== "none" ? (
          /* OTP VERIFICATION STEP SCREEN */
          <div className="animate-in fade-in duration-500">
            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <ShieldCheck className="text-amber-500" size={32} />
              </div>
              <h2 className="text-3xl font-heading font-black tracking-tighter mb-3 text-white">
                Verify <span className="text-[var(--accent-primary)]">OTP Code</span>
              </h2>
              <p className="text-[10px] uppercase tracking-[0.25em] opacity-40 font-black leading-relaxed">
                Enter the 6-digit code sent to<br />
                <span className="text-white opacity-80 font-mono tracking-widest">{countryCode} {phone}</span>
              </p>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border-l-4 border-rose-500 rounded-r-xl text-rose-500 text-[10px] font-black uppercase tracking-widest mb-8">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ml-2">Verification Code</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  pattern="\d{6}"
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="0 0 0 0 0 0"
                  className="form-input !text-center !text-2xl !tracking-[0.5em] !font-black !py-4"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary !py-5 shadow-2xl font-black tracking-[0.3em] uppercase text-[12px] mt-4"
              >
                {isSubmitting ? "VERIFYING..." : "CONFIRM & VERIFY"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtpStep("none");
                  setOtpCode("");
                  setError("");
                }}
                className="text-[10px] text-center uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity font-bold mt-2"
              >
                ← Back to Login / Register
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-2xl bg-[var(--accent-primary)]/10 flex items-center justify-center mx-auto mb-6 rotate-3 shadow-inner">
                {isRegister ? <UserPlus className="text-[var(--accent-primary)]" size={32} /> : <LogIn className="text-[var(--accent-primary)]" size={32} />}
              </div>
              <h2 className="text-4xl font-heading font-black tracking-tighter mb-3 text-[var(--foreground)]">
                {isRegister ? "Join " : "Guest "}
                <span className="text-[var(--accent-primary)]">{isRegister ? "StayNJoy" : "Access"}</span>
              </h2>
              <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-black">
                {isRegister ? "Start your luxury journey" : "Manage your resort reservations"}
              </p>
            </div>

            {!isRegister && (
              <div className="flex p-1.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-white/5 mb-10 shadow-inner">
                <button
                  onClick={() => setLoginMethod("email")}
                  className={`flex-1 py-3 text-[10px] font-black tracking-[0.2em] uppercase rounded-xl transition-all duration-300 ${loginMethod === "email" ? "bg-[var(--accent-primary)] text-white shadow-xl scale-105" : "opacity-30 hover:opacity-100"
                    }`}
                >
                  Email ID
                </button>
                <button
                  onClick={() => setLoginMethod("phone")}
                  className={`flex-1 py-3 text-[10px] font-black tracking-[0.2em] uppercase rounded-xl transition-all duration-300 ${loginMethod === "phone" ? "bg-[var(--accent-primary)] text-white shadow-xl scale-105" : "opacity-30 hover:opacity-100"
                    }`}
                >
                  Phone OTP
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

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center ml-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Email Address</label>
                        <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-rose-500/80 bg-rose-500/5 px-2.5 py-0.5 rounded-full border border-rose-500/10">Required</span>
                      </div>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" size={18} />
                        <input
                          type="email" required
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

              {!(loginMethod === "phone" && !isRegister) && (
                <div className="flex flex-col gap-2 animate-in fade-in duration-300">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ml-2">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" size={18} />
                    <input
                      type="password" required value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" className="form-input !pl-12 !py-4"
                    />
                  </div>
                </div>
              )}

              <button type="submit" disabled={isSubmitting} className="btn-primary !py-5 shadow-2xl hover:shadow-rose-500/20 active:scale-95 transition-all font-black tracking-[0.3em] uppercase text-[12px] mt-4">
                {isSubmitting ? "PROCESSING..." : (isRegister ? "VERIFY PHONE & REGISTER" : (loginMethod === "phone" ? "SEND OTP CODE" : "SIGN IN TO GUEST ACCOUNT"))}
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

              <div className="mt-14 pt-10 border-t border-white/5 bg-rose-500/5 -mx-10 px-10 rounded-b-3xl">
                <div className="flex items-center justify-center gap-2 mb-4 text-rose-500 animate-pulse">
                  <ShieldAlert size={14} />
                  <p className="text-[9px] uppercase tracking-[0.2em] font-black">Authorized Staff Personnel Only</p>
                </div>
                <button
                  type="button"
                  onClick={navigateToStaff}
                  className="w-full py-4 rounded-xl border-2 border-rose-500/40 text-[11px] font-black tracking-[0.3em] uppercase text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-500/10 cursor-pointer text-center"
                >
                  STAFF PORTAL ACCESS →
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

