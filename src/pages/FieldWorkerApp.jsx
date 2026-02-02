import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Navigation, CheckCircle, Clock, MapPin, Phone, MessageSquare,
  Mic, Square, Send, AlertCircle, Wifi, WifiOff, Camera
} from 'lucide-react';

export default function FieldWorkerApp() {
  const [currentJob, setCurrentJob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [location, setLocation] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recognitionRef = useRef(null);

  // Check online status
  useEffect(() => {
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);

  // Get real-time location
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => console.error('Location error:', error),
        { enableHighAccuracy: true, maximumAge: 5000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Fetch jobs
  const { data: jobs = [] } = useQuery({
    queryKey: ['dispatch'],
    queryFn: () => base44.entities.Dispatch.filter({ status: 'queued' }, '-created_date', 10)
  });

  // Voice to text
  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setRecordedNotes(transcript);
    };

    recognition.start();
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // Update job status
  const updateJobMutation = useMutation({
    mutationFn: (data) => base44.entities.Dispatch.update(data.id, data),
    onSuccess: () => {
      setCurrentJob(null);
      setRecordedNotes('');
    }
  });

  const handleCompleteJob = async () => {
    if (!currentJob) return;

    updateJobMutation.mutate({
      id: currentJob.id,
      status: 'completed',
      completed_time: new Date().toISOString(),
      notes: recordedNotes || currentJob.notes,
      worker_location: location
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Field Worker App</h1>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Badge className="bg-emerald-100 text-emerald-800">
                <Wifi className="w-3 h-3 mr-1" />
                Online
              </Badge>
            ) : (
              <Badge className="bg-orange-100 text-orange-800">
                <WifiOff className="w-3 h-3 mr-1" />
                Offline
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Location & Status */}
        {location && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold">Current Location</p>
                    <p className="text-xs text-slate-600">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)} (±{location.accuracy.toFixed(0)}m)
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Live Tracking</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Job Selection */}
        {!currentJob ? (
          <div className="space-y-3">
            <h2 className="font-semibold text-slate-900">Available Jobs</h2>
            {jobs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-slate-500">No jobs assigned</p>
                </CardContent>
              </Card>
            ) : (
              jobs.map(job => (
                <Card key={job.id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => setCurrentJob(job)}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-900">{job.job_title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{job.customer_name}</p>
                        <div className="flex gap-2 mt-3 text-xs text-slate-600">
                          <span>📍 {job.location?.address || 'No address'}</span>
                          <span>⏱️ {job.estimated_duration}m</span>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Tap to start</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : (
          /* Active Job View */
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
              <TabsTrigger value="notes" className="flex-1">Notes & Photos</TabsTrigger>
              <TabsTrigger value="communication" className="flex-1">Communication</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{currentJob.job_title}</span>
                    <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">CUSTOMER</p>
                    <p className="font-semibold">{currentJob.customer_name}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">LOCATION</p>
                    <p className="font-semibold">{currentJob.location?.address}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">DURATION</p>
                      <p className="font-semibold">{currentJob.estimated_duration} min</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">PRIORITY</p>
                      <Badge className={currentJob.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                        {currentJob.priority}
                      </Badge>
                    </div>
                  </div>

                  <Button 
                    onClick={handleCompleteJob}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={updateJobMutation.isPending}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {updateJobMutation.isPending ? 'Completing...' : 'Mark Complete'}
                  </Button>
                  <Button 
                    onClick={() => setCurrentJob(null)}
                    variant="outline"
                    className="w-full"
                  >
                    Back to Jobs
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Job Notes & Photos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-2">VOICE TO TEXT</p>
                    <div className="flex gap-2 mb-3">
                      {isRecording ? (
                        <Button 
                          onClick={stopVoiceRecording}
                          className="flex-1 bg-red-600 hover:bg-red-700"
                        >
                          <Square className="w-4 h-4 mr-2" />
                          Stop Recording
                        </Button>
                      ) : (
                        <Button 
                          onClick={startVoiceRecording}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <Mic className="w-4 h-4 mr-2" />
                          Start Recording
                        </Button>
                      )}
                    </div>

                    {isRecording && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-3">
                        <p className="text-xs text-red-800">🎤 Recording... Speak clearly</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-2">TRANSCRIBED NOTES</p>
                    <Textarea
                      value={recordedNotes}
                      onChange={(e) => setRecordedNotes(e.target.value)}
                      placeholder="Notes will appear here..."
                      className="h-24"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-2">PHOTO CAPTURE</p>
                    <Button variant="outline" className="w-full">
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communication">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Communication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Dispatcher
                  </Button>
                  <Button className="w-full" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Status Update
                  </Button>
                  <Button className="w-full" variant="outline">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Report Issue
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}