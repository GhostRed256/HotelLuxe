/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const sa = JSON.parse(fs.readFileSync('serviceAccountKey.json', 'utf8'));

const envContent = `# ==============================
#  Firebase Frontend (Public)
# ==============================
# Find these in Firebase Console > Project Settings > General > Your Apps
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${sa.project_id}.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${sa.project_id}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${sa.project_id}.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID

# ==============================
#  Firebase Admin (Server-side)
# ==============================
FIREBASE_PROJECT_ID=${sa.project_id}
FIREBASE_CLIENT_EMAIL=${sa.client_email}
FIREBASE_PRIVATE_KEY=${JSON.stringify(sa.private_key)}

# ==============================
#  SMTP (Gmail) - Email Alerts
# ==============================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=staynjoy05@gmail.com
SMTP_PASS=YOUR_GMAIL_APP_PASSWORD
SMTP_FROM_NAME="StayNjoy Palace"

# ==============================
#  Admin & Notifications
# ==============================
NEXT_PUBLIC_ADMIN_EMAIL=staynjoy05@gmail.com
NEXT_PUBLIC_ADMIN_PHONE=+917002475079
OWNER_EMAILS=staynjoy05@gmail.com
OWNER_PHONES=+917002475079

# Telegram (Optional)
TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID=YOUR_TELEGRAM_CHAT_ID

# SMS (Optional - Fast2SMS)
FAST2SMS_API_KEY=YOUR_FAST2SMS_API_KEY
`;

fs.writeFileSync('.env', envContent);
console.log('.env file has been restored successfully.');
