import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import 'leaflet/dist/leaflet.css';
import {
  Navigation,
  MapPin,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Radio,
  TrendingUp
} from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function DispatchMap() {
  const [selectedDispatch, setSelectedDispatch] = useState(null);
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]); // San Francisco default

  const { data: dispatches = [], refetch } = useQuery({
    queryKey: ['dispatches'],
    queryFn: () => base44.entities.Dispatch.list('-updated_date', 100),
    refetchInterval: 10000 // Auto-refresh every 10 seconds for real-time updates
  });

  useEffect(() => {
    // Subscribe to real-time dispatch updates
    const unsubscribe = base44.entities.Dispatch.subscribe((event) => {
      refetch();
    });
    return unsubscribe;
  }, [refetch]);

  const activeDispatches = dispatches.filter(d => 
    d.status !== 'completed' && d.status !== 'failed' && d.location
  );

  const stats = {
    total: dispatches.length,
    enRoute: dispatches.filter(d => d.status === 'en_route').length,
    inProgress: dispatches.filter(d => d.status === 'in_progress').length,
    completed: dispatches.filter(d => d.status === 'completed').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'queued': return 'bg-slate-100 text-slate-700';
      case 'en_route': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-amber-100 text-amber-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-blue-600';
      case 'low': return 'text-slate-600';
      default: return 'text-slate-600';
    }
  };

  const getMarkerIcon = (dispatch) => {
    const color = dispatch.status === 'in_progress' ? '#f59e0b' :
                  dispatch.status === 'en_route' ? '#3b82f6' :
                  dispatch.status === 'completed' ? '#10b981' : '#64748b';
    
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  const getWorkerIcon = () => {
    return L.divIcon({
      className: 'worker-marker',
      html: `<div style="background-color: #7cb342; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      </div>`,
      iconSize: [25, 25],
      iconAnchor: [12.5, 12.5]
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-slate-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-sm text-slate-500">Total Dispatches</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Navigation className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.enRoute}</p>
                <p className="text-sm text-slate-500">En Route</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Radio className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.inProgress}</p>
                <p className="text-sm text-slate-500">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
                <p className="text-sm text-slate-500">Completed Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className="h-[600px] rounded-lg overflow-hidden">
              <MapContainer
                center={mapCenter}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {activeDispatches.map((dispatch) => (
                  <React.Fragment key={dispatch.id}>
                    {/* Job location marker */}
                    <Marker
                      position={[dispatch.location.lat, dispatch.location.lng]}
                      icon={getMarkerIcon(dispatch)}
                      eventHandlers={{
                        click: () => setSelectedDispatch(dispatch)
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold text-sm mb-1">{dispatch.job_title}</h3>
                          <p className="text-xs text-slate-600 mb-1">{dispatch.customer_name}</p>
                          <Badge className={getStatusColor(dispatch.status)} size="sm">
                            {dispatch.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Worker location marker */}
                    {dispatch.worker_location && (
                      <>
                        <Marker
                          position={[dispatch.worker_location.lat, dispatch.worker_location.lng]}
                          icon={getWorkerIcon()}
                        >
                          <Popup>
                            <div className="p-2">
                              <p className="text-xs font-semibold">{dispatch.worker_name}</p>
                              <p className="text-xs text-slate-600">Current Location</p>
                            </div>
                          </Popup>
                        </Marker>
                        
                        {/* Route line from worker to job */}
                        {dispatch.status === 'en_route' && (
                          <Polyline
                            positions={[
                              [dispatch.worker_location.lat, dispatch.worker_location.lng],
                              [dispatch.location.lat, dispatch.location.lng]
                            ]}
                            color="#3b82f6"
                            dashArray="10, 10"
                            weight={2}
                          />
                        )}
                      </>
                    )}
                  </React.Fragment>
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {/* Active Dispatches List */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Active Dispatches</h3>
              <Badge variant="outline">{activeDispatches.length} Live</Badge>
            </div>
            
            <div className="space-y-3 max-h-[530px] overflow-y-auto">
              {activeDispatches.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No active dispatches</p>
                </div>
              ) : (
                activeDispatches.map((dispatch) => (
                  <div
                    key={dispatch.id}
                    onClick={() => {
                      setSelectedDispatch(dispatch);
                      setMapCenter([dispatch.location.lat, dispatch.location.lng]);
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      selectedDispatch?.id === dispatch.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-slate-900">{dispatch.job_title}</h4>
                        <p className="text-xs text-slate-600 mt-0.5">{dispatch.customer_name}</p>
                      </div>
                      <Badge className={`${getStatusColor(dispatch.status)} text-xs`}>
                        {dispatch.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                      <User className="w-3 h-3" />
                      <span>{dispatch.worker_name}</span>
                    </div>

                    {dispatch.estimated_duration && (
                      <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                        <Clock className="w-3 h-3" />
                        <span>{dispatch.estimated_duration} min</span>
                      </div>
                    )}

                    {dispatch.location?.address && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{dispatch.location.address}</span>
                      </div>
                    )}

                    {dispatch.priority && dispatch.priority !== 'medium' && (
                      <div className="mt-2">
                        <Badge variant="outline" className={getPriorityColor(dispatch.priority)}>
                          {dispatch.priority.toUpperCase()}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Dispatch Details */}
      {selectedDispatch && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Dispatch Details</h3>
              <Button variant="outline" size="sm" onClick={() => setSelectedDispatch(null)}>
                Close
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Job Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-500">Title:</span>
                    <p className="font-medium">{selectedDispatch.job_title}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Customer:</span>
                    <p className="font-medium">{selectedDispatch.customer_name}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Status:</span>
                    <Badge className={getStatusColor(selectedDispatch.status)} size="sm">
                      {selectedDispatch.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Worker & Timing</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-500">Worker:</span>
                    <p className="font-medium">{selectedDispatch.worker_name}</p>
                  </div>
                  {selectedDispatch.estimated_duration && (
                    <div>
                      <span className="text-slate-500">Duration:</span>
                      <p className="font-medium">{selectedDispatch.estimated_duration} min</p>
                    </div>
                  )}
                  {selectedDispatch.scheduled_time && (
                    <div>
                      <span className="text-slate-500">Scheduled:</span>
                      <p className="font-medium">
                        {new Date(selectedDispatch.scheduled_time).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Location</h4>
                <div className="space-y-2 text-sm">
                  {selectedDispatch.location?.address && (
                    <div>
                      <span className="text-slate-500">Address:</span>
                      <p className="font-medium">{selectedDispatch.location.address}</p>
                    </div>
                  )}
                  {selectedDispatch.estimated_savings && (
                    <div>
                      <span className="text-slate-500">Est. Savings:</span>
                      <p className="font-medium text-green-600">
                        ${selectedDispatch.estimated_savings.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedDispatch.notes && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Notes</h4>
                <p className="text-sm text-slate-600">{selectedDispatch.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}