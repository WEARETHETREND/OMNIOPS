import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2, Star } from 'lucide-react';
import WorkerForm from '@/components/contract/WorkerForm';

export default function WorkerList() {
  const [showForm, setShowForm] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const queryClient = useQueryClient();

  const { data: workers = [] } = useQuery({
    queryKey: ['workers'],
    queryFn: () => base44.entities.Worker.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Worker.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Worker.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      setShowForm(false);
      setEditingWorker(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Worker.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    },
  });

  const handleSubmit = (data) => {
    if (editingWorker) {
      updateMutation.mutate({ id: editingWorker.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Worker Roster</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Worker
        </Button>
      </div>

      {showForm && (
        <WorkerForm
          worker={editingWorker}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingWorker(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workers.map(worker => (
          <Card key={worker.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{worker.name}</h3>
                  <p className="text-slate-600 text-sm capitalize">{worker.specialty}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingWorker(worker);
                      setShowForm(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600"
                    onClick={() => deleteMutation.mutate(worker.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="font-semibold text-lg text-slate-900">
                  ${worker.hourly_rate}/hr
                </p>

                <div className="flex flex-wrap gap-1">
                  <Badge className={worker.availability === 'available' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}>
                    {worker.availability}
                  </Badge>
                  {worker.experience_years && (
                    <Badge variant="outline">{worker.experience_years} yrs exp</Badge>
                  )}
                </div>

                {worker.location && (
                  <p className="text-slate-600">📍 {worker.location}</p>
                )}

                {worker.email && (
                  <p className="text-slate-600">📧 {worker.email}</p>
                )}

                {worker.phone && (
                  <p className="text-slate-600">📱 {worker.phone}</p>
                )}

                {worker.certifications && worker.certifications.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-slate-600 font-medium mb-1">Certifications:</p>
                    <div className="flex flex-wrap gap-1">
                      {worker.certifications.map((cert, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}