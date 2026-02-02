import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Users, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function ContractHunter() {
  const { data: contracts = [] } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => base44.entities.Contract.list(),
  });

  const { data: workers = [] } = useQuery({
    queryKey: ['workers'],
    queryFn: () => base44.entities.Worker.list(),
  });

  const totalContractValue = contracts.reduce((sum, c) => sum + (c.contract_value || 0), 0);
  const wonContracts = contracts.filter(c => c.status === 'won').length;
  const availableWorkers = workers.filter(w => w.availability === 'available').length;

  const statusColors = {
    lead: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    bid_submitted: 'bg-purple-100 text-purple-800',
    won: 'bg-green-100 text-green-800',
    in_progress: 'bg-cyan-100 text-cyan-800',
    completed: 'bg-slate-100 text-slate-800',
    lost: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <FileText className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contracts.length}</div>
            <p className="text-xs text-slate-500 mt-1">{wonContracts} contracts won</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalContractValue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-slate-500 mt-1">All contracts combined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Workers</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableWorkers}</div>
            <p className="text-xs text-slate-500 mt-1">of {workers.length} total</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Contracts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Contracts</CardTitle>
          <Link to={createPageUrl('ContractList')}>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Contract
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {contracts.length === 0 ? (
            <p className="text-slate-500">No contracts added yet</p>
          ) : (
            <div className="space-y-3">
              {contracts.slice(0, 5).map(contract => (
                <div key={contract.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{contract.title}</h3>
                    <p className="text-sm text-slate-500">{contract.company}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge className={statusColors[contract.status]}>
                        {contract.status.replace('_', ' ')}
                      </Badge>
                      {contract.contract_value && (
                        <Badge variant="outline">
                          ${contract.contract_value.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Worker Pool */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Worker Pool</CardTitle>
          <Link to={createPageUrl('WorkerList')}>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Worker
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {workers.length === 0 ? (
            <p className="text-slate-500">No workers in your roster yet</p>
          ) : (
            <div className="space-y-3">
              {workers.slice(0, 5).map(worker => (
                <div key={worker.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{worker.name}</h3>
                    <p className="text-sm text-slate-500">{worker.specialty}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">${worker.hourly_rate}/hr</Badge>
                      <Badge className={worker.availability === 'available' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}>
                        {worker.availability}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}