'use client';

import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useApp } from '@/context/AppContext';
import { parseCSVText, generateId } from '@/lib/utils/helpers';
import { Download, Upload, CheckCircle2, FileText, AlertCircle, Database } from 'lucide-react';
import { Dataset } from '@/types';

export function IngestionView() {
  const { activeProject, saveDataset, addAuditLog } = useApp();
  const [fileContent, setFileContent] = useState('');
  const [datasetName, setDatasetName] = useState('Ingested_Game_Events');
  const [ingestionStatus, setIngestionStatus] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<{ headers: string[]; rows: Record<string, any>[] } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      setFileContent(text);
      if (file.name.endsWith('.csv')) {
        const parsed = parseCSVText(text);
        setParsedData(parsed);
      } else if (file.name.endsWith('.json')) {
        try {
          const json = JSON.parse(text);
          const rows = Array.isArray(json) ? json : [json];
          const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
          setParsedData({ headers, rows });
        } catch (err) {
          setIngestionStatus('Invalid JSON document format');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleSaveIngestedDataset = async () => {
    if (!parsedData || parsedData.rows.length === 0 || !activeProject) return;

    const newDs: Dataset = {
      id: generateId('ds'),
      projectId: activeProject.id,
      name: datasetName,
      description: `Ingested ${parsedData.rows.length} records via local parser`,
      ownerId: 'usr_alex',
      recordCount: parsedData.rows.length,
      sizeBytes: JSON.stringify(parsedData.rows).length,
      columnCount: parsedData.headers.length,
      schemaId: 'sch_game_event',
      qualityScore: 98.0,
      freshnessScore: 100.0,
      status: 'Healthy',
      domain: 'Telemetry',
      tags: ['Ingested', 'Local'],
      records: parsedData.rows,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastRefreshedAt: new Date().toISOString(),
    };

    await saveDataset(newDs);
    await addAuditLog('Dataset imported', 'dataset', newDs.id, `Imported ${parsedData.rows.length} records into dataset ${datasetName}`);
    setIngestionStatus(`Successfully created dataset "${datasetName}" with ${parsedData.rows.length} rows!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Download className="w-6 h-6 text-emerald-400" />
            Local Data Ingestion Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Import local CSV/JSON telemetry payloads, auto-detect schemas, and parse records
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload & Controls */}
        <Card className="lg:col-span-1 space-y-4">
          <CardHeader title="Import Payload" subtitle="Upload CSV or JSON files" />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Dataset Name</label>
            <input
              type="text"
              value={datasetName}
              onChange={e => setDatasetName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/80 rounded-xl p-6 text-center transition-colors">
            <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
            <p className="text-xs text-slate-300 font-medium">Select a local CSV or JSON telemetry file</p>
            <p className="text-[10px] text-slate-500 mt-1">Files parsed entirely in browser memory</p>
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="secondary" size="sm" className="mt-4" type="button" onClick={() => document.getElementById('file-upload')?.click()}>
                Browse Local Files
              </Button>
            </label>
          </div>

          {parsedData && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs text-emerald-300">
              <p className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Parsed {parsedData.rows.length} rows & {parsedData.headers.length} columns
              </p>
              <Button variant="primary" size="sm" className="w-full mt-3" onClick={handleSaveIngestedDataset}>
                Commit to Dataset Catalog
              </Button>
            </div>
          )}

          {ingestionStatus && (
            <p className="text-xs text-indigo-400 font-mono bg-indigo-950/40 p-2.5 rounded border border-indigo-800/60">
              {ingestionStatus}
            </p>
          )}
        </Card>

        {/* Parsed Preview Table */}
        <Card className="lg:col-span-2">
          <CardHeader title="Parsed Records Preview" subtitle={parsedData ? `Showing first 10 of ${parsedData.rows.length} rows` : 'Upload a file to preview parsed data'} />

          {parsedData ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px]">
                  <tr>
                    {parsedData.headers.map((header, i) => (
                      <th key={i} className="py-2.5 px-3">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                  {parsedData.rows.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      {parsedData.headers.map((h, i) => (
                        <td key={i} className="py-2 px-3 truncate max-w-[150px]">
                          {String(row[h] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs">
              <FileText className="w-10 h-10 mb-2 opacity-40" />
              <span>No payload file uploaded yet</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
