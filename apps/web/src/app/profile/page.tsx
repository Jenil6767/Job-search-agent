'use client';

import React from 'react';
import { User, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="h-6 w-6 text-primary-light" />
          Candidate Profile
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your skills, experience history, salary requirements, and workplace preferences.
        </p>
      </div>

      <div className="rounded-2xl glass-panel p-10 text-center border border-border space-y-4">
        <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary-light">
          <Sparkles className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Candidate Domain Model Initialized</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          User & CandidateProfile schemas ready. Interactive multi-section profile editor unlocks in Phase 2.
        </p>
      </div>
    </div>
  );
}
