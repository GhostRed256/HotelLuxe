import { db } from './src/lib/firebase-admin';

async function run() {
  const snapshot = await db.collection('rooms').get();

  for (const doc of snapshot.docs) {
    const data = doc.data();

    // Update 1BHK HOUSE IT-1
    if (data.name === "1BHK HOUSE IT-1" || data.name === "IT-1") {
      await db.collection('rooms').doc(doc.id).update({
        name: "1BHK HOUSE: IT-1",
        price: 2200
      });
    }

    // Update CH-1R to First Floor
    if (data.name === "CH-1R" || data.name === "CH-1R (₹1799)") {
      await db.collection('rooms').doc(doc.id).update({
        name: "First Floor: CH-1R",
        price: 1799
      });
    }
    // Update CH-2L to Second Floor
    if (data.name === "CH-2L" || data.name === "CH-2L (₹1799)") {
      await db.collection('rooms').doc(doc.id).update({
        name: "Second Floor: CH-2L",
        price: 1799
      });
    }
    // Update CH-1L to First Floor
    if (data.name === "CH-1L" || data.name === "CH-1L (₹1799)") {
      await db.collection('rooms').doc(doc.id).update({
        name: "First Floor: CH-1L",
        price: 1799
      });
    }
    // Update CH-2R to 1BHK HOUSE
    if (data.name === "CH-2R" || data.name === "CH-2R (₹2200)") {
      await db.collection('rooms').doc(doc.id).update({
        name: "1BHK HOUSE: CH-2R",
        price: 2200
      });
    }
    // Update IT-2 to 2BHK HOUSE with new price 2700
    if (data.name === "IT-2" || data.name === "IT-2 (₹2200)") {
      await db.collection('rooms').doc(doc.id).update({
        name: "2BHK HOUSE: IT-2",
        price: 2700,
        type: "Premium Suite"
      });
    }
    // Update IT-3 to 3BHK HOUSE with new price 3600
    if (data.name === "IT-3" || data.name === "IT-3 (₹2200)") {
      await db.collection('rooms').doc(doc.id).update({
        name: "3BHK HOUSE: IT-3",
        price: 3600,
        type: "Premium Suite"
      });
    }

    // Convert any 4BHK House category to Premium Suite
    if (data.name === "4BHK House" || data.type === "4BHK House") {
      console.log(`Updating 4BHK House category -> Premium Suite`);
      await db.collection('rooms').doc(doc.id).update({
        type: "Premium Suite"
      });
    }
  }

  console.log("Database update completed.");
}

run().catch(console.error);
