'use client';

import React from 'react';
import { FileCheck, Kanban } from 'lucide-react';

export default function ApplicationsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-primary-light" />
            Job Applications Pipeline
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track status from Discovered → Shortlisted → Applied → Assessment → Interview → Offer.
          </p>
        </div>
      </div>

      <div className="rounded-2xl glass-panel p-12 text-center border border-border space-y-4">
        <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-accent-emerald">
          <Kanban className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Application Pipeline & Kanban Tracker</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Application models and status transition history configured. Interactive Kanban board unlocks in Phase 9.
        </p>
      </div>
    </div>
  );
}
