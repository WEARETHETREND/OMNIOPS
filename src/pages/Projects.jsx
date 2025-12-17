import React, { useState, useEffect } from 'react';
import { safeGet } from '@/components/api/apiClient';
import { 
  Folder,
  Plus,
  Search,
  Calendar,
  Users as UsersIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    setLoading(true);
    const r = await safeGet('/projects');
    if (r.ok) setProjects(r.data.projects || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filtered = projects.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500 mt-1">Manage tasks, timelines, and resources</p>
        </div>
        <Button className="bg-slate-900">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-sm text-slate-500 mb-1">Total Projects</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-sm text-slate-500 mb-1">Active</p>
          <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-sm text-slate-500 mb-1">Completed</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(project => (
            <div key={project.id} className="bg-white rounded-xl border border-slate-200/60 p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Folder className="w-6 h-6 text-white" />
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  project.status === 'active' ? 'bg-blue-50 text-blue-700' :
                  project.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <h3 className="font-semibold text-slate-900 mb-2">{project.name}</h3>
              <p className="text-sm text-slate-600 mb-4">{project.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {project.due_date ? new Date(project.due_date).toLocaleDateString() : 'No deadline'}
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <UsersIcon className="w-3.5 h-3.5" />
                  {project.team_size || 0}
                </div>
              </div>

              {project.progress !== undefined && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-600"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <Folder className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects found</h3>
          <p className="text-slate-500">Create your first project</p>
        </div>
      )}
    </div>
  );
}