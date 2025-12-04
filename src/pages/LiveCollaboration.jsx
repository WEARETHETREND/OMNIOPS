import React, { useState, useEffect } from 'react';
import { 
  Users,
  MessageSquare,
  Send,
  AtSign,
  Paperclip,
  Image,
  Smile,
  MoreVertical,
  Clock,
  CheckCheck,
  Pin,
  Reply,
  Edit2,
  Trash2,
  Bell,
  MousePointer2,
  Circle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const mockUsers = [
  { id: 1, name: 'John Smith', role: 'Technician', online: true, color: 'bg-emerald-500', activity: 'Editing Job #1234' },
  { id: 2, name: 'Sarah Davis', role: 'Dispatcher', online: true, color: 'bg-blue-500', activity: 'Viewing Schedule' },
  { id: 3, name: 'Mike Johnson', role: 'Manager', online: true, color: 'bg-violet-500', activity: 'On Dashboard' },
  { id: 4, name: 'Emily Brown', role: 'CSR', online: false, color: 'bg-amber-500', activity: 'Last seen 2h ago' },
];

const mockMessages = [
  { id: 1, user: 'John Smith', avatar: 'JS', color: 'bg-emerald-500', message: 'Just finished the Smith job, invoice is ready for review', time: '10:32 AM', read: true },
  { id: 2, user: 'Sarah Davis', avatar: 'SD', color: 'bg-blue-500', message: '@Mike can you approve the estimate for Johnson project?', time: '10:45 AM', read: true, mentions: ['Mike'] },
  { id: 3, user: 'Mike Johnson', avatar: 'MJ', color: 'bg-violet-500', message: 'Approved! @Sarah please schedule for next week', time: '10:52 AM', read: true, mentions: ['Sarah'] },
  { id: 4, user: 'John Smith', avatar: 'JS', color: 'bg-emerald-500', message: 'Running 15 min late to the Williams appointment, traffic on I-95', time: '11:15 AM', read: false },
];

const mockActivities = [
  { id: 1, user: 'John Smith', action: 'completed', target: 'Job #1234', time: '2 min ago' },
  { id: 2, user: 'Sarah Davis', action: 'scheduled', target: 'Appointment for Williams', time: '5 min ago' },
  { id: 3, user: 'Mike Johnson', action: 'approved', target: 'Estimate #EST-2024-089', time: '8 min ago' },
  { id: 4, user: 'Emily Brown', action: 'created', target: 'New customer: Anderson Corp', time: '15 min ago' },
];

export default function LiveCollaboration() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [showMentions, setShowMentions] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, {
      id: messages.length + 1,
      user: 'You',
      avatar: 'ME',
      color: 'bg-slate-700',
      message: message,
      time: 'Just now',
      read: false
    }]);
    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-cyan-600" />
            Live Collaboration
          </h1>
          <p className="text-slate-500">Real-time team communication and activity</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {mockUsers.filter(u => u.online).map(user => (
              <Avatar key={user.id} className={cn("w-8 h-8 border-2 border-white", user.color)}>
                <AvatarFallback className={cn("text-white text-xs", user.color)}>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <Badge className="bg-emerald-100 text-emerald-700">
            {mockUsers.filter(u => u.online).length} online
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chat */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Team Chat</h3>
              <p className="text-xs text-slate-500">General channel</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Pin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className="group flex gap-3">
                <Avatar className={cn("w-9 h-9", msg.color)}>
                  <AvatarFallback className={cn("text-white text-xs", msg.color)}>
                    {msg.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">{msg.user}</span>
                    <span className="text-xs text-slate-400">{msg.time}</span>
                    {msg.read && <CheckCheck className="w-3 h-3 text-blue-500" />}
                  </div>
                  <p className="text-sm text-slate-600 mt-0.5">
                    {msg.message.split(' ').map((word, i) => 
                      word.startsWith('@') ? (
                        <span key={i} className="text-blue-600 font-medium">{word} </span>
                      ) : (
                        word + ' '
                      )
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
                      <Reply className="w-3 h-3" /> Reply
                    </button>
                    <button className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
                      <Smile className="w-3 h-3" /> React
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Image className="w-4 h-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setShowMentions(e.target.value.includes('@'));
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message... Use @ to mention"
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setMessage(message + '@')}
                >
                  <AtSign className="w-4 h-4 text-slate-400" />
                </Button>
              </div>
              <Button onClick={handleSend} disabled={!message.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {showMentions && (
              <div className="absolute bottom-20 left-4 right-4 bg-white rounded-lg border border-slate-200 shadow-lg p-2">
                {mockUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setMessage(message.replace(/@\w*$/, `@${user.name.split(' ')[0]} `));
                      setShowMentions(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 hover:bg-slate-50 rounded"
                  >
                    <Avatar className={cn("w-6 h-6", user.color)}>
                      <AvatarFallback className={cn("text-white text-xs", user.color)}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user.name}</span>
                    <span className="text-xs text-slate-400">{user.role}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Online Users */}
          <div className="bg-white rounded-xl border border-slate-200/60 p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Team Members</h3>
            <div className="space-y-3">
              {mockUsers.map(user => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className={cn("w-9 h-9", user.color)}>
                      <AvatarFallback className={cn("text-white text-xs", user.color)}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className={cn(
                      "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white",
                      user.online ? "bg-emerald-500" : "bg-slate-300"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.activity}</p>
                  </div>
                  {user.online && (
                    <MousePointer2 className="w-4 h-4 text-cyan-500" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-xl border border-slate-200/60 p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Activity Feed</h3>
            <div className="space-y-3">
              {mockActivities.map(activity => (
                <div key={activity.id} className="flex items-start gap-3">
                  <Circle className="w-2 h-2 mt-1.5 text-cyan-500 fill-cyan-500" />
                  <div>
                    <p className="text-sm text-slate-600">
                      <span className="font-medium text-slate-900">{activity.user}</span>
                      {' '}{activity.action}{' '}
                      <span className="font-medium text-slate-900">{activity.target}</span>
                    </p>
                    <p className="text-xs text-slate-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Cursors Indicator */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <MousePointer2 className="w-5 h-5 text-cyan-600" />
              <h3 className="font-semibold text-cyan-900">Live Cursors</h3>
            </div>
            <p className="text-sm text-cyan-700">
              See where team members are working in real-time. Cursors appear when viewing the same document or job.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}