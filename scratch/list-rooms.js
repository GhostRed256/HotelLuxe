/* eslint-disable */
const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

async function listRooms() {
  const snap = await db.collection("rooms").get();
  const rooms = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  console.log(`Total rooms: ${rooms.length}`);
  const grouped = {};
  rooms.forEach(r => {
    const key = r.type || "Other";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(r);
  });

  for (const [type, list] of Object.entries(grouped)) {
    console.log(`\n--- ${type} ---`);
    list.sort((a, b) => (a.name || "").localeCompare(b.name || "")).forEach(r => {
      console.log(`  ID: ${r.id}`);
      console.log(`  Name: ${r.name}`);
      console.log(`  Floor: ${r.floor}`);
      console.log(`  Location: ${r.location}`);
      console.log(`  Price: ₹${r.price}`);
      console.log(`  Room Number: ${r.roomNumber}`);
      console.log('  -------------------');
    });
  }
}

listRooms().catch(console.error);
