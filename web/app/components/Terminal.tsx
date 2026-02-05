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
  content: string;
}

interface DisplayMessage extends Message {
  persona?: string;
  isStreaming?: boolean;
}

export default function Terminal({ onCommandChange }: { onCommandChange: (cmd: string) => void }) {
  const [view, setView] = useState<'initial' | 'building' | 'chatting'>('initial');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [apiMessages, setApiMessages] = useState<Message[]>([]);
  const [buildData, setBuildData] = useState<BuildData>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [botName, setBotName] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
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
    
    // Fade in Simple_AI title
    setTimeout(() => setShowTitle(true), 100);
    
    const welcomeMsg = "Hey! I'm Simple_AI, your builder. Let's create your custom AI personality.";
    const firstQuestion = QUESTIONS[0];
    
    // Delay messages to let title fade in
    setTimeout(() => {
      setMessages([
        { role: 'assistant', content: welcomeMsg, persona: 'Simple_AI' },
        { role: 'assistant', content: firstQuestion, persona: 'Simple_AI' }
      ]);
      
      setApiMessages([
        { role: 'assistant', content: welcomeMsg },
        { role: 'assistant', content: firstQuestion }
      ]);
    }, 600);
  };

  const handleBuildingInput = (text: string) => {
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setApiMessages(prev => [...prev, { role: 'user', content: text }]);

    const newData = { ...buildData };
    const questionKeys: (keyof BuildData)[] = ['name', 'personality', 'topics', 'quirks', 'tone', 'special'];
    newData[questionKeys[currentQuestion]] = text;
    setBuildData(newData);

    if (currentQuestion === 0) {
      setBotName(text);
    }

    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => {
        const nextQuestion = QUESTIONS[currentQuestion + 1];
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: nextQuestion,
          persona: 'Simple_AI'
        }]);
        setApiMessages(prev => [...prev, { role: 'assistant', content: nextQuestion }]);
      }, 500);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Done building
      setTimeout(() => {
        const doneMsg = `Perfect! ${newData.name || 'Your AI'} is ready to go. Start chatting below!`;
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: doneMsg,
          persona: 'Simple_AI'
        }]);
        setTimeout(() => {
          setShowTitle(false);
          setTimeout(() => {
            setView('chatting');
            setShowTitle(true);
            setMessages([{
              role: 'assistant',
              content: `Hey! I'm ${newData.name}. ${newData.personality || 'Ready to chat!'}`,
              persona: newData.name
            }]);
            setApiMessages([{
              role: 'system',
              content: `You are ${newData.name}. Personality: ${newData.personality}. Topics: ${newData.topics}. Quirks: ${newData.quirks}. Tone: ${newData.tone}. ${newData.special}`
            }]);
          }, 300);
        }, 2000);
      }, 500);
    }
  };

  const handleChattingInput = async (text: string) => {
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    const newApiMessages = [...apiMessages, { role: 'user', content: text }];
    setApiMessages(newApiMessages);
    setIsLoading(true);
    
    // Add empty streaming message
    const streamingMessageIndex = messages.length + 1;
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '',
      persona: botName,
      isStreaming: true
    }]);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newApiMessages,
          buildingMode: false,
          botData: buildData
        })
      });

      if (!response.ok || !response.body) {
        throw new Error('Stream failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              
              if (content) {
                accumulatedContent += content;
                // Update the streaming message
                setMessages(prev => {
                  const updated = [...prev];
                  updated[streamingMessageIndex] = {
                    role: 'assistant',
                    content: accumulatedContent,
                    persona: botName,
                    isStreaming: true
                  };
                  return updated;
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // Finalize message
      setMessages(prev => {
        const updated = [...prev];
        updated[streamingMessageIndex] = {
          role: 'assistant',
          content: accumulatedContent,
          persona: botName,
          isStreaming: false
        };
        return updated;
      });
      
      setApiMessages(prev => [...prev, { role: 'assistant', content: accumulatedContent }]);

    } catch (error) {
      setMessages(prev => {
        const updated = [...prev];
        updated[streamingMessageIndex] = {
          role: 'assistant',
          content: 'Connection error. Please try again.',
          persona: botName,
          isStreaming: false
        };
        return updated;
      });
    }
    
    setIsLoading(false);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (view === 'initial') {
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
    <div className="bg-[#0A0E27] border-2 border-cyan-500/50 rounded-lg shadow-2xl shadow-cyan-500/20 overflow-hidden h-full flex flex-col">
      {/* Terminal Header */}
      <div className="bg-slate-800 border-b border-cyan-500/30 px-4 py-2 flex justify-between items-center flex-shrink-0">
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
            <div className="mb-4">
              <span className="text-cyan-400 text-base font-bold drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                /newAI<span className={`${showCursor ? 'opacity-100' : 'opacity-0'}`}>_</span>
              </span>
            </div>
          </div>
        )}

        {(view === 'building' || view === 'chatting') && (
          <div className="space-y-4">
            {/* Fade-in title */}
            <div 
              className={`text-3xl font-bold text-cyan-400 mb-6 text-center drop-shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-opacity duration-1000 ${
                showTitle ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {view === 'building' ? 'Simple_AI' : botName}
            </div>
            
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block max-w-[80%] px-4 py-2 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-cyan-500/20 text-cyan-300' 
                    : 'bg-purple-900/30 text-white'
                }`}>
                  {msg.content}
                  {msg.isStreaming && (
                    <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse"></span>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="text-left">
                <div className="inline-block bg-purple-900/30 px-4 py-2 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-cyan-500/30 bg-slate-900/50 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-slate-800/50 text-white px-4 py-2 rounded outline-none border border-cyan-500/30 focus:border-cyan-500 placeholder-gray-500 disabled:opacity-50"
            placeholder="Press Enter to begin..."
            autoFocus
          />
          {view !== 'initial' && (
            <button
              type="submit"
              disabled={isLoading}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-2 rounded transition-all disabled:opacity-50"
            >
              Send
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
