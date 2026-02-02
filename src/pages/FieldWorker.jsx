import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Navigation,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  MessageSquare,
  ArrowRight,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 13);
  }, [center, map]);
  return null;
}

export default function FieldWorker() {
  const [selectedDispatch, setSelectedDispatch] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log('Location error:', error)
      );
    }
  }, []);

  const { data: dispatches = [], isLoading } = useQuery({
    queryKey: ['my-dispatches'],
    queryFn: () => base44.entities.Dispatch.filter({
      worker_name: user?.full_name,
      status: { $in: ['queued', 'en_route', 'in_progress'] }
    }, '-scheduled_time'),
    enabled: !!user,
    refetchInterval: 30000
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Dispatch.update(id, { 
      status,
      worker_location: currentLocation,
      ...(status === 'completed' && { completed_time: new Date().toISOString() })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-dispatches']);
      setSelectedDispatch(null);
    }
  });

  const handleStatusUpdate = (dispatch, newStatus) => {
    updateStatusMutation.mutate({ id: dispatch.id, status: newStatus });
  };

  const handleNavigate = (dispatch) => {
    if (dispatch.location?.lat && dispatch.location?.lng) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${dispatch.location.lat},${dispatch.location.lng}`,
        '_blank'
      );
    }
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
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const activeDispatch = dispatches.find(d => d.status === 'in_progress') || dispatches[0];
  const mapCenter = activeDispatch?.location || currentLocation || { lat: 37.7749, lng: -122.4194 };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-slate-900">My Jobs</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => queryClient.invalidateQueries(['my-dispatches'])}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-slate-600">
            {dispatches.length} active job{dispatches.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Map View */}
      {activeDispatch && (
        <div className="h-64 relative">
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={13}
            className="h-full w-full"
            zoomControl={false}
          >
            <MapUpdater center={[mapCenter.lat, mapCenter.lng]} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {currentLocation && (
              <Marker position={[currentLocation.lat, currentLocation.lng]}>
                <Popup>Your Location</Popup>
              </Marker>
            )}
            
            {activeDispatch.location && (
              <Marker position={[activeDispatch.location.lat, activeDispatch.location.lng]}>
                <Popup>{activeDispatch.job_title}</Popup>
              </Marker>
            )}
          </MapContainer>

          {activeDispatch.location && (
            <Button
              onClick={() => handleNavigate(activeDispatch)}
              className="absolute bottom-4 right-4 z-[1000] shadow-lg"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Navigate
            </Button>
          )}
        </div>
      )}

      {/* Job List */}
      <div className="px-4 py-4 space-y-3">
        {dispatches.length === 0 ? (
          <Card className="p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-900 mb-2">All caught up!</h3>
            <p className="text-sm text-slate-600">No active jobs right now</p>
          </Card>
        ) : (
          dispatches.map((dispatch) => (
            <Card
              key={dispatch.id}
              className={`p-4 cursor-pointer transition-all ${
                selectedDispatch?.id === dispatch.id
                  ? 'ring-2 ring-blue-500 shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedDispatch(selectedDispatch?.id === dispatch.id ? null : dispatch)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(dispatch.priority)}`} />
                    <h3 className="font-semibold text-slate-900">{dispatch.job_title}</h3>
                  </div>
                  <p className="text-sm text-slate-600">{dispatch.customer_name}</p>
                </div>
                <Badge className={getStatusColor(dispatch.status)}>
                  {dispatch.status.replace('_', ' ')}
                </Badge>
              </div>

              {dispatch.location?.address && (
                <div className="flex items-start gap-2 mb-3 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{dispatch.location.address}</span>
                </div>
              )}

              {dispatch.scheduled_time && (
                <div className="flex items-center gap-2 mb-3 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(dispatch.scheduled_time).toLocaleString()}</span>
                </div>
              )}

              {selectedDispatch?.id === dispatch.id && (
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                  {dispatch.notes && (
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs font-medium text-slate-500 mb-1">Notes</p>
                      <p className="text-sm text-slate-700">{dispatch.notes}</p>
                    </div>
                  )}

                  {dispatch.estimated_duration && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>Est. {dispatch.estimated_duration} minutes</span>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    {dispatch.status === 'queued' && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(dispatch, 'en_route');
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={updateStatusMutation.isPending}
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Start Travel
                      </Button>
                    )}

                    {dispatch.status === 'en_route' && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(dispatch, 'in_progress');
                        }}
                        className="w-full bg-amber-600 hover:bg-amber-700"
                        disabled={updateStatusMutation.isPending}
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Start Job
                      </Button>
                    )}

                    {dispatch.status === 'in_progress' && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(dispatch, 'completed');
                        }}
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={updateStatusMutation.isPending}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Complete
                      </Button>
                    )}

                    {dispatch.location && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigate(dispatch);
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Navigate
                      </Button>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `tel:+1234567890`;
                      }}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `sms:+1234567890`;
                      }}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-around">
        <button className="flex flex-col items-center gap-1 text-blue-600">
          <MapPin className="w-5 h-5" />
          <span className="text-xs font-medium">Jobs</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Clock className="w-5 h-5" />
          <span className="text-xs">History</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <AlertCircle className="w-5 h-5" />
          <span className="text-xs">Support</span>
        </button>
      </div>
    </div>
  );
}