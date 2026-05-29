"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { auth, app } from "./firebase"
import {
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth"
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"

const db = getFirestore(app)

interface UserData {
  displayName?: string
  phoneNumber?: string
  email?: string
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  isAdmin: boolean
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signIn: (email: string, pass: string) => Promise<void>
  register: (email: string, pass: string, data: UserData) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  isAdmin: false,
  loading: true,
  signInWithGoogle: async () => { },
  signIn: async () => { },
  register: async () => { },
  signOut: async () => { }
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  // Helper to check if a user is an admin based on environment variables
  const checkIsAdmin = (u: User | null) => {
    if (!u) return false

    // Support multiple admins via comma-separated lists
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@homestay.com")
      .split(",")
      .map(e => e.trim().toLowerCase())

    const adminPhones = (process.env.NEXT_PUBLIC_ADMIN_PHONE || "+919876543210")
      .split(",")
      .map(p => p.trim())

    const userEmail = u.email?.trim().toLowerCase() || ""
    const userPhone = u.phoneNumber?.trim() || ""

    const isEmailAdmin = adminEmails.includes(userEmail)
    const isPhoneAdmin = adminPhones.includes(userPhone)

    return isEmailAdmin || isPhoneAdmin
  }

  const isAdmin = checkIsAdmin(user)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      try {
        if (user) {
          // Fetch extended profile
          try {
            const docRef = doc(db, "customers", user.uid)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
              setUserData(docSnap.data() as UserData)
            } else if (user.displayName || user.phoneNumber) {
              const newData = {
                displayName: user.displayName || "",
                phoneNumber: user.phoneNumber || "",
                email: user.email || ""
              }
              await setDoc(docRef, newData)
              setUserData(newData)
            }
          } catch (profileError) {
            console.error("Error fetching/creating user profile:", profileError)
          }

          // Update server session cookie with verified admin status
          const idToken = await user.getIdToken(true)
          await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken })
          })
        } else {
          setUserData(null)
          await fetch("/api/auth/session", { method: "DELETE" })
        }
      } catch (err) {
        console.error("Auth state change error:", err)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, []) // adminEmail check removed from deps as we use local helper

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (error: any) {
      if (error.code !== "auth/cancelled-popup-request" && error.code !== "auth/popup-closed-by-user") {
        console.error("Google sign in error", error)
      }
    }
  }

  const signIn = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass)
  }

  const register = async (email: string, pass: string, data: UserData) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass)
    if (res.user) {
      const cleanData: any = { ...data }
      if (email.includes("@staynjoy.com") || email.includes("@homestay.com")) {
        if (!data.email) delete cleanData.email
      }

      await setDoc(doc(db, "customers", res.user.uid), {
        ...cleanData,
        uid: res.user.uid,
        createdAt: new Date()
      })
    }
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, userData, isAdmin, loading, signInWithGoogle, signIn, register, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
