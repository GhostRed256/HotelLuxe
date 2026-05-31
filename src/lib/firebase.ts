import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || (typeof window === "undefined" ? "BUILD_TIME_DUMMY_KEY" : undefined),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let app: any;
let auth: any;

// Safe initialization that avoids crashing during Next.js build/static analysis
try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "BUILD_TIME_DUMMY_KEY") {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
  } else {
    // During build time or if keys are missing, we export "mock" versions 
    // that won't crash on module load but also won't do anything.
    app = { name: "[DEFAULT]", options: firebaseConfig };
    auth = { onAuthStateChanged: () => () => { } };
  }
} catch (e) {
  console.error("Firebase initialization safety fallback triggered:", e);
  app = { name: "[DEFAULT]", options: firebaseConfig };
  auth = { onAuthStateChanged: () => () => { } };
}

export { app, auth };
