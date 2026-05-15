<div align="center">

# 🏨 Stay-N-Joy: Premium Hotel Booking Platform

<p align="center">
  <em>A meticulous, royal-themed Next.js architecture redefining digital hospitality in Tinsukia.</em>
</p>

<div align="center">

**[🌐 Live Demo: stay-n-joy-wine.vercel.app](https://stay-n-joy-wine.vercel.app)**

</div>

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase_Auth_&_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

<br/>

<img src="https://img.shields.io/github/stars/GhostRed256/HotelLuxe?style=social" alt="Stars"/>
<img src="https://img.shields.io/github/forks/GhostRed256/HotelLuxe?style=social" alt="Forks"/>
<img src="https://img.shields.io/github/license/GhostRed256/HotelLuxe" alt="License"/>

</div>

---

## ✨ The Stay-N-Joy Experience

Stay-N-Joy isn't just a booking platform—it's a digital reflection of premium hospitality. From the typography to the buttery-smooth page transitions, every pixel has been engineered to provide an opulent user experience.

| Feature | Description |
|---------|-------------|
| 🎨 **Cinematic Aesthetics** | Cormorant Garamond & Cinzel typography combined with deep gold gradients and glassmorphism. |
| ✨ **Fluid Animations** | Powered by `framer-motion`, featuring seamless route transitions, micro-interactions, and hovering artifacts. |
| 🛏️ **Dynamic Suite Showcase** | Browse visually striking room cards with auto-playing image carousels and live availability states. |
| 📅 **Serverless Architecture** | Entirely decoupled from local storage. Real-time data sync using Google Cloud Firestore. |
| 🔐 **Bulletproof Security** | Role-based Firebase authentication enforcing strict admin-only routes via Next.js Middleware. |
| 🌙 **Adaptive Theming** | Fully responsive, offering a gorgeous high-contrast Dark Mode and an airy, elegant Light Mode. |
| 📊 **Admin Dashboard** | Easily generate CSV reports of all bookings and add new luxury suites directly from the protected UI. |

---

## 🛠️ The Technology Engine

<div align="center">

| Layer | Technology | Purpose |
|------------|---------|---------|
| **Core** | `Next.js 16` & `React 19` | SSR, Static Optimization, App Router |
| **Logic** | `TypeScript` | End-to-end type safety and robust refactoring |
| **Styling** | `Tailwind CSS 4` | Utility-first styling with custom CSS variables for themes |
| **Motion** | `Framer Motion` | Complex gestures, page transitions, and element enter/exit physics |
| **Database** | `Firebase Firestore` | NoSQL Cloud Database for real-time room & booking data |
| **Auth** | `Firebase Auth` | Secure cookie-based session management for Administrators |

</div>

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 20+
- A Firebase Project (with Firestore and Authentication enabled)

### 2. Local Installation

```bash
# Clone the repository
git clone https://github.com/GhostRed256/HotelLuxe.git

# Navigate to project directory
cd HotelLuxe

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your Firebase Client configuration:

```env
# Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-app.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your-measurement-id"

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL="admin@hotel.com" # Change to your email for Dashboard access
```

### 4. Admin SDK Configuration (For Database Access)
To allow the server to write to Firestore (e.g., adding rooms, generating CSVs):
1. Go to your **Firebase Console** -> **Project Settings** -> **Service Accounts**.
2. Click **Generate new private key**.
3. Move the downloaded JSON file into the root of this project and rename it to `serviceAccountKey.json`.
*(Note: This file is securely ignored in `.gitignore` so it will never be uploaded to GitHub).*

### 5. Start the Engine
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application!

---

## 📁 Project Architecture

```text
Stay-N-Joy/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Protected Dashboard & CSV Export Logic
│   │   ├── api/auth/          # Session Cookie Management
│   │   ├── login/             # Firebase Authentication UI
│   │   ├── rooms/             # Interactive Booking Gallery
│   │   └── template.tsx       # Global Framer Motion Page Transitions
│   ├── components/            # Reusable UI Elements (Navbar, Hero, RoomCard)
│   ├── lib/                   # Utilities (Firebase Client & Admin SDK initialization)
│   └── globals.css            # Custom Premium Theme Variables & Micro-animations
├── serviceAccountKey.json     # 🔒 Local Firebase Admin Credentials (Ignored)
└── tailwind.config.ts         # Design System Tokens
```

---

## 🚢 Deployment (Vercel)

Stay-N-Joy is fully optimized for edge/serverless deployment on Vercel.

1. Push your code to GitHub.
2. Import the repository into your [Vercel Dashboard](https://vercel.com/new).
3. Under **Environment Variables**, paste all your `NEXT_PUBLIC_FIREBASE_*` keys.
4. For the Admin SDK, add two specific environment variables from your JSON file:
   - `FIREBASE_CLIENT_EMAIL`: Your service account email.
   - `FIREBASE_PRIVATE_KEY`: Your exact private key string (including `-----BEGIN...` and `\n` characters).
5. Deploy! Vercel will automatically inject the keys, and your database will be live.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

### Designed & Developed by [GhostRed256](https://github.com/GhostRed256)

⭐ If you appreciate clean architecture and premium UI/UX, a star is always welcome!

</div>
