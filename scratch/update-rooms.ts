import { db } from './src/lib/firebase-admin';

async function run() {
  const snapshot = await db.collection('rooms').get();
  
  const updates = [
    { oldName: "IT-1", newName: "1BHK HOUSE IT-1", type: "Premium Suite", price: 2200 },
    { oldName: "CH-1R", newName: "First Floor: CH-1R", type: "Deluxe Room", price: 1799 },
    { oldName: "CH-2L", newName: "Second Floor: CH-2L", type: "Deluxe Room", price: 1799 },
    { oldName: "CH-1L", newName: "First Floor: CH-1L", type: "Deluxe Room", price: 1799 },
    { oldName: "CH-2R", newName: "1BHK HOUSE: CH-2R", type: "Premium Suite", price: 2200 },
    { oldName: "IT-2", newName: "2BHK HOUSE: Top Floor", type: "Premium Suite", price: 2700 },
    { oldName: "IT-3", newName: "3BHK HOUSE: Top Floor", type: "Premium Suite", price: 3600 },
    { oldName: "4BHK House", newName: "4BHK House", type: "4BHK House", price: 5400 } // just to ensure price is correct
  ];

  const map = new Map();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    for (const u of updates) {
      if (data.name === u.oldName) {
        console.log(`Updating ${u.oldName} -> ${u.newName}`);
        await db.collection('rooms').doc(doc.id).update({
          name: u.newName,
          type: u.type,
          price: u.price
        });
        map.set(u.oldName, doc.id);
      }
    }
  }

  console.log("IDs mapped:", Object.fromEntries(map));
}

run().catch(console.error);
