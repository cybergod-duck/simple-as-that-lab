'use client';
import { useState, useEffect, useRef } from 'react';

export default function Terminal({ onCommandChange }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [showCursor, setShowCursor] = useState(true);
  const inputRef = useRef(null);

  // Blinking cursor animation
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    onCommandChange(trimmed);

    setOutput(prev => [...prev, { type: 'input', text: cmd }]);

    switch(trimmed) {
      case '/newai':
        setOutput(prev => [...prev, { type: 'system', text: '🚧 /newAI builder coming soon! Sign in to get notified.' }]);
        break;
      case '/myais':
        setOutput(prev => [...prev, { type: 'system', text: '🚧 /myAIs feature coming soon!' }]);
        break;
      case '/sharedais':
        setOutput(prev => [...prev, { type: 'system', text: '🚧 Shared AIs feature coming soon!' }]);
        break;
      case 'help':
        setOutput(prev => [...prev, { 
          type: 'system', 
          text: 'Commands: /newAI | /myAIs | /sharedAIs | help | clear' 
        }]);
        break;
      case 'clear':
        setOutput([]);
        break;
      default:
        setOutput(prev => [...prev, { type: 'error', text: `Command not found: ${cmd}` }]);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-cyan-500/50 rounded-lg shadow-2xl shadow-cyan-500/20 overflow-hidden">
      {/* Terminal Header with /newAI prompt in corner */}
      <div className="bg-slate-800 border-b border-cyan-500/30 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          {/* Small terminal prompt - moved to top left */}
          <span className="text-cyan-400 text-xs font-mono ml-3">
            $ /newAI<span className={`${showCursor ? 'opacity-100' : 'opacity-0'}`}>_</span>
          </span>
        </div>
        <span className="text-purple-300 text-sm font-mono">simple-as-that:~$</span>
      </div>

      {/* Terminal Body */}
      <div className="p-6 font-mono text-sm min-h-[500px]">
        {/* Welcome Message */}
        {output.length === 0 && (
          <div className="space-y-2 text-cyan-400">
            <p>Welcome to Simple As That AI Lab</p>
            <p className="text-purple-300">Type 'help' for commands or press Enter to begin...</p>
          </div>
        )}

        {/* Output */}
        <div className="space-y-2 mb-4">
          {output.map((line, i) => (
            <div key={i} className={`
              ${line.type === 'input' ? 'text-cyan-400' : ''}
              ${line.type === 'system' ? 'text-green-400' : ''}
              ${line.type === 'error' ? 'text-red-400' : ''}
            `}>
              {line.type === 'input' && '$ '}
              {line.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2">
          <span className="text-cyan-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCommand(input);
                setInput('');
              }
            }}
            className="flex-1 bg-transparent text-white outline-none"
            placeholder="Press Enter to begin..."
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
