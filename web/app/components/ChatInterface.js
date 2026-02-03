'use client';
import { useState, useEffect, useRef } from 'react';
import { personas } from '@/config/personas';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentPersona, setCurrentPersona] = useState(personas[0]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: 'Hey! Simple_AI here. I adapt to your vibe and can switch personalities. Type /help to see what I can do.',
      persona: 'Simple_AI'
    }]);
  }, []);

  const handleCommand = (cmd) => {
    const lower = cmd.toLowerCase().trim();
    if (lower === '/help' || lower === '/commands') {
      setMessages(p => [...p, { role: 'user', content: cmd }, { role: 'assistant', content: 'Available commands:\n\n/bots - List available personalities\n/switch [slug] - Switch to a different persona\n/default - Return to Simple_AI\n/export - Export bot config (coming soon)\n/research - View research papers (coming soon)', persona: currentPersona.name }]);
      return true;
    }
    if (lower === '/bots') {
      const list = personas.map((p, i) => `${i + 1}. ${p.name} - ${p.description}`).join('\n');
      setMessages(p => [...p, { role: 'user', content: cmd }, { role: 'assistant', content: 'Available personalities:\n\n' + list + '\n\nUse /switch [slug] to switch.\nExample: /switch astrology-bitch', persona: currentPersona.name }]);
      return true;
    }
    if (lower.startsWith('/switch ')) {
      const slug = lower.replace('/switch ', '');
      const found = personas.find(p => p.slug === slug);
      if (found) {
        setCurrentPersona(found);
        setMessages(p => [...p, { role: 'user', content: cmd }, { role: 'assistant', content: 'Switched to ' + found.name + ' - ' + found.description, persona: found.name }]);
      } else {
        setMessages(p => [...p, { role: 'user', content: cmd }, { role: 'assistant', content: 'Persona not found. Use /bots to see options.', persona: currentPersona.name }]);
      }
      return true;
    }
    if (lower === '/default') {
      setCurrentPersona(personas[0]);
      setMessages(p => [...p, { role: 'user', content: cmd }, { role: 'assistant', content: 'Back to Simple_AI mode.', persona: 'Simple_AI' }]);
      return true;
    }
    if (lower === '/export') {
      setMessages(p => [...p, { role: 'user', content: cmd }, { role: 'assistant', content: 'Bot export feature coming soon! Generate Telegram and Discord bot configs.', persona: currentPersona.name }]);
      return true;
    }
    if (lower === '/research') {
      setMessages(p => [...p, { role: 'user', content: cmd }, { role: 'assistant', content: 'Research Division coming soon! Browse certified fake news and entertaining papers.', persona: currentPersona.name }]);
      return true;
    }
    return false;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (handleCommand(input)) {
      setInput('');
      return;
    }
    const msg = { role: 'user', content: input };
    setMessages(p => [...p, msg]);
    setInput('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, msg], personaSlug: currentPersona.slug })
      });
      const data = await res.json();
      setMessages(p => [...p, { role: 'assistant', content: data.message || 'Error', persona: currentPersona.name }]);
    } catch (e) {
      setMessages(p => [...p, { role: 'assistant', content: 'Connection error.', persona: currentPersona.name }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0A0E27] relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D1B69] via-[#0A0E27] to-[#2D1B69] opacity-60"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00D9FF] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8B9FDE] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header with glow */}
        <div className="p-6 border-b border-[#8B9FDE]/30 bg-[#0A0E27]/80 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">
                S.A.T. <span className="text-[#00D9FF] drop-shadow-[0_0_15px_rgba(0,217,255,0.5)]">Labs</span>
              </h1>
              <p className="text-[#8B9FDE] text-sm">
                AI Personality Engine • Bot Factory • Research Division
              </p>
            </div>
            <div className="px-4 py-2 rounded-full bg-[#2D1B69]/60 border border-[#00D9FF]/40">
              <p className="text-xs text-[#8B9FDE]">Active:</p>
              <p className="text-[#00D9FF] font-bold">{currentPersona.name}</p>
            </div>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
              <div className={m.role === 'user' 
                ? 'max-w-[75%] rounded-2xl px-5 py-3 bg-gradient-to-r from-[#00D9FF] to-[#6B9B9E] text-[#0A0E27] font-semibold shadow-lg shadow-[#00D9FF]/20' 
                : 'max-w-[75%] rounded-2xl px-5 py-4 bg-[#2D1B69]/70 backdrop-blur-sm text-white border border-[#8B9FDE]/40 shadow-lg'
              }>
                {m.role === 'assistant' && (
                  <div className="text-xs text-[#00D9FF] mb-2 font-bold uppercase tracking-wide">{m.persona}</div>
                )}
                <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#2D1B69]/70 backdrop-blur-sm rounded-2xl px-5 py-3 border border-[#8B9FDE]/40">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-[#00D9FF] rounded-full animate-bounce shadow-lg shadow-[#00D9FF]/50"></div>
                  <div className="w-3 h-3 bg-[#00D9FF] rounded-full animate-bounce shadow-lg shadow-[#00D9FF]/50" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-3 h-3 bg-[#00D9FF] rounded-full animate-bounce shadow-lg shadow-[#00D9FF]/50" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input with glow */}
        <div className="p-6 border-t border-[#8B9FDE]/30 bg-[#0A0E27]/80 backdrop-blur-xl">
          <div className="flex gap-3 mb-3">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()} 
              placeholder="Type /help for commands..." 
              className="flex-1 px-5 py-4 rounded-xl bg-[#2D1B69]/60 border-2 border-[#8B9FDE]/30 text-white placeholder-[#8B9FDE]/50 focus:outline-none focus:border-[#00D9FF] focus:shadow-lg focus:shadow-[#00D9FF]/20 transition-all" 
            />
            <button 
              onClick={sendMessage} 
              disabled={isLoading} 
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#6B9B9E] text-[#0A0E27] font-bold hover:shadow-xl hover:shadow-[#00D9FF]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-[#8B9FDE]/70 text-center">
            Simple As That — Certified by Voss Neural Research
          </p>
        </div>
      </div>
    </div>
  );
}
