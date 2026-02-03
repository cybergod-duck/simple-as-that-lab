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
      content: 'Hey! Simple AI here. I can switch personalities. Type /bots to see options.',
      persona: 'Simple AI'
    }]);
  }, []);

  const handleCommand = (cmd) => {
    const lower = cmd.toLowerCase().trim();
    if (lower === '/bots') {
      const list = personas.map((p, i) => `${i + 1}. ${p.name} - ${p.description}`).join('\n');
      setMessages(p => [...p, { role: 'user', content: cmd }, { role: 'assistant', content: 'Available personalities:\n\n' + list + '\n\nUse /switch [slug] to switch.', persona: currentPersona.name }]);
      return true;
    }
    if (lower.startsWith('/switch ')) {
      const slug = lower.replace('/switch ', '');
      const found = personas.find(p => p.slug === slug);
      if (found) {
        setCurrentPersona(found);
        setMessages(p => [...p, { role: 'user', content: cmd }, { role: 'assistant', content: 'Switched to ' + found.name, persona: found.name }]);
      } else {
        setMessages(p => [...p, { role: 'user', content: cmd }, { role: 'assistant', content: 'Persona not found. Use /bots.', persona: currentPersona.name }]);
      }
      return true;
    }
    if (lower === '/default') {
      setCurrentPersona(personas[0]);
      setMessages(p => [...p, { role: 'user', content: cmd }, { role: 'assistant', content: 'Back to Simple AI.', persona: 'Simple AI' }]);
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
      setMessages(p => [...p, { role: 'assistant', content: 'Error', persona: currentPersona.name }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-dark-navy via-deep-purple to-dark-navy">
      <div className="p-4 border-b border-periwinkle/20 bg-dark-navy/50">
        <h1 className="text-2xl font-bold text-white">Simple As That <span className="text-bright-cyan">Lab</span></h1>
        <p className="text-sm text-periwinkle">Currently: <span className="text-bright-cyan">{currentPersona.name}</span></p>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div className={m.role === 'user' ? 'max-w-4/5 rounded-2xl px-4 py-3 bg-bright-cyan text-dark-navy' : 'max-w-4/5 rounded-2xl px-4 py-3 bg-deep-purple/60 text-white border border-periwinkle/30'}>
              {m.role === 'assistant' && <div className="text-xs text-periwinkle mb-1">{m.persona}</div>}
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        ))}
        {isLoading && <div className="text-periwinkle">Loading...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-periwinkle/20 bg-dark-navy/50">
        <div className="flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type /bots for commands..." className="flex-1 px-4 py-3 rounded-xl bg-deep-purple/40 border border-periwinkle/30 text-white placeholder-periwinkle/50 focus:outline-none focus:border-bright-cyan" />
          <button onClick={sendMessage} disabled={isLoading} className="px-6 py-3 rounded-xl bg-bright-cyan text-dark-navy font-semibold hover:bg-periwinkle disabled:opacity-50">Send</button>
        </div>
        <p className="text-xs text-periwinkle/60 mt-2 text-center">Commands: /bots /switch /default</p>
      </div>
    </div>
  );
}
