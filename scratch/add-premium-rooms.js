const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

async function addPremiumRooms() {
  const roomsRef = db.collection("rooms");
  const snap = await roomsRef.get();
  const rooms = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  const existingNames = rooms.map(r => r.name);
  console.log("Existing rooms names:", existingNames);

  const batch = db.batch();
  let added = 0;

  const premiumToCreate = [
    {
      name: "IT-2",
      type: "Premium Suite",
      price: 2200,
      floor: "1st Floor",
      roomNumber: "IT2",
      location: "Bordoloi Nagar (Near Income Tax Office)",
      description: "A spacious, upscale sanctuary featuring a lavish private living room, fully equipped gourmet kitchen, and an ultra-modern bathroom. Crafted with contemporary design elements, ideal for families and travelers seeking long-term luxury living.",
      images: []
    },
    {
      name: "IT-3",
      type: "Premium Suite",
      price: 2200,
      floor: "1st Floor",
      roomNumber: "IT3",
      location: "Bordoloi Nagar (Near Income Tax Office)",
      description: "A spacious, upscale sanctuary featuring a lavish private living room, fully equipped gourmet kitchen, and an ultra-modern bathroom. Crafted with contemporary design elements, ideal for families and travelers seeking long-term luxury living.",
      images: []
    }
  ];

  for (const p of premiumToCreate) {
    if (!existingNames.includes(p.name)) {
      const ref = roomsRef.doc();
      batch.set(ref, {
        ...p,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Adding missing premium room: ${p.name}`);
      added++;
    } else {
      console.log(`Premium room already exists: ${p.name}`);
    }
  }

  // Double check that all other premium rooms have type "Premium Suite"
  let updatedCount = 0;
  for (const r of rooms) {
    if (r.type === "Premium 1BHK Suite" || (r.name && (r.name.startsWith("IT-") || r.name === "CH-2R") && r.type !== "Premium Suite")) {
      const ref = roomsRef.doc(r.id);
      batch.update(ref, {
        type: "Premium Suite",
        updatedAt: new Date()
      });
      console.log(`Updating type for ${r.name} to "Premium Suite"`);
      updatedCount++;
    }
  }

  if (added > 0 || updatedCount > 0) {
    await batch.commit();
    console.log(`✅ Successfully added ${added} rooms and updated ${updatedCount} rooms!`);
  } else {
    console.log("No database changes needed.");
  }
}

addPremiumRooms().catch(console.error);
