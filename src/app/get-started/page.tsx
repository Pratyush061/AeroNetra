import { IndustrialPanel } from '@/components/ui/IndustrialPanel';
import { PhysicalButton } from '@/components/ui/PhysicalButton';
import Link from 'next/link';

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-chassis pt-32 pb-24 font-sans text-graphite flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <IndustrialPanel elevation="level-1" withFasteners={true} className="p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-recessed shadow-recessed mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-amber"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </div>

          <h1 className="font-sans text-3xl md:text-4xl font-semibold tracking-tight text-graphite mb-4">
            AeroNetra GitHub Repository
          </h1>

          <p className="font-mono text-sm md:text-base text-carbon mb-8 max-w-lg mx-auto">
            This is a placeholder page. Soon, you will be redirected to the official AeroNetra GitHub repository where you can clone the project and start deploying your sequences.
          </p>

          <Link href="/" className="inline-block">
            <PhysicalButton variant="secondary">
              Return to Grid
            </PhysicalButton>
          </Link>
        </IndustrialPanel>
      </div>
    </div>
  );
}
