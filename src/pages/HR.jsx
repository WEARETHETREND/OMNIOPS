import React, { useState, useEffect } from 'react';
import { safeGet } from '@/components/api/apiClient';
import { 
  Users,
  Plus,
  Search,
  UserCheck,
  Clock,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function HR() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    setLoading(true);
    const r = await safeGet('/hr/employees');
    if (r.ok) setEmployees(r.data.employees || []);
    setLoading(false);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filtered = employees.filter(e => 
    e.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    onboarding: employees.filter(e => e.status === 'onboarding').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">HR Management</h1>
          <p className="text-slate-500 mt-1">Employees, onboarding, and time tracking</p>
        </div>
        <Button className="bg-slate-900">
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-sm text-slate-500 mb-1">Total Employees</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-sm text-slate-500 mb-1">Active</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-sm text-slate-500 mb-1">Onboarding</p>
          <p className="text-2xl font-bold text-blue-600">{stats.onboarding}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Employees Table */}
      {loading ? (
        <div className="space-y-3">
          {Array(10).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Employee</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Department</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Role</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Start Date</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                        {emp.name?.charAt(0) || 'E'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{emp.name}</p>
                        <p className="text-sm text-slate-500">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 capitalize">{emp.department}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">{emp.role}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {emp.start_date ? new Date(emp.start_date).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      emp.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                      emp.status === 'onboarding' ? 'bg-blue-50 text-blue-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {emp.status === 'active' && <UserCheck className="w-3 h-3" />}
                      {emp.status === 'onboarding' && <Clock className="w-3 h-3" />}
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No employees found</h3>
          <p className="text-slate-500">Add employees to get started</p>
        </div>
      )}
    </div>
  );
}