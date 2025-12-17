import React, { useState, useEffect } from 'react';
import { safeGet, safePost } from '@/components/api/apiClient';
import { 
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function CRM() {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const loadContacts = async () => {
    setLoading(true);
    const r = await safeGet('/crm/contacts');
    if (r.ok) setContacts(r.data.contacts || []);
    setLoading(false);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const filtered = contacts.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: contacts.length,
    active: contacts.filter(c => c.status === 'active').length,
    leads: contacts.filter(c => c.type === 'lead').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">CRM</h1>
          <p className="text-slate-500 mt-1">Manage contacts, leads, and deals</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-slate-900">
          <Plus className="w-4 h-4 mr-2" />
          New Contact
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-sm text-slate-500 mb-1">Total Contacts</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-sm text-slate-500 mb-1">Active</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <p className="text-sm text-slate-500 mb-1">Leads</p>
          <p className="text-2xl font-bold text-blue-600">{stats.leads}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Contacts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(9).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(contact => (
            <div key={contact.id} className="bg-white rounded-xl border border-slate-200/60 p-5 hover:shadow-lg transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                  {contact.name?.charAt(0) || 'C'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{contact.name}</h3>
                  {contact.company && (
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <Building className="w-3 h-3" />
                      {contact.company}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {contact.email && (
                  <p className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5" />
                    {contact.email}
                  </p>
                )}
                {contact.phone && (
                  <p className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5" />
                    {contact.phone}
                  </p>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  contact.type === 'lead' ? 'bg-blue-50 text-blue-700' :
                  contact.type === 'customer' ? 'bg-emerald-50 text-emerald-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {contact.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No contacts found</h3>
          <p className="text-slate-500">Add your first contact to get started</p>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="john@company.com" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input placeholder="+1 (555) 000-0000" />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input placeholder="Company Name" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-slate-900">
                Create Contact
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}