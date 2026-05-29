const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

async function finalCleanup() {
  const snap = await db.collection("rooms").get();
  const rooms = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  const batch = db.batch();
  let ops = 0;

  for (const r of rooms) {
    const ref = db.collection("rooms").doc(r.id);

    // 1. DELETE: 2BHK House ₹2700 (PJ6hFWwZoIS8bMijVmJJ) — user crossed this out
    if (r.id === "PJ6hFWwZoIS8bMijVmJJ") {
      console.log(`🗑️  Deleting "2BHK House (₹2700)" [${r.id}]`);
      batch.delete(ref);
      ops++;
      continue;
    }

    // 2. DELETE: CH-G2 — user said "Remove this" (one less deluxe)
    if (r.name === "CH-G2") {
      console.log(`🗑️  Deleting "CH-G2" [${r.id}]`);
      batch.delete(ref);
      ops++;
      continue;
    }

    const updates = { updatedAt: new Date() };
    let hasUpdate = false;

    // 3. RENAME TYPE: "Premium 1BHK Suite" → "Premium Suite"
    if (r.type === "Premium 1BHK Suite") {
      updates.type = "Premium Suite";
      console.log(`✏️  [${r.name}] type: "Premium 1BHK Suite" → "Premium Suite"`);
      hasUpdate = true;
    }

    // 4. Fix Lake rooms — set clear floor label
    if (r.name === "Lake-1") {
      updates.floor = "Lake Homestay — Ground Floor";
      hasUpdate = true;
      console.log(`✏️  Lake-1 floor label updated`);
    }
    if (r.name === "Lake-2") {
      updates.floor = "Lake Homestay — Ground Floor";
      hasUpdate = true;
      console.log(`✏️  Lake-2 floor label updated`);
    }

    // 5. Fix 4BHK House — floor = "2nd Floor"
    if (r.name === "4BHK House") {
      updates.floor = "2nd Floor (Full House)";
      hasUpdate = true;
      console.log(`✏️  4BHK House floor label updated`);
    }

    if (hasUpdate) {
      batch.update(ref, updates);
      ops++;
    }
  }

  await batch.commit();
  console.log(`\n✅ Applied ${ops} operations`);

  // Final state
  const finalSnap = await db.collection("rooms").get();
  const finalRooms = finalSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  
  console.log(`\n📊 Total rooms: ${finalRooms.length}`);
  console.log("\n=== FINAL ROOM LISTING (grouped) ===\n");

  const grouped = {};
  finalRooms.forEach(r => {
    const g = r.type || "Other";
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(r);
  });

  Object.entries(grouped).sort().forEach(([type, rms]) => {
    console.log(`▶ ${type}`);
    rms.sort((a,b) => (a.name||"").localeCompare(b.name||"")).forEach(r => {
      console.log(`    • ${r.name} | ${r.floor} | ${r.location} | ₹${r.price}`);
    });
    console.log("");
  });
}

finalCleanup().catch(console.error);
