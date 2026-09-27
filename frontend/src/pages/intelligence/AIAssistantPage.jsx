import React, { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { SubNavTabs } from '../../components/common/SubNavTabs';
import { intelligenceTabs } from './IntelligenceOverviewPage';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/forms/Input';
import { Badge } from '../../components/ui/Badge';
import { Bot, Send, Sparkles, User } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const AIAssistantPage = () => {
  const { addToast } = useToast();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am BuildOps AI Site Assistant. How can I assist you with site metrics, rebar stock levels, or safety risk analysis today?',
      time: '10:00 AM',
    },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    const currentQuery = query;
    setQuery('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `[Phase 0 Response Mock] Analyzed query "${currentQuery}". In Phase 4, I will query live site telemetry, BOQ rates, and material inventory APIs to give instant insights.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  return (
    <div>
      <PageHeader
        title="AI Construction Copilot Assistant"
        subtitle="Conversational site intelligence query assistant for site supervisors, PMs, and procurement."
        badgeText="Phase 0 Mock Chat"
      />
      <SubNavTabs tabs={intelligenceTabs} />

      <Card className="flex flex-col h-[60vh] max-h-[600px] p-0 overflow-hidden">
        {/* Chat Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-xl ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  m.sender === 'user' ? 'bg-slate-900 text-white' : 'bg-amber-500 text-slate-950 shadow-xs'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-xs rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className="font-bold text-[10px] opacity-75">
                    {m.sender === 'user' ? 'You' : 'BuildOps AI'}
                  </span>
                  <span className="text-[10px] opacity-60">{m.time}</span>
                </div>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask AI: 'Will rebar stock last until Friday at Skyline Tower?'"
            className="flex-1"
          />
          <Button type="submit" variant="secondary" rightIcon={Send}>
            Ask AI
          </Button>
        </form>
      </Card>
    </div>
  );
};
