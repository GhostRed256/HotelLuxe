import * as admin from 'firebase-admin'

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
      const serviceAccountPath = require('path').join(process.cwd(), 'serviceAccountKey.json');
      if (require('fs').existsSync(serviceAccountPath)) {
        const serviceAccount = JSON.parse(require('fs').readFileSync(serviceAccountPath, 'utf8'));
        credential = admin.credential.cert(serviceAccount);
      }
    }

    if (credential) {
      admin.initializeApp({ credential });
    } else {
      throw new Error("No Firebase Admin credentials found!");
    }
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
    throw error;
  }
}

export const db = admin.firestore()
export const adminAuth = admin.auth()
