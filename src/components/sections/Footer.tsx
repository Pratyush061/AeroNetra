export function Footer() {
  return (
    <footer className="bg-graphite text-chassis py-12 px-6 md:px-12 lg:px-24 border-t-4 border-amber">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-display text-2xl font-bold tracking-tighter uppercase">
          AeroNetra
        </div>

        <div className="font-mono text-xs text-metal uppercase flex gap-8">
          <a href="#" className="hover:text-amber transition-colors">Documentation</a>
          <a href="#" className="hover:text-amber transition-colors">API</a>
          <a href="#" className="hover:text-amber transition-colors">Contact</a>
        </div>

        <div className="font-mono text-[10px] text-metal uppercase">
          © {new Date().getFullYear()} AeroNetra Systems. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
