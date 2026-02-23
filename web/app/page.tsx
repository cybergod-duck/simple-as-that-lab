import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050511] overflow-hidden font-sans text-slate-300">
      {/* Dynamic Background */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse filter"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[150px] mix-blend-screen animate-pulse filter" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Navigation */}
        <nav className="border-b border-white/5 bg-white/[0.02] backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                ST
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
                Simple As That
              </span>
            </div>
            <div className="flex gap-4 items-center">
              <Link href="/success" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Verify Patch
              </Link>
              <button className="px-5 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium transition-all backdrop-blur-md">
                Client Login
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-6 py-20 pb-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              Ordinance Monitoring Active
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
              <span className="block opacity-90">Compliance,</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg">Automated at Scale.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
              We monitor hyper-local digital ordinances and deploy invisible patches before the fines hit. You aren't buying software; you're buying the absence of a lawsuit.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button className="w-full sm:w-auto px-8 py-4 rounded-lg bg-white text-black font-bold text-lg hover:bg-slate-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:-translate-y-1">
                Scan My Infrastructure
              </button>
              <button className="w-full sm:w-auto px-8 py-4 rounded-lg border border-white/10 bg-white/5 text-white font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-md">
                View 2026 Mandates
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="border-t border-white/5 bg-black/40 backdrop-blur-lg pb-24">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Feature 1 */}
              <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Statute Sniper</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Real-time monitoring of global legislative feeds. We identify enforcement dates and fine schedules the moment a law passes.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Refractor Clone</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Instant generation of lightweight, invisible code modules that bring your site into 99% alignment with new laws via a single script tag.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Zero-Friction Deployment</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  No complex integrations. No weekly meetings. Drop our proprietary modules into your global footer and eliminate regulatory risk immediately.
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
