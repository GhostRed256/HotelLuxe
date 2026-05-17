import * as admin from 'firebase-admin'

const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function updateRooms() {
  const roomsRef = db.collection('rooms');
  const snapshot = await roomsRef.get();
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (data.description && typeof data.description === 'string' && data.description.includes('1RK')) {
      let newDescription = data.description.replace(/1RK/g, '1BHK');
      console.log(`Updating room ${doc.id} description:`, newDescription);
      await doc.ref.update({ description: newDescription });
    }
  }
  
  console.log('Room description update complete.');
}

updateRooms().catch(console.error);
