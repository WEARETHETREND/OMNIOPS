import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import ContractForm from '@/components/contract/ContractForm';

export default function ContractList() {
  const [showForm, setShowForm] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const queryClient = useQueryClient();

  const { data: contracts = [] } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => base44.entities.Contract.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Contract.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Contract.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      setShowForm(false);
      setEditingContract(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Contract.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });

  const handleSubmit = (data) => {
    if (editingContract) {
      updateMutation.mutate({ id: editingContract.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const statusColors = {
    lead: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    bid_submitted: 'bg-purple-100 text-purple-800',
    won: 'bg-green-100 text-green-800',
    in_progress: 'bg-cyan-100 text-cyan-800',
    completed: 'bg-slate-100 text-slate-800',
    lost: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Contracts</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          New Contract
        </Button>
      </div>

      {showForm && (
        <ContractForm
          contract={editingContract}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingContract(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <div className="space-y-4">
        {contracts.map(contract => (
          <Card key={contract.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{contract.title}</h3>
                  <p className="text-slate-600 text-sm">{contract.company}</p>
                  
                  {contract.location && (
                    <p className="text-slate-500 text-sm mt-1">📍 {contract.location}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge className={statusColors[contract.status]}>
                      {contract.status.replace('_', ' ')}
                    </Badge>
                    {contract.industry && (
                      <Badge variant="outline">{contract.industry.replace('_', ' ')}</Badge>
                    )}
                    {contract.contract_value && (
                      <Badge variant="outline" className="font-semibold">
                        ${contract.contract_value.toLocaleString()}
                      </Badge>
                    )}
                  </div>

                  {contract.description && (
                    <p className="text-slate-700 mt-3 text-sm">{contract.description}</p>
                  )}

                  {contract.contact_email && (
                    <p className="text-slate-500 text-sm mt-2">📧 {contract.contact_email}</p>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingContract(contract);
                      setShowForm(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => deleteMutation.mutate(contract.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}