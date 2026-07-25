import React from 'react';
import { IndustrialPanel } from './ui/IndustrialPanel';

export function RepositoryPanel() {
  const folders = [
    { name: 'perception', desc: 'Core CV pipelines' },
    { name: 'datasets', desc: 'Training data structures' },
    { name: 'simulation', desc: 'Synthetic environments' },
    { name: 'evaluation', desc: 'Benchmarking tools' },
    { name: 'documentation', desc: 'System specs' },
  ];

  return (
    <IndustrialPanel className="bg-graphite text-panel font-mono border-carbon">
      <div className="flex border-b border-carbon/50 p-4 items-center gap-4 text-xs text-metal">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-carbon" />
          <div className="w-2.5 h-2.5 rounded-full bg-carbon" />
          <div className="w-2.5 h-2.5 rounded-full bg-carbon" />
        </div>
        <div className="flex-1 text-center opacity-50">aeronetra / core</div>
      </div>

      <div className="p-1 md:p-4">
        <div className="grid gap-1">
          {folders.map((folder) => (
            <div key={folder.name} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 hover:bg-white/5 rounded-sm transition-colors cursor-pointer group">
              <div className="flex items-center gap-3 w-48 shrink-0">
                <svg className="w-4 h-4 text-metal group-hover:text-amber transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span className="text-sm font-medium text-panel group-hover:text-white transition-colors">{folder.name}</span>
              </div>
              <span className="text-xs text-metal hidden sm:block truncate">{folder.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </IndustrialPanel>
  );
}
