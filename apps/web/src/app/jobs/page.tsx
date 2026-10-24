'use client';

import React from 'react';
import { Briefcase, Filter, Sparkles } from 'lucide-react';

export default function JobsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary-light" />
            Job Discovery & Ingestion
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Jobs aggregated from authorized APIs, scheduled scrapers, and Mock providers.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-surface-elevated border border-border px-4 py-2 text-xs font-semibold text-slate-200">
          <Filter className="h-3.5 w-3.5" />
          Filter Criteria
        </button>
      </div>

      <div className="rounded-2xl glass-panel p-12 text-center border border-border space-y-4">
        <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary-light">
          <Sparkles className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Job Discovery Pipeline Ready</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Pluggable JobSource architecture and normalized Job schemas configured. Full search UI and match cards unlock in Phase 3.
        </p>
      </div>
    </div>
  );
}
