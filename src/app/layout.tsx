import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Stay-N-Joy | Premium Hotel Booking",
  description: "Experience world-class comfort and joy at Stay-N-Joy, Tinsukia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          <main className="pt-[80px]" style={{ minHeight: "calc(100vh - 160px)" }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
