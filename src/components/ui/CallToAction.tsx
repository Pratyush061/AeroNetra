"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { IndustrialPanel } from '@/components/ui/IndustrialPanel';
import { PhysicalButton } from '@/components/ui/PhysicalButton';

export function CallToAction() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <IndustrialPanel
          elevation="level-1"
          withFasteners={true}
          className="p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 text-center md:text-left"
        >
          <div className="max-w-2xl space-y-4">
            <h2 className="font-sans text-3xl md:text-4xl font-semibold tracking-tight text-graphite">
              Ready to deploy your next sequence?
            </h2>
            <p className="font-mono text-sm md:text-base text-carbon max-w-xl mx-auto md:mx-0">
              Join the network and initialize your systems. Experience the future of industrial-grade telemetry and diagnostics today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
            <Link href="/get-started" className="block w-full sm:w-auto">
              <PhysicalButton variant="primary" fullWidth>
                DEPLOY
                <ChevronRight className="w-4 h-4" />
              </PhysicalButton>
            </Link>
            <PhysicalButton variant="secondary" onClick={() => window.location.href = '#features'} fullWidth>
              Learn More
            </PhysicalButton>
          </div>
        </IndustrialPanel>
      </div>
    </section>
  );
}
