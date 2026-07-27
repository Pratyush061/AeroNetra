export function Footer() {
  return (
    <footer className="bg-chassis text-white py-12 px-6 md:px-12 lg:px-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-display text-2xl font-bold tracking-tighter uppercase text-white/90">
          AeroNetra
        </div>

        <div className="font-mono text-xs text-metal uppercase flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">API</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>

        <div className="font-mono text-[10px] text-metal uppercase">
          © {new Date().getFullYear()} AeroNetra Systems. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
