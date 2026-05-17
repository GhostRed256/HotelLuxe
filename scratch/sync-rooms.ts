import * as admin from 'firebase-admin'

const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

const targetRooms = [
  {
    id: 'I2w8C9yxnzjmnPYe1byb',
    name: 'Pink Cozy Room',
    type: 'Cozy Pink Room',
    price: 1399,
    floor: 'Ground Floor',
    roomNumber: '01',
    location: 'Chaliha Nagar',
    description: 'A vibrant, rose-toned sanctuary designed with a cozy bohemian aesthetic. Features warm ambient lighting, signature plush bedding, and artisanal local accents—perfect for solo travelers, creative souls, and travelers seeking a charming, peaceful getaway.'
  },
  {
    id: '60GS2vOYGqK6h0v03NBr',
    name: 'Deluxe Room',
    type: 'Deluxe Room',
    price: 1799,
    floor: 'Top Floor',
    roomNumber: '02',
    location: 'Chaliha Nagar',
    description: 'An elegant, premium couples\' retreat boasting an attached modern bathroom, state-of-the-art cinema projector for private movie nights, high-definition acoustics, and premium memory foam mattresses for a truly luxurious sleep experience.'
  },
  {
    id: '3w4aUEduVe4ADNVG0LNl',
    name: 'Deluxe Room',
    type: 'Deluxe Room',
    price: 1799,
    floor: '1st Floor Left',
    roomNumber: '03',
    location: 'Chaliha Nagar',
    description: 'An elegant, premium couples\' retreat boasting an attached modern bathroom, state-of-the-art cinema projector for private movie nights, high-definition acoustics, and premium memory foam mattresses for a truly luxurious sleep experience.'
  },
  {
    id: 'qCKBhzTURLYJX5xxKeYS',
    name: 'Deluxe Room',
    type: 'Deluxe Room',
    price: 1799,
    floor: '1st Floor Right',
    roomNumber: '04',
    location: 'Chaliha Nagar',
    description: 'An elegant, premium couples\' retreat boasting an attached modern bathroom, state-of-the-art cinema projector for private movie nights, high-definition acoustics, and premium memory foam mattresses for a truly luxurious sleep experience.'
  },
  {
    id: 'PJ6hFWwZoIS8bMijVmJJ',
    name: '2BHK House',
    type: '2BHK House',
    price: 2700,
    floor: 'Top Floor',
    roomNumber: '05',
    location: 'Chaliha Nagar',
    description: 'A spectacular, expansive residence featuring a grand living room, dining hall, chef-ready kitchen, and 2 luxury bedrooms. Architected for group stays, birthday celebrations, and cozy private gatherings in an elite setting.'
  },
  {
    id: 'ueRo7OAAzwl2UOuIYi20', // Migrated from 1BHK Ground Floor to Deluxe Room
    name: 'Deluxe Room',
    type: 'Deluxe Room',
    price: 1799,
    floor: 'Ground Floor',
    roomNumber: '06',
    location: 'Chaliha Nagar',
    description: 'An elegant, premium couples\' retreat boasting an attached modern bathroom, state-of-the-art cinema projector for private movie nights, high-definition acoustics, and premium memory foam mattresses for a truly luxurious sleep experience.'
  },
  {
    id: 'UXV7x0DTYheTzw1qW7ZL',
    name: 'Deluxe Room',
    type: 'Deluxe Room',
    price: 1799,
    floor: 'Left',
    roomNumber: '07',
    location: 'Bordoloi Nagar (Near Lake)',
    description: 'An elegant, premium couples\' retreat boasting an attached modern bathroom, state-of-the-art cinema projector for private movie nights, high-definition acoustics, and premium memory foam mattresses for a truly luxurious sleep experience.'
  },
  {
    id: 'WaWGDEesSpLAw64cIBEY',
    name: 'Deluxe Room',
    type: 'Deluxe Room',
    price: 1799,
    floor: 'Right',
    roomNumber: '08',
    location: 'Bordoloi Nagar (Near Lake)',
    description: 'An elegant, premium couples\' retreat boasting an attached modern bathroom, state-of-the-art cinema projector for private movie nights, high-definition acoustics, and premium memory foam mattresses for a truly luxurious sleep experience.'
  },
  {
    id: 'Ne0oPUF4KDRdp0bG5ogj',
    name: 'Premium 1BHK Suite',
    type: 'Premium 1BHK Suite',
    price: 2200,
    floor: 'Ground Floor',
    roomNumber: '09',
    location: 'Bordoloi Nagar (Near Income Tax Office)',
    description: 'A spacious, upscale sanctuary featuring a lavish private living room, fully equipped gourmet kitchen, and an ultra-modern bathroom. Crafted with contemporary design elements, ideal for families and travelers seeking long-term luxury living.'
  },
  {
    id: 'new_2bhk_3600', // To be created
    name: '2BHK House',
    type: '2BHK House',
    price: 3600,
    floor: '1st Floor',
    roomNumber: '10',
    location: 'Chaliha Nagar',
    description: 'An elite, professionally styled executive residence equipped with lavish Italian-style furnishings, a stunning spacious lounge, curated artwork, and fully integrated modern kitchen. Perfect for discerning guests seeking high-end luxury.'
  },
  {
    id: 'new_2bhk_4400', // To be created
    name: '2BHK House',
    type: '2BHK House',
    price: 4400,
    floor: 'Penthouse',
    roomNumber: '11',
    location: 'Chaliha Nagar',
    description: 'The ultimate luxury penthouse experience, showcasing high ceilings, premium double-volume space, a gourmet kitchen, and a magnificent private terrace offering spectacular scenic views. Curated for premium lifestyles and exclusive getaways.'
  }
];

async function syncRooms() {
  console.log('Starting DB Room Synchronization...');
  const roomsRef = db.collection('rooms');

  for (const r of targetRooms) {
    const { id, ...data } = r;
    
    if (id.startsWith('new_')) {
      // Create a new room with a random ID or unique custom ID
      // Let's query by roomNumber first to avoid creating duplicates
      const query = await roomsRef.where('roomNumber', '==', r.roomNumber).get();
      if (query.empty) {
        const docRef = await roomsRef.add({
          ...data,
          images: [],
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`Created new room ${r.name} with ID ${docRef.id}`);
      } else {
        const doc = query.docs[0];
        await doc.ref.update({
          ...data,
          updatedAt: new Date()
        });
        console.log(`Updated existing new-room match ${r.name} at ID ${doc.id}`);
      }
    } else {
      // Update existing room keeping the ID
      const docRef = roomsRef.doc(id);
      const doc = await docRef.get();
      if (doc.exists) {
        await docRef.update({
          ...data,
          updatedAt: new Date()
        });
        console.log(`Updated existing room ID ${id} -> ${r.name}`);
      } else {
        // Create if missing
        await docRef.set({
          ...data,
          images: [],
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`Seeded missing room ID ${id} -> ${r.name}`);
      }
    }
  }

  // Double check if any extraneous rooms exist and remove them
  const snapshot = await roomsRef.get();
  const validRoomNumbers = targetRooms.map(r => r.roomNumber);
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (!validRoomNumbers.includes(data.roomNumber)) {
      console.log(`Deleting extraneous room ID ${doc.id} (Room Number: ${data.roomNumber})`);
      await doc.ref.delete();
    }
  }

  console.log('Room Synchronization Complete! Exactly 11 rooms active.');
}

syncRooms().catch(console.error);
