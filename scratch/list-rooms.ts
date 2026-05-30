// @ts-nocheck
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// @ts-ignore
import { db } from "@/lib/firebase-admin";

async function listRooms() {
    const snapshot = await db.collection("rooms").get();
    console.log("--- ROOMS DATA ---");
    snapshot.docs.forEach(doc => {
        const data = doc.data();
        console.log(`ID: ${doc.id} | Name: ${data.name} | Type: ${data.type} | Price: ${data.price}`);
    });
}

listRooms().catch(console.error);
