import React, { useState, useEffect } from 'react';
import { safeGet, safePost } from '@/components/api/apiClient';
import { 
  Shield,
  Plus,
  Edit,
  Trash2,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export default function AccessControl() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const loadRoles = async () => {
    setLoading(true);
    setError('');
    const r = await safeGet('/roles');
    if (!r.ok) {
      setError(r.error);
    } else {
      setRoles(r.data.roles || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const deleteRole = async (id) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    const r = await safePost(`/roles/${id}/delete`);
    if (!r.ok) {
      toast.error(`Failed to delete: ${r.error}`);
    } else {
      toast.success('Role deleted');
      await loadRoles();
    }
  };

  const modules = [
    { id: 'workflows', label: 'Workflows' },
    { id: 'dispatches', label: 'Dispatches' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'audit', label: 'Audit Trail' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'settings', label: 'Settings' },
  ];

  const permissions = ['view', 'create', 'edit', 'delete', 'execute'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Access Control</h1>
          <p className="text-slate-500 mt-1">Manage role-based permissions</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-slate-900 hover:bg-slate-800">
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Roles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : roles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map(role => (
            <div key={role.id} className="bg-white rounded-xl border border-slate-200/60 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{role.name}</h3>
                    {role.description && (
                      <p className="text-sm text-slate-500 mt-1">{role.description}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {role.permissions && Object.entries(role.permissions).slice(0, 3).map(([module, perms]) => (
                  <div key={module} className="text-sm">
                    <p className="font-medium text-slate-700 capitalize mb-1">{module}</p>
                    <div className="flex gap-1 flex-wrap">
                      {Object.entries(perms).filter(([_, v]) => v).map(([perm]) => (
                        <span key={perm} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setEditingRole(role)}
                >
                  <Edit className="w-3.5 h-3.5 mr-1" />
                  Edit
                </Button>
                {!role.is_system && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteRole(role.id)}
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No roles found</h3>
          <p className="text-slate-500">Create your first role to get started</p>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen || !!editingRole} onOpenChange={() => {
        setIsCreateOpen(false);
        setEditingRole(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Edit Role' : 'Create Role'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Role Name</Label>
              <Input placeholder="e.g., Dispatcher" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input placeholder="Brief description of this role" />
            </div>

            <div className="space-y-3">
              <Label>Permissions by Module</Label>
              {modules.map(module => (
                <div key={module.id} className="border border-slate-200 rounded-lg p-4">
                  <p className="font-medium text-slate-900 mb-3">{module.label}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {permissions.map(perm => (
                      <div key={perm} className="flex items-center space-x-2">
                        <Checkbox id={`${module.id}-${perm}`} />
                        <label
                          htmlFor={`${module.id}-${perm}`}
                          className="text-sm text-slate-700 capitalize cursor-pointer"
                        >
                          {perm}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => {
                setIsCreateOpen(false);
                setEditingRole(null);
              }}>
                Cancel
              </Button>
              <Button className="bg-slate-900 hover:bg-slate-800">
                {editingRole ? 'Update Role' : 'Create Role'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}