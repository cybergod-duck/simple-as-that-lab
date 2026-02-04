'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

export default function SharedBotPage() {
  const params = useParams();
  const { user, profile, supabase } = useAuth();
  const [bot, setBot] = useState(null);
  const [creator, setCreator] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [previewCount, setPreviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBot();
  }, [params.id]);

  const fetchBot = async () => {
    const { data: botData, error } = await supabase
      .from('bots')
      .select('*, profiles(*)')
      .eq('id', params.id)
      .eq('public', true)
      .single();

    if (botData) {
      setBot(botData);
      setCreator(botData.profiles);
    }
    setLoading(false);
  };

  const saveToMyAIs = async () => {
    if (!user) {
      alert('Sign in to save this AI');
      return;
    }
    if (profile?.plan_tier === 'starter') {
      alert('Upgrade to Creator ($9.99/mo) to save shared AIs');
      return;
    }

    const { error } = await supabase.from('bots').insert([{
      user_id: user.id,
      name: bot.name,
      description: bot.description,
      model: bot.model,
      system_prompt: bot.system_prompt,
      public: false
    }]);

    if (!error) {
      alert('AI saved to your /myAIs! 🎉');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-cyan-400 text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-4">AI Not Found</h1>
          <Link href="/" className="text-cyan-400 hover:underline">← Back to Lab</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="container mx-auto max-w-4xl">
        <Link href="/" className="text-cyan-400 hover:underline mb-6 inline-block">← Back to Lab</Link>
        
        {/* Bot Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-cyan-400 mb-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            {bot.name}
          </h1>
          <p className="text-sm animate-rainbow font-semibold">
            by @{creator?.username}
          </p>
          <p className="text-purple-300 mt-4">{bot.description}</p>
        </div>

        {/* Preview Chat Terminal */}
        <div className="bg-slate-900/80 border border-cyan-500/50 rounded-lg shadow-2xl shadow-cyan-500/20 mb-6">
          <div className="bg-slate-800 border-b border-cyan-500/30 px-4 py-2 flex justify-between items-center">
            <span className="text-cyan-400 font-mono text-sm">Preview Chat ({previewCount}/10 free messages)</span>
            <button
              onClick={saveToMyAIs}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-sm px-4 py-1 rounded transition-all"
            >
              Save to My AIs
            </button>
          </div>
          
          <div className="p-6 min-h-[400px]">
            {previewCount >= 10 ? (
              <div className="text-center text-purple-300">
                <p className="mb-4">Preview limit reached!</p>
                <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-2 rounded">
                  Upgrade to Continue
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`${msg.role === 'user' ? 'text-cyan-400' : 'text-green-400'}`}>
                    <strong>{msg.role}:</strong> {msg.content}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Teaser */}
        <div className="text-center text-purple-300">
          <p>Build your own AIs like this one—start free at <Link href="/" className="text-cyan-400 hover:underline">/newAI</Link></p>
        </div>
      </div>
    </div>
  );
}
