'use client';
import { useState, useEffect, useRef } from 'react';
import { personas, modelOptions } from '@/config/personas';

export default function ChatInterface() {
  const [view, setView] = useState('initial'); // initial, building, myais, chatting
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentPersona, setCurrentPersona] = useState(null);
  const [userAIs, setUserAIs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [buildingSession, setBuildingSession] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Load saved AIs from localStorage
    const saved = localStorage.getItem('userAIs');
    if (saved) {
      setUserAIs(JSON.parse(saved));
    }
  }, []);

  const saveUserAI = (ai) => {
    const updated = [...userAIs, ai];
    setUserAIs(updated);
    localStorage.setItem('userAIs', JSON.stringify(updated));
  };

  const updateUserAI = (index, updates) => {
    const updated = [...userAIs];
    updated[index] = { ...updated[index], ...updates };
    setUserAIs(updated);
    localStorage.setItem('userAIs', JSON.stringify(updated));
  };

  const startNewAI = () => {
    setView('building');
    setBuildingSession({ step: 0, data: {} });
    setMessages([{
      role: 'assistant',
      content: "Hey there! I'm Simple_AI, your go-to builder for custom AIs. I can craft anything from code wizards to debate champs—just tell me your vision, and we'll make it happen. What's the main idea or role for your new AI?",
      persona: 'Simple_AI'
    }]);
  };

  const viewMyAIs = () => {
    setView('myais');
    setMessages([]);
  };

  const selectAI = (ai, index) => {
    setCurrentPersona({ ...ai, index });
    setView('chatting');
    setMessages([{
      role: 'assistant',
      content: ai.initialMessage || `Hey! I'm ${ai.name}. ${ai.description}`,
      persona: ai.name
    }]);
  };

  const backToMyAIs = () => {
    setView('myais');
    setCurrentPersona(null);
    setMessages([]);
  };

  const refineAI = () => {
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: "What would you like to change about " + currentPersona.name + "?",
      persona: 'Simple_AI'
    }]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const msg = { role: 'user', content: input };
    setMessages(p => [...p, msg]);
    setInput('');
    setIsLoading(true);

    try {
      let personaToUse = view === 'building' ? personas[0] : currentPersona;
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, msg],
          personaSlug: personaToUse.slug || 'simple-ai',
          buildingMode: view === 'building',
          sessionData: buildingSession
        })
      });

      const data = await res.json();
      const aiResponse = data.message || 'Error';

      setMessages(p => [...p, {
        role: 'assistant',
        content: aiResponse,
        persona: personaToUse.name
      }]);

      // Check if AI signals completion
      if (view === 'building' && aiResponse.includes('Your new AI is ready')) {
        // Extract AI data from conversation (simplified - in production parse the actual template)
        const newAI = {
          name: buildingSession.data.name || 'Custom AI',
          description: buildingSession.data.description || 'A custom AI personality',
          model: buildingSession.data.model || 'anthropic/claude-sonnet-4',
          systemPrompt: aiResponse, // In production, extract the actual template
          slug: (buildingSession.data.name || 'custom-ai').toLowerCase().replace(/\s+/g, '-')
        };
        saveUserAI(newAI);
        setView('initial');
        setMessages([]);
        setBuildingSession(null);
      }

    } catch (e) {
      setMessages(p => [...p, {
        role: 'assistant',
        content: 'Connection error.',
        persona: 'System'
      }]);
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
              <p className="text-[#00D9FF] font-semibold mb-1">Affiliates & Partners</p>
              <p>Voss Neural Research</p>
              <p>The Peer Review</p>
              <p>DuckTronikz Music</p>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex gap-4 p-6 max-w-7xl mx-auto w-full overflow-hidden">
          {/* Left sidebar */}
          <div className="w-48 flex flex-col gap-3">
            <div className="bg-[#2D1B69]/60 backdrop-blur-sm border border-[#8B9FDE]/40 rounded-xl p-4 text-center">
              <p className="text-[#8B9FDE] text-xs mb-3 uppercase tracking-wide">Export Bot Code</p>
              <button className="w-full mb-2 px-4 py-2 rounded-lg bg-[#0088cc]/80 hover:bg-[#0088cc] text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-[#0088cc]/30 border border-[#00D9FF]/30">
                Telegram
              </button>
              <p className="text-[#8B9FDE]/60 text-[10px] mb-2">Generates ready-to-host code + instructions</p>
              <button disabled className="w-full px-4 py-2 rounded-lg bg-[#5865F2]/30 text-white/50 font-semibold text-sm border border-[#8B9FDE]/20 cursor-not-allowed">
                Discord
              </button>
              <p className="text-[#8B9FDE]/60 text-[10px] mt-1">(coming soon)</p>
            </div>
          </div>
          
          {/* Center - Terminal */}
          <div className="flex-1 flex flex-col bg-[#2D1B69]/40 backdrop-blur-sm border border-[#8B9FDE]/30 rounded-2xl overflow-hidden shadow-2xl">
            {view === 'initial' && (
              <div className="flex-1 flex flex-col items-center justify-center p-12">
                <div className="text-center space-y-8 animate-pulse">
                  <button 
                    onClick={startNewAI}
                    className="text-6xl font-bold text-[#00D9FF] drop-shadow-[0_0_30px_rgba(0,217,255,0.8)] hover:drop-shadow-[0_0_40px_rgba(0,217,255,1)] transition-all cursor-pointer"
                  >
                    /newAI
                  </button>
                  <p className="text-[#8B9FDE] text-lg">Create your custom AI personality</p>
                  {userAIs.length > 0 && (
                    <button 
                      onClick={viewMyAIs}
                      className="text-3xl font-bold text-[#6B9B9E] drop-shadow-[0_0_20px_rgba(107,155,158,0.6)] hover:drop-shadow-[0_0_30px_rgba(107,155,158,1)] transition-all cursor-pointer mt-8"
                    >
                      /myAIs
                    </button>
                  )}
                </div>
                <p className="text-[#8B9FDE]/50 text-sm mt-12">Press Enter to begin</p>
              </div>
            )}

            {view === 'myais' && (
              <div className="flex-1 p-6 overflow-y-auto">
                <h2 className="text-3xl font-bold text-[#00D9FF] mb-6 drop-shadow-[0_0_15px_rgba(0,217,255,0.5)]">Your AI Collection</h2>
                <div className="space-y-3">
                  {userAIs.map((ai, i) => (
                    <div 
                      key={i}
                      onClick={() => selectAI(ai, i)}
                      className="p-4 bg-[#2D1B69]/70 rounded-xl border border-[#8B9FDE]/40 hover:border-[#00D9FF]/60 cursor-pointer transition-all hover:shadow-lg hover:shadow-[#00D9FF]/20"
                    >
                      <p className="text-white font-bold text-lg">{ai.name}</p>
                      <p className="text-[#8B9FDE] text-sm mt-1">{ai.description}</p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setView('initial')}
                  className="mt-6 text-[#00D9FF] text-sm hover:underline"
                >
                  ← Back
                </button>
              </div>
            )}

            {(view === 'building' || view === 'chatting') && (
              <>
                <div className="p-4 border-b border-[#8B9FDE]/30 flex items-center justify-between">
                  <button 
                    onClick={view === 'chatting' ? backToMyAIs : null}
                    className="text-[#00D9FF] text-sm hover:underline"
                  >
                    {view === 'chatting' ? '← Back' : ''}
                  </button>
                  <h2 className="text-2xl font-bold text-[#00D9FF] drop-shadow-[0_0_15px_rgba(0,217,255,0.5)]">
                    {view === 'building' ? 'Simple_AI' : currentPersona?.name}
                  </h2>
                  {view === 'chatting' && (
                    <button 
                      onClick={refineAI}
                      className="text-[#8B9FDE] text-sm hover:text-[#00D9FF] transition-colors"
                    >
                      Refine
                    </button>
                  )}
                </div>

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
                      placeholder={view === 'building' ? "Describe your AI..." : "Type your message..."}
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
              </>
            )}
          </div>
          
          {/* Right sidebar */}
          <div className="w-64 bg-[#2D1B69]/60 backdrop-blur-sm border border-[#8B9FDE]/40 rounded-2xl p-5 overflow-y-auto">
            <h3 className="text-[#00D9FF] font-bold text-lg mb-3 drop-shadow-[0_0_10px_rgba(0,217,255,0.3)]">Affiliates & Partners</h3>
            <p className="text-[#8B9FDE] text-xs mb-4">Recommended labs & projects</p>
            
            <div className="space-y-3">
              <div className="p-3 bg-[#0A0E27]/60 rounded-lg border border-[#8B9FDE]/20 hover:border-[#00D9FF]/40 transition-colors">
                <p className="text-white text-sm font-semibold">Voss Neural Research</p>
                <p className="text-[#8B9FDE]/70 text-xs mt-1">Advanced AI systems</p>
              </div>
              
              <div className="p-3 bg-[#0A0E27]/60 rounded-lg border border-[#8B9FDE]/20 hover:border-[#00D9FF]/40 transition-colors">
                <p className="text-white text-sm font-semibold">The Peer Review</p>
                <p className="text-[#8B9FDE]/70 text-xs mt-1">Research & analysis</p>
              </div>
              
              <a 
                href="https://soundcloud.com/ducktronikz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-3 bg-[#0A0E27]/60 rounded-lg border border-[#8B9FDE]/20 hover:border-[#00D9FF]/40 transition-colors cursor-pointer"
              >
                <p className="text-white text-sm font-semibold">DuckTronikz Music</p>
                <p className="text-[#8B9FDE]/70 text-xs mt-1">Electronic production</p>
              </a>
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
