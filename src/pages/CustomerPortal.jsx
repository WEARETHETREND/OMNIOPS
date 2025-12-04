import React, { useState } from 'react';
import { 
  Users,
  Calendar,
  FileText,
  CreditCard,
  Clock,
  CheckCircle,
  Package,
  MessageSquare,
  Bell,
  Settings,
  ChevronRight,
  Download,
  Star,
  MapPin,
  Phone,
  Mail,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const mockServiceHistory = [
  { id: 1, date: '2024-11-15', type: 'HVAC Maintenance', tech: 'John Smith', status: 'completed', amount: 185 },
  { id: 2, date: '2024-10-22', type: 'Plumbing Repair', tech: 'Mike Johnson', status: 'completed', amount: 320 },
  { id: 3, date: '2024-09-08', type: 'Electrical Inspection', tech: 'Sarah Davis', status: 'completed', amount: 150 },
];

const mockEquipment = [
  { id: 1, name: 'HVAC System', model: 'Carrier 24ACC636', installed: '2020-03-15', warranty: '2025-03-15', status: 'good' },
  { id: 2, name: 'Water Heater', model: 'Rheem RH50', installed: '2019-08-22', warranty: '2024-08-22', status: 'attention' },
  { id: 3, name: 'Furnace', model: 'Lennox SL297NV', installed: '2021-11-10', warranty: '2031-11-10', status: 'good' },
];

const mockInvoices = [
  { id: 'INV-2024-001', date: '2024-11-15', amount: 185, status: 'paid' },
  { id: 'INV-2024-002', date: '2024-10-22', amount: 320, status: 'paid' },
  { id: 'INV-2024-003', date: '2024-12-01', amount: 275, status: 'pending' },
];

export default function CustomerPortal() {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-violet-600" />
            Customer Portal
          </h1>
          <p className="text-slate-500">Self-service portal for customers</p>
        </div>
        <Badge className="bg-violet-100 text-violet-700">
          Preview Mode
        </Badge>
      </div>

      {/* Portal Preview */}
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-violet-200 text-sm">Welcome back</p>
            <h2 className="text-2xl font-bold">Acme Corporation</h2>
            <p className="text-violet-200 text-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              123 Business Ave, Suite 100
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
              <Bell className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Calendar, label: 'Book Service', desc: 'Schedule appointment' },
            { icon: CreditCard, label: 'Pay Invoice', desc: '$275 pending' },
            { icon: MessageSquare, label: 'Contact Us', desc: 'Send message' },
            { icon: FileText, label: 'View History', desc: '12 services' },
          ].map((action, i) => (
            <button key={i} className="bg-white/10 hover:bg-white/20 rounded-xl p-4 text-left transition-colors">
              <action.icon className="w-6 h-6 mb-2" />
              <p className="font-medium">{action.label}</p>
              <p className="text-xs text-violet-200">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full justify-start border-b rounded-none bg-slate-50 p-0 h-auto">
            {['overview', 'appointments', 'invoices', 'equipment'].map(tab => (
              <TabsTrigger 
                key={tab} 
                value={tab}
                className="capitalize rounded-none border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:bg-white py-3 px-6"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="p-6 space-y-6 mt-0">
            {/* Upcoming Appointment */}
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-start justify-between">
                <div>
                  <Badge className="bg-emerald-100 text-emerald-700 mb-2">Upcoming</Badge>
                  <h3 className="font-semibold text-slate-900">HVAC Annual Maintenance</h3>
                  <p className="text-sm text-slate-600">Dec 15, 2024 at 10:00 AM</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <Wrench className="w-3 h-3" />
                    Technician: John Smith
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Reschedule</Button>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Confirm</Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Services', value: '12', icon: Wrench },
                { label: 'This Year', value: '$2,430', icon: CreditCard },
                { label: 'Equipment', value: '3 units', icon: Package },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-4 text-center">
                  <stat.icon className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Recent Service History</h3>
              <div className="space-y-3">
                {mockServiceHistory.map(service => (
                  <div key={service.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{service.type}</p>
                        <p className="text-xs text-slate-500">{service.date} • {service.tech}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">${service.amount}</p>
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">Completed</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="p-6 space-y-4 mt-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Your Appointments</h3>
              <Button className="bg-violet-600 hover:bg-violet-700">
                <Calendar className="w-4 h-4 mr-2" />
                Book New Service
              </Button>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-8 text-center">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Appointment booking calendar would appear here</p>
              <p className="text-xs text-slate-400">Select date, time, and service type</p>
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="p-6 space-y-4 mt-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Invoices & Payments</h3>
              <Badge className="bg-amber-100 text-amber-700">1 pending</Badge>
            </div>
            
            <div className="space-y-3">
              {mockInvoices.map(invoice => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900">{invoice.id}</p>
                      <p className="text-xs text-slate-500">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-slate-900">${invoice.amount}</p>
                    {invoice.status === 'paid' ? (
                      <Badge className="bg-emerald-100 text-emerald-700">Paid</Badge>
                    ) : (
                      <Button size="sm" className="bg-violet-600 hover:bg-violet-700">Pay Now</Button>
                    )}
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="p-6 space-y-4 mt-0">
            <h3 className="font-semibold text-slate-900">Your Equipment</h3>
            
            <div className="space-y-3">
              {mockEquipment.map(equip => (
                <div key={equip.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-slate-400" />
                        <h4 className="font-medium text-slate-900">{equip.name}</h4>
                        <Badge className={equip.status === 'good' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                          {equip.status === 'good' ? 'Good Condition' : 'Needs Attention'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">Model: {equip.model}</p>
                    </div>
                    <Button size="sm" variant="outline">Service History</Button>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Installed</p>
                      <p className="font-medium text-slate-700">{equip.installed}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Warranty Until</p>
                      <p className="font-medium text-slate-700">{equip.warranty}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}