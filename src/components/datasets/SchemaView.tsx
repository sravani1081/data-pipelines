'use client';

import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';
import { compareSchemas } from '@/lib/schemas/evolution';
import { FileCode2, History, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export function SchemaView() {
  const { schemas, activeProject } = useApp();
  const [selectedSchemaId, setSelectedSchemaId] = useState<string>(schemas[0]?.id ?? '');

  const currentSchema = schemas.find(s => s.id === selectedSchemaId) || schemas[0];

  if (!currentSchema) {
    return <div className="p-8 text-center text-slate-400">No schema registered yet</div>;
  }

  // Create a synthetic v1 schema to demonstrate diff comparison
  const mockOldSchema = {
    ...currentSchema,
    version: 1,
    fields: currentSchema.fields.slice(0, Math.max(1, currentSchema.fields.length - 2)),
  };

  const diffResult = compareSchemas(mockOldSchema, currentSchema);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileCode2 className="w-6 h-6 text-purple-400" />
            Schema Registry & Evolution
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Schema definition registry, field constraints, version compatibility diffs, and breaking change detection
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={currentSchema.id}
            onChange={e => setSelectedSchemaId(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
          >
            {schemas.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} (v{s.version})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schema Fields Table */}
        <Card className="lg:col-span-2 space-y-4">
          <CardHeader
            title={`${currentSchema.name} (v${currentSchema.version})`}
            subtitle="Registered field definitions and constraints"
            action={
              <Badge
                variant={
                  currentSchema.compatibility === 'Compatible'
                    ? 'success'
                    : currentSchema.compatibility === 'Warning'
                    ? 'warning'
                    : 'danger'
                }
                size="sm"
              >
                {currentSchema.compatibility}
              </Badge>
            }
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Field Name</th>
                  <th className="py-2.5 px-3">Data Type</th>
                  <th className="py-2.5 px-3">Required</th>
                  <th className="py-2.5 px-3">Nullable</th>
                  <th className="py-2.5 px-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                {currentSchema.fields.map((field, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-100">{field.name}</td>
                    <td className="py-2.5 px-3 text-indigo-400">{field.type}</td>
                    <td className="py-2.5 px-3">
                      {field.required ? <span className="text-emerald-400">Yes</span> : <span className="text-slate-500">No</span>}
                    </td>
                    <td className="py-2.5 px-3">
                      {field.nullable ? <span className="text-amber-400">Yes</span> : <span className="text-slate-500">No</span>}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">{field.description || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Evolution Diff Card */}
        <Card className="space-y-4">
          <CardHeader title="Schema Evolution Analyzer" subtitle="Diff comparison v1 vs v2" />

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 space-y-2">
            <div className="flex items-center justify-between font-semibold">
              <span>Compatibility Status</span>
              <Badge variant={diffResult.compatibility === 'Compatible' ? 'success' : 'warning'} size="sm">
                {diffResult.compatibility}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400">{diffResult.summary}</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 tracking-wider">CHANGE HISTORY</h4>
            {currentSchema.changeHistory.map((history, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-200">
                  <span>Version v{history.version}</span>
                  <span className="text-[10px] text-slate-500">{history.changedBy}</span>
                </div>
                <ul className="list-disc list-inside text-slate-400 mt-2 space-y-1 text-[11px]">
                  {history.changes.map((change, cIdx) => (
                    <li key={cIdx}>{change}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
