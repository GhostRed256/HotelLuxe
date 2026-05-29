import { db } from './src/lib/firebase-admin';

async function run() {
    const snapshot = await db.collection('rooms').get();

    // The user wants to update the "Premium Suite" category to show a cheaper starting price
    // and a more inclusive description.

    // We'll update the '4BHK HOUSE:' room specifically as it's often the representative for the category
    // Or we find the room with the 5400 price and update it.

    for (const doc of snapshot.docs) {
        const data = doc.data();
        if (data.type === "Premium Suite" && (data.name?.includes("4BHK") || Number(data.price) === 5400)) {
            console.log(`Updating Premium Suite representative: ${data.name}`);
            await db.collection('rooms').doc(doc.id).update({
                description: "A premium collection of suites including 1BHK, 2BHK, 3BHK, and the grand 4BHK residence, providing flexible luxury for every guest.",
                price: 2200 // "Starts from" price
            });
        }
    }

    console.log("Premium Suite details updated.");
}

run().catch(console.error);
