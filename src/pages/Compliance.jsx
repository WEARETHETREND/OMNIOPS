import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Download,
  Plus,
  FileText,
  Calendar,
  User,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const frameworks = [
  { id: 'SOC2', name: 'SOC 2 Type II', icon: Shield, color: 'from-blue-500 to-indigo-600' },
  { id: 'GDPR', name: 'GDPR', icon: Shield, color: 'from-emerald-500 to-teal-600' },
  { id: 'HIPAA', name: 'HIPAA', icon: Shield, color: 'from-rose-500 to-pink-600' },
  { id: 'ISO27001', name: 'ISO 27001', icon: Shield, color: 'from-violet-500 to-purple-600' },
  { id: 'PCI-DSS', name: 'PCI-DSS', icon: Shield, color: 'from-amber-500 to-orange-600' }
];

const statusConfig = {
  compliant: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Compliant' },
  non_compliant: { icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50', label: 'Non-Compliant' },
  partial: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Partial' },
  pending_review: { icon: Clock, color: 'text-slate-500', bg: 'bg-slate-100', label: 'Pending Review' },
  not_applicable: { icon: FileText, color: 'text-slate-400', bg: 'bg-slate-50', label: 'N/A' }
};

export default function Compliance() {
  const [selectedFramework, setSelectedFramework] = useState('SOC2');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: controls = [], isLoading } = useQuery({
    queryKey: ['compliance-controls'],
    queryFn: () => base44.entities.ComplianceControl.list('-created_date')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ComplianceControl.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['compliance-controls'] })
  });

  const frameworkControls = controls.filter(c => c.framework === selectedFramework);
  const filteredControls = frameworkControls.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.control_id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getComplianceScore = (framework) => {
    const fControls = controls.filter(c => c.framework === framework);
    if (fControls.length === 0) return 0;
    const compliant = fControls.filter(c => c.status === 'compliant').length;
    return Math.round((compliant / fControls.length) * 100);
  };

  const stats = {
    total: frameworkControls.length,
    compliant: frameworkControls.filter(c => c.status === 'compliant').length,
    nonCompliant: frameworkControls.filter(c => c.status === 'non_compliant').length,
    partial: frameworkControls.filter(c => c.status === 'partial').length,
    pending: frameworkControls.filter(c => c.status === 'pending_review').length
  };

  const overallScore = stats.total > 0 ? Math.round((stats.compliant / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Framework Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {frameworks.map(fw => {
          const score = getComplianceScore(fw.id);
          const isSelected = selectedFramework === fw.id;
          return (
            <button
              key={fw.id}
              onClick={() => setSelectedFramework(fw.id)}
              className={cn(
                "p-4 rounded-xl border-2 transition-all text-left",
                isSelected 
                  ? "border-slate-900 bg-slate-50" 
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3", fw.color)}>
                <fw.icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-slate-900">{fw.name}</p>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={score} className="h-1.5 flex-1" />
                <span className="text-sm font-medium text-slate-600">{score}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Controls', value: stats.total, color: 'bg-slate-900' },
          { label: 'Compliant', value: stats.compliant, color: 'bg-emerald-500' },
          { label: 'Non-Compliant', value: stats.nonCompliant, color: 'bg-rose-500' },
          { label: 'Partial', value: stats.partial, color: 'bg-amber-500' },
          { label: 'Pending Review', value: stats.pending, color: 'bg-slate-400' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200/60 p-4">
            <div className="flex items-center gap-3">
              <div className={cn("w-2 h-8 rounded-full", stat.color)} />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Score Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {frameworks.find(f => f.id === selectedFramework)?.name} Compliance Score
              </h3>
              <p className="text-slate-500 mt-1">Based on {stats.total} controls assessed</p>
            </div>
            <div className="text-right">
              <p className={cn(
                "text-4xl font-bold",
                overallScore >= 80 ? "text-emerald-500" : 
                overallScore >= 60 ? "text-amber-500" : "text-rose-500"
              )}>
                {overallScore}%
              </p>
              <p className="text-sm text-slate-500">Overall Score</p>
            </div>
          </div>
          <Progress value={overallScore} className="h-3 mt-4" />
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-1 gap-3 w-full md:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search controls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="access_control">Access Control</SelectItem>
              <SelectItem value="data_protection">Data Protection</SelectItem>
              <SelectItem value="encryption">Encryption</SelectItem>
              <SelectItem value="monitoring">Monitoring</SelectItem>
              <SelectItem value="incident_response">Incident Response</SelectItem>
              <SelectItem value="privacy">Privacy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Controls List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : filteredControls.length > 0 ? (
        <div className="space-y-3">
          {filteredControls.map(control => {
            const status = statusConfig[control.status] || statusConfig.pending_review;
            const StatusIcon = status.icon;
            return (
              <div 
                key={control.id}
                className="bg-white rounded-xl border border-slate-200/60 p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", status.bg)}>
                    <StatusIcon className={cn("w-5 h-5", status.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-slate-500">{control.control_id}</span>
                          <h3 className="font-semibold text-slate-900">{control.name}</h3>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{control.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                          {control.owner && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" /> {control.owner}
                            </span>
                          )}
                          {control.next_review && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> Review: {new Date(control.next_review).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn("capitalize", status.bg, status.color)}>
                          {status.label}
                        </Badge>
                        <Select
                          value={control.status}
                          onValueChange={(value) => updateMutation.mutate({ id: control.id, data: { status: value } })}
                        >
                          <SelectTrigger className="w-36 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="compliant">Compliant</SelectItem>
                            <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                            <SelectItem value="pending_review">Pending Review</SelectItem>
                            <SelectItem value="not_applicable">N/A</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <Shield className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No controls found</h3>
          <p className="text-slate-500">
            {searchQuery || categoryFilter !== 'all' ? 'Try adjusting your filters' : 'Add compliance controls to track'}
          </p>
        </div>
      )}
    </div>
  );
}