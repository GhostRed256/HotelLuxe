import { db } from './src/lib/firebase-admin';

async function updatePremiumSuite() {
    console.log("Starting database update for Premium Suite...");

    const snapshot = await db.collection('rooms').get();
    let updatedCount = 0;

    for (const doc of snapshot.docs) {
        const data = doc.data();
        // Target the rooms that are Premium Suites, specifically the ones that represent the category
        // Based on previous conversations, '4BHK HOUSE:' or rooms type 'Premium Suite'
        if (data.type === "Premium Suite") {
            console.log(`Updating room: ${data.name} (ID: ${doc.id})`);

            const newDescription = "A premium collection of suites including 1BHK, 2BHK, 3BHK, and the grand 4BHK residence, providing flexible luxury for every guest.";

            // We want to set the price to 2200 for at least the representative ones
            // or all of them if they are all part of the "starts from" logic.
            // However, individual rooms have different prices (1BHK: 2200, 2BHK: 2700, 3BHK: 3600, 4BHK: 5400).
            // The category price logic in page.tsx picks cat.price from the categories.
            // So I'll update the specific room that is being used as the "4BHK House" representative
            // to have price 2200 and the new description.

            if (data.name === "4BHK HOUSE:" || data.name === "4BHK House") {
                await db.collection('rooms').doc(doc.id).update({
                    description: newDescription,
                    price: 2200 // Changed from 5400 to 2200
                });
                updatedCount++;
            } else {
                // Just update the description for other Premium Suite rooms if they don't have one
                await db.collection('rooms').doc(doc.id).update({
                    description: newDescription
                });
                updatedCount++;
            }
        }
    }

    console.log(`Update complete. ${updatedCount} rooms updated.`);
}

updatePremiumSuite().catch(console.error);
