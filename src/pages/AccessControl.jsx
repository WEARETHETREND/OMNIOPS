import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Shield,
  Plus,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  ChevronDown,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const departments = ['all', 'hr', 'finance', 'it', 'logistics', 'customer_service', 'sales', 'marketing', 'operations'];

const permissionModules = [
  { key: 'workflows', label: 'Workflows', actions: ['view', 'create', 'edit', 'delete', 'execute'] },
  { key: 'integrations', label: 'Integrations', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'analytics', label: 'Analytics', actions: ['view', 'export'] },
  { key: 'alerts', label: 'Alerts', actions: ['view', 'acknowledge', 'resolve'] },
  { key: 'settings', label: 'Settings', actions: ['view', 'edit'] },
  { key: 'users', label: 'User Management', actions: ['view', 'invite', 'edit', 'delete'] },
  { key: 'compliance', label: 'Compliance', actions: ['view', 'edit'] },
  { key: 'audit', label: 'Audit Logs', actions: ['view', 'export'] }
];

const defaultPermissions = {};
permissionModules.forEach(m => {
  defaultPermissions[m.key] = {};
  m.actions.forEach(a => defaultPermissions[m.key][a] = false);
});

export default function AccessControl() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    department: 'all',
    permissions: { ...defaultPermissions }
  });

  const queryClient = useQueryClient();

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => base44.entities.Role.list()
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Role.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setIsCreateOpen(false);
      resetForm();
      toast.success('Role created successfully');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Role.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setEditingRole(null);
      toast.success('Role updated');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Role.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role deleted');
    }
  });

  const resetForm = () => {
    setNewRole({
      name: '',
      description: '',
      department: 'all',
      permissions: { ...defaultPermissions }
    });
  };

  const togglePermission = (role, setRole, moduleKey, action) => {
    const newPerms = { ...role.permissions };
    if (!newPerms[moduleKey]) newPerms[moduleKey] = {};
    newPerms[moduleKey][action] = !newPerms[moduleKey][action];
    setRole({ ...role, permissions: newPerms });
  };

  const filteredRoles = roles.filter(role => 
    role.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const RoleForm = ({ role, setRole, onSave, onCancel, isNew }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Role Name</Label>
          <Input
            value={role.name}
            onChange={(e) => setRole({ ...role, name: e.target.value })}
            placeholder="e.g., Department Manager"
          />
        </div>
        <div className="space-y-2">
          <Label>Department</Label>
          <Select value={role.department} onValueChange={(v) => setRole({ ...role, department: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {departments.map(d => (
                <SelectItem key={d} value={d} className="capitalize">
                  {d === 'all' ? 'All Departments' : d.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={role.description || ''}
          onChange={(e) => setRole({ ...role, description: e.target.value })}
          placeholder="What can this role do?"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base">Permissions</Label>
        {permissionModules.map(module => (
          <Collapsible key={module.key}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="font-medium text-slate-900">{module.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  {module.actions.filter(a => role.permissions?.[module.key]?.[a]).length}/{module.actions.length}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 px-3">
              <div className="flex flex-wrap gap-3">
                {module.actions.map(action => (
                  <label key={action} className="flex items-center gap-2 cursor-pointer">
                    <Switch
                      checked={role.permissions?.[module.key]?.[action] || false}
                      onCheckedChange={() => togglePermission(role, setRole, module.key, action)}
                    />
                    <span className="text-sm capitalize">{action}</span>
                  </label>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button 
          onClick={onSave}
          disabled={!role.name}
          className="bg-slate-900 hover:bg-slate-800"
        >
          {isNew ? 'Create Role' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-slate-900 hover:bg-slate-800">
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Roles Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      ) : filteredRoles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRoles.map(role => {
            const totalPerms = permissionModules.reduce((acc, m) => {
              return acc + m.actions.filter(a => role.permissions?.[m.key]?.[a]).length;
            }, 0);
            const maxPerms = permissionModules.reduce((acc, m) => acc + m.actions.length, 0);
            
            return (
              <Card key={role.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{role.name}</CardTitle>
                        <p className="text-xs text-slate-500 capitalize">
                          {role.department === 'all' ? 'All Departments' : role.department?.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    {role.is_system && <Badge variant="outline">System</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {role.description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {totalPerms}/{maxPerms} permissions
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingRole(role)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {!role.is_system && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate(role.id)}
                          className="text-rose-500 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <Shield className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No roles found</h3>
          <p className="text-slate-500 mb-6">Create roles to manage user permissions</p>
          <Button onClick={() => setIsCreateOpen(true)} className="bg-slate-900 hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-2" />
            Create Role
          </Button>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
          </DialogHeader>
          <RoleForm
            role={newRole}
            setRole={setNewRole}
            onSave={() => createMutation.mutate(newRole)}
            onCancel={() => { setIsCreateOpen(false); resetForm(); }}
            isNew={true}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          {editingRole && (
            <RoleForm
              role={editingRole}
              setRole={setEditingRole}
              onSave={() => updateMutation.mutate({ id: editingRole.id, data: editingRole })}
              onCancel={() => setEditingRole(null)}
              isNew={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}