import * as admin from 'firebase-admin'
// eslint-disable-next-line import/no-unresolved
// @ts-nocheck
import { db } from "@/lib/firebase-admin";
const path = require('path');
const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "luxurestays-eeb27.appspot.com"
  });
}

async function testStorage() {
  const bucket = admin.storage().bucket();
  const file = bucket.file('test.txt');
  await file.save('Hello world');
  console.log('File uploaded to storage.');
  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: '03-09-2491'
  });
  console.log('URL:', url);
}

testStorage().catch(console.error);
