'use client';

import React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Sparkles,
  FileCheck,
  Calendar,
  ArrowUpRight,
  Play,
  Clock,
  CheckCircle2,
  GitBranch,
  Bot,
  Zap,
} from 'lucide-react';

const kpis = [
  {
    title: 'Discovered Jobs',
    value: '127',
    change: '+18 today',
    trend: 'up',
    icon: Briefcase,
    color: 'from-blue-500/20 to-indigo-500/20 text-indigo-400',
    border: 'border-indigo-500/20',
  },
  {
    title: 'Strong AI Matches',
    value: '18',
    change: '85%+ match score',
    trend: 'up',
    icon: Sparkles,
    color: 'from-cyan-500/20 to-teal-500/20 text-cyan-400',
    border: 'border-cyan-500/20',
  },
  {
    title: 'Active Applications',
    value: '23',
    change: '3 shortlisted',
    trend: 'neutral',
    icon: FileCheck,
    color: 'from-emerald-500/20 to-green-500/20 text-emerald-400',
    border: 'border-emerald-500/20',
  },
  {
    title: 'Interviews Scheduled',
    value: '4',
    change: '2 this week',
    trend: 'up',
    icon: Calendar,
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400',
    border: 'border-amber-500/20',
  },
];

const activeWorkflows = [
  {
    id: 'wf-1',
    name: 'Daily Job Search (Automated)',
    schedule: 'Every weekday at 8:00 AM',
    status: 'Enabled',
    lastRun: 'Today, 8:00 AM',
    matchesFound: 6,
    flow: ['Schedule', 'Search Jobs', 'Deduplicate', 'AI Analyze', 'Match Resume', 'Notify'],
  },
  {
    id: 'wf-2',
    name: 'Remote React & Node.js Search',
    schedule: 'Every 6 hours',
    status: 'Enabled',
    lastRun: '2 hours ago',
    matchesFound: 4,
    flow: ['Schedule', 'Filter Remote', 'Semantic Match', 'Save Job'],
  },
  {
    id: 'wf-3',
    name: 'Senior Full Stack Pipeline',
    schedule: 'Daily at 10:00 AM',
    status: 'Enabled',
    lastRun: 'Yesterday',
    matchesFound: 8,
    flow: ['Job Detected', 'AI Match', 'Generate Cover Letter'],
  },
];

const recentAgentActivity = [
  {
    id: 'act-1',
    tool: 'matchJob',
    description: 'Evaluated "Senior Full Stack Engineer" at Stripe (91% match)',
    time: '12m ago',
    status: 'success',
  },
  {
    id: 'act-2',
    tool: 'searchJobs',
    description: 'Scanned authorized sources for query: "TypeScript Node.js Remote"',
    time: '45m ago',
    status: 'success',
  },
  {
    id: 'act-3',
    tool: 'generateCoverLetter',
    description: 'Drafted tailored cover letter highlighting BullMQ & Redis expertise',
    time: '2h ago',
    status: 'success',
  },
  {
    id: 'act-4',
    tool: 'getCandidateProfile',
    description: 'Retrieved profile skills and preferences for candidate Alex Morgan',
    time: '3h ago',
    status: 'success',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-8 border border-primary/20 bg-gradient-to-r from-surface via-surface-elevated/40 to-indigo-950/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary-light">
              <Zap className="h-3.5 w-3.5 text-accent-cyan" />
              Autonomous Engine v1.0.0 Ready
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              AI JobPilot Mission Control
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Your autonomous job search pipeline is synchronized. Automated BullMQ workers
              and AI agent loops are active to discover, match, and curate high-alignment opportunities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/agent"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover transition-all"
            >
              <Bot className="h-4 w-4" />
              Launch Agent Chat
            </Link>
            <Link
              href="/workflows"
              className="inline-flex items-center gap-2 rounded-xl bg-surface-elevated border border-border px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-surface-elevated/80 transition-all"
            >
              <GitBranch className="h-4 w-4" />
              Manage Workflows
            </Link>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className={`rounded-2xl glass-panel p-5 border ${kpi.border} glass-card-hover flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${kpi.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-3xl font-bold tracking-tight text-white">{kpi.value}</div>
                <div className="mt-1 flex items-center text-xs font-medium text-slate-400">
                  <span className="text-accent-emerald mr-1">{kpi.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Active Workflows & Recent Activity */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Active Workflows */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <GitBranch className="h-5 w-5 text-primary-light" />
              <h2 className="text-lg font-bold text-white">Active Automated Workflows</h2>
            </div>
            <Link
              href="/workflows"
              className="text-xs font-semibold text-primary-light hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
            >
              View All <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {activeWorkflows.map((wf) => (
              <div
                key={wf.id}
                className="rounded-xl glass-panel p-5 border border-border glass-card-hover space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-surface-elevated flex items-center justify-center text-primary-light border border-border">
                      <Play className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{wf.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          {wf.schedule}
                        </span>
                        <span>•</span>
                        <span>Last run: {wf.lastRun}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald" />
                      {wf.status}
                    </span>
                  </div>
                </div>

                {/* Node Execution Steps Visual */}
                <div className="pt-2 border-t border-border/60">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {wf.flow.map((step, idx) => (
                      <React.Fragment key={step}>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface-elevated text-slate-300 border border-border">
                          {step}
                        </span>
                        {idx < wf.flow.length - 1 && (
                          <span className="text-[10px] text-slate-400">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Recent AI Agent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bot className="h-5 w-5 text-accent-cyan" />
              <h2 className="text-lg font-bold text-white">Agent Activity</h2>
            </div>
            <span className="text-xs text-slate-400">Real-time</span>
          </div>

          <div className="rounded-xl glass-panel p-5 border border-border space-y-4">
            {recentAgentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-3 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                <div className="mt-1">
                  <CheckCircle2 className="h-4 w-4 text-accent-cyan" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary-light">
                      tool:{activity.tool}
                    </span>
                    <span className="text-[10px] text-slate-400">{activity.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-normal">{activity.description}</p>
                </div>
              </div>
            ))}

            <Link
              href="/agent"
              className="mt-2 block w-full py-2 text-center text-xs font-semibold text-slate-300 bg-surface-elevated hover:bg-surface-elevated/80 rounded-lg border border-border transition-colors"
            >
              Open Interactive Agent Console
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
