'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { personas, modelOptions } from '@/config/personas';

const PLAN_LIMITS = {
  starter: { ais: 1, messages: 50, canShare: false, canUseShared: false },
  creator: { ais: 5, messages: 2000, canShare: true, canUseShared: true },
  power_user: { ais: 20, messages: 20000, canShare: true, canUseShared: true, exports: true }
};

export default function ChatInterface() {
  const { user, profile, loading, signInWithProvider, signOut } = useAuth();
  const [view, setView] = useState('initial');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentPersona, setCurrentPersona] = useState(null);
  const [userAIs, setUserAIs] = useState([]);
  const [sharedAIs, setSharedAIs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [buildingSession, setBuildingSession] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (user && profile) {
      loadUserAIs();
    }
  }, [user, profile]);

  useEffect(() => {
    loadSharedAIs();
  }, []);

  const loadUserAIs = async () => {
    const { data } = await supabase
      .from('bots')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setUserAIs(data || []);
  };

  const loadSharedAIs = async () => {
    const { data } = await supabase
      .from('bots')
      .select('*, profiles(username)')
      .eq('is_shared', true)
      .order('created_at', { ascending: false });
    setSharedAIs(data || []);
  };

  const saveUserAI = async (ai) => {
    if (!user || !profile) {
      setShowAuthModal(true);
      return;
    }

    const limits = PLAN_LIMITS[profile.plan_tier];
    if (userAIs.length >= limits.ais) {
      setShowPricingModal(true);
      return;
    }

    const { data } = await supabase
      .from('bots')
      .insert([{
        user_id: user.id,
        name: ai.name,
        description: ai.description,
        model: ai.model,
        system_prompt: ai.systemPrompt,
        slug: ai.slug,
        is_shared: false
      }])
      .select()
      .single();

    if (data) {
      setUserAIs([data, ...userAIs]);
    }
  };

  const saveSharedAI = async (sharedAI) => {
    if (!user || !profile) {
      setShowAuthModal(true);
      return;
    }

    const limits = PLAN_LIMITS[profile.plan_tier];
    if (!limits.canUseShared) {
      setShowPricingModal(true);
      return;
    }

    if (userAIs.length >= limits.ais) {
      setShowPricingModal(true);
      return;
    }

    const { data } = await supabase
      .from('bots')
      .insert([{
        user_id: user.id,
        name: sharedAI.name,
        description: sharedAI.description,
        model: sharedAI.model,
        system_prompt: sharedAI.system_prompt,
        slug: sharedAI.slug + '-copy',
        is_shared: false
      }])
      .select()
      .single();

    if (data) {
      setUserAIs([data, ...userAIs]);
      alert(`Saved ${sharedAI.name} to your /myAIs!`);
    }
  };

  const toggleShareAI = async (ai) => {
    if (!profile || !PLAN_LIMITS[profile.plan_tier].canShare) {
      setShowPricingModal(true);
      return;
    }

    const { error } = await supabase
      .from('bots')
      .update({ is_shared: !ai.is_shared })
      .eq('id', ai.id);

    if (!error) {
      loadUserAIs();
      loadSharedAIs();
    }
  };

  const startNewAI = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setView('building');
    setBuildingSession({ step: 0, data: {} });
    setMessages([{
      role: 'assistant',
      content: "Hey there! I'm Simple_AI, your go-to builder for custom AIs. I can craft anything from code wizards to debate champs—just tell me your vision, and we'll make it happen. What's the main idea or role for your new AI?",
      persona: 'Simple_AI'
    }]);
  };

  const viewMyAIs = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setView('myais');
  };

  const viewSharedAIs = () => {
    setView('sharedais');
  };

  const selectAI = async (ai, index, isShared = false) => {
    if (isShared && (!profile || !PLAN_LIMITS[profile.plan_tier].canUseShared)) {
      setShowPricingModal(true);
      return;
    }

    setCurrentPersona({ ...ai, index, isShared });
    setView('chatting');
    
    // Check if first message after deploy - show pricing modal
    const messageCount = await getMessageCount(user?.id);
    const limits = PLAN_LIMITS[profile?.plan_tier || 'starter'];
    
    if (messageCount === 0 && !isShared) {
      setMessages([{
        role: 'assistant',
        content: `${ai.name} is ready to roll! 🔥\n\nTo start chatting (and to save/use any shared bots), pick your plan:\n\n1. Starter – $0 (50 messages/month, 1 bot only)\n2. Creator – $9.99/mo → 5 bots, 2k messages, share & use shared bots\n3. Power User – $23.99/mo → 20 bots, 20k messages, full Discord/Telegram exports\n\nType 1, 2, or 3 — or say "upgrade" for annual discounts.`,
        persona: ai.name
      }]);
      return;
    }

    setMessages([{
      role: 'assistant',
      content: ai.initial_message || `Hey! I'm ${ai.name}. ${ai.description}`,
      persona: ai.name
    }]);
  };

  const getMessageCount = async (userId) => {
    if (!userId) return 0;
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    return count || 0;
  };

  const backToList = () => {
    setView(currentPersona?.isShared ? 'sharedais' : 'myais');
    setCurrentPersona(null);
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const msg = { role: 'user', content: input };
    setMessages(p => [...p, msg]);
    setInput('');
    setIsLoading(true);

    // Check message limits
    if (user && profile) {
      const messageCount = await getMessageCount(user.id);
      const limits = PLAN_LIMITS[profile.plan_tier];
      if (messageCount >= limits.messages) {
        setMessages(p => [...p, {
          role: 'assistant',
          content: `You've hit your ${limits.messages} message limit for this month! Upgrade to continue chatting.`,
          persona: 'System'
        }]);
        setShowPricingModal(true);
        setIsLoading(false);
        return;
      }
    }

    try {
      let personaToUse = view === 'building' ? personas[0] : currentPersona;
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, msg],
          personaSlug: personaToUse.slug || 'simple-ai',
          systemPrompt: personaToUse.system_prompt,
          model: personaToUse.model,
          buildingMode: view === 'building',
          userId: user?.id
        })
      });

      const data = await res.json();
      const aiResponse = data.message || 'Error';

      setMessages(p => [...p, {
        role: 'assistant',
        content: aiResponse,
        persona: personaToUse.name
      }]);

      // Save message to DB
      if (user) {
        await supabase.from('messages').insert([{
          user_id: user.id,
          bot_id: currentPersona?.id || null,
          content: msg.content,
          role: 'user'
        }]);
        await supabase.from('messages').insert([{
          user_id: user.id,
          bot_id: currentPersona?.id || null,
          content: aiResponse,
          role: 'assistant'
        }]);
      }

      if (view === 'building' && aiResponse.includes('Your new AI is ready')) {
        const newAI = {
          name: buildingSession.data.name || 'Custom AI',
          description: buildingSession.data.description || 'A custom AI personality',
          model: buildingSession.data.model || 'anthropic/claude-sonnet-4',
          systemPrompt: buildingSession.data.systemPrompt || aiResponse,
          slug: (buildingSession.data.name || 'custom-ai').toLowerCase().replace(/\s+/g, '-')
        };
        await saveUserAI(newAI);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0A0E27]">
        <div className="text-[#00D9FF] text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0A0E27] relative overflow-hidden">
      {/* Background */}
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
            <div className="flex items-center gap-4">
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2D1B69]/60 border border-[#00D9FF]/40 hover:bg-[#2D1B69]/80 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00D9FF] to-[#6B9B9E] flex items-center justify-center text-[#0A0E27] font-bold">
                      {profile?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-white text-sm">{profile?.username}</span>
                  </button>
                  {showProfileMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-[#2D1B69]/95 backdrop-blur-xl border border-[#8B9FDE]/40 rounded-lg shadow-2xl p-2">
                      <div className="text-[#8B9FDE] text-xs px-3 py-2 border-b border-[#8B9FDE]/20">
                        Plan: <span className="text-[#00D9FF] font-bold capitalize">{profile?.plan_tier}</span>
                      </div>
                      <button 
                        onClick={() => setShowPricingModal(true)}
                        className="w-full text-left px-3 py-2 text-white text-sm hover:bg-[#00D9FF]/20 rounded"
                      >
                        Upgrade Plan
                      </button>
                      <button 
                        onClick={signOut}
                        className="w-full text-left px-3 py-2 text-white text-sm hover:bg-[#00D9FF]/20 rounded"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#00D9FF] to-[#6B9B9E] text-[#0A0E27] font-bold hover:shadow-lg hover:shadow-[#00D9FF]/40 transition-all"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex gap-4 p-6 max-w-7xl mx-auto w-full overflow-hidden">
          {/* Left sidebar */}
          <div className="w-48 flex flex-col gap-3">
            <div className="bg-[#2D1B69]/60 backdrop-blur-sm border border-[#8B9FDE]/40 rounded-xl p-4 text-center space-y-2">
              <p className="text-[#8B9FDE] text-xs uppercase tracking-wide">Export Bot Code</p>
              <button disabled={!profile || profile.plan_tier !== 'power_user'} className="w-full px-4 py-2 rounded-lg bg-[#0088cc]/80 hover:bg-[#0088cc] disabled:bg-[#0088cc]/30 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-[#0088cc]/30 border border-[#00D9FF]/30">
                Telegram
              </button>
              <p className="text-[#8B9FDE]/60 text-[10px]">Generates code + instructions</p>
              <button disabled className="w-full px-4 py-2 rounded-lg bg-[#5865F2]/30 text-white/50 font-semibold text-sm border border-[#8B9FDE]/20 cursor-not-allowed">
                Discord
              </button>
              <p className="text-[#8B9FDE]/60 text-[10px]">(coming soon)</p>
              {profile?.plan_tier !== 'power_user' && (
                <p className="text-[#00D9FF] text-[10px] mt-2">Power User plan required</p>
              )}
            </div>
          </div>
          
          {/* Center - Terminal */}
          <div className="flex-1 flex flex-col bg-[#0A0E27]/90 backdrop-blur-sm border-2 border-[#8B9FDE]/30 rounded-2xl overflow-hidden shadow-2xl">
            {view === 'initial' && (
              <div className="flex-1 flex flex-col justify-between p-12">
                <div className="flex-1 flex flex-col items-start justify-center space-y-12 font-mono">
                  <button 
                    onClick={startNewAI}
                    className="text-5xl font-bold text-[#00D9FF] drop-shadow-[0_0_30px_rgba(0,217,255,0.8)] hover:drop-shadow-[0_0_40px_rgba(0,217,255,1)] transition-all cursor-pointer text-left"
                  >
                    $ /newAI
                  </button>
                  <p className="text-[#8B9FDE] text-lg ml-8">Create your custom AI personality</p>
                  
                  {user && userAIs.length > 0 && (
                    <>
                      <button 
                        onClick={viewMyAIs}
                        className="text-4xl font-bold text-[#6B9B9E] drop-shadow-[0_0_20px_rgba(107,155,158,0.6)] hover:drop-shadow-[0_0_30px_rgba(107,155,158,1)] transition-all cursor-pointer text-left mt-8"
                      >
                        $ /myAIs
                      </button>
                      <p className="text-[#8B9FDE] text-lg ml-8">Access your AI collection</p>
                    </>
                  )}
                  
                  <button 
                    onClick={viewSharedAIs}
                    className="text-4xl font-bold text-[#8B9FDE] drop-shadow-[0_0_20px_rgba(139,159,222,0.6)] hover:drop-shadow-[0_0_30px_rgba(139,159,222,1)] transition-all cursor-pointer text-left mt-8"
                  >
                    $ /sharedAIs
                  </button>
                  <p className="text-[#8B9FDE] text-lg ml-8">Browse community AIs</p>
                </div>
                
                <div className="bg-[#0A0E27]/80 rounded-xl border-2 border-[#8B9FDE]/40 p-4">
                  <input 
                    type="text"
                    placeholder="Press Enter to begin..."
                    onKeyPress={(e) => e.key === 'Enter' && startNewAI()}
                    className="w-full bg-transparent text-white placeholder-[#8B9FDE]/50 outline-none font-mono"
                  />
                </div>
              </div>
            )}

            {view === 'myais' && (
              <div className="flex-1 p-6 overflow-y-auto">
                <h2 className="text-3xl font-bold text-[#00D9FF] mb-6 drop-shadow-[0_0_15px_rgba(0,217,255,0.5)]">Your AI Collection</h2>
                <div className="space-y-3">
                  {userAIs.map((ai, i) => (
                    <div 
                      key={i}
                      className="p-4 bg-[#2D1B69]/70 rounded-xl border border-[#8B9FDE]/40 hover:border-[#00D9FF]/60 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div onClick={() => selectAI(ai, i)} className="flex-1">
                          <p className="text-white font-bold text-lg">{ai.name}</p>
                          <p className="text-[#8B9FDE] text-sm mt-1">{ai.description}</p>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleShareAI(ai); }}
                          className={`px-3 py-1 rounded text-xs font-semibold ${ai.is_shared ? 'bg-[#00D9FF] text-[#0A0E27]' : 'bg-[#8B9FDE]/30 text-[#8B9FDE]'}`}
                        >
                          {ai.is_shared ? 'Shared' : 'Share'}
                        </button>
                      </div>
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

            {view === 'sharedais' && (
              <div className="flex-1 p-6 overflow-y-auto">
                <h2 className="text-3xl font-bold text-[#00D9FF] mb-6 drop-shadow-[0_0_15px_rgba(0,217,255,0.5)]">Community Shared AIs</h2>
                <div className="space-y-3">
                  {sharedAIs.map((ai, i) => (
                    <div 
                      key={i}
                      className="p-4 bg-[#2D1B69]/70 rounded-xl border border-[#8B9FDE]/40 hover:border-[#00D9FF]/60 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-baseline gap-3">
                            <p className="text-white font-bold text-xl">{ai.name}</p>
                            <p className="text-[10px] font-semibold animate-pulse bg-gradient-to-r from-[#00D9FF] via-[#8B9FDE] to-[#6B9B9E] bg-clip-text text-transparent">
                              by {ai.profiles?.username || 'Anonymous'}
                            </p>
                          </div>
                          <p className="text-[#8B9FDE] text-sm mt-1">{ai.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => selectAI(ai, i, true)}
                            className="px-4 py-2 rounded-lg bg-[#00D9FF]/20 text-[#00D9FF] hover:bg-[#00D9FF]/30 text-sm font-semibold transition-colors"
                          >
                            Chat
                          </button>
                          <button 
                            onClick={() => saveSharedAI(ai)}
                            className="px-4 py-2 rounded-lg bg-[#6B9B9E]/20 text-[#6B9B9E] hover:bg-[#6B9B9E]/30 text-sm font-semibold transition-colors"
                          >
                            Save
                          </button>
                        </div>
                      </div>
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
                    onClick={backToList}
                    className="text-[#00D9FF] text-sm hover:underline"
                  >
                    ← Back
                  </button>
                  <h2 className="text-2xl font-bold text-[#00D9FF] drop-shadow-[0_0_15px_rgba(0,217,255,0.5)]">
                    {view === 'building' ? 'Simple_AI' : currentPersona?.name}
                  </h2>
                  <div className="w-16"></div>
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

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#2D1B69] border-2 border-[#00D9FF] rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-3xl font-bold text-[#00D9FF] mb-4">Sign In to Continue</h2>
            <p className="text-[#8B9FDE] mb-6">Create an account to build, save, and chat with custom AIs</p>
            <div className="space-y-3">
              <button onClick={() => signInWithProvider('github')} className="w-full py-3 rounded-lg bg-[#333] hover:bg-[#444] text-white font-semibold transition-colors">
                Continue with GitHub
              </button>
              <button onClick={() => signInWithProvider('google')} className="w-full py-3 rounded-lg bg-white hover:bg-gray-100 text-black font-semibold transition-colors">
                Continue with Google
              </button>
              <button onClick={() => signInWithProvider('discord')} className="w-full py-3 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold transition-colors">
                Continue with Discord
              </button>
              <button onClick={() => signInWithProvider('twitter')} className="w-full py-3 rounded-lg bg-[#1DA1F2] hover:bg-[#1A91DA] text-white font-semibold transition-colors">
                Continue with X (Twitter)
              </button>
            </div>
            <button 
              onClick={() => setShowAuthModal(false)}
              className="mt-6 w-full py-2 text-[#8B9FDE] hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-[#2D1B69] border-2 border-[#00D9FF] rounded-2xl p-8 max-w-4xl w-full">
            <h2 className="text-4xl font-bold text-[#00D9FF] mb-6 text-center">Choose Your Plan</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-[#0A0E27]/60 border-2 border-[#8B9FDE]/40 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                <p className="text-4xl font-bold text-[#00D9FF] mb-4">$0</p>
                <ul className="text-[#8B9FDE] text-sm space-y-2 mb-6">
                  <li>• 1 custom AI</li>
                  <li>• 50 messages/month</li>
                  <li>• Browse shared AIs</li>
                </ul>
                <p className="text-[#8B9FDE] text-xs">For testers & lurkers</p>
              </div>
              
              <div className="bg-[#0A0E27]/60 border-4 border-[#00D9FF] rounded-xl p-6 transform scale-105">
                <div className="bg-[#00D9FF] text-[#0A0E27] text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">POPULAR</div>
                <h3 className="text-2xl font-bold text-white mb-2">Creator</h3>
                <p className="text-4xl font-bold text-[#00D9FF] mb-4">$9.99<span className="text-lg">/mo</span></p>
                <ul className="text-[#8B9FDE] text-sm space-y-2 mb-6">
                  <li>• 5 custom AIs</li>
                  <li>• 2,000 messages/month</li>
                  <li>• Chat & save shared AIs</li>
                  <li>• Share your bots</li>
                </ul>
                <button className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00D9FF] to-[#6B9B9E] text-[#0A0E27] font-bold hover:shadow-xl transition-all">
                  Get Creator
                </button>
              </div>
              
              <div className="bg-[#0A0E27]/60 border-2 border-[#8B9FDE]/40 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Power User</h3>
                <p className="text-4xl font-bold text-[#00D9FF] mb-4">$23.99<span className="text-lg">/mo</span></p>
                <ul className="text-[#8B9FDE] text-sm space-y-2 mb-6">
                  <li>• 20 custom AIs</li>
                  <li>• 20,000 messages/month</li>
                  <li>• Full bot exports</li>
                  <li>• Priority support</li>
                </ul>
                <button className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00D9FF] to-[#6B9B9E] text-[#0A0E27] font-bold hover:shadow-xl transition-all">
                  Get Power User
                </button>
              </div>
            </div>
            <p className="text-center text-[#8B9FDE] text-sm mb-4">Annual billing: Save 2 months (Creator $99.90/yr, Power User $239.90/yr)</p>
            <button 
              onClick={() => setShowPricingModal(false)}
              className="w-full py-2 text-[#8B9FDE] hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
