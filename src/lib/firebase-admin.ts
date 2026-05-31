import * as admin from 'firebase-admin'
import path from 'path'
import fs from 'fs'

if (!admin.apps.length) {
  try {
    let credential;

    // 1. Try to load from environment variables (for Production / Vercel)
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      credential = admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      })
    }
    // 2. Try to load from a local serviceAccountKey.json file (for local testing)
    else {
      const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');
      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        credential = admin.credential.cert(serviceAccount);
      }
    }

    if (credential) {
      admin.initializeApp({ credential });
    } else {
      console.warn("⚠️ Firebase Admin credentials not found. Database operations will be unavailable in this environment.");
    }
  } catch (error: any) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Firebase admin initialization error:', error.message);
      // We don't throw here to avoid killing the build process
    } else {
      console.error('Firebase admin initialization error:', error.message);
    }
  }
}

export const db = admin.firestore()
export const adminAuth = admin.auth()
