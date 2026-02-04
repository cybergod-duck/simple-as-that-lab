'use client';
import { useState } from 'react';
import Terminal from './components/Terminal';

export default function Home() {
  const [command, setCommand] = useState('');
  
  // Placeholder user data - replace with real auth later
  const mockUser = null;

  return (
    <main className="min-h-screen bg-[#0A0E27] overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D1B69] via-[#0A0E27] to-[#2D1B69] opacity-60"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-cyan-500/30 backdrop-blur-sm flex-shrink-0">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-cyan-400 tracking-wider drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                Simple As That
              </h1>
              <p className="text-purple-300 text-sm mt-1">AI Personality Lab & Bot Factory</p>
            </div>
            
            {/* User Profile Area - PLACEHOLDER */}
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
                  <button className="ml-2 text-purple-300 hover:text-cyan-400 text-sm transition-colors">
                    Sign Out
                  </button>
                </div>
              ) : (
                <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/50">
                  Sign In
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <div className="container mx-auto px-6 py-6 h-full grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
            {/* Main Terminal Area - Full Height */}
            <div className="h-full">
              <Terminal onCommandChange={setCommand} />
            </div>

            {/* Right Sidebar */}
            <aside className="h-full overflow-y-auto">
              <div className="bg-[#2D1B69]/60 border border-cyan-500/30 rounded-lg p-6">
                <h3 className="text-cyan-400 font-bold text-lg mb-4">Affiliates & Partners</h3>
                <p className="text-purple-300 text-sm mb-4">Recommended labs & projects</p>
                
                <div className="space-y-3">
                  <div className="bg-[#0A0E27]/60 border border-purple-500/30 rounded-lg p-4 hover:border-cyan-500/50 transition-all">
                    <h4 className="text-white font-bold">Voss Neural Research</h4>
                    <p className="text-purple-300 text-xs">Advanced AI systems</p>
                  </div>
                  
                  <div className="bg-[#0A0E27]/60 border border-purple-500/30 rounded-lg p-4 hover:border-cyan-500/50 transition-all">
                    <h4 className="text-white font-bold">The Peer Review</h4>
                    <p className="text-purple-300 text-xs">Research & analysis</p>
                  </div>
                  
                  <div className="bg-[#0A0E27]/60 border border-purple-500/30 rounded-lg p-4 hover:border-cyan-500/50 transition-all">
                    <h4 className="text-white font-bold">DuckTronikz Music</h4>
                    <p className="text-purple-300 text-xs">Electronic production</p>
                  </div>
                </div>
                
                {/* Creator Credit with link */}
                <div className="mt-6 pt-6 border-t border-purple-500/30">
                  <a 
                    href="https://x.com/Cyberdvck" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-center text-sm font-bold animate-rainbow hover:scale-105 transition-transform"
                  >
                    Created by @Cyberdvck
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
