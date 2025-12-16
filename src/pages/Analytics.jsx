import React, { useState, useEffect } from 'react';
import { safeGet } from '@/components/api/apiClient';
import { 
  TrendingUp,
  RefreshCw,
  Download,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import AreaChartCard from '@/components/charts/AreaChartCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Analytics() {
  const [predictions, setPredictions] = useState(null);
  const [trends, setTrends] = useState([]);
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAnalytics = async () => {
    setLoading(true);
    setError('');
    
    const [p, t] = await Promise.all([
      safeGet('/analytics/predictions', { range: timeRange }),
      safeGet('/analytics/trends', { range: timeRange })
    ]);

    if (p.ok) setPredictions(p.data);
    if (t.ok) setTrends(t.data.trends || []);
    if (!p.ok || !t.ok) setError('Failed to load some analytics');

    setLoading(false);
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const chartData = trends.map(t => ({
    name: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    actual: t.actual,
    predicted: t.predicted
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Predictive Analytics</h1>
          <p className="text-slate-500 mt-1">AI-powered insights and forecasting</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadAnalytics} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Predictions Summary */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : predictions && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-8 h-8" />
              <div>
                <p className="text-blue-100 text-sm">Predicted Volume</p>
                <p className="text-3xl font-bold">{predictions.predicted_volume?.toLocaleString() || '—'}</p>
              </div>
            </div>
            <p className="text-sm text-blue-100">Next 7 days</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-8 h-8" />
              <div>
                <p className="text-emerald-100 text-sm">Growth Rate</p>
                <p className="text-3xl font-bold">
                  {predictions.growth_rate ? `${(predictions.growth_rate * 100).toFixed(1)}%` : '—'}
                </p>
              </div>
            </div>
            <p className="text-sm text-emerald-100">Month over month</p>
          </div>

          <div className="bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-8 h-8" />
              <div>
                <p className="text-violet-100 text-sm">Confidence Score</p>
                <p className="text-3xl font-bold">
                  {predictions.confidence ? `${Math.round(predictions.confidence * 100)}%` : '—'}
                </p>
              </div>
            </div>
            <p className="text-sm text-violet-100">Model accuracy</p>
          </div>
        </div>
      )}

      {/* Trends Chart */}
      {!loading && chartData.length > 0 && (
        <AreaChartCard
          title="Actual vs Predicted Trends"
          subtitle="Historical data and AI forecasting"
          data={chartData}
          color="#3b82f6"
        />
      )}

      {/* Insights */}
      {!loading && predictions?.insights && (
        <div className="bg-white rounded-xl border border-slate-200/60 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">AI Insights</h2>
          <div className="space-y-3">
            {predictions.insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <Brain className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}