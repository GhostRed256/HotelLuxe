import { db } from './src/lib/firebase-admin';

async function run() {
  const snapshot = await db.collection('rooms').get();
  console.log(JSON.stringify(snapshot.docs.map(d => ({id: d.id, ...d.data()})), null, 2));
}

run();
