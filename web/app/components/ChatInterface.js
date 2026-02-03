'use client';
import { useState, useEffect, useRef } from 'react';
import { personas } from '@/config/personas';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentPersona, setCurrentPersona] = useState(personas[0]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `Hey! I'm Simple AI — your adaptive lab assistant. I can take on different personalities and help you explore. Try typing /bots to see who I can become.`,
      persona: 'Simple AI'
    }]);
  }, []);

  const handleCommand = (input) => {
    const cmd = input.toLowerCase().trim();
    
    if (cmd === '/bots') {
      const botList = personas.map((p, i) => 
        `${i + 1}. **${p.name}** — ${p.description}`
      ).join('\n');
      setMessages(prev => [...prev, 
        { role: 'user', content: input },
        { role: 'assistant', content: `Here are the personalities I can take on:\n\n${botList}\n\nUse /switch [name] to switch (e.g., /switch astrology-bitch)`, persona: currentPersona.name }
      ]);
      return true;
    }
    
    if (cmd.startsWith('/switch ')) {
      const slug = cmd.replace('/switch ', '').trim();
      const newPersona = personas.find(p => p.slug === slug);
      if (newPersona) {
        setCurrentPersona(newPersona);
        setMessages(prev => [...prev,
          { role: 'user', content: input },
          { role: 'assistant', content: `*Switched to ${newPersona.name}* — ${newPersona.description}`, persona: newPersona.name }
        ]);
      } else {
        setMessages(prev => [...prev,
          { role: 'user', content: input },
          { role: 'assistant', content: `Couldn't find that persona. Use /bots to see available options.`, persona: currentPersona.name }
        ]);
      }
      return true;
    }
    
    if (cmd === '/default') {
      setCurrentPersona(personas[0]);
      setMessages(prev => [...prev,
        { role: 'user', content: input },
        { role: 'assistant', content: `Back to Simple AI mode.`, persona: 'Simple AI' }
      ]);
      return true;
    }
    
    if (cmd === '/export') {
      setMessages(prev => [...prev,
        { role: 'user', content: input },
        { role: 'assistant', content: `Export to Telegram/Discord coming soon! For now, check out the /bots section.`, persona: currentPersona.name }
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
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content })).concat([userMessage]),
          personaSlug: currentPersona.slug
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message || data.error || 'No response',
        persona: currentPersona.name
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error connecting to AI. Check your API key.',
        persona: currentPersona.name
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-dark-navy via-deep-purple to-dark-navy">
      <div className="p-4 border-b border-periwinkle/20 bg-dark-navy/50 backdrop-blur">
        <h1 className="text-2xl font-bold text-white">
          Simple As That <span className="text-bright-cyan">Lab</span>
        </h1>
        <p className="text-sm text-periwinkle">
          Currently: <span className="text-bright-cyan font-semibold">{currentPersona.name}</span>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' 
                ? 'bg-bright-cyan text-dark-navy' 
                : 'bg-deep-purple/60 text-white border border-periwinkle/30'
            }`}>
              {msg.role === 'assistant' && (
                <div className="text-xs text-periwinkle mb-1 font-semibold">{msg.persona}</div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-deep-purple/60 text-periwinkle rounded-2xl px-4 py-3 border border-periwinkle/30">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-bright-cyan rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-bright-cyan rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-

cat > app/components/ChatInterface.js << 'EOF'
'use client';
import { useState, useEffect, useRef } from 'react';
import { personas } from '@/config/personas';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentPersona, setCurrentPersona] = useState(personas[0]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `Hey! I'm Simple AI — your adaptive lab assistant. I can take on different personalities and help you explore. Try typing /bots to see who I can become.`,
      persona: 'Simple AI'
    }]);
  }, []);

  const handleCommand = (input) => {
    const cmd = input.toLowerCase().trim();
    
    if (cmd === '/bots') {
      const botList = personas.map((p, i) => 
        `${i + 1}. **${p.name}** — ${p.description}`
      ).join('\n');
      setMessages(prev => [...prev, 
        { role: 'user', content: input },
        { role: 'assistant', content: `Here are the personalities I can take on:\n\n${botList}\n\nUse /switch [name] to switch (e.g., /switch astrology-bitch)`, persona: currentPersona.name }
      ]);
      return true;
    }
    
    if (cmd.startsWith('/switch ')) {
      const slug = cmd.replace('/switch ', '').trim();
      const newPersona = personas.find(p => p.slug === slug);
      if (newPersona) {
        setCurrentPersona(newPersona);
        setMessages(prev => [...prev,
          { role: 'user', content: input },
          { role: 'assistant', content: `*Switched to ${newPersona.name}* — ${newPersona.description}`, persona: newPersona.name }
        ]);
      } else {
        setMessages(prev => [...prev,
          { role: 'user', content: input },
          { role: 'assistant', content: `Couldn't find that persona. Use /bots to see available options.`, persona: currentPersona.name }
        ]);
      }
      return true;
    }
    
    if (cmd === '/default') {
      setCurrentPersona(personas[0]);
      setMessages(prev => [...prev,
        { role: 'user', content: input },
        { role: 'assistant', content: `Back to Simple AI mode.`, persona: 'Simple AI' }
      ]);
      return true;
    }
    
    if (cmd === '/export') {
      setMessages(prev => [...prev,
        { role: 'user', content: input },
        { role: 'assistant', content: `Export to Telegram/Discord coming soon! For now, check out the /bots section.`, persona: currentPersona.name }
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
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content })).concat([userMessage]),
          personaSlug: currentPersona.slug
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message || data.error || 'No response',
        persona: currentPersona.name
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error connecting to AI. Check your API key.',
        persona: currentPersona.name
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-dark-navy via-deep-purple to-dark-navy">
      <div className="p-4 border-b border-periwinkle/20 bg-dark-navy/50 backdrop-blur">
        <h1 className="text-2xl font-bold text-white">
          Simple As That <span className="text-bright-cyan">Lab</span>
        </h1>
        <p className="text-sm text-periwinkle">
          Currently: <span className="text-bright-cyan font-semibold">{currentPersona.name}</span>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' 
                ? 'bg-bright-cyan text-dark-navy' 
                : 'bg-deep-purple/60 text-white border border-periwinkle/30'
            }`}>
              {msg.role === 'assistant' && (
                <div className="text-xs text-periwinkle mb-1 font-semibold">{msg.persona}</div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-deep-purple/60 text-periwinkle rounded-2xl px-4 py-3 border border-periwinkle/30">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-bright-cyan rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-bright-cyan rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-

# Make sure we're in the right directory
cd /workspaces/simple-as-that-lab/web

# Create components directory if it doesn't exist
mkdir -p app/components

# Create the ChatInterface component
cat > app/components/ChatInterface.js << 'EOF'
'use client';
import { useState, useEffect, useRef } from 'react';
import { personas } from '@/config/personas';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentPersona, setCurrentPersona] = useState(personas[0]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `Hey! I'm Simple AI — your adaptive lab assistant. I can take on different personalities and help you explore. Try typing /bots to see who I can become.`,
      persona: 'Simple AI'
    }]);
  }, []);

  const handleCommand = (input) => {
    const cmd = input.toLowerCase().trim();
    
    if (cmd === '/bots') {
      const botList = personas.map((p, i) => 
        `${i + 1}. **${p.name}** — ${p.description}`
      ).join('\n');
      setMessages(prev => [...prev, 
        { role: 'user', content: input },
        { role: 'assistant', content: `Here are the personalities I can take on:\n\n${botList}\n\nUse /switch [name] to switch (e.g., /switch astrology-bitch)`, persona: currentPersona.name }
      ]);
      return true;
    }
    
    if (cmd.startsWith('/switch ')) {
      const slug = cmd.replace('/switch ', '').trim();
      const newPersona = personas.find(p => p.slug === slug);
      if (newPersona) {
        setCurrentPersona(newPersona);
        setMessages(prev => [...prev,
          { role: 'user', content: input },
          { role: 'assistant', content: `*Switched to ${newPersona.name}* — ${newPersona.description}`, persona: newPersona.name }
        ]);
      } else {
        setMessages(prev => [...prev,
          { role: 'user', content: input },
          { role: 'assistant', content: `Couldn't find that persona. Use /bots to see available options.`, persona: currentPersona.name }
        ]);
      }
      return true;
    }
    
    if (cmd === '/default') {
      setCurrentPersona(personas[0]);
      setMessages(prev => [...prev,
        { role: 'user', content: input },
        { role: 'assistant', content: `Back to Simple AI mode.`, persona: 'Simple AI' }
      ]);
      return true;
    }
    
    if (cmd === '/export') {
      setMessages(prev => [...prev,
        { role: 'user', content: input },
        { role: 'assistant', content: `Export to Telegram/Discord coming soon! For now, check out the /bots section.`, persona: currentPersona.name }
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
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content })).concat([userMessage]),
          personaSlug: currentPersona.slug
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message || data.error || 'No response',
        persona: currentPersona.name
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error connecting to AI. Check your API key.',
        persona: currentPersona.name
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-dark-navy via-deep-purple to-dark-navy">
      <div className="p-4 border-b border-periwinkle/20 bg-dark-navy/50 backdrop-blur">
        <h1 className="text-2xl font-bold text-white">
          Simple As That <span className="text-bright-cyan">Lab</span>
        </h1>
        <p className="text-sm text-periwinkle">
          Currently: <span className="text-bright-cyan font-semibold">{currentPersona.name}</span>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' 
                ? 'bg-bright-cyan text-dark-navy' 
                : 'bg-deep-purple/60 text-white border border-periwinkle/30'
            }`}>
              {msg.role === 'assistant' && (
                <div className="text-xs text-periwinkle mb-1 font-semibold">{msg.persona}</div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-deep-purple/60 text-periwinkle rounded-2xl px-4 py-3 border border-periwinkle/30">
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
            placeholder="Type a message or /bots for commands..."
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
        <p className="text-xs text-periwinkle/60 mt-2 text-center">
          Try: /bots • /switch [persona] • /default • /export
        </p>
      </div>
    </div>
  );
}
