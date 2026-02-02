import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Zap
} from 'lucide-react';

export default function FinancialIntelligence() {
  const [impacts, setImpacts] = useState([]);
  const queryClient = useQueryClient();

  const { data: financialData, isLoading } = useQuery({
    queryKey: ['financialImpacts'],
    queryFn: async () => {
      try {
        return await base44.entities.FinancialImpact.list('-amount_usd', 100);
      } catch {
        return [];
      }
    },
    refetchInterval: 60000
  });

  useEffect(() => {
    if (financialData) {
      setImpacts(financialData);
    }
  }, [financialData]);

  const calculateTotals = () => {
    return {
      total_cost: impacts.reduce((sum, i) => sum + i.amount_usd, 0),
      hourly_rate: impacts.reduce((sum, i) => sum + i.hourly_rate, 0),
      daily_projection: impacts.reduce((sum, i) => sum + i.daily_projection, 0),
      critical_count: impacts.filter(i => i.severity === 'critical').length,
      active_count: impacts.filter(i => i.status === 'active').length
    };
  };

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('calculateFinancialImpact', {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialImpacts'] });
    }
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'high':
        return 'bg-orange-50 border-orange-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  const getSeverityBadge = (severity) => {
    const styles = {
      critical: 'bg-red-100 text-red-800 border-red-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-green-100 text-green-800 border-green-300'
    };
    return styles[severity] || styles.low;
  };

  const totals = calculateTotals();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Loading financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-red-600" />
              Current Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              ${totals.total_cost.toFixed(2)}
            </div>
            <p className="text-xs text-slate-600 mt-1">{totals.active_count} active issues</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              Hourly Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              ${totals.hourly_rate.toFixed(0)}/hr
            </div>
            <p className="text-xs text-slate-600 mt-1">Ongoing cost</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-yellow-600" />
              Daily Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              ${totals.daily_projection.toFixed(0)}
            </div>
            <p className="text-xs text-slate-600 mt-1">If trend continues</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Critical Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{totals.critical_count}</div>
            <p className="text-xs text-slate-600 mt-1">Require immediate action</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={() => analyzeMutation.mutate()}
          disabled={analyzeMutation.isPending}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Zap className={`w-4 h-4 ${analyzeMutation.isPending ? 'animate-spin' : ''}`} />
          Analyze Impact
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Financial Impacts */}
      <div className="space-y-4">
        {impacts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <DollarSign className="w-12 h-12 text-slate-200 mb-3" />
              <p className="text-slate-500">No financial impacts recorded</p>
            </CardContent>
          </Card>
        ) : (
          impacts.map((impact) => (
            <Card
              key={impact.id}
              className={`border-2 ${getSeverityColor(impact.severity)}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base capitalize">
                      {impact.entity_type} - {impact.impact_type.replace(/_/g, ' ')}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {impact.description}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={getSeverityBadge(impact.severity)}
                  >
                    {impact.severity.charAt(0).toUpperCase() + impact.severity.slice(1)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Financial Breakdown */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-600 mb-1">Current Cost</p>
                    <p className="text-xl font-bold text-red-600">
                      ${impact.amount_usd.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-600 mb-1">Hourly Rate</p>
                    <p className="text-xl font-bold text-orange-600">
                      ${impact.hourly_rate.toFixed(0)}/hr
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-600 mb-1">Daily Impact</p>
                    <p className="text-xl font-bold text-yellow-600">
                      ${impact.daily_projection.toFixed(0)}/day
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    {impact.status === 'resolved' ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700 font-medium">Resolved</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-yellow-700 font-medium">Active</span>
                      </>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}