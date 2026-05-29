const { db } = require("./src/lib/firebase-admin");

async function listRooms() {
    const snapshot = await db.collection("rooms").get();
    const rooms = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    console.log("--- ROOMS LIST ---");
    rooms.forEach(r => {
        console.log(`${r.name} (${r.type}): ₹${r.price}`);
    });
}

listRooms().catch(console.error);
