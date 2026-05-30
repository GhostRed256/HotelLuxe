/* eslint-disable */
const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function getRooms() {
  const roomsSnapshot = await db.collection("rooms").get();
  console.log("Current rooms count:", roomsSnapshot.size);
  roomsSnapshot.forEach(doc => {
    console.log(doc.id, "=>", doc.data());
  });
}

getRooms().catch(console.error);
