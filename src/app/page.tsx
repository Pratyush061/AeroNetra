import { Header } from "@/components/Header";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { PerceptionDemo } from "@/components/sections/PerceptionDemo";
import { Showcase } from "@/components/sections/Showcase";
import { OpenSource } from "@/components/sections/OpenSource";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 w-full bg-chassis relative">
        <Hero />
        <Features />
        <PerceptionDemo />
        <Showcase />
        <OpenSource />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
