import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Search, 
  DollarSign, 
  Calendar,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import AdvancedFilters from '../components/search/AdvancedFilters';
import { useFilteredData } from '../components/search/useFilteredData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ContractsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newContract, setNewContract] = useState({
    title: '',
    customer_name: '',
    customer_email: '',
    type: 'service_agreement',
    value: '',
    start_date: '',
    end_date: '',
    payment_terms: 'Net 30',
    terms: ''
  });

  const queryClient = useQueryClient();

  const { data: contracts = [], isLoading } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => base44.entities.Contract.list('-created_date', 100)
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Contract.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['contracts']);
      setCreateDialogOpen(false);
      setNewContract({
        title: '',
        customer_name: '',
        customer_email: '',
        type: 'service_agreement',
        value: '',
        start_date: '',
        end_date: '',
        payment_terms: 'Net 30',
        terms: ''
      });
    }
  });

  const handleCreateContract = () => {
    const contractData = {
      ...newContract,
      value: parseFloat(newContract.value) || 0,
      status: 'draft'
    };
    createMutation.mutate(contractData);
  };

  const searchFiltered = contracts.filter(contract => {
    if (!searchQuery) return true;
    const searchStr = `${contract.title} ${contract.customer_name} ${contract.company}`.toLowerCase();
    return searchStr.includes(searchQuery.toLowerCase());
  });

  const filteredContracts = useFilteredData(searchFiltered, filters);

  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'lead', label: 'Lead' },
        { value: 'contacted', label: 'Contacted' },
        { value: 'bid_submitted', label: 'Bid Submitted' },
        { value: 'won', label: 'Won' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'lost', label: 'Lost' }
      ]
    },
    {
      key: 'industry',
      label: 'Industry',
      type: 'select',
      options: [
        { value: 'hvac', label: 'HVAC' },
        { value: 'plumbing', label: 'Plumbing' },
        { value: 'electrical', label: 'Electrical' },
        { value: 'cleaning', label: 'Cleaning' },
        { value: 'maintenance', label: 'Maintenance' },
        { value: 'construction', label: 'Construction' }
      ]
    },
    {
      key: 'start_date',
      label: 'Start Date',
      type: 'date'
    },
    {
      key: 'contract_value',
      label: 'Contract Value',
      type: 'number'
    }
  ];

  const totalValue = contracts.reduce((sum, c) => sum + (c.value || 0), 0);
  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const pendingSignatures = contracts.filter(c => c.status === 'pending_signature').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending_signature': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-slate-100 text-slate-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="w-4 h-4" />;
      case 'pending_signature': return <Clock className="w-4 h-4" />;
      case 'expired': return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Contract Value</CardTitle>
            <DollarSign className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-slate-500">{contracts.length} total contracts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Contracts</CardTitle>
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeContracts}</div>
            <p className="text-xs text-slate-500">Currently in effect</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Signatures</CardTitle>
            <Clock className="w-5 h-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSignatures}</div>
            <p className="text-xs text-slate-500">Waiting for response</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search contracts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <AdvancedFilters 
              filters={filters}
              onFiltersChange={setFilters}
              filterConfig={filterConfig}
            />
            <Button onClick={() => setCreateDialogOpen(true)} className="bg-[#2196f3]">
              <Plus className="w-4 h-4 mr-2" />
              New Contract
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contracts List */}
      {filteredContracts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No contracts found</h3>
            <p className="text-slate-500 mb-4">Get started by creating a new contract.</p>
            <Button onClick={() => setCreateDialogOpen(true)} className="bg-[#2196f3]">
              <Plus className="w-4 h-4 mr-2" />
              Create Contract
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredContracts.map((contract) => (
            <Card key={contract.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{contract.title}</h3>
                      <Badge className={getStatusColor(contract.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(contract.status)}
                          <span className="capitalize">{contract.status.replace('_', ' ')}</span>
                        </div>
                      </Badge>
                    </div>
                    <p className="text-slate-600 mb-3">{contract.customer_name}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>${contract.value?.toLocaleString() || 0}</span>
                      </div>
                      {contract.start_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(contract.start_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      <Badge variant="outline" className="capitalize">
                        {contract.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Contract Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Contract</DialogTitle>
            <DialogDescription>Fill in the contract details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Contract Title *</Label>
              <Input
                placeholder="e.g., Annual Service Agreement"
                value={newContract.title}
                onChange={(e) => setNewContract({ ...newContract, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Customer Name *</Label>
                <Input
                  placeholder="Company or Client Name"
                  value={newContract.customer_name}
                  onChange={(e) => setNewContract({ ...newContract, customer_name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Customer Email</Label>
                <Input
                  type="email"
                  placeholder="client@company.com"
                  value={newContract.customer_email}
                  onChange={(e) => setNewContract({ ...newContract, customer_email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Contract Type *</Label>
                <Select
                  value={newContract.type}
                  onValueChange={(value) => setNewContract({ ...newContract, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service_agreement">Service Agreement</SelectItem>
                    <SelectItem value="nda">NDA</SelectItem>
                    <SelectItem value="msa">Master Service Agreement</SelectItem>
                    <SelectItem value="sow">Statement of Work</SelectItem>
                    <SelectItem value="purchase_order">Purchase Order</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Contract Value ($)</Label>
                <Input
                  type="number"
                  placeholder="50000"
                  value={newContract.value}
                  onChange={(e) => setNewContract({ ...newContract, value: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={newContract.start_date}
                  onChange={(e) => setNewContract({ ...newContract, start_date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={newContract.end_date}
                  onChange={(e) => setNewContract({ ...newContract, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Payment Terms</Label>
              <Select
                value={newContract.payment_terms}
                onValueChange={(value) => setNewContract({ ...newContract, payment_terms: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Due on receipt">Due on receipt</SelectItem>
                  <SelectItem value="Net 15">Net 15</SelectItem>
                  <SelectItem value="Net 30">Net 30</SelectItem>
                  <SelectItem value="Net 60">Net 60</SelectItem>
                  <SelectItem value="Net 90">Net 90</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Terms & Conditions</Label>
              <Textarea
                placeholder="Enter contract terms and conditions..."
                value={newContract.terms}
                onChange={(e) => setNewContract({ ...newContract, terms: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateContract}
              disabled={!newContract.title || !newContract.customer_name}
              className="bg-[#2196f3]"
            >
              Create Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}