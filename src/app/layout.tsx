import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AeroNetra | Computer Vision & Autonomy Software for UAVs",
  description: "AeroNetra builds computer-vision, perception and simulation software for UAVs—transforming aerial imagery into structured intelligence for autonomous systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} scroll-smooth`}>
      <body className="min-h-screen antialiased bg-chassis text-graphite selection:bg-amber selection:text-white flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:top-4 focus:left-4 focus:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber font-mono text-sm uppercase tracking-wider font-bold">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
