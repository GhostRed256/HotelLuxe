const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

async function migrateRooms() {
  const snap = await db.collection("rooms").get();
  const rooms = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Print current state for mapping
  console.log("\n=== CURRENT ROOMS ===");
  rooms.forEach(r => {
    console.log(`[${r.id}] name="${r.name}" type="${r.type}" floor="${r.floor}" loc="${r.location}" price=${r.price}`);
  });

  // ─── RENAME MAP ─────────────────────────────────────────────────────────────
  // Based on:  location + type + floor → new name / roomNumber
  //
  // 📍 Lake Homestay (Bordoloi Nagar Near Lake)
  //   Lake-1  → Deluxe, Left
  //   Lake-2  → Deluxe, Right (if exists)
  //
  // 📍 Chaliha Nagar
  //   CH-G1   → Pink Cozy, Ground Floor
  //   CH-1L   → Deluxe, 1st Floor Left
  //   CH-1R   → Deluxe, 1st Floor Right
  //   CH-2L   → Deluxe, 2nd Floor Left  (currently "Top Floor")
  //   CH-2M   → Pink Cozy, 2nd Floor Middle
  //   CH-2R   → Premium 1BHK, 2nd Floor Right
  //
  // 📍 Income Tax (Bordoloi Nagar Near Income Tax Office)
  //   IT-1    → Premium 1BHK
  //   4BHK    → 2BHK House (₹5400) — update description & name
  // ─────────────────────────────────────────────────────────────────────────────

  const updates = [];

  for (const r of rooms) {
    const loc = (r.location || "").toLowerCase();
    const floor = (r.floor || "").toLowerCase();
    const type = (r.type || "").toLowerCase();

    let newName = null;
    let newFloor = null;
    let newRoomNumber = null;
    let descExtra = null;

    // === LAKE HOMESTAY ===
    if (loc.includes("lake")) {
      if (floor.includes("left") || r.roomNumber === "07") {
        newName = "Lake-1";
        newFloor = "Bordoloi Nagar (Near Lake)";
        newRoomNumber = "L1";
      } else if (floor.includes("right") || r.roomNumber === "08") {
        newName = "Lake-2";
        newFloor = "Bordoloi Nagar (Near Lake)";
        newRoomNumber = "L2";
      } else {
        // Default – first lake room gets Lake-1
        newName = "Lake-1";
        newFloor = "Bordoloi Nagar (Near Lake)";
        newRoomNumber = "L1";
      }
    }

    // === CHALIHA NAGAR ===
    else if (loc.includes("chaliha")) {
      if (type.includes("cozy") || type.includes("pink")) {
        if (floor.includes("ground") || floor === "g" || r.roomNumber === "01") {
          newName = "CH-G1";
          newFloor = "Ground Floor";
          newRoomNumber = "G1";
        } else {
          newName = "CH-2M";
          newFloor = "2nd Floor Middle";
          newRoomNumber = "2M";
        }
      } else if (type.includes("deluxe")) {
        if (floor.includes("1st") || floor.includes("first") || floor.includes("left") && !floor.includes("top")) {
          // 1st floor left room
          newName = "CH-1L";
          newFloor = "1st Floor Left";
          newRoomNumber = "1L";
        } else if (floor.includes("right") && !floor.includes("top")) {
          newName = "CH-1R";
          newFloor = "1st Floor Right";
          newRoomNumber = "1R";
        } else if (floor.includes("top") || floor.includes("2nd") || floor.includes("second")) {
          newName = "CH-2L";
          newFloor = "2nd Floor Left";
          newRoomNumber = "2L";
        } else {
          newName = "CH-1L";
          newFloor = "1st Floor Left";
          newRoomNumber = "1L";
        }
      } else if (type.includes("premium") || type.includes("1bhk")) {
        newName = "CH-2R";
        newFloor = "2nd Floor Right";
        newRoomNumber = "2R";
      } else if (type.includes("2bhk") || type.includes("house")) {
        // Keep 2BHK as is (separate listing)
        if (r.price === 5400 || r.price === "5400") {
          newName = "4BHK House";
          descExtra = "12 rooms";
        }
      }
    }

    // === INCOME TAX HOMESTAY ===
    else if (loc.includes("income") || loc.includes("tax")) {
      if (type.includes("premium") || type.includes("1bhk")) {
        newName = "IT-1";
        newFloor = "1st Floor";
        newRoomNumber = "IT1";
      } else if (type.includes("2bhk") || type.includes("house")) {
        newName = "4BHK House";
        descExtra = "12 rooms";
      }
    }

    if (newName && newName !== r.name) {
      updates.push({ id: r.id, oldName: r.name, newName, newFloor, newRoomNumber, descExtra });
    }
  }

  console.log("\n=== PLANNED UPDATES ===");
  updates.forEach(u => {
    console.log(`[${u.id}] "${u.oldName}" → "${u.newName}" (floor: ${u.newFloor}, roomNum: ${u.newRoomNumber})`);
  });

  if (updates.length === 0) {
    console.log("No updates needed or mappings couldn't be resolved.");
    return;
  }

  console.log("\n=== APPLYING UPDATES ===");
  const batch = db.batch();
  for (const u of updates) {
    const ref = db.collection("rooms").doc(u.id);
    const updateData = {
      name: u.newName,
      updatedAt: new Date()
    };
    if (u.newFloor) updateData.floor = u.newFloor;
    if (u.newRoomNumber) updateData.roomNumber = u.newRoomNumber;
    if (u.descExtra) {
      // Append to description if not already there
      const r = rooms.find(x => x.id === u.id);
      if (r && r.description && !r.description.includes("12 rooms")) {
        updateData.description = r.description.replace("11 rooms", "12 rooms");
      }
    }
    batch.update(ref, updateData);
    console.log(`✓ Queued: ${u.id} → "${u.newName}"`);
  }

  await batch.commit();
  console.log("\n✅ All updates committed successfully!");

  // ─── ADD MISSING ROOMS ──────────────────────────────────────────────────────
  const existingNames = rooms.map(r => r.name);
  const requiredRooms = [
    {
      name: "Lake-2",
      type: "Deluxe Room",
      price: 1799,
      floor: "Bordoloi Nagar (Near Lake)",
      roomNumber: "L2",
      location: "Bordoloi Nagar (Near Lake)",
      description: "An elegant lake-view deluxe retreat boasting an attached modern bathroom, cinema projector for private movie nights, and premium memory foam mattresses.",
    },
    {
      name: "CH-1R",
      type: "Deluxe Room",
      price: 1799,
      floor: "1st Floor Right",
      roomNumber: "1R",
      location: "Chaliha Nagar",
      description: "An elegant, premium couples' retreat with attached modern bathroom, state-of-the-art cinema projector, high-definition acoustics, and premium memory foam mattresses.",
    },
    {
      name: "CH-2L",
      type: "Deluxe Room",
      price: 1799,
      floor: "2nd Floor Left",
      roomNumber: "2L",
      location: "Chaliha Nagar",
      description: "A spacious second-floor deluxe room with attached bathroom, projector setup, and cozy premium bedding — perfect for couples and solo travellers.",
    },
    {
      name: "CH-2M",
      type: "Cozy Pink Room",
      price: 1399,
      floor: "2nd Floor Middle",
      roomNumber: "2M",
      location: "Chaliha Nagar",
      description: "A charming rose-toned cozy retreat on the second floor with warm ambient lighting, plush bedding, and artisanal local accents — perfect for solo travelers.",
    },
    {
      name: "CH-2R",
      type: "Premium 1BHK Suite",
      price: 2200,
      floor: "2nd Floor Right",
      roomNumber: "2R",
      location: "Chaliha Nagar",
      description: "A spacious premium suite with private living room, fully equipped kitchen, and ultra-modern bathroom — perfect for families seeking luxury.",
    },
    {
      name: "4BHK House",
      type: "4BHK House",
      price: 5400,
      floor: "Full House",
      roomNumber: "4BHK",
      location: "Bordoloi Nagar (Near Income Tax Office)",
      description: "A grand 4BHK residence accommodating up to 12 guests, featuring a spacious living room, dining area, fully equipped kitchen, and 4 private bedrooms. Ideal for large groups, family reunions, and exclusive gatherings.",
    },
  ];

  const toAdd = requiredRooms.filter(r => !existingNames.includes(r.name));
  if (toAdd.length > 0) {
    console.log(`\n=== ADDING ${toAdd.length} MISSING ROOMS ===`);
    for (const room of toAdd) {
      const ref = db.collection("rooms").doc();
      await ref.set({
        ...room,
        images: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✓ Created: "${room.name}" (${room.type}, ${room.location})`);
    }
    console.log(`\n✅ ${toAdd.length} new rooms created!`);
  } else {
    console.log("\n✓ No missing rooms to add.");
  }

  // Final count
  const finalSnap = await db.collection("rooms").get();
  console.log(`\n📊 Total rooms in database: ${finalSnap.size}`);
}

migrateRooms().catch(console.error);
