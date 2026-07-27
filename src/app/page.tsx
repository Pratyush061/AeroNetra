import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PhysicalButton } from '@/components/ui/PhysicalButton';
import { TechnicalLabel } from '@/components/ui/TechnicalLabel';
import { RecessedScreen } from '@/components/ui/RecessedScreen';
import { TelemetryRow } from '@/components/ui/TelemetryRow';
import { CapabilityModule } from '@/components/CapabilityModule';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PipelineConnector } from '@/components/ui/PipelineConnector';
import { IndustrialPanel } from '@/components/ui/IndustrialPanel';
import { RepositoryPanel } from '@/components/RepositoryPanel';
import { StatusLED } from '@/components/ui/StatusLED';
import { CallToAction } from '@/components/ui/CallToAction';

export default function Home() {
  return (
    <>
      <div className="pt-4 pb-0 overflow-x-hidden">
        <Header />

        <main className="max-w-7xl mx-auto px-4 md:px-8 mt-16 md:mt-24 space-y-32 md:space-y-48 pb-32">

          {/* HERO SECTION */}
          <section className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-8 items-center">
            <div className="order-2 lg:order-1">
              <TechnicalLabel type="identifier" className="mb-8 inline-block">
                VISION SOFTWARE FOR AUTONOMOUS AERIAL SYSTEMS
              </TechnicalLabel>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-balance leading-[1.1] mb-6">
                Giving aerial machines the ability to see, understand and act.
              </h1>
              <p className="text-lg md:text-xl text-metal max-w-2xl mb-10 leading-relaxed">
                AeroNetra builds computer-vision, perception and simulation software for UAVs—transforming aerial imagery into structured intelligence for autonomous systems.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <PhysicalButton variant="primary">Explore the Platform</PhysicalButton>
                <PhysicalButton variant="secondary">View Open-Source Work</PhysicalButton>
              </div>

              <div className="flex flex-wrap gap-4 pt-8 border-t border-shadow/20">
                <TechnicalLabel>DETECTION</TechnicalLabel>
                <span className="text-shadow/40">/</span>
                <TechnicalLabel>TRACKING</TechnicalLabel>
                <span className="text-shadow/40">/</span>
                <TechnicalLabel>NAVIGATION</TechnicalLabel>
              </div>
            </div>

            <div className="order-1 lg:order-2 w-full max-w-lg mx-auto lg:max-w-none">
              <RecessedScreen className="aspect-square relative flex flex-col p-4">
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="w-4 h-4 border-t-2 border-r-2 border-amber/30" />
                </div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-amber/30" />
                </div>

                {/* HUD Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-amber/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-amber rounded-full animate-pulse" />
                  {/* Radar sweep simulation */}
                  <div className="absolute inset-0 border-t border-amber/40 rounded-full origin-bottom rotate-45" style={{clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)'}} />
                </div>

                <div className="absolute top-1/4 left-1/4 border border-signal text-signal text-[10px] p-1 font-mono bg-signal/10">
                  OBJ_DETECT
                </div>

                {/* Telemetry Display */}
                <div className="mt-auto space-y-1 bg-black/40 p-3 backdrop-blur-sm border border-white/5 rounded-sm relative z-20">
                  <TelemetryRow label="OBJECT TRACK" value="08" />
                  <TelemetryRow label="CONFIDENCE" value="94.2%" highlight />
                  <TelemetryRow label="FRAME INPUT" value="ACTIVE" />
                  <TelemetryRow label="VISION PIPELINE" value="ONLINE" />
                  <TelemetryRow label="MODE" value="SIMULATION" />
                </div>
              </RecessedScreen>
            </div>
          </section>

          {/* CALL TO ACTION */}
          <CallToAction />

          {/* CAPABILITY MODULES SECTION */}
          <section id="capabilities">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <CapabilityModule
                id="MOD-01"
                title="Aerial Object Detection"
                description="Identify and classify vehicles, infrastructure, and personnel from high-altitude moving platforms."
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                isActive
              />
              <CapabilityModule
                id="MOD-02"
                title="Multi-Object Tracking"
                description="Maintain persistent identity tracking across frames despite occlusions and ego-motion."
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>}
              />
              <CapabilityModule
                id="MOD-03"
                title="Visual Navigation"
                description="GPS-denied localization and mapping using terrain feature matching and visual odometry."
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              />
              <CapabilityModule
                id="MOD-04"
                title="Synthetic Simulation"
                description="Validate perception pipelines in physically accurate virtual environments before flight."
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>}
              />
            </div>
          </section>

          {/* PERCEPTION PIPELINE SECTION */}
          <section id="platform">
            <SectionHeading
              numberStr="01 // PERCEPTION PLATFORM"
              title="From camera frames to spatial intelligence."
            />

            <div className="bg-shadow/5 p-4 md:p-8 rounded-sm border border-shadow/10">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">

                <IndustrialPanel elevation="level-2" className="flex-1 p-6 z-10 relative text-center lg:text-left">
                  <div className="flex flex-col items-center lg:items-start">
                    <StatusLED status="active" className="mb-4" />
                    <h4 className="font-semibold text-lg mb-2">Aerial Vision</h4>
                    <p className="text-sm text-metal">Detect objects and infrastructure in moving aerial footage.</p>
                  </div>
                </IndustrialPanel>

                <PipelineConnector direction="vertical" className="lg:hidden mx-auto" />
                <PipelineConnector direction="horizontal" className="hidden lg:flex" />

                <IndustrialPanel elevation="level-2" className="flex-1 p-6 z-10 relative text-center lg:text-left">
                   <div className="flex flex-col items-center lg:items-start">
                    <StatusLED status="active" className="mb-4" />
                    <h4 className="font-semibold text-lg mb-2">Temporal Tracking</h4>
                    <p className="text-sm text-metal">Maintain identity and movement history across successive frames.</p>
                  </div>
                </IndustrialPanel>

                <PipelineConnector direction="vertical" className="lg:hidden mx-auto" />
                <PipelineConnector direction="horizontal" className="hidden lg:flex" />

                <IndustrialPanel elevation="level-2" className="flex-1 p-6 z-10 relative text-center lg:text-left">
                   <div className="flex flex-col items-center lg:items-start">
                    <StatusLED status="active" className="mb-4" />
                    <h4 className="font-semibold text-lg mb-2">Decision Interfaces</h4>
                    <p className="text-sm text-metal">Transform perception results into structured outputs for autonomy systems.</p>
                  </div>
                </IndustrialPanel>

              </div>

              <div className="mt-8 flex justify-center hidden sm:flex">
                <TechnicalLabel className="bg-white px-4 py-2 rounded-sm shadow-raised inline-flex flex-wrap items-center justify-center gap-2 md:gap-4">
                  <span>FRAME INPUT</span>
                  <span className="text-amber">→</span>
                  <span>DETECTION</span>
                  <span className="text-amber">→</span>
                  <span>TRACKING</span>
                  <span className="text-amber">→</span>
                  <span>AUTONOMY OUTPUT</span>
                </TechnicalLabel>
              </div>
            </div>
          </section>

          {/* SIMULATION SECTION */}
          <section id="simulation">
            <SectionHeading
              numberStr="02 // SIMULATION"
              title="Develop before hardware enters the loop."
              subtitle="Build, validate and benchmark aerial-perception pipelines through repeatable software-first simulation before physical drone deployment."
            />

            <IndustrialPanel withFasteners className="bg-graphite p-2 md:p-4 mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-px bg-carbon">

                {/* Left side: Environment */}
                <RecessedScreen withBezel={false} className="h-64 lg:h-96">
                  <div className="absolute inset-0 bg-carbon flex items-center justify-center relative overflow-hidden">
                    {/* Simulated Terrain Grid */}
                    <div className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '20px 20px',
                        transform: 'perspective(500px) rotateX(60deg) translateY(-50px) scale(2)'
                      }}
                    />
                    <div className="absolute bottom-4 left-4 text-xs font-mono text-metal">
                      ENV: URBAN_SECTOR_7
                    </div>
                  </div>
                </RecessedScreen>

                {/* Right side: Telemetry */}
                <RecessedScreen withBezel={false} className="h-64 lg:h-96">
                  <div className="absolute inset-0 bg-[#0a0a0a] p-4 font-mono text-xs text-amber/80 flex flex-col relative overflow-hidden">
                    {/* Scanline */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

                    <div className="mb-4 text-white/50 border-b border-white/10 pb-2">
                      <span className="text-signal">■</span> RUNNING INFERENCE...
                    </div>

                    <div className="space-y-2 flex-1">
                      <div className="flex justify-between"><span>FPS</span><span className="text-white">60.2</span></div>
                      <div className="flex justify-between"><span>LATENCY</span><span className="text-white">12ms</span></div>
                      <div className="flex justify-between"><span>TARGETS_ACQUIRED</span><span className="text-white">14</span></div>
                      <div className="flex justify-between"><span>TRACK_LOSS_RATE</span><span className="text-white">0.02%</span></div>
                    </div>

                    {/* Console Output Simulation */}
                    <div className="mt-auto h-24 overflow-hidden text-[10px] text-metal border-t border-white/10 pt-2 opacity-70">
                      <div>&gt; Loading model weights... OK</div>
                      <div>&gt; Initializing tracking pipeline... OK</div>
                      <div>&gt; Frame 001: Detected 4 vehicles</div>
                      <div>&gt; Frame 002: Detected 4 vehicles, 2 pedestrians</div>
                      <div>&gt; Frame 003: [WARN] Low confidence on target ID:8</div>
                    </div>
                  </div>
                </RecessedScreen>

              </div>
            </IndustrialPanel>

            <PhysicalButton variant="primary">Explore Simulation Workflow</PhysicalButton>
          </section>

          {/* OPEN SOURCE SECTION */}
          <section id="open-source">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <SectionHeading
                  numberStr="03 // OPEN SOURCE"
                  title="Built in the open. Engineered for aerial problems."
                  className="mb-8"
                />
                <PhysicalButton variant="secondary" className="mb-12 lg:mb-0">Visit AeroNetra on GitHub</PhysicalButton>
              </div>
              <div className="w-full">
                <RepositoryPanel />
              </div>
            </div>
          </section>

          {/* ENGINEERING PRINCIPLES */}
          <section className="border-t border-b border-shadow/20 py-16 md:py-24 my-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { num: '01', title: 'Simulation First' },
                { num: '02', title: 'Modular Pipelines' },
                { num: '03', title: 'Reproducible Evaluation' },
                { num: '04', title: 'Hardware-Agnostic Foundations' }
              ].map((principle) => (
                <div key={principle.num} className="relative group">
                  <div className="text-5xl font-display font-bold text-shadow/10 group-hover:text-amber/10 transition-colors absolute -top-6 -left-2 -z-10">
                    {principle.num}
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-1.5 bg-graphite rounded-full" />
                    <span className="font-mono text-sm tracking-widest text-metal">SPEC — {principle.num}</span>
                  </div>
                  <h3 className="text-xl font-medium text-graphite">{principle.title}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* INDIA-ORIGIN STATEMENT & FINAL CTA */}
          <section className="text-center max-w-3xl mx-auto flex flex-col items-center">

            <div className="mb-24 flex flex-col items-center relative">
              {/* Abstract wing/eye geometry */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-10 pointer-events-none">
                 <svg width="200" height="100" viewBox="0 0 200 100" className="text-carbon">
                  <path d="M0,50 L100,0 L200,50 L100,100 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="100" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
                 </svg>
              </div>

              <TechnicalLabel type="identifier" className="mb-6">
                ENGINEERED FROM INDIA
              </TechnicalLabel>
              <h2 className="font-display text-3xl font-medium text-graphite">
                Indian perspective. Global engineering standards.
              </h2>
            </div>

            <div className="bg-panel w-full p-12 md:p-16 rounded-sm shadow-raised border border-white/50 relative overflow-hidden">
               <div className="absolute -right-20 -bottom-20 opacity-5 pointer-events-none w-64 h-64 border-[40px] border-amber rounded-full" />
               <div className="relative z-10">
                <h2 className="font-display text-4xl md:text-5xl font-medium text-graphite mb-10 text-balance">
                  Build aerial systems that understand what they see.
                </h2>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <PhysicalButton variant="primary">Explore AeroNetra</PhysicalButton>
                  <PhysicalButton variant="ghost">Follow Development</PhysicalButton>
                </div>
               </div>
            </div>

          </section>

        </main>

        <Footer />
      </div>
    </>
  );
}
