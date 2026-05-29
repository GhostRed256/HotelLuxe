import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Stay-N-Joy | Premium Homestay Booking",
  description: "Experience world-class comfort and joy at Stay-N-Joy, Tinsukia. Book your perfect homestay — from cozy rooms to spacious 2BHK houses.",
  openGraph: {
    title: "Stay-N-Joy | Premium Homestay in Tinsukia",
    description: "Book your perfect homestay — cozy rooms, deluxe suites & spacious 2BHK houses. Experience world-class comfort at Stay-N-Joy, Tinsukia.",
    siteName: "Stay-N-Joy",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stay-N-Joy | Premium Homestay in Tinsukia",
    description: "Book your perfect homestay — cozy rooms, deluxe suites & spacious 2BHK houses. Experience world-class comfort at Stay-N-Joy, Tinsukia.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to speed up external resources on mobile */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://api.qrserver.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
      </head>
      <body>
        <Providers>
          <div className="royal-frame" />
          <Navbar />
          <main className="pt-[80px]" style={{ minHeight: "calc(100vh - 160px)" }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
