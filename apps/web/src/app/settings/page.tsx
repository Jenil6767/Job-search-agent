'use client';

import React from 'react';
import { Settings, Shield, Sliders } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary-light" />
          Platform Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure AI Provider (Mock / OpenAI / Anthropic), notifications, and security keys.
        </p>
      </div>

      <div className="rounded-2xl glass-panel p-8 border border-border space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-surface-elevated flex items-center justify-center text-primary-light">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Active AI Engine</h3>
            <p className="text-xs text-slate-400">Controlled via environment variable (AI_PROVIDER=mock|openai|anthropic)</p>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <div className="h-10 w-10 rounded-xl bg-surface-elevated flex items-center justify-center text-accent-emerald">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Decoupled BullMQ Worker Cluster</h3>
            <p className="text-xs text-slate-400">Independent process running outside API Gateway</p>
          </div>
        </div>
      </div>
    </div>
  );
}
