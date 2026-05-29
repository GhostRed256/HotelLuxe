require('dotenv').config({ path: '.env' });
const { notifyNewBooking } = require('./src/lib/notifications.ts');

// We have to use ts-node or similar, but since we are in Next.js, let's write a simple ts wrapper or execute it using ts-node.
