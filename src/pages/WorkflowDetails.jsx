import React, { useState, useEffect } from 'react';
import { safeGet, safePost } from '@/components/api/apiClient';
import { 
  Play,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function WorkflowDetails() {
  const [workflow, setWorkflow] = useState(null);
  const [runs, setRuns] = useState([]);
  const [selectedRun, setSelectedRun] = useState(null);
  const [runDetails, setRunDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const urlParams = new URLSearchParams(window.location.search);
  const workflowId = urlParams.get('id');

  const loadData = async () => {
    if (!workflowId) {
      setError('No workflow ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const [wf, r] = await Promise.all([
      safeGet(`/workflows/${workflowId}`),
      safeGet(`/workflows/${workflowId}/runs`)
    ]);

    if (!wf.ok) {
      setError(`Failed to load workflow: ${wf.error}`);
    } else {
      setWorkflow(wf.data);
    }

    if (r.ok) {
      setRuns(r.data.runs || []);
    }

    setLoading(false);
  };

  const loadRunDetails = async (runId) => {
    const r = await safeGet(`/runs/${runId}`);
    if (r.ok) {
      setRunDetails(r.data);
      setSelectedRun(runId);
    } else {
      toast.error(`Failed to load run details: ${r.error}`);
    }
  };

  const runNow = async () => {
    const r = await safePost(`/workflows/${workflowId}/run`, { input: {} });
    if (!r.ok) {
      toast.error(`Failed to run workflow: ${r.error}`);
    } else {
      toast.success(`Queued run ${r.data.runId}`);
      await loadData();
    }
  };

  useEffect(() => {
    loadData();
  }, [workflowId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-rose-500" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      {loading ? (
        <Skeleton className="h-32 rounded-xl" />
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      ) : workflow ? (
        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{workflow.name}</h1>
              <p className="text-slate-600 mb-4">{workflow.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium ${
                  workflow.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    workflow.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                  }`} />
                  {workflow.status}
                </span>
                <span className="text-slate-500">
                  Created: {new Date(workflow.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadData} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={runNow} className="bg-emerald-600 hover:bg-emerald-700">
                <Play className="w-4 h-4 mr-2" />
                Run Now
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Runs List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Latest Runs</h2>
            </div>
            {loading ? (
              <div className="p-4 space-y-2">
                {Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : runs.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {runs.map(run => (
                  <button
                    key={run.id}
                    onClick={() => loadRunDetails(run.id)}
                    className={`w-full text-left px-6 py-4 hover:bg-slate-50 transition-colors ${
                      selectedRun === run.id ? 'bg-slate-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(run.status)}
                        <div>
                          <p className="font-medium text-slate-900">Run #{run.id}</p>
                          <p className="text-sm text-slate-500">
                            {new Date(run.startedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">
                          {run.durationMs ? `${Math.round(run.durationMs / 1000)}s` : '—'}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">{run.status}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500">
                No runs yet
              </div>
            )}
          </div>
        </div>

        {/* Run Details */}
        <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Run Details</h2>
          </div>
          {runDetails ? (
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Run ID</p>
                  <p className="text-slate-900">{runDetails.run.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Status</p>
                  <p className="capitalize text-slate-900">{runDetails.run.status}</p>
                </div>
                {runDetails.steps && runDetails.steps.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-3">Steps</p>
                    <div className="space-y-2">
                      {runDetails.steps.map(step => (
                        <div key={step.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(step.status)}
                            <span className="text-sm text-slate-900">{step.name}</span>
                          </div>
                          <span className="text-xs text-slate-500">
                            {step.durationMs ? `${Math.round(step.durationMs / 1000)}s` : '—'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              Select a run to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}