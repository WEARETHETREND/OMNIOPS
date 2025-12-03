import React from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  User, 
  Play, 
  Pause,
  Settings,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
  complete: CheckCircle,
  error: AlertCircle,
  create: FileText,
  user: User,
  start: Play,
  pause: Pause,
  update: Settings,
  automation: Zap,
};

const colorMap = {
  complete: 'text-emerald-500 bg-emerald-50',
  error: 'text-rose-500 bg-rose-50',
  create: 'text-blue-500 bg-blue-50',
  user: 'text-violet-500 bg-violet-50',
  start: 'text-emerald-500 bg-emerald-50',
  pause: 'text-amber-500 bg-amber-50',
  update: 'text-slate-500 bg-slate-100',
  automation: 'text-cyan-500 bg-cyan-50',
};

export default function ActivityFeed({ activities = [], maxItems = 5 }) {
  const displayActivities = activities.slice(0, maxItems);

  if (displayActivities.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayActivities.map((activity, i) => {
        const Icon = iconMap[activity.type] || Zap;
        const colors = colorMap[activity.type] || colorMap.update;
        
        return (
          <div key={activity.id || i} className="flex gap-3">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", colors)}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700">{activity.message}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-400">{activity.time}</span>
                {activity.user && (
                  <>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{activity.user}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}