import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, AtSign, Heart } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function TeamChat({ jobId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    
    // Simulate initial messages
    setMessages([
      { id: 1, user: 'Sarah Martinez', email: 'sarah@ops.com', message: 'Job assigned to John, he\'s 5 mins away', timestamp: '10:23 AM', avatar: 'SM' },
      { id: 2, user: 'John Smith', email: 'john@field.com', message: 'Arrived on site, starting inspection', timestamp: '10:28 AM', avatar: 'JS' },
      { id: 3, user: 'Sarah Martinez', email: 'sarah@ops.com', message: '✓ Got it. Let me know when complete', timestamp: '10:29 AM', avatar: 'SM' }
    ]);
  }, []);

  const handleSendMessage = () => {
    if (!input.trim() || !user) return;

    const newMessage = {
      id: messages.length + 1,
      user: user.full_name || 'Me',
      email: user.email,
      message: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: (user.full_name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    };

    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="text-lg">Job Communication</CardTitle>
        <CardDescription>Real-time chat with team and field worker</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className="flex gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className="bg-slate-200 text-xs font-semibold">
                {msg.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-sm font-semibold">{msg.user}</p>
                <p className="text-xs text-slate-500">{msg.timestamp}</p>
              </div>
              <p className="text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2 inline-block max-w-xs">
                {msg.message}
              </p>
            </div>
          </div>
        ))}
      </CardContent>

      <div className="border-t p-4 space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button size="icon" onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-xs">
            <AtSign className="w-3 h-3 mr-1" />
            Mention
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Heart className="w-3 h-3 mr-1" />
            React
          </Button>
        </div>
      </div>
    </Card>
  );
}