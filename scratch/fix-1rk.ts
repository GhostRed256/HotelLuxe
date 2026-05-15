import * as admin from 'firebase-admin'

const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function fix1RK() {
  const roomsRef = db.collection('rooms');
  const snapshot = await roomsRef.get();
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    let updated = false;
    let updates: any = {};
    
    if (data.name && data.name.includes('1RK')) {
      updates.name = data.name.replace(/1RK/g, '1BHK');
      updated = true;
    }
    
    if (data.type && data.type.includes('1RK')) {
      updates.type = data.type.replace(/1RK/g, '1BHK');
      updated = true;
    }
    
    if (updated) {
      console.log(`Updating room ${doc.id}:`, updates);
      await doc.ref.update(updates);
    }
  }
  
  console.log('Room update complete.');
}

fix1RK().catch(console.error);
