import { Header } from "@/components/Header";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Showcase } from "@/components/sections/Showcase";
import { OpenSource } from "@/components/sections/OpenSource";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";
import { DroneVision } from "@/components/canvas/DroneVision";

export default function Home() {
  return (
    <main className="flex-1 w-full relative">
      <DroneVision />
      <div className="relative z-10 w-full">
        <Header />
        <Hero />
        <Features />
        <Showcase />
        <OpenSource />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
