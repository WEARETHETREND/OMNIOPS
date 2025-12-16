import React, { useState, useEffect } from 'react';
import { safeGet, safePost } from '@/components/api/apiClient';
import { 
  Bell,
  CheckCircle,
  Trash2,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = async () => {
    setLoading(true);
    setError('');
    const r = await safeGet('/notifications', { 
      status: filter === 'all' ? undefined : filter 
    });
    if (!r.ok) {
      setError(r.error);
    } else {
      setNotifications(r.data.notifications || []);
    }
    setLoading(false);
  };

  const markAsRead = async (id) => {
    const r = await safePost(`/notifications/${id}/read`);
    if (!r.ok) {
      toast.error(`Failed: ${r.error}`);
    } else {
      await loadNotifications();
    }
  };

  const markAllAsRead = async () => {
    const r = await safePost('/notifications/read-all');
    if (!r.ok) {
      toast.error(`Failed: ${r.error}`);
    } else {
      toast.success('All notifications marked as read');
      await loadNotifications();
    }
  };

  const deleteNotification = async (id) => {
    const r = await safePost(`/notifications/${id}/delete`);
    if (!r.ok) {
      toast.error(`Failed: ${r.error}`);
    } else {
      await loadNotifications();
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications Center</h1>
          <p className="text-slate-500 mt-1">{unreadCount} unread notifications</p>
        </div>
        <Button onClick={markAllAsRead} variant="outline">
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark All as Read
        </Button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Filters */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-3">
          {Array(8).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map(n => (
            <div 
              key={n.id} 
              className={`bg-white rounded-xl border border-slate-200/60 p-4 ${!n.read ? 'border-l-4 border-l-blue-500' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  n.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                  n.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                  n.type === 'error' ? 'bg-rose-50 text-rose-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900">{n.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!n.read && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => markAsRead(n.id)}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteNotification(n.id)}
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <Bell className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No notifications</h3>
          <p className="text-slate-500">You're all caught up!</p>
        </div>
      )}
    </div>
  );
}