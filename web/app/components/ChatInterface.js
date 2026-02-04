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
      content: 'Hi. I\'m Simple AI. Type /menu to see what I can do.',
      persona: 'Simple_AI'
    }]);
  }, []);

  const handleCommand = (cmd) => {
    const lower = cmd.toLowerCase().trim();
    if (lower === '/menu') {
      setMessages(p => [...p, 
        { role: 'user', content: cmd }, 
        { role: 'assistant', content: '🟢 READY NOW:\n• /bots - Switch AI personalities\n• /chat - Talk with current persona\n• /switch [name] - Change personality\n• /default - Return to Simple AI\n\n🔨 COMING SOON:\n• /export - Generate Telegram/Discord bots\n• Bot marketplace\n• Custom personality builder\n• System settings for sale', persona: currentPersona.name }
      ]);
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
      setMessages(p => [...p, { role: 'user', content: cmd }, { role: 'assistant', content: 'Back to Simple AI mode.', persona: 'Simple_AI' }]);
      return true;
    }
    if (lower === '/export') {
      setMessages(p => [...p, { role: 'user', content: cmd }, { role: 'assistant', content: 'Bot export coming soon! Generate Telegram and Discord configs for any personality.', persona: currentPersona.name }]);
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
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D1B69] via-[#0A0E27] to-[#2D1B69] opacity-60"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00D9FF] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8B9FDE] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-[#8B9FDE]/30 bg-[#0A0E27]/80 backdrop-blur-xl">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <h1 className="text-5xl font-bold text-[#00D9FF] drop-shadow-[0_0_20px_rgba(0,217,255,0.6)] mb-1">
                Simple As That
              </h1>
              <p className="text-[#8B9FDE] text-sm">
                AI Personality Lab & Bot Factory
              </p>
            </div>
            <div className="text-right text-xs text-[#8B9FDE]/50">
              <p>Affiliates:</p>
              <p>Voss Neural Research</p>
              <p>Duck Research Division</p>
            </div>
          </div>
        </div>
        
        {/* Main content - 3 columns */}
        <div className="flex-1 flex gap-4 p-6 max-w-7xl mx-auto w-full overflow-hidden">
          {/* Left sidebar - Deploy buttons */}
          <div className="w-48 flex flex-col gap-3">
            <div className="bg-[#2D1B69]/60 backdrop-blur-sm border border-[#8B9FDE]/40 rounded-xl p-4 text-center">
              <p className="text-[#8B9FDE] text-xs mb-3 uppercase tracking-wide">Deploy Bot</p>
              <button className="w-full mb-2 px-4 py-2 rounded-lg bg-[#0088cc]/80 hover:bg-[#0088cc] text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-[#0088cc]/30 border border-[#00D9FF]/30">
                Telegram
              </button>
              <button className="w-full px-4 py-2 rounded-lg bg-[#5865F2]/80 hover:bg-[#5865F2] text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-[#5865F2]/30 border border-[#8B9FDE]/30">
                Discord
              </button>
              <p className="text-[#8B9FDE]/60 text-xs mt-2">(coming soon)</p>
            </div>
            
            <div className="bg-[#2D1B69]/60 backdrop-blur-sm border border-[#8B9FDE]/40 rounded-xl p-4">
              <p className="text-[#00D9FF] font-bold text-xs mb-2 uppercase tracking-wide">Active</p>
              <p className="text-white text-sm">{currentPersona.name}</p>
            </div>
          </div>
          
          {/* Center - Chat */}
          <div className="flex-1 flex flex-col bg-[#2D1B69]/40 backdrop-blur-sm border border-[#8B9FDE]/30 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div className={m.role === 'user' 
                    ? 'max-w-[75%] rounded-2xl px-5 py-3 bg-gradient-to-r from-[#00D9FF] to-[#6B9B9E] text-[#0A0E27] font-semibold shadow-lg' 
                    : 'max-w-[75%] rounded-2xl px-5 py-4 bg-[#2D1B69]/90 text-white border border-[#8B9FDE]/40 shadow-lg'
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
                  <div className="bg-[#2D1B69]/90 rounded-2xl px-5 py-3 border border-[#8B9FDE]/40">
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
            
            <div className="p-4 border-t border-[#8B9FDE]/30">
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()} 
                  placeholder="Type /menu for commands..." 
                  className="flex-1 px-5 py-3 rounded-xl bg-[#0A0E27]/60 border-2 border-[#8B9FDE]/30 text-white placeholder-[#8B9FDE]/50 focus:outline-none focus:border-[#00D9FF] focus:shadow-lg focus:shadow-[#00D9FF]/20 transition-all" 
                />
                <button 
                  onClick={sendMessage} 
                  disabled={isLoading} 
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#6B9B9E] text-[#0A0E27] font-bold hover:shadow-xl hover:shadow-[#00D9FF]/40 transition-all disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
          
          {/* Right sidebar - Marketplace */}
          <div className="w-64 bg-[#2D1B69]/60 backdrop-blur-sm border border-[#8B9FDE]/40 rounded-2xl p-5 overflow-y-auto">
            <h3 className="text-[#00D9FF] font-bold text-lg mb-3 drop-shadow-[0_0_10px_rgba(0,217,255,0.3)]">Bot Marketplace</h3>
            <p className="text-[#8B9FDE] text-xs mb-4">AI systems and bots for sale</p>
            
            <div className="space-y-3">
              <div className="p-3 bg-[#0A0E27]/60 rounded-lg border border-[#8B9FDE]/20 hover:border-[#00D9FF]/40 transition-colors cursor-pointer">
                <p className="text-white text-sm font-semibold">System Settings</p>
                <p className="text-[#8B9FDE]/70 text-xs mt-1">Pre-built AI configs</p>
              </div>
              
              <div className="p-3 bg-[#0A0E27]/60 rounded-lg border border-[#8B9FDE]/20 hover:border-[#00D9FF]/40 transition-colors cursor-pointer">
                <p className="text-white text-sm font-semibold">Custom Bots</p>
                <p className="text-[#8B9FDE]/70 text-xs mt-1">Telegram & Discord ready</p>
              </div>
              
              <div className="p-3 bg-[#0A0E27]/60 rounded-lg border border-[#8B9FDE]/20">
                <p className="text-white text-sm font-semibold">Coming Soon</p>
                <p className="text-[#8B9FDE]/70 text-xs mt-1">Browse full catalog</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-3 border-t border-[#8B9FDE]/30 bg-[#0A0E27]/80 backdrop-blur-xl">
          <p className="text-xs text-[#8B9FDE]/70 text-center">Simple As That</p>
        </div>
      </div>
    </div>
  );
}
