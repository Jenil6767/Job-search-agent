'use client';

import React from 'react';
import { Bot, Terminal, Send } from 'lucide-react';

export default function AgentPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="h-6 w-6 text-accent-cyan" />
            AI Pilot Agent
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Autonomous multi-tool calling agent with human-in-the-loop permission checks.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-xs font-semibold text-accent-cyan">
          <Terminal className="h-3.5 w-3.5" />
          Tool Calling Active
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 rounded-2xl glass-panel p-6 border border-border flex flex-col justify-between overflow-hidden">
        <div className="space-y-4 overflow-y-auto pr-2">
          {/* Assistant Message */}
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-xl bg-accent-cyan/20 text-accent-cyan flex items-center justify-center font-bold text-xs">
              AI
            </div>
            <div className="max-w-xl rounded-2xl bg-surface-elevated p-4 border border-border text-sm text-slate-200 space-y-2">
              <p>
                Hello Alex! I am your AI JobPilot assistant. I can search jobs, analyze matches
                against your resume, generate customized cover letters, and trigger background workflows.
              </p>
              <div className="p-2.5 rounded-lg bg-[#090D16] border border-border/80 text-xs font-mono text-slate-400">
                <span>Available Tools:</span> searchJobs, getCandidateProfile, analyzeJob, matchJob, generateCoverLetter
              </div>
            </div>
          </div>
        </div>

        {/* Prompt Input Box */}
        <div className="pt-4 border-t border-border mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask AI Pilot (e.g., 'Find remote React jobs matching my resume')..."
              className="w-full rounded-xl bg-surface border border-border py-3 pl-4 pr-12 text-sm text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50"
              readOnly
            />
            <button
              aria-label="Send message"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg bg-primary p-2 text-white hover:bg-primary-hover transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            Agent reasoning loop and interactive streaming tool execution unlock in Phase 5.
          </p>
        </div>
      </div>
    </div>
  );
}
