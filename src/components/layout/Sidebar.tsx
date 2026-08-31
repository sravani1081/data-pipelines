'use client';

import React from 'react';
import { useNavigation, ActiveModuleView } from '@/context/NavigationContext';
import {
  LayoutDashboard,
  FolderKanban,
  Database,
  Download,
  GitMerge,
  Workflow,
  PlaySquare,
  Layers,
  Search,
  FileCode2,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Gamepad2,
  Radio,
  Clock,
  GitBranch,
  BookOpen,
  Terminal,
  BarChart3,
  FileSpreadsheet,
  Activity,
  AlertTriangle,
  FileText,
  DollarSign,
  BrainCircuit,
  Save,
  Users,
  CheckSquare,
  History,
  HelpCircle,
  Settings,
} from 'lucide-react';

interface NavGroup {
  title: string;
  items: { id: ActiveModuleView; label: string; icon: React.ReactNode }[];
}

export function Sidebar() {
  const { activeView, setActiveView } = useNavigation();

  const navGroups: NavGroup[] = [
    {
      title: 'CORE PLATFORM',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
        { id: 'data-sources', label: 'Data Sources', icon: <Database className="w-4 h-4" /> },
        { id: 'ingestion', label: 'Data Ingestion', icon: <Download className="w-4 h-4" /> },
      ],
    },
    {
      title: 'ORCHESTRATION',
      items: [
        { id: 'pipelines', label: 'Pipelines', icon: <GitMerge className="w-4 h-4" /> },
        { id: 'pipeline-builder', label: 'Pipeline Builder', icon: <Workflow className="w-4 h-4" /> },
        { id: 'pipeline-runs', label: 'Pipeline Runs', icon: <PlaySquare className="w-4 h-4" /> },
        { id: 'transformations', label: 'Transformations', icon: <Cpu className="w-4 h-4" /> },
        { id: 'scheduling', label: 'Scheduling', icon: <Clock className="w-4 h-4" /> },
      ],
    },
    {
      title: 'DATASETS & QUALITY',
      items: [
        { id: 'datasets', label: 'Datasets Catalog', icon: <Layers className="w-4 h-4" /> },
        { id: 'data-explorer', label: 'Data Explorer', icon: <Search className="w-4 h-4" /> },
        { id: 'schemas', label: 'Schemas & Registry', icon: <FileCode2 className="w-4 h-4" /> },
        { id: 'data-quality', label: 'Data Quality', icon: <CheckCircle2 className="w-4 h-4" /> },
        { id: 'data-contracts', label: 'Data Contracts', icon: <ShieldCheck className="w-4 h-4" /> },
        { id: 'data-lineage', label: 'Data Lineage', icon: <GitBranch className="w-4 h-4" /> },
      ],
    },
    {
      title: 'GAME DATA & ANALYTICS',
      items: [
        { id: 'game-events', label: 'Game Events & Telemetry', icon: <Gamepad2 className="w-4 h-4" /> },
        { id: 'streaming-simulation', label: 'Streaming Simulation', icon: <Radio className="w-4 h-4" /> },
        { id: 'sql-workspace', label: 'SQL Workspace', icon: <Terminal className="w-4 h-4" /> },
        { id: 'query-builder', label: 'Query Builder', icon: <FileSpreadsheet className="w-4 h-4" /> },
        { id: 'feature-engineering', label: 'Feature Engineering', icon: <BrainCircuit className="w-4 h-4" /> },
      ],
    },
    {
      title: 'OBSERVABILITY',
      items: [
        { id: 'monitoring', label: 'Monitoring & Metrics', icon: <Activity className="w-4 h-4" /> },
        { id: 'logs', label: 'Pipeline Logs', icon: <FileText className="w-4 h-4" /> },
        { id: 'alerts', label: 'Alerts & Incidents', icon: <AlertTriangle className="w-4 h-4" /> },
        { id: 'cost-simulation', label: 'Cost Calculator', icon: <DollarSign className="w-4 h-4" /> },
      ],
    },
    {
      title: 'MANAGEMENT & GOVERNANCE',
      items: [
        { id: 'teams', label: 'Teams & Access', icon: <Users className="w-4 h-4" /> },
        { id: 'tasks', label: 'Task Management', icon: <CheckSquare className="w-4 h-4" /> },
        { id: 'audit-logs', label: 'Audit Logs', icon: <History className="w-4 h-4" /> },
        { id: 'exports-backup', label: 'Export & Backup', icon: <Save className="w-4 h-4" /> },
        { id: 'documentation', label: 'Documentation', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800/90 flex flex-col h-screen sticky top-0 shrink-0 z-40">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
          <Gamepad2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            GameOps <span className="text-indigo-400 font-semibold">AI</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-mono">Data Pipelines v1.0</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <h4 className="px-3 text-[10px] font-bold text-slate-400 tracking-wider">
              {group.title}
            </h4>
            {group.items.map(item => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600/90 text-white shadow-sm shadow-indigo-600/20 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Engine: Synthetic</span>
        <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-[10px]">
          Demo Mode
        </span>
      </div>
    </aside>
  );
}
