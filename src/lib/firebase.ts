import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

/**
 * Lazy Initialization Proxy for Firebase Client SDK
 * Prevents build-time crashes when API keys are missing during static analysis.
 */
function createLazyProxy<T extends object>(initializer: () => T, name: string): T {
  let instance: T | null = null;
  return new Proxy({} as T, {
    get(_, prop) {
      if (!firebaseConfig.apiKey) {
        console.warn(`[Firebase Proxy] ${name} accessed but apiKey is missing. Returning null for ${String(prop)}.`);
        return null;
      }
      if (!instance) {
        instance = initializer();
      }
      return (instance as any)[prop];
    }
  });
}

const app = createLazyProxy(() =>
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig),
  "app"
);

const auth = createLazyProxy(() => getAuth(app), "auth");

export { app, auth };
