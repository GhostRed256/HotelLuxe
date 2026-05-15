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
    let updated = false;
    let updates: any = {};
    
    if (data.name && typeof data.name === 'string') {
      let newName = data.name.replace(/Left/g, '1').replace(/Right/g, '2');
      if (newName !== data.name) {
        updates.name = newName;
        updated = true;
      }
    }
    
    if (data.type && typeof data.type === 'string') {
      let newType = data.type.replace(/1RK/g, '1BHK');
      if (newType !== data.type) {
        updates.type = newType;
        updated = true;
      }
    }
    
    if (updated) {
      console.log(`Updating room ${doc.id}:`, updates);
      await doc.ref.update(updates);
    }
  }
  
  console.log('Room update complete.');
}

updateRooms().catch(console.error);
