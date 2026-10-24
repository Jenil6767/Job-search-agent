'use client';

import React from 'react';
import { GitBranch, Plus } from 'lucide-react';

export default function WorkflowsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <GitBranch className="h-6 w-6 text-primary-light" />
            Automated Workflows
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Build scheduled, trigger-based pipelines to scan, filter, match, and apply autonomously.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-primary/30">
          <Plus className="h-3.5 w-3.5" />
          Create Visual Workflow
        </button>
      </div>

      <div className="rounded-2xl glass-panel p-12 text-center border border-border space-y-4">
        <div className="mx-auto h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-primary-light">
          <GitBranch className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-white">React Flow Visual Builder Pipeline</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Workflow engine models and BullMQ queues initialized. Visual node drag-and-drop editor unlocks in Phase 7 & 8.
        </p>
      </div>
    </div>
  );
}
