import React, { useState, useEffect } from 'react';
import { safeGet } from '@/components/api/apiClient';
import { 
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import AreaChartCard from '@/components/charts/AreaChartCard';

export default function AnomalyDetection() {
  const [anomalies, setAnomalies] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAnomalies = async () => {
    setLoading(true);
    setError('');
    
    const [a, m] = await Promise.all([
      safeGet('/anomalies'),
      safeGet('/anomalies/metrics')
    ]);

    if (a.ok) setAnomalies(a.data.anomalies || []);
    if (m.ok) setMetrics(m.data);
    if (!a.ok || !m.ok) setError('Failed to load anomaly data');

    setLoading(false);
  };

  useEffect(() => {
    loadAnomalies();
  }, []);

  const stats = {
    total: anomalies.length,
    critical: anomalies.filter(a => a.severity === 'critical').length,
    resolved: anomalies.filter(a => a.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Anomaly Detection</h1>
          <p className="text-slate-500 mt-1">AI-powered system monitoring and alerts</p>
        </div>
        <Button onClick={loadAnomalies} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-slate-200/60 p-6">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-sm text-slate-500">Total Detected</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/60 p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-rose-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.critical}</p>
                <p className="text-sm text-slate-500">Critical</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/60 p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.resolved}</p>
                <p className="text-sm text-slate-500">Resolved</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/60 p-6">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-violet-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {metrics?.detection_rate ? `${Math.round(metrics.detection_rate * 100)}%` : '—'}
                </p>
                <p className="text-sm text-slate-500">Detection Rate</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Anomalies List */}
      {loading ? (
        <div className="space-y-3">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : anomalies.length > 0 ? (
        <div className="space-y-3">
          {anomalies.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-slate-200/60 p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  a.severity === 'critical' ? 'bg-rose-50 text-rose-600' :
                  a.severity === 'high' ? 'bg-orange-50 text-orange-600' :
                  'bg-amber-50 text-amber-600'
                }`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-900">{a.metric_name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{a.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      a.severity === 'critical' ? 'bg-rose-50 text-rose-700' :
                      a.severity === 'high' ? 'bg-orange-50 text-orange-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {a.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Expected:</span>
                      <span className="font-medium text-slate-900">{a.expected_value}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Actual:</span>
                      <span className="font-medium text-rose-600">{a.actual_value}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Deviation:</span>
                      <span className="font-medium text-slate-900">
                        {a.deviation ? `${(a.deviation * 100).toFixed(1)}%` : '—'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    Detected: {new Date(a.detected_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <Activity className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No anomalies detected</h3>
          <p className="text-slate-500">All systems operating normally</p>
        </div>
      )}
    </div>
  );
}