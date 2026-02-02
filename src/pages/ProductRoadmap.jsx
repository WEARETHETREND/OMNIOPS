import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Smartphone,
  Map,
  TrendingUp,
  Zap,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  GitBranch,
  Users,
  Gauge
} from 'lucide-react';

const roadmapTasks = [
  {
    id: 1,
    title: 'Native Mobile App for Field Workers',
    description: 'iOS/Android native application with geolocation, offline support, and voice-to-notes for field teams.',
    impact: 'Push to 9/10',
    priority: 'critical',
    status: 'planned',
    timeline: 'Q2 2026',
    estimatedDays: 60,
    details: [
      'Real-time GPS tracking and navigation',
      'Offline-first architecture with local caching',
      'Voice-to-text job notes and updates',
      'Push notifications for job assignments',
      'Photo capture and document upload',
      'Battery-optimized background sync',
      'Biometric authentication'
    ],
    businessValue: 'Increases field team efficiency by 30%, enables better dispatch visibility, reduces communication delays'
  },
  {
    id: 2,
    title: 'Advanced Route Optimization Engine',
    description: 'AI-powered scheduling that optimizes routes, reduces travel time, and maximizes daily throughput.',
    impact: 'Push to 9/10',
    priority: 'critical',
    status: 'planned',
    timeline: 'Q2 2026',
    estimatedDays: 40,
    details: [
      'Traveling Salesman Problem (TSP) solver',
      'Real-time traffic integration',
      'Time window constraints handling',
      'Multi-vehicle fleet optimization',
      'Skill-based job-to-worker matching',
      'Dynamic rerouting on job changes',
      'Predictive ETA with ML'
    ],
    businessValue: 'Reduces travel time by 20-25%, enables 5-7 more jobs/day per worker, saves $40K+/month in fuel'
  },
  {
    id: 3,
    title: 'Customer Success & Retention Analytics',
    description: 'Predictive churn modeling, upsell opportunities, health scores, and retention automation.',
    impact: 'Push to 9/10',
    priority: 'high',
    status: 'planned',
    timeline: 'Q3 2026',
    estimatedDays: 35,
    details: [
      'Customer health score dashboard',
      'Churn prediction ML model',
      'Upsell/cross-sell recommendations',
      'Engagement tracking (logins, feature usage)',
      'Cohort analysis and retention curves',
      'Automated win-back campaigns',
      'NPS tracking and sentiment analysis'
    ],
    businessValue: 'Reduces churn by 15%, increases customer lifetime value, improves SaaS metrics'
  },
  {
    id: 4,
    title: 'Advanced Workflow Automation Rules',
    description: 'Conditional logic, multi-step automations, error handling, and sophisticated workflow orchestration.',
    impact: 'Push to 9/10',
    priority: 'high',
    status: 'planned',
    timeline: 'Q3 2026',
    estimatedDays: 45,
    details: [
      'If/Then/Else conditional branching',
      'Loop and parallel execution support',
      'Custom script execution (JavaScript)',
      'Error handling and retry logic',
      'Webhook triggers and responses',
      'Variable management and templating',
      'Workflow versioning and rollback',
      'Performance monitoring and logging'
    ],
    businessValue: 'Enables 80% of custom use cases without code, reduces dependency on engineering, accelerates sales cycles'
  }
];

export default function ProductRoadmap() {
  const [selectedTask, setSelectedTask] = useState(roadmapTasks[0]);

  const getPriorityColor = (priority) => {
    return {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-blue-100 text-blue-800'
    }[priority] || 'bg-slate-100 text-slate-800';
  };

  const getStatusColor = (status) => {
    return {
      planned: 'bg-slate-100 text-slate-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-emerald-100 text-emerald-800'
    }[status] || 'bg-slate-100 text-slate-800';
  };

  const getStatusIcon = (status) => {
    return {
      planned: <Clock className="w-4 h-4" />,
      in_progress: <GitBranch className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />
    }[status];
  };

  const taskIcons = {
    1: <Smartphone className="w-6 h-6 text-blue-600" />,
    2: <Map className="w-6 h-6 text-green-600" />,
    3: <TrendingUp className="w-6 h-6 text-purple-600" />,
    4: <Zap className="w-6 h-6 text-amber-600" />
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Product Roadmap</h1>
        <p className="text-slate-500 mt-1">Strategic initiatives to reach 9-10 rating and maximize product value</p>
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Current Status: 8/10
          </CardTitle>
          <CardDescription>
            Four strategic improvements identified to reach 9-10 rating and establish market leadership
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {roadmapTasks.map(task => (
              <div key={task.id} className="text-center">
                <div className="text-2xl mb-2">{task.id}</div>
                <p className="text-xs font-medium text-slate-600">{task.title.split(' ').slice(0, 2).join(' ')}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks List */}
        <div className="lg:col-span-1 space-y-2">
          {roadmapTasks.map(task => (
            <button
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedTask.id === task.id
                  ? 'border-slate-900 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                {taskIcons[task.id]}
                <div className="flex-1">
                  <p className="font-semibold text-sm text-slate-900">{task.title}</p>
                  <div className="flex gap-1 mt-2">
                    <Badge className={getPriorityColor(task.priority)} variant="outline">
                      {task.priority}
                    </Badge>
                    <Badge className={getStatusColor(task.status)} variant="outline">
                      {task.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Task Detail */}
        <div className="lg:col-span-2">
          <Card className="sticky top-20">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  {taskIcons[selectedTask.id]}
                  <div>
                    <CardTitle>{selectedTask.title}</CardTitle>
                    <CardDescription className="mt-1">{selectedTask.description}</CardDescription>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Priority</p>
                  <Badge className={getPriorityColor(selectedTask.priority)}>
                    {selectedTask.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Status</p>
                  <Badge className={getStatusColor(selectedTask.status)} variant="outline">
                    <span className="flex items-center gap-1">
                      {getStatusIcon(selectedTask.status)}
                      {selectedTask.status}
                    </span>
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Timeline</p>
                  <p className="text-sm font-semibold">{selectedTask.timeline}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Estimate</p>
                  <p className="text-sm font-semibold">{selectedTask.estimatedDays} days</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Features */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {selectedTask.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                      <ChevronRight className="w-4 h-4 mt-0.5 text-emerald-600 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Business Value */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-xs font-medium text-emerald-900 mb-2">💰 Business Value</p>
                <p className="text-sm text-emerald-900">{selectedTask.businessValue}</p>
              </div>

              {/* Impact */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs font-medium text-blue-900 mb-2">📈 Impact</p>
                <p className="text-sm text-blue-900 font-semibold">{selectedTask.impact}</p>
              </div>

              {/* CTA */}
              {selectedTask.status === 'planned' && (
                <Button className="w-full bg-slate-900 hover:bg-slate-800">
                  <GitBranch className="w-4 h-4 mr-2" />
                  Start Implementation
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Timeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Timeline</CardTitle>
          <CardDescription>Phased rollout to reach 9-10 rating by Q3 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Q2 Tasks */}
            <div>
              <p className="font-semibold text-slate-900 mb-3">Q2 2026 (April-June)</p>
              <div className="space-y-2">
                {roadmapTasks.filter(t => t.timeline.includes('Q2')).map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-sm font-medium text-slate-900">{task.title}</span>
                    <span className="text-xs font-semibold text-blue-700">{task.estimatedDays} days</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Q3 Tasks */}
            <div>
              <p className="font-semibold text-slate-900 mb-3">Q3 2026 (July-September)</p>
              <div className="space-y-2">
                {roadmapTasks.filter(t => t.timeline.includes('Q3')).map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <span className="text-sm font-medium text-slate-900">{task.title}</span>
                    <span className="text-xs font-semibold text-purple-700">{task.estimatedDays} days</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Completion */}
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 mt-6">
              <p className="text-sm font-semibold text-emerald-900">
                ✅ Projected completion: Q3 2026 | Target rating: 9-10/10
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}