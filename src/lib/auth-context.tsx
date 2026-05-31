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

  const [serverAdmin, setServerAdmin] = useState(false)
  const isAdmin = serverAdmin

  useEffect(() => {
    // Build Safety: Skip subscription if Firebase is unavailable during static analysis
    if (!auth || typeof auth.onAuthStateChanged !== "function") {
      setLoading(false)
      return
    }

    const db = getFirestore(app)
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
          const idToken = await user.getIdToken()
          const res = await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken })
          })

          if (res.ok) {
            const data = await res.json()
            if (data.isAdmin !== undefined) {
              setServerAdmin(data.isAdmin)
            }
          }
        } else {
          setUserData(null)
          setServerAdmin(false)
          // DO NOT auto-delete the admin_session cookie here.
          // The admin cookie is managed server-side and should only
          // be cleared on explicit logout via logoutAdmin() action.
          // Auto-deleting here wipes the session every time Firebase
          // client auth re-initializes (e.g. on page refresh), causing
          // "Unauthorized: No session found" on all server actions.
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
      const db = getFirestore(app)
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
