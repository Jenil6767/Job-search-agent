'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  GitBranch,
  Bot,
  FileText,
  User,
  FileCheck,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Job Discovery', href: '/jobs', icon: Briefcase, badge: 'Active' },
  { name: 'Workflows', href: '/workflows', icon: GitBranch },
  { name: 'AI Pilot Agent', href: '/agent', icon: Bot, isAi: true },
  { name: 'Applications', href: '/applications', icon: FileCheck },
  { name: 'Resume & RAG', href: '/resume', icon: FileText },
  { name: 'Candidate Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-[#0B0F19]/90 backdrop-blur-xl flex flex-col justify-between">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-border">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-accent-cyan flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
              AI JobPilot
            </span>
            <span className="block text-[10px] font-semibold text-primary-light uppercase tracking-wider">
              Autonomous Hub
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Core Platform
          </div>

          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/25 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-surface-elevated/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : item.isAi ? 'text-accent-cyan' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20">
                    {item.badge}
                  </span>
                )}
                {item.isAi && !isActive && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Engine Status Footer */}
      <div className="p-4 border-t border-border">
        <div className="p-3 rounded-xl bg-surface border border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-emerald"></span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Autonomous Workers</p>
              <p className="text-[10px] text-slate-400">BullMQ + Redis Active</p>
            </div>
          </div>
          <Zap className="h-4 w-4 text-accent-amber" />
        </div>
      </div>
    </aside>
  );
}
