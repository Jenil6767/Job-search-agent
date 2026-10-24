'use client';

import React, { useEffect, useState } from 'react';
import { Search, Bell, Activity } from 'lucide-react';

export function Navbar() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'healthy' | 'offline'>('checking');

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('http://localhost:5000/api/v1/health');
        if (res.ok) {
          setApiStatus('healthy');
        } else {
          setApiStatus('offline');
        }
      } catch {
        setApiStatus('offline');
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-[#0B0F19]/80 px-8 backdrop-blur-md">
      {/* Search Input Trigger */}
      <div className="flex items-center gap-3">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs, skills, or ask AI Agent..."
            className="w-full rounded-xl bg-surface/80 border border-border py-1.5 pl-9 pr-12 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all"
            readOnly
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border bg-surface-elevated px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            Ctrl+K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* API Health Pill */}
        <div className="flex items-center gap-2 rounded-full bg-surface border border-border px-3 py-1">
          <Activity className={`h-3.5 w-3.5 ${apiStatus === 'healthy' ? 'text-accent-emerald' : 'text-accent-rose'}`} />
          <span className="text-[11px] font-medium text-slate-300">
            API Gateway:
          </span>
          <span
            className={`text-[11px] font-semibold uppercase tracking-wider ${
              apiStatus === 'healthy'
                ? 'text-accent-emerald'
                : apiStatus === 'checking'
                ? 'text-accent-amber'
                : 'text-accent-rose'
            }`}
          >
            {apiStatus}
          </span>
        </div>

        {/* Notifications Icon */}
        <button
          aria-label="Notifications"
          className="relative rounded-xl p-2 text-slate-400 hover:bg-surface-elevated hover:text-slate-200 transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-[#0B0F19]" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-border">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-xs text-white shadow-sm">
            AM
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-200">Alex Morgan</p>
            <p className="text-[10px] text-slate-400">Senior Full-Stack</p>
          </div>
        </div>
      </div>
    </header>
  );
}
