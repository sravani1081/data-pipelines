'use client';

import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Tabs } from '@/components/common/Tabs';
import { useApp } from '@/context/AppContext';
import { useNavigation } from '@/context/NavigationContext';
import { profileDataset } from '@/lib/quality/evaluator';
import { exportToCSV, exportToJSON } from '@/lib/utils/helpers';
import { Search, Filter, ArrowUpDown, Eye, Download, BarChart2, ShieldCheck, Database, Layers } from 'lucide-react';
import { formatBytes } from '@/lib/utils/formatters';

export function ExplorerView() {
  const { datasets, activeProject } = useApp();
  const { selectedDatasetId, setSelectedDatasetId } = useNavigation();

  const currentDataset = datasets.find(d => d.id === selectedDatasetId) || datasets[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [activeTab, setActiveTab] = useState<'table' | 'profiling'>('table');

  if (!currentDataset) {
    return (
      <div className="p-8 text-center border border-slate-800 rounded-2xl bg-slate-900/60 max-w-xl mx-auto my-12">
        <h3 className="text-lg font-semibold text-slate-200">No Dataset Selected</h3>
      </div>
    );
  }

  const profile = profileDataset(currentDataset.records);
  const headers = currentDataset.records.length > 0 ? Object.keys(currentDataset.records[0]) : [];

  // Filter & Sort
  let filteredRows = currentDataset.records.filter(row => {
    if (!searchQuery) return true;
    return Object.values(row).some(val => String(val ?? '').toLowerCase().includes(searchQuery.toLowerCase()));
  });

  if (sortField) {
    filteredRows = [...filteredRows].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      const dir = sortDirection === 'desc' ? -1 : 1;
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      return String(valA).localeCompare(String(valB)) * dir;
    });
  }

  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Dataset Picker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Database className="w-6 h-6 text-emerald-400" />
              {currentDataset.name}
            </h1>
            <select
              value={currentDataset.id}
              onChange={e => setSelectedDatasetId(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
            >
              {datasets.map(d => (
                <option key={d.id} value={d.id}>
                  Switch: {d.name}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-slate-400 mt-1">{currentDataset.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <Tabs
            tabs={[
              { id: 'table', label: 'Data Table', icon: <Layers className="w-4 h-4" /> },
              { id: 'profiling', label: 'Data Profiling', icon: <BarChart2 className="w-4 h-4" /> },
            ]}
            activeTab={activeTab}
            onChange={tab => setActiveTab(tab as any)}
          />
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={() => exportToCSV(`${currentDataset.name}.csv`, currentDataset.records)}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {activeTab === 'table' ? (
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search dataset rows..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Showing {paginatedRows.length} of {filteredRows.length} rows ({formatBytes(currentDataset.sizeBytes)})
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px]">
                <tr>
                  {headers.map(h => (
                    <th key={h} className="py-2.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort(h)}>
                      <div className="flex items-center gap-1.5">
                        <span>{h}</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-500" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                {paginatedRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    {headers.map(h => (
                      <td key={h} className="py-2 px-3 truncate max-w-[200px]">
                        {row[h] === null || row[h] === undefined ? (
                          <span className="text-slate-600 italic">null</span>
                        ) : typeof row[h] === 'boolean' ? (
                          <Badge variant={row[h] ? 'success' : 'neutral'} size="sm">
                            {String(row[h])}
                          </Badge>
                        ) : (
                          String(row[h])
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(prev => Math.max(1, prev - 1))}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}>
                Next
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        /* Data Profiling View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="col-span-full">
            <CardHeader title="Data Quality & Profiling Summary" subtitle="Field completeness, unique counts, and value distribution" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400">Total Rows</p>
                <p className="text-xl font-bold text-slate-100 font-mono mt-1">{profile.totalRecords.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400">Columns / Fields</p>
                <p className="text-xl font-bold text-slate-100 font-mono mt-1">{profile.totalFields}</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400">Quality Score</p>
                <p className="text-xl font-bold text-emerald-400 font-mono mt-1">{currentDataset.qualityScore}%</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400">Duplicate Rows</p>
                <p className="text-xl font-bold text-amber-400 font-mono mt-1">{profile.duplicateRecordCount}</p>
              </div>
            </div>

            {/* Field level stats */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Field Name</th>
                    <th className="py-2.5 px-3">Null %</th>
                    <th className="py-2.5 px-3">Unique Values</th>
                    <th className="py-2.5 px-3">Min</th>
                    <th className="py-2.5 px-3">Max</th>
                    <th className="py-2.5 px-3">Average</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                  {headers.map(f => {
                    const stats = profile.numericStatsByField[f];
                    return (
                      <tr key={f} className="hover:bg-slate-800/40">
                        <td className="py-2 px-3 font-semibold text-slate-100">{f}</td>
                        <td className="py-2 px-3 text-amber-400">{profile.nullPercentByField[f]}%</td>
                        <td className="py-2 px-3 text-sky-400">{profile.uniqueCountByField[f]}</td>
                        <td className="py-2 px-3 text-slate-400">{stats ? stats.min : 'N/A'}</td>
                        <td className="py-2 px-3 text-slate-400">{stats ? stats.max : 'N/A'}</td>
                        <td className="py-2 px-3 text-slate-400">{stats ? stats.avg : 'N/A'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
