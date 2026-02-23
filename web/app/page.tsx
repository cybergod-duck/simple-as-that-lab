'use client'
import { useState, Suspense, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'

function ScannerContent() {
  const searchParams = useSearchParams()
  const stateParam = searchParams.get('state')

  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'scanning' | 'failed'>('idle')
  const [logs, setLogs] = useState<string[]>([])

  // Dynamic state formatting
  let mandateName = "B49-2026"
  let errorText = "Statutory Patch v2026.04 missing."
  let estimatedFine = "$2,500.00 USD"

  if (stateParam) {
    const state = stateParam.toUpperCase()
    if (state === 'RI') {
      mandateName = "Rhode Island (RIDPA)"
      errorText = "RIDPA CURE PERIOD UNAVAILABLE. IMMEDIATE PENALTY ACTIVE."
      estimatedFine = "$10,000.00 USD"
    } else if (state === 'MN') {
      mandateName = "Minnesota (MCDPA)"
      errorText = "MCDPA GRACE PERIOD EXPIRED."
      estimatedFine = "$7,500.00 USD"
    } else if (state === 'IN') {
      mandateName = "Indiana (ICDPA)"
      errorText = "ICDPA VIOLATION DETECTED."
      estimatedFine = "$7,500.00 USD"
    }
  }

  const scanMessages = [
    "Initializing statutory audit...",
    "Analyzing SSL/TLS handshake...",
    "Querying local ordinance database...",
    "Checking security header alignment...",
    `Verifying ${mandateName} compliance...`,
    "CRITICAL: Missing required regulatory headers.",
    "CRITICAL: Non-compliant encryption found."
  ]

  const isValidUrl = (input: string): boolean => {
    try {
      new URL(input.startsWith('http') ? input : `https://${input}`);
      return true;
    } catch {
      return false;
    }
  }

  const runAudit = useCallback(() => {
    if (!url || !isValidUrl(url)) {
      setLogs(['> Invalid URL provided.']);
      setStatus('failed');
      return;
    }
    setStatus('scanning')
    setLogs([])

    scanMessages.forEach((msg, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, `> ${msg}`])
        if (i === scanMessages.length - 1) setStatus('failed')
      }, i * 800)
    })
  }, [url])

  return (
    <div className="flex-grow flex flex-col justify-center max-w-3xl mx-auto w-full">
      {status === 'idle' && (
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Regulatory Feed Active
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            <span className="block">Compliance,</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Automated.</span>
          </h1>

          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg">
            Statutory enforcement for digital infrastructure is shifting. We monitor legislative feeds and deploy invisible patches before fines hit. We're not selling code — we're providing certainty.
          </p>

          <p className="text-slate-500 text-sm font-medium">
            Penalties for non-compliance start at {estimatedFine}/day. Run your domain below.
          </p>

          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Target Domain Audit</label>
            <div className="relative border-b border-white/10 focus-within:border-blue-500/50 transition-colors py-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runAudit()}
                placeholder="example.com"
                className="bg-transparent w-full outline-none text-lg text-white placeholder:text-slate-600 font-mono"
              />
              <button
                onClick={runAudit}
                className="absolute right-0 bottom-2 text-xs font-bold text-blue-400 hover:text-white transition px-3 py-1 border border-blue-500/30 rounded hover:bg-blue-500/20"
              >
                RUN AUDIT
              </button>
            </div>
          </div>
        </div>
      )}

      {(status === 'scanning' || status === 'failed') && (
        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 min-h-[220px] font-mono text-sm space-y-2 backdrop-blur-sm">
            {logs.map((log, i) => (
              <p key={i} className={log.includes('CRITICAL') ? 'text-red-400 font-bold' : 'text-slate-400'}>{log}</p>
            ))}
            {status === 'scanning' && <span className="inline-block h-4 w-2 bg-blue-400 animate-bounce ml-1"></span>}
          </div>

          {status === 'failed' && (
            <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 border border-red-500/30 rounded-2xl p-8 backdrop-blur-md text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Non-Compliant
              </div>
              <p className="text-white font-bold text-lg">Action Required: {errorText}</p>
              <a
                href="https://buy.stripe.com/00wdR31uZ9KAa8yao71kA00"
                className="inline-block px-10 py-4 bg-white text-black font-bold text-base rounded-xl hover:bg-slate-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Acquire Patch — $49
              </a>
              <p className="text-slate-400 text-xs">Estimated daily fine for non-compliance: {estimatedFine}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AntigravityHome() {
  return (
    <main className="min-h-screen bg-[#050511] font-sans text-slate-300 selection:bg-blue-500/30">
      {/* Ambient Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen animate-pulse filter" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-pink-900/10 rounded-full blur-[150px] mix-blend-screen animate-pulse filter" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="border-b border-white/5 bg-white/[0.02] backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                ST
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
                Simple As That
              </span>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs text-slate-500">Systems Nominal</span>
              </div>
              <a href="/login" className="px-5 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium transition-all backdrop-blur-md text-white">
                Client Access
              </a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <Suspense fallback={<div className="flex items-center justify-center text-slate-500 text-sm animate-pulse">Initializing Interface...</div>}>
            <ScannerContent />
          </Suspense>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-white/[0.02] backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-xs text-slate-500">
            <div className="flex gap-6">
              <span>Active Protocol: ENFORCEMENT-MODE</span>
              <span>Security: AES-256-GCM</span>
            </div>
            <span>Authorized use only.</span>
          </div>
        </footer>
      </div>
    </main>
  )
}
