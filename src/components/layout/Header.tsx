'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useNavigation } from '@/context/NavigationContext';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Search, FolderKanban, Bell, Shield, Terminal, Zap, Play } from 'lucide-react';

export function Header() {
  const { activeProject, projects, setActiveProject, alerts } = useApp();
  const { activeView, setIsCommandPaletteOpen, navigateToPipelineBuilder } = useNavigation();

  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;

  return (
    <header className="h-16 bg-slate-900/90 border-b border-slate-800/90 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      {/* Left: Project Selector & Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-indigo-400" />
          <select
            value={activeProject?.id ?? ''}
            onChange={e => {
              const selected = projects.find(p => p.id === e.target.value);
              if (selected) setActiveProject(selected);
            }}
            className="bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {projects.map(proj => (
              <option key={proj.id} value={proj.id}>
                {proj.name} ({proj.environment})
              </option>
            ))}
          </select>
        </div>

        {activeProject && (
          <Badge variant={activeProject.environment === 'Production' ? 'success' : 'warning'}>
            {activeProject.environment}
          </Badge>
        )}

        <div className="hidden lg:flex items-center gap-2 border-l border-slate-800 pl-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300 font-medium">Local Engine: Active</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">IndexedDB Persisted</span>
        </div>
      </div>

      {/* Center: Command Palette Trigger */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-1.5 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-300 transition-all cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            Search pipelines, datasets, schemas, runs...
          </span>
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700 rounded">
            Cmd + K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Actions & Notifications */}
      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          size="sm"
          icon={<Play className="w-3.5 h-3.5" />}
          onClick={() => navigateToPipelineBuilder()}
        >
          New Pipeline
        </Button>

        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
          title="Alerts"
        >
          <Bell className="w-4 h-4" />
          {activeAlertsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>
      </div>
    </header>
  );
}
