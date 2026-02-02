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

export default function WorkerForm({ worker, onSubmit, onCancel, isLoading }) {
  const [data, setData] = useState(worker || {
    name: '',
    email: '',
    phone: '',
    specialty: '',
    hourly_rate: '',
    availability: 'available',
    experience_years: '',
    certifications: [],
    location: '',
    notes: '',
    status: 'active',
  });

  const [certInput, setCertInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...data,
      hourly_rate: Number(data.hourly_rate),
      experience_years: data.experience_years ? Number(data.experience_years) : null,
    });
  };

  const addCertification = () => {
    if (certInput.trim()) {
      setData({
        ...data,
        certifications: [...data.certifications, certInput],
      });
      setCertInput('');
    }
  };

  const removeCertification = (index) => {
    setData({
      ...data,
      certifications: data.certifications.filter((_, i) => i !== index),
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <Input
                required
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="Worker name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Specialty *</label>
              <Select value={data.specialty} onValueChange={(v) => setData({ ...data, specialty: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
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
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="worker@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hourly Rate ($) *</label>
              <Input
                type="number"
                required
                value={data.hourly_rate}
                onChange={(e) => setData({ ...data, hourly_rate: e.target.value })}
                placeholder="45"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Experience (Years)</label>
              <Input
                type="number"
                value={data.experience_years}
                onChange={(e) => setData({ ...data, experience_years: e.target.value })}
                placeholder="5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Availability</label>
              <Select value={data.availability} onValueChange={(v) => setData({ ...data, availability: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input
                value={data.location}
                onChange={(e) => setData({ ...data, location: e.target.value })}
                placeholder="City, State"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Certifications</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                placeholder="Add certification"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
              />
              <Button type="button" variant="outline" onClick={addCertification}>
                Add
              </Button>
            </div>
            {data.certifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.certifications.map((cert, i) => (
                  <div
                    key={i}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {cert}
                    <button
                      type="button"
                      onClick={() => removeCertification(i)}
                      className="text-blue-600 hover:text-blue-900 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              {isLoading ? 'Saving...' : worker ? 'Update' : 'Add'} Worker
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}