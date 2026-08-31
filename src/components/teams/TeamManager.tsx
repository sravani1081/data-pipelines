'use client';

import React from 'react';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { useApp } from '@/context/AppContext';
import { Users, Shield, UserCheck } from 'lucide-react';

export function TeamManager() {
  const { users, teams } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Team & Role Access Control
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage data engineering team members, assigned domain roles, and project ownership permissions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader title="Team Members & Roles" subtitle={`Showing ${users.length} registered team members`} />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Team</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-slate-100 flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                    {user.name}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono">{user.email}</td>
                  <td className="py-3 px-4">
                    <Badge variant="indigo" size="sm">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-medium">
                    {teams.find(t => t.id === user.teamId)?.name || 'Data Platform'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
