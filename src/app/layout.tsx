import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "unSent - Your Smart Dating Assistant",
  description: "Get personalized dating advice, conversation analysis, and coaching to improve your dating life.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "unSent - Your Smart Dating Assistant",
    description: "Get personalized dating advice, conversation analysis, and coaching to improve your dating life.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "unSent - Your Smart Dating Assistant",
    description: "Get personalized dating advice, conversation analysis, and coaching to improve your dating life.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-licorice text-antiquewhite antialiased`}>
        {/* Global ambient background (keeps the whole app visually cohesive) */}
        <div className="mesh-gradient" aria-hidden="true" />
        <div className="noise-overlay" aria-hidden="true" />
        {/* Ensure app content always sits above ambient layers */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
