// AI Agent connection setup & storefront integration
import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ClientLayoutWrapper from "../components/ClientLayoutWrapper";
import AIChatWidget from "../components/AIChatWidget";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-noto-bengali",
});

export const metadata: Metadata = {
  title: "Premium Account Store – Buy Digital Subscriptions at Best Price",
  description:
    "Get premium accounts for ChatGPT, Spotify, Netflix, YouTube, Canva & more. Fast delivery, 100% secure & affordable.",
  keywords: "premium accounts, digital subscriptions, ChatGPT, Spotify, Netflix, YouTube, Canva",
  openGraph: {
    title: "Premium Account Store",
    description: "Buy premium digital subscriptions at the best price.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${notoSansBengali.variable}`} style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f8fafc" }}>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
        <AIChatWidget />
      </body>
    </html>
  );
}
