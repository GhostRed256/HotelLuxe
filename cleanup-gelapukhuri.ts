import { db } from "./src/lib/firebase-admin";

async function cleanupGelapukhuri() {
  console.log("Searching for rooms in Gelapukhuri...");
  const snapshot = await db.collection("rooms").where("location", "==", "Gelapukhuri").get();
  
  if (snapshot.empty) {
    console.log("No rooms found in Gelapukhuri.");
    return;
  }

  console.log(`Found ${snapshot.size} rooms. Deleting...`);
  
  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  console.log("Successfully deleted all Gelapukhuri rooms.");
}

cleanupGelapukhuri().catch(console.error);
