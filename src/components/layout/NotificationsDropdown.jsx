import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Bell, Check, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const mockNotifications = [
  { id: 1, type: 'warning', title: 'Workflow paused', message: 'Invoice Processing needs attention', time: '2m ago', read: false },
  { id: 2, type: 'success', title: 'Integration synced', message: 'Salesforce sync completed', time: '15m ago', read: false },
  { id: 3, type: 'info', title: 'New feature', message: 'Keyboard shortcuts are now available', time: '1h ago', read: true },
];

const typeConfig = {
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
  success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
  error: { icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50' },
};

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-slate-900">Notifications</h3>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const config = typeConfig[notification.type];
              const Icon = config.icon;
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "px-4 py-3 border-b last:border-0 hover:bg-slate-50 transition-colors",
                    !notification.read && "bg-blue-50/50"
                  )}
                >
                  <div className="flex gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", config.bg)}>
                      <Icon className={cn("w-4 h-4", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                        <button onClick={() => dismiss(notification.id)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{notification.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">{notification.time}</span>
                        {!notification.read && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="px-4 py-2 border-t bg-slate-50">
          <Link to={createPageUrl('Alerts')} className="text-xs text-blue-600 hover:underline">
            View all alerts →
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}