import React, { useState } from 'react';
import { 
  Smartphone,
  MapPin,
  Camera,
  FileSignature,
  Clock,
  CheckCircle,
  AlertCircle,
  Navigation,
  Wifi,
  WifiOff,
  Battery,
  Upload,
  Mic,
  Package,
  DollarSign,
  Phone,
  MessageSquare,
  ChevronRight,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const mockJobs = [
  { id: 1, customer: 'Smith Residence', address: '123 Main St', type: 'HVAC Repair', status: 'in_progress', time: '9:00 AM', priority: 'high' },
  { id: 2, customer: 'Johnson Office', address: '456 Oak Ave', type: 'Plumbing', status: 'scheduled', time: '11:30 AM', priority: 'medium' },
  { id: 3, customer: 'Williams Home', address: '789 Pine Rd', type: 'Electrical', status: 'scheduled', time: '2:00 PM', priority: 'low' },
];

const statusConfig = {
  scheduled: { label: 'Scheduled', color: 'bg-slate-100 text-slate-700', icon: Clock },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Play },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
};

export default function FieldApp() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [clockedIn, setClockedIn] = useState(true);
  const [activeTimer, setActiveTimer] = useState({ hours: 2, minutes: 34 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Smartphone className="w-7 h-7 text-blue-600" />
            Mobile Field App
          </h1>
          <p className="text-slate-500">Technician mobile experience preview</p>
        </div>
        <Badge className={isOnline ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
          {isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
          {isOnline ? 'Online' : 'Offline Mode'}
        </Badge>
      </div>

      {/* Mobile Preview Frame */}
      <div className="max-w-md mx-auto">
        <div className="bg-slate-900 rounded-[3rem] p-3 shadow-2xl">
          <div className="bg-white rounded-[2.5rem] overflow-hidden">
            {/* Phone Status Bar */}
            <div className="bg-slate-900 text-white px-6 py-2 flex items-center justify-between text-xs">
              <span>9:41</span>
              <div className="flex items-center gap-2">
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* App Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-blue-100 text-xs">Good morning</p>
                  <h2 className="font-bold text-lg">John Technician</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary" className="h-8 bg-white/20 hover:bg-white/30 text-white border-0">
                    <Phone className="w-3.5 h-3.5 mr-1" />
                    Support
                  </Button>
                </div>
              </div>
              
              {/* Clock In/Out */}
              <div className="flex items-center justify-between bg-white/10 rounded-xl p-3">
                <div>
                  <p className="text-xs text-blue-100">Today's Time</p>
                  <p className="text-xl font-bold">{activeTimer.hours}h {activeTimer.minutes}m</p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => setClockedIn(!clockedIn)}
                  className={clockedIn ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-500 hover:bg-emerald-600"}
                >
                  {clockedIn ? <Square className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
                  {clockedIn ? 'Clock Out' : 'Clock In'}
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="jobs" className="p-4">
              <TabsList className="w-full grid grid-cols-3 mb-4">
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
                <TabsTrigger value="sync">Sync</TabsTrigger>
              </TabsList>

              <TabsContent value="jobs" className="space-y-3 mt-0">
                {mockJobs.map(job => {
                  const config = statusConfig[job.status];
                  const Icon = config.icon;
                  return (
                    <div 
                      key={job.id}
                      onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                      className={cn(
                        "p-4 rounded-xl border transition-all cursor-pointer",
                        selectedJob === job.id ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-slate-900">{job.customer}</h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.address}
                          </p>
                        </div>
                        <Badge className={config.color}>
                          <Icon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {job.time}
                          <span>•</span>
                          <span>{job.type}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>

                      {selectedJob === job.id && (
                        <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { icon: Navigation, label: 'Navigate' },
                              { icon: Phone, label: 'Call' },
                              { icon: MessageSquare, label: 'Message' },
                              { icon: Camera, label: 'Photos' },
                            ].map((action, i) => (
                              <button key={i} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-100 hover:bg-slate-200">
                                <action.icon className="w-4 h-4 text-slate-600" />
                                <span className="text-[10px] text-slate-600">{action.label}</span>
                              </button>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button size="sm" variant="outline" className="text-xs">
                              <Package className="w-3.5 h-3.5 mr-1" />
                              Add Parts
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs">
                              <Mic className="w-3.5 h-3.5 mr-1" />
                              Voice Note
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button size="sm" variant="outline" className="text-xs">
                              <FileSignature className="w-3.5 h-3.5 mr-1" />
                              Signature
                            </Button>
                            <Button size="sm" className="text-xs bg-emerald-600 hover:bg-emerald-700">
                              <CheckCircle className="w-3.5 h-3.5 mr-1" />
                              Complete
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </TabsContent>

              <TabsContent value="tools" className="space-y-3 mt-0">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Camera, label: 'Take Photo', desc: 'Before/after shots' },
                    { icon: Mic, label: 'Voice Notes', desc: 'Quick recordings' },
                    { icon: FileSignature, label: 'Get Signature', desc: 'Customer sign-off' },
                    { icon: DollarSign, label: 'Collect Payment', desc: 'Card or cash' },
                    { icon: Package, label: 'Inventory', desc: 'Parts & materials' },
                    { icon: MapPin, label: 'GPS Check-in', desc: 'Log location' },
                  ].map((tool, i) => (
                    <button key={i} className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-left transition-colors">
                      <tool.icon className="w-6 h-6 text-blue-600 mb-2" />
                      <p className="font-medium text-slate-900 text-sm">{tool.label}</p>
                      <p className="text-xs text-slate-500">{tool.desc}</p>
                    </button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sync" className="space-y-4 mt-0">
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">All Synced</h3>
                  <p className="text-xs text-slate-500">Last sync: 2 minutes ago</p>
                </div>
                
                <div className="space-y-2">
                  {[
                    { label: 'Jobs', count: 3, synced: true },
                    { label: 'Photos', count: 12, synced: true },
                    { label: 'Notes', count: 5, synced: true },
                    { label: 'Time Logs', count: 8, synced: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-700">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{item.count} items</span>
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Force Sync Now
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {[
          { icon: WifiOff, label: 'Offline Capable', desc: 'Works without internet' },
          { icon: Mic, label: 'Voice to Notes', desc: 'Speak, we transcribe' },
          { icon: Camera, label: 'Photo Capture', desc: 'Before/after documentation' },
          { icon: MapPin, label: 'GPS Check-in', desc: 'Automatic location logging' },
        ].map((feature, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200/60 p-4 text-center">
            <feature.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium text-slate-900 text-sm">{feature.label}</h3>
            <p className="text-xs text-slate-500">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}