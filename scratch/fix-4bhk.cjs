const admin = require("firebase-admin");
const path = require("path");
const serviceAccount = require(path.join(__dirname, "../serviceAccountKey.json"));

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function fix4BHK() {
    const HOUSE_4BHK_ID = '6rluzPaGTH1YT0kYfj0T';
    await db.collection("rooms").doc(HOUSE_4BHK_ID).update({
        price: 5400
    });

    // Also search for any other 4BHK rooms
    const snapshot = await db.collection("rooms").where("name", "==", "4BHK HOUSE").get();
    for (const doc of snapshot.docs) {
        await doc.ref.update({ price: 5400 });
    }

    console.log("Fixed 4BHK prices to 5400");
}

fix4BHK().catch(console.error);
