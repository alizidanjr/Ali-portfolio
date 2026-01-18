import type { Metadata } from "next";
import { Geist, Geist_Mono, Reem_Kufi } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LiquidBackground } from "@/components/layout/LiquidBackground";
import { PageTransition } from "@/components/layout/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const reemKufi = Reem_Kufi({
  variable: "--font-reem-kufi",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});




export const metadata: Metadata = {
  metadataBase: new URL("https://alizidanjr.site"),
  manifest: "/manifest.json",
  title: {
    default: "Ali Zidan | Professional Photographer & Videographer",
    template: "%s | Ali Zidan"
  },
  description: "Capture your moments with Ali Zidan - A professional photographer and videographer specializing in portraits, commercial work, and cinematic videos.",
  keywords: ["photographer", "videographer", "portfolio", "cinematics", "photoshoot", "booking", "Ali Zidan"],
  authors: [{ name: "Ali Zidan" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://alizidan.com",
    siteName: "Ali Zidan Portfolio",
    title: "Ali Zidan | Professional Photographer & Videographer",
    description: "Capture your moments with Ali Zidan - A professional photographer and videographer specializing in portraits, commercial work, and cinematic videos.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ali Zidan Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ali Zidan | Professional Photographer & Videographer",
    description: "Capture your moments with Ali Zidan - A professional photographer and videographer specializing in portraits, commercial work, and cinematic videos.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${reemKufi.variable} antialiased bg-background text-foreground flex flex-col min-h-screen relative`}
      >
        <LiquidBackground />
        <Navbar />

        <main className="flex-1 relative z-10 pt-20">
          <PageTransition>
            {children}
          </PageTransition>
        </main>


        <Footer />
      </body>
    </html>
  );
}
