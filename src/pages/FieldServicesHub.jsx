import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, MapPin, Clock, DollarSign, CheckCircle, AlertCircle, 
  MessageSquare, User, Zap, TrendingUp, Calendar, Navigation
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function FieldServicesHub() {
  const [activeJob, setActiveJob] = useState(null);

  // Fetch all related data
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['dispatch'],
    queryFn: () => base44.entities.Dispatch.filter({}, '-created_date', 50)
  });

  const { data: workflows = [] } = useQuery({
    queryKey: ['workflows'],
    queryFn: () => base44.entities.Workflow.list('-updated_date', 10)
  });

  const { data: metrics = [] } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => base44.entities.Metric.list('-updated_date', 20)
  });

  const getStatusColor = (status) => {
    const colors = {
      'queued': 'bg-slate-100 text-slate-800',
      'en_route': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-slate-100 text-slate-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'bg-blue-50 border-blue-200',
      'medium': 'bg-yellow-50 border-yellow-200',
      'high': 'bg-orange-50 border-orange-200',
      'urgent': 'bg-red-50 border-red-200'
    };
    return colors[priority] || 'bg-slate-50 border-slate-200';
  };

  // Calculate metrics
  const stats = {
    activeJobs: jobs.filter(j => ['en_route', 'in_progress'].includes(j.status)).length,
    completedToday: jobs.filter(j => j.status === 'completed').length,
    avgTimeToCompletion: metrics.find(m => m.name === 'Avg Completion Time')?.value || 45,
    estimatedRevenue: jobs.reduce((sum, j) => sum + (j.estimated_savings || 0), 0),
    workerUtilization: ((jobs.filter(j => j.worker_location).length / jobs.length) * 100).toFixed(0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Field Services Hub</h1>
          <p className="text-slate-500 mt-1">Unified job management, dispatch & revenue tracking</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          New Job
        </Button>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-600" />
              Active Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-slate-500 mt-1">En route or in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Completed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedToday}</div>
            <p className="text-xs text-slate-500 mt-1">Finished jobs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              Avg Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgTimeToCompletion}m</div>
            <p className="text-xs text-slate-500 mt-1">Per job</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Revenue Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(stats.estimatedRevenue)}</div>
            <p className="text-xs text-slate-500 mt-1">From completed jobs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              Worker Util.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.workerUtilization}%</div>
            <p className="text-xs text-slate-500 mt-1">Tracked workers</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">Live Job Board</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="insights">Operations Insights</TabsTrigger>
        </TabsList>

        {/* Live Job Board */}
        <TabsContent value="jobs">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Jobs List */}
            <div className="lg:col-span-2 space-y-3">
              {jobsLoading ? (
                <p className="text-slate-500">Loading jobs...</p>
              ) : jobs.length === 0 ? (
                <Card className="text-center py-12">
                  <p className="text-slate-500">No active jobs</p>
                </Card>
              ) : (
                jobs.map(job => (
                  <Card 
                    key={job.id} 
                    className={`cursor-pointer transition-all border-l-4 ${getPriorityColor(job.priority)} hover:shadow-md`}
                    onClick={() => setActiveJob(job)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-slate-900">{job.job_title}</h3>
                            <Badge className={getStatusColor(job.status)}>
                              {job.status.replace('_', ' ')}
                            </Badge>
                            {job.priority === 'urgent' && (
                              <AlertCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{job.customer_name}</p>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-1 text-slate-600">
                              <User className="w-3 h-3" />
                              <span>{job.worker_name}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-600">
                              <Clock className="w-3 h-3" />
                              <span>{job.estimated_duration}m</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-600">
                              <MapPin className="w-3 h-3" />
                              <span>{job.location?.address || 'TBD'}</span>
                            </div>
                            <div className="flex items-center gap-1 text-emerald-600 font-medium">
                              <DollarSign className="w-3 h-3" />
                              <span>${job.estimated_savings || 0}</span>
                            </div>
                          </div>
                        </div>

                        <Button variant="ghost" size="icon" onClick={() => setActiveJob(job)}>
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Job Detail Panel */}
            <div>
              {activeJob ? (
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle className="text-lg">{activeJob.job_title}</CardTitle>
                    <CardDescription>{activeJob.customer_name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">WORKER</p>
                      <p className="font-semibold">{activeJob.worker_name}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">LOCATION</p>
                      <p className="text-sm">{activeJob.location?.address || 'No address provided'}</p>
                      {activeJob.worker_location && (
                        <p className="text-xs text-slate-500 mt-1">
                          📍 Worker: {activeJob.worker_location.lat.toFixed(2)}, {activeJob.worker_location.lng.toFixed(2)}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-1">DURATION</p>
                        <p className="font-semibold">{activeJob.estimated_duration}m</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-1">REVENUE</p>
                        <p className="font-semibold text-emerald-600">${activeJob.estimated_savings}</p>
                      </div>
                    </div>

                    {activeJob.notes && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-1">NOTES</p>
                        <p className="text-sm text-slate-700">{activeJob.notes}</p>
                      </div>
                    )}

                    <div className="pt-4 border-t space-y-2">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                        <MessageSquare className="w-3 h-3 mr-2" />
                        Chat with Worker
                      </Button>
                      <Button className="w-full" variant="outline" size="sm">
                        <Navigation className="w-3 h-3 mr-2" />
                        Track Live
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="text-center py-12">
                  <p className="text-slate-500 text-sm">Select a job to view details</p>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Timeline View */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Job Timeline</CardTitle>
              <CardDescription>Today's job schedule and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {jobs.map(job => (
                  <div key={job.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{job.job_title}</p>
                      <p className="text-xs text-slate-500">{job.customer_name}</p>
                    </div>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights */}
        <TabsContent value="insights">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Jobs Completed</span>
                    <span className="font-semibold">{stats.completedToday}/15</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full" 
                      style={{ width: `${(stats.completedToday / 15) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">On track for {Math.round((stats.completedToday / 15) * 100)}% of daily target</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Today's Revenue</span>
                    <span className="text-xl font-bold text-emerald-600">${Math.round(stats.estimatedRevenue)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Projected Weekly</span>
                    <span className="font-semibold">${Math.round(stats.estimatedRevenue * 5)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Projected Monthly</span>
                    <span className="font-semibold text-emerald-600">${Math.round(stats.estimatedRevenue * 22)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}