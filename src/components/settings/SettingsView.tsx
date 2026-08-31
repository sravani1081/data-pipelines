'use client';

import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';
import { downloadBackupFile, restoreBackupData, resetToDefaultSeed } from '@/lib/storage/exportImport';
import { Settings, Save, RotateCcw, Upload, ShieldCheck, Database } from 'lucide-react';

export function SettingsView() {
  const { reloadState, addAuditLog } = useApp();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleDownloadBackup = async () => {
    await downloadBackupFile();
    setStatusMessage('Backup file downloaded successfully!');
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async event => {
      try {
        const json = JSON.parse(event.target?.result as string);
        await restoreBackupData(json);
        await reloadState();
        await addAuditLog('Backup restored', 'project', 'all', 'Restored state from local JSON backup');
        setStatusMessage('State restored successfully from backup!');
      } catch (err: any) {
        setStatusMessage(`Restore Failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset IndexedDB to default seed data?')) {
      await resetToDefaultSeed();
      await reloadState();
      setStatusMessage('IndexedDB reset to default enterprise seed datasets.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-400" />
            Platform Settings & Data Governance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Local storage backup, full database restoration, and seed data initialization
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <CardHeader title="Backup & Restore" subtitle="Export or import complete local platform state" />

          <div className="space-y-3">
            <Button variant="primary" className="w-full" icon={<Save className="w-4 h-4" />} onClick={handleDownloadBackup}>
              Download Full Backup (JSON)
            </Button>

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleRestoreFile}
                className="hidden"
                id="restore-upload"
              />
              <label htmlFor="restore-upload">
                <Button variant="outline" className="w-full" icon={<Upload className="w-4 h-4" />} type="button" onClick={() => document.getElementById('restore-upload')?.click()}>
                  Restore from JSON File
                </Button>
              </label>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <CardHeader title="Reset State" subtitle="Reset local IndexedDB to enterprise seed state" />

          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Resetting will erase custom draft pipelines and reload pre-populated telemetry datasets, schemas, and default templates.
            </p>

            <Button variant="danger" className="w-full" icon={<RotateCcw className="w-4 h-4" />} onClick={handleReset}>
              Reset to Default Seed Data
            </Button>
          </div>
        </Card>
      </div>

      {statusMessage && (
        <div className="p-4 bg-indigo-950/80 border border-indigo-800 rounded-xl text-xs text-indigo-200 font-mono">
          {statusMessage}
        </div>
      )}
    </div>
  );
}
