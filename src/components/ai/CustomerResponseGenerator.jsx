import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, Copy, Send, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerResponseGenerator({ dispatch }) {
  const [generating, setGenerating] = useState(false);
  const [response, setResponse] = useState('');
  const [tone, setTone] = useState('professional');

  const generateResponse = async () => {
    setGenerating(true);
    try {
      const context = `
Job: ${dispatch.job_title}
Customer: ${dispatch.customer_name}
Status: ${dispatch.status}
Notes: ${dispatch.notes || 'No notes available'}
Priority: ${dispatch.priority}
      `.trim();

      const prompt = `Based on the following job information, generate a ${tone} customer response email:

${context}

Generate a brief, clear response that:
1. Acknowledges the customer's job
2. Provides a status update
3. Sets expectations for next steps
4. Maintains a ${tone} tone

Keep it under 150 words.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: false
      });

      setResponse(result);
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to generate response');
    }
    setGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    toast.success('Response copied to clipboard');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            AI Response Generator
          </CardTitle>
          <div className="flex gap-2">
            {['professional', 'friendly', 'urgent'].map(t => (
              <Button
                key={t}
                variant={tone === t ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTone(t)}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!response ? (
          <Button
            onClick={generateResponse}
            disabled={generating}
            className="w-full"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Response
              </>
            )}
          </Button>
        ) : (
          <>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="min-h-[150px]"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopy} className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button onClick={generateResponse} variant="outline" className="flex-1">
                Regenerate
              </Button>
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}