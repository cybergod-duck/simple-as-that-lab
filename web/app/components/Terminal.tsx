'use client';
import { useState, useEffect, useRef } from 'react';

const QUESTIONS = [
  "What's the name of your AI?",
  "What's the main personality or vibe? (e.g., brutally honest, supportive coach, sarcastic critic)",
  "What topics or domains should it focus on? (e.g., astrology, coding, fitness, etc.)",
  "Any specific quirks or catchphrases?",
  "What tone should it use? (e.g., casual, formal, edgy)",
  "Anything else special about this AI?"
];

interface BuildData {
  name?: string;
  personality?: string;
  topics?: string;
  quirks?: string;
  tone?: string;
  special?: string;
}

interface Message {
  role: string;
  text: string;
  persona?: string;
}

export default function Terminal({ onCommandChange }: { onCommandChange: (cmd: string) => void }) {
  const [view, setView] = useState<'initial' | 'building' | 'chatting'>('initial');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [buildData, setBuildData] = useState<BuildData>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [botName, setBotName] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Blinking cursor animation
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startBuilding = () => {
    setView('building');
    setMessages([{
      role: 'assistant',
      text: "Hey! I'm Simple_AI, your builder. Let's create your custom AI personality.",
      persona: 'Simple_AI'
    }, {
      role: 'assistant',
      text: QUESTIONS[0],
      persona: 'Simple_AI'
    }]);
  };

  const handleBuildingInput = (text: string) => {
    setMessages(prev => [...prev, { role: 'user', text }]);

    const newData = { ...buildData };
    const questionKeys: (keyof BuildData)[] = ['name', 'personality', 'topics', 'quirks', 'tone', 'special'];
    newData[questionKeys[currentQuestion]] = text;
    setBuildData(newData);

    if (currentQuestion === 0) {
      setBotName(text);
    }

    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: QUESTIONS[currentQuestion + 1],
          persona: 'Simple_AI'
        }]);
      }, 500);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Done building
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: `Perfect! ${newData.name || 'Your AI'} is ready to go. Start chatting below!`,
          persona: 'Simple_AI'
        }]);
        setTimeout(() => {
          setView('chatting');
          setMessages([{
            role: 'assistant',
            text: `Hey! I'm ${newData.name}. ${newData.personality || 'Ready to chat!'}`,
            persona: newData.name
          }]);
        }, 2000);
      }, 500);
    }
  };

  const handleChattingInput = (text: string) => {
    setMessages(prev => [...prev, { role: 'user', text }]);
    
    // Placeholder response - replace with API call later
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: "I'm a placeholder response. Real AI integration coming soon!",
        persona: botName
      }]);
    }, 1000);
  };

  const handleSubmit = () => {
    if (view === 'initial') {
      // On initial screen, ANY key press (even empty) starts building
      startBuilding();
      setInput('');
      return;
    }
    
    if (!input.trim()) return;
    
    if (view === 'building') {
      handleBuildingInput(input);
    } else if (view === 'chatting') {
      handleChattingInput(input);
    }
    
    setInput('');
  };

  return (
    <div className="bg-[#0A0E27] border-2 border-cyan-500/50 rounded-lg shadow-2xl shadow-cyan-500/20 overflow-hidden h-[600px] flex flex-col">
      {/* Terminal Header */}
      <div className="bg-slate-800 border-b border-cyan-500/30 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        <span className="text-purple-300 text-sm font-mono">simple-as-that:~$</span>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 p-6 font-mono text-sm overflow-y-auto">
        {view === 'initial' && (
          <div className="flex flex-col h-full">
            {/* /newAI as terminal prompt line */}
            <div className="mb-4">
              <span className="text-cyan-400 text-base font-bold drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                /newAI<span className={`${showCursor ? 'opacity-100' : 'opacity-0'}`}>_</span>
              </span>
            </div>
          </div>
        )}

        {(view === 'building' || view === 'chatting') && (
          <div className="space-y-4">
            {view === 'building' && (
              <div className="text-3xl font-bold text-cyan-400 mb-6 text-center drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                Simple_AI
              </div>
            )}
            {view === 'chatting' && botName && (
              <div className="text-3xl font-bold text-cyan-400 mb-6 text-center drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                {botName}
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block max-w-[80%] px-4 py-2 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-cyan-500/20 text-cyan-300' 
                    : 'bg-purple-900/30 text-white'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-cyan-500/30 bg-slate-900/50">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
            className="flex-1 bg-slate-800/50 text-white px-4 py-2 rounded outline-none border border-cyan-500/30 focus:border-cyan-500 placeholder-gray-500"
            placeholder="Press Enter to begin..."
            autoFocus
          />
          {view !== 'initial' && (
            <button
              onClick={handleSubmit}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-2 rounded transition-all"
            >
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
