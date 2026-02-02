import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ContractForm({ contract, onSubmit, onCancel, isLoading }) {
  const [data, setData] = useState(contract || {
    title: '',
    description: '',
    company: '',
    contact_email: '',
    contact_phone: '',
    location: '',
    industry: '',
    contract_value: '',
    payment_terms: '',
    workers_needed: '',
    status: 'lead',
    start_date: '',
    end_date: '',
    notes: '',
    source: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...data,
      contract_value: data.contract_value ? Number(data.contract_value) : null,
      workers_needed: data.workers_needed ? Number(data.workers_needed) : null,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input
                required
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder="Job title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company *</label>
              <Input
                required
                value={data.company}
                onChange={(e) => setData({ ...data, company: e.target.value })}
                placeholder="Company name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              placeholder="Job details and requirements"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <Select value={data.industry} onValueChange={(v) => setData({ ...data, industry: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hvac">HVAC</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="pest_control">Pest Control</SelectItem>
                  <SelectItem value="landscaping">Landscaping</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select value={data.status} onValueChange={(v) => setData({ ...data, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="bid_submitted">Bid Submitted</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Contact Email</label>
              <Input
                type="email"
                value={data.contact_email}
                onChange={(e) => setData({ ...data, contact_email: e.target.value })}
                placeholder="contact@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Phone</label>
              <Input
                value={data.contact_phone}
                onChange={(e) => setData({ ...data, contact_phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input
                value={data.location}
                onChange={(e) => setData({ ...data, location: e.target.value })}
                placeholder="City, State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contract Value ($)</label>
              <Input
                type="number"
                value={data.contract_value}
                onChange={(e) => setData({ ...data, contract_value: e.target.value })}
                placeholder="50000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Workers Needed</label>
              <Input
                type="number"
                value={data.workers_needed}
                onChange={(e) => setData({ ...data, workers_needed: e.target.value })}
                placeholder="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Terms</label>
              <Input
                value={data.payment_terms}
                onChange={(e) => setData({ ...data, payment_terms: e.target.value })}
                placeholder="Net 30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <Input
                type="date"
                value={data.start_date}
                onChange={(e) => setData({ ...data, start_date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <Input
                type="date"
                value={data.end_date}
                onChange={(e) => setData({ ...data, end_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Source</label>
            <Input
              value={data.source}
              onChange={(e) => setData({ ...data, source: e.target.value })}
              placeholder="Where you found it (website, referral, etc.)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <Textarea
              value={data.notes}
              onChange={(e) => setData({ ...data, notes: e.target.value })}
              placeholder="Additional notes"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : contract ? 'Update' : 'Create'} Contract
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}