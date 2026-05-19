import * as admin from 'firebase-admin'

const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

function replace1RK(text: any): any {
  if (typeof text !== 'string') return text;
  return text
    .replace(/1RK/g, '1BHK')
    .replace(/1rk/g, '1bhk')
    .replace(/1Rk/g, '1BHK')
    .replace(/1rK/g, '1bhk');
}

async function purge1RK() {
  console.log('Purging 1RK references from Firestore collections...');

  // 1. Scan Rooms Collection
  const roomsRef = db.collection('rooms');
  const roomsSnapshot = await roomsRef.get();
  let roomsUpdated = 0;

  for (const doc of roomsSnapshot.docs) {
    const data = doc.data();
    let updated = false;
    const updates: any = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        const newValue = replace1RK(value);
        if (newValue !== value) {
          updates[key] = newValue;
          updated = true;
        }
      }
    }

    if (updated) {
      console.log(`Updating Room ${doc.id}:`, updates);
      await doc.ref.update(updates);
      roomsUpdated++;
    }
  }

  // 2. Scan Bookings Collection
  const bookingsRef = db.collection('bookings');
  const bookingsSnapshot = await bookingsRef.get();
  let bookingsUpdated = 0;

  for (const doc of bookingsSnapshot.docs) {
    const data = doc.data();
    let updated = false;
    const updates: any = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        const newValue = replace1RK(value);
        if (newValue !== value) {
          updates[key] = newValue;
          updated = true;
        }
      }
    }

    if (updated) {
      console.log(`Updating Booking ${doc.id}:`, updates);
      await doc.ref.update(updates);
      bookingsUpdated++;
    }
  }

  console.log(`Purge Complete! Rooms updated: ${roomsUpdated}, Bookings updated: ${bookingsUpdated}`);
}

purge1RK().catch(console.error);
