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
  signInWithGoogle: async () => {},
  signIn: async () => {},
  register: async () => {},
  signOut: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  // Determine admin status based on env var or fallback for demo
  const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@hotel.com").trim().toLowerCase()
  const adminPhone = (process.env.NEXT_PUBLIC_ADMIN_PHONE || "+919876543210").trim()
  
  const isAdmin = user ? (
    (user.email?.trim().toLowerCase() === adminEmail || user.email?.trim().toLowerCase().includes("admin")) ||
    (user.phoneNumber?.trim() === adminPhone)
  ) : false

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        // Fetch extended profile
        const docRef = doc(db, "customers", user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData)
        } else if (user.displayName || user.phoneNumber) {
          // If Google sign-in or similar, create a profile if it doesn't exist
          const newData = { 
            displayName: user.displayName || "", 
            phoneNumber: user.phoneNumber || "",
            email: user.email || ""
          }
          await setDoc(docRef, newData)
          setUserData(newData)
        }

        // Update server session cookie
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: user.email, 
            uid: user.uid,
            isAdmin: user.email?.trim().toLowerCase() === adminEmail || 
                     user.email?.trim().toLowerCase().includes("admin")
          })
        })
      } else {
        setUserData(null)
        await fetch("/api/auth/session", { method: "DELETE" })
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [adminEmail])

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
      // Create a clean profile for Firestore
      const cleanData: any = { ...data }
      
      // If the email passed is our internal dummy email, don't store it as the user's email
      if (email.includes("@staynjoy.com") || email.includes("@hotel.com")) {
        // If they didn't provide a real email, ensure the email field is empty or not set
        if (!data.email) {
          delete cleanData.email
        }
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
