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
      setMessages(p => [...p, 
        { role: 'user', content: cmd }, 
        { role: 'assistant', content: 'Available commands:\n\n/bots - List available personalities\n/switch [slug] - Switch to a different persona\n/default - Return to Simple_AI\n/export - Export bot config (coming soon)\n/research - View research papers (coming soon)', persona: currentPersona.name }
      ]);
      return true;
    }
    
    if (lower === '/bots') {
      const list = personas.map((p, i) => `${i + 1}. ${p.name} - ${p.description}`).join('\n');
      setMessages(p => [...p, 
        { role: 'user', content: cmd }, 
        { role: 'assistant', content: 'Available personalities:\n\n' + list + '\n\nUse /switch [slug] to switch.\nExample: /switch astrology-bitch', persona: currentPersona.name }
      ]);
      return true;
    }
    
    if (lower.startsWith('/switch ')) {
      const slug = lower.replace('/switch ', '');
      const found = personas.find(p => p.slug === slug);
      if (found) {
        setCurrentPersona(found);
        setMessages(p => [...p, 
          { role: 'user', content: cmd }, 
          { role: 'assistant', content: 'Switched to ' + found.name + ' - ' + found.description, persona: found.name }
        ]);
      } else {
        setMessages(p => [...p, 
          { role: 'user', content: cmd }, 
          { role: 'assistant', content: 'Persona not found. Use /bots to see options.', persona: currentPersona.name }
        ]);
      }
      return true;
    }
    
    if (lower === '/default') {
      setCurrentPersona(personas[0]);
      setMessages(p => [...p, 
        { role: 'user', content: cmd }, 
        { role: 'assistant', content: 'Back to Simple_AI mode.', persona: 'Simple_AI' }
      ]);
      return true;
    }
    
    if (lower === '/export') {
      setMessages(p => [...p, 
        { role: 'user', content: cmd }, 
        { role: 'assistant', content: 'Bot export feature coming soon! This will let you generate Telegram and Discord bot configs based on any personality.', persona: currentPersona.name }
      ]);
      return true;
    }
    
    if (lower === '/research') {
      setMessages(p => [...p, 
        { role: 'user', content: cmd }, 
        { role: 'assistant', content: 'Research Division coming soon! Browse certified fake news, fake research papers, and entertaining reads.', persona: currentPersona.name }
      ]);
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
      setMessages(p => [...p, { 
        role: 'assistant', 
        content: data.message || 'Error connecting to AI', 
        persona: currentPersona.name 
      }]);
    } catch (e) {
      setMessages(p => [...p, { 
        role: 'assistant', 
        content: 'Connection error. Check your API key.', 
        persona: currentPersona.name 
      }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-dark-navy via-deep-purple to-dark-navy">
      <div className="p-4 border-b border-periwinkle/20 bg-dark-navy/50 backdrop-blur">
        <h1 className="text-2xl font-bold text-white">
          S.A.T. <span className="text-bright-cyan">Labs</span>
        </h1>
        <p className="text-sm text-periwinkle">
          Active: <span className="text-bright-cyan font-semibold">{currentPersona.name}</span>
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div className={m.role === 'user' 
              ? 'max-w-[80%] rounded-2xl px-4 py-3 bg-bright-cyan text-dark-navy font-medium' 
              : 'max-w-[80%] rounded-2xl px-4 py-3 bg-deep-purple/60 text-white border border-periwinkle/30'
            }>
              {m.role === 'assistant' && (
                <div className="text-xs text-periwinkle mb-1 font-semibold">{m.persona}</div>
              )}
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-deep-purple/60 rounded-2xl px-4 py-3 border border-periwinkle/30">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-bright-cyan rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-bright-cyan rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-bright-cyan rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-periwinkle/20 bg-dark-navy/50 backdrop-blur">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()} 
            placeholder="Type /help for commands..." 
            className="flex-1 px-4 py-3 rounded-xl bg-deep-purple/40 border border-periwinkle/30 text-white placeholder-periwinkle/50 focus:outline-none focus:border-bright-cyan transition-colors" 
          />
          <button 
            onClick={sendMessage} 
            disabled={isLoading} 
            className="px-6 py-3 rounded-xl bg-bright-cyan text-dark-navy font-semibold hover:bg-periwinkle transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          Simple As That — Certified by Voss Neural Research
        </p>
      </div>
    </div>
  );
}
