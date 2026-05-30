import { db } from './src/lib/firebase-admin';

async function run() {
  const snapshot = await db.collection('rooms').get();

  for (const doc of snapshot.docs) {
    const data = doc.data();

    // Rename 4BHK House → 4BHK HOUSE:
    if (data.name === '4BHK House' || data.name?.startsWith('4BHK House')) {
      console.log(`Renaming: ${data.name} → 4BHK HOUSE:`);
      await db.collection('rooms').doc(doc.id).update({
        name: '4BHK HOUSE:',
        type: 'Premium Suite'
      });
    }
  }

  console.log('Done.');
}

run().catch(console.error);
