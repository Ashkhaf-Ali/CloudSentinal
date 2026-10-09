import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, Loader2, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextData: any;
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({ isOpen, onClose, contextData }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Hello! I am your CloudSentinel AI FinOps Chief Architect, powered by Gemini 3.1 Pro with High Thinking mode. How can I help you optimize your cloud infrastructure, investigate cost anomalies, or model budget scenarios today?'
    }
  ]);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const query = customPrompt || prompt;
    if (!query.trim() || loading) return;

    const newMessages = [...messages, { role: 'user' as const, text: query }];
    setMessages(newMessages);
    if (!customPrompt) setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, contextData }),
      });
      const data = await res.json();
      if (data.text) {
        setMessages([...newMessages, { role: 'assistant', text: data.text }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', text: 'I apologize, but I could not generate advice at this moment.' }]);
      }
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant', text: 'Network or server error communicating with Gemini AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'How can I reduce my compute costs by 25%?',
    'Analyze Project Alpha cost spike root cause',
    'What is our projected budget overrun risk?',
    'Review S3 storage lifecycle cost savings',
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-white">Gemini 3.1 Pro FinOps AI Advisor</h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                  Thinking Level: HIGH
                </span>
              </div>
              <p className="text-xs text-slate-400">Deep reasoning architecture & cost optimization engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/30">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                m.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-slate-800 border border-cyan-500/30 text-cyan-400'
              }`}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-cyan-600 text-white rounded-tr-none shadow-md shadow-cyan-600/20' 
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
              }`}>
                <div className="whitespace-pre-wrap font-sans">{m.text}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl rounded-tl-none text-slate-300 flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-xs font-medium">Gemini 3.1 Pro is performing deep multi-step architectural reasoning...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-5 py-2.5 bg-slate-900/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-400" /> Suggested:
          </span>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 text-xs text-slate-300 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
            >
              <span>{qp}</span>
              <ArrowRight className="w-3 h-3 text-cyan-400" />
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Gemini 3.1 Pro anything about your cloud spend, anomalies, or architecture..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !prompt.trim()}
            className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
