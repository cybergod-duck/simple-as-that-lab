'use client';
import { useState } from 'react';
import Terminal from './components/Terminal';

export default function Home() {
  const [command, setCommand] = useState('');
  
  // Placeholder user data - replace with real auth later
  const mockUser = null; // Set to { username: 'YourName', avatar: '/path', tier: 'starter' } to test UI

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-cyan-500/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-cyan-400 tracking-wider">
              Simple As That
            </h1>
            <p className="text-purple-300 text-sm mt-1">AI Personality Lab & Bot Factory</p>
          </div>
          
          {/* User Profile Area (Top Right) - PLACEHOLDER */}
          <div className="flex items-center gap-4">
            {mockUser ? (
              <div className="flex items-center gap-3 bg-purple-900/40 border border-cyan-500/30 rounded-lg px-4 py-2">
                {mockUser.avatar && (
                  <img 
                    src={mockUser.avatar} 
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-cyan-400"
                  />
                )}
                <div>
                  <p className="text-cyan-400 font-semibold">@{mockUser.username}</p>
                  <p className="text-purple-300 text-xs">{mockUser.tier} tier</p>
                </div>
                <button
                  className="ml-2 text-purple-300 hover:text-cyan-400 text-sm transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/50"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Main Terminal Area */}
        <div className="space-y-6">
          <Terminal 
            onCommandChange={setCommand}
          />
          
          {/* Export Bot Code Section - Moved Below Terminal */}
          <div className="bg-purple-900/30 border border-cyan-500/30 rounded-lg p-6">
            <h3 className="text-cyan-400 font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-2xl">📦</span>
              EXPORT BOT CODE
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2">
                <span>Discord</span>
              </button>
              <p className="text-purple-300 text-xs text-center">(coming soon)</p>
              <p className="text-purple-300 text-xs text-center">Power User plan required</p>
              
              <button className="w-full bg-[#0088cc] hover:bg-[#006699] text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 mt-4">
                <span>Telegram</span>
              </button>
              <p className="text-purple-300 text-xs text-center">Generates code + instructions</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Affiliates & Partners */}
        <aside className="space-y-6">
          <div className="bg-purple-900/30 border border-cyan-500/30 rounded-lg p-6">
            <h3 className="text-cyan-400 font-bold text-lg mb-4">Affiliates & Partners</h3>
            <p className="text-purple-300 text-sm mb-4">Recommended labs & projects</p>
            
            <div className="space-y-3">
              <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-4 hover:border-cyan-500/50 transition-all">
                <h4 className="text-white font-bold">Voss Neural Research</h4>
                <p className="text-purple-300 text-xs">Advanced AI systems</p>
              </div>
              
              <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-4 hover:border-cyan-500/50 transition-all">
                <h4 className="text-white font-bold">The Peer Review</h4>
                <p className="text-purple-300 text-xs">Research & analysis</p>
              </div>
              
              <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-4 hover:border-cyan-500/50 transition-all">
                <h4 className="text-white font-bold">DuckTronikz Music</h4>
                <p className="text-purple-300 text-xs">Electronic production</p>
              </div>
            </div>
            
            {/* Creator Credit with Flashy Colors */}
            <div className="mt-6 pt-6 border-t border-purple-500/30">
              <p className="text-center text-sm font-bold animate-rainbow">
                Created by @Cyberdvck
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
