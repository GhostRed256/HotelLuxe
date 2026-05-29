const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

async function fixRooms() {
  const snap = await db.collection("rooms").get();
  const rooms = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  console.log("\n=== CURRENT ROOMS ===");
  rooms.forEach(r => {
    console.log(`[${r.id}] name="${r.name}" type="${r.type}" floor="${r.floor}" loc="${r.location}" price=${r.price}`);
  });

  const batch = db.batch();
  let fixes = 0;

  for (const r of rooms) {
    const ref = db.collection("rooms").doc(r.id);

    // Fix: qCKBhzTURLYJX5xxKeYS was "1st Floor Right" Chaliha Nagar → CH-1R
    if (r.id === "qCKBhzTURLYJX5xxKeYS") {
      batch.update(ref, { name: "CH-1R", floor: "1st Floor Right", roomNumber: "1R", updatedAt: new Date() });
      console.log(`✓ Fix: CH-1R correctly assigned to ${r.id}`);
      fixes++;
    }

    // Fix: ueRo7OAAzwl2UOuIYi20 was "Ground Floor" Chaliha Nagar Deluxe → this is CH-2L candidate
    // Since we already have CH-1L (3w4aUEduVe4ADNVG0LNl), and CH-2L was created fresh,
    // This ground floor deluxe in Chaliha is actually a duplicate. Mark as CH-2L since the top floor one got that name.
    // Actually looking at the data: floor="Ground Floor", Chaliha Nagar, Deluxe → likely a room that doesn't fit the given layout
    // The user has: CH-G1 (Pink Cozy GF), so a GF Deluxe might be CH-G2 or just doesn't exist.
    // Let's rename it CH-2L since 60GS2vOYGqK6h0v03NBr had Top Floor and got CH-2L, but that's the real CH-2L.
    // The ueRo7 room (GF deluxe Chaliha) might be an old duplicate entry. Delete it.
    if (r.id === "ueRo7OAAzwl2UOuIYi20") {
      console.log(`ℹ️  Found extra GF Deluxe Chaliha (${r.id}) — checking if this should be deleted or kept...`);
      // Keep it but rename to CH-G2 as a secondary ground floor deluxe
      batch.update(ref, { name: "CH-G2", floor: "Ground Floor", roomNumber: "G2", updatedAt: new Date() });
      console.log(`✓ Renamed to CH-G2 (ground floor deluxe, Chaliha Nagar)`);
      fixes++;
    }

    // Fix: The freshly created "Lake-2" duplicate — if both WaWGDEesSpLAw64cIBEY and the new entry are Lake-2, delete new
    // WaWGDEesSpLAw64cIBEY is the original Right lake room, now correctly Lake-2.
    // Delete any newly created Lake-2 duplicate.
    // We can identify newly created ones by createdAt being very recent (within last 5 mins).
    if (r.name === "Lake-2" && r.id !== "WaWGDEesSpLAw64cIBEY") {
      const createdAt = r.createdAt instanceof admin.firestore.Timestamp 
        ? r.createdAt.toDate() 
        : new Date(r.createdAt);
      const minsAgo = (Date.now() - createdAt.getTime()) / 1000 / 60;
      if (minsAgo < 10) {
        console.log(`🗑️  Deleting duplicate Lake-2 entry ${r.id} (created ${minsAgo.toFixed(1)} mins ago)`);
        batch.delete(ref);
        fixes++;
      }
    }

    // Fix: The freshly created "CH-1R" — check if qCKBhzTURLYJX5xxKeYS is already correct, delete new duplicate
    if (r.name === "CH-1R" && r.id !== "qCKBhzTURLYJX5xxKeYS") {
      const createdAt = r.createdAt instanceof admin.firestore.Timestamp 
        ? r.createdAt.toDate() 
        : new Date(r.createdAt);
      const minsAgo = (Date.now() - createdAt.getTime()) / 1000 / 60;
      if (minsAgo < 10) {
        console.log(`🗑️  Deleting duplicate CH-1R entry ${r.id} (created ${minsAgo.toFixed(1)} mins ago)`);
        batch.delete(ref);
        fixes++;
      }
    }

    // Fix: The freshly created "CH-2L" — the real one is 60GS2vOYGqK6h0v03NBr (Top Floor Chaliha Deluxe)
    if (r.name === "CH-2L" && r.id !== "60GS2vOYGqK6h0v03NBr") {
      const createdAt = r.createdAt instanceof admin.firestore.Timestamp 
        ? r.createdAt.toDate() 
        : new Date(r.createdAt);
      const minsAgo = (Date.now() - createdAt.getTime()) / 1000 / 60;
      if (minsAgo < 10) {
        console.log(`🗑️  Deleting duplicate CH-2L entry ${r.id} (created ${minsAgo.toFixed(1)} mins ago)`);
        batch.delete(ref);
        fixes++;
      }
    }

    // Fix: Remove the duplicate 2BHK House (₹2700, Chaliha Nagar) — keep PJ6hFWwZoIS8bMijVmJJ as is
    // Also update the 2BHK's name to be descriptive
    if (r.id === "PJ6hFWwZoIS8bMijVmJJ") {
      batch.update(ref, { name: "2BHK House (₹2700)", updatedAt: new Date() });
      console.log(`✓ Clarified 2BHK House entry name`);
      fixes++;
    }
  }

  if (fixes > 0) {
    await batch.commit();
    console.log(`\n✅ Applied ${fixes} cleanup fixes!`);
  } else {
    console.log("\nNo fixes needed.");
  }

  const finalSnap = await db.collection("rooms").get();
  console.log(`\n📊 Final room count: ${finalSnap.size}`);
  console.log("\n=== FINAL ROOMS ===");
  finalSnap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (a.location || "").localeCompare(b.location || "") || (a.name || "").localeCompare(b.name || ""))
    .forEach(r => {
      console.log(`  [${r.name}] ${r.type} | ${r.location} | Floor: ${r.floor} | ₹${r.price}`);
    });
}

fixRooms().catch(console.error);
