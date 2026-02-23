'use client'
import { useState } from 'react'

export default function AntigravityHome() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'scanning' | 'failed'>('idle')
  const [logs, setLogs] = useState<string[]>([])

  const scanMessages = [
    "Initializing statutory audit...",
    "Analyzing SSL/TLS handshake...",
    "Querying local ordinance database...",
    "Checking security header alignment...",
    "Verifying 2026 mandate compliance...",
    "CRITICAL: Missing required regulatory headers.",
    "CRITICAL: Non-compliant encryption found."
  ]

  const runAudit = () => {
    if (!url) return
    setStatus('scanning')
    setLogs([])

    // Cycle through logs to build tension
    scanMessages.forEach((msg, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, `> ${msg}`])
        if (i === scanMessages.length - 1) setStatus('failed')
      }, i * 800)
    })
  }

  return (
    <main className="h-screen w-full bg-[#050505] text-[#e0e0e0] flex flex-col p-10 overflow-hidden font-mono tracking-tight">
      {/* 1. TOP NAV - Institutional Branding */}
      <nav className="flex justify-between items-start w-full border-b border-zinc-900 pb-6">
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tighter text-white">SIMPLE AS THAT</span>
          <span className="text-[10px] text-zinc-600 tracking-[0.4em] uppercase">Statutory Defense Unit // Global</span>
        </div>
        <div className="flex gap-8 items-center">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] text-zinc-500 uppercase">Systems Nominal</span>
          </div>
          <a href="/login" className="text-[10px] border border-zinc-800 px-3 py-1.5 hover:bg-white hover:text-black transition uppercase">Client Access</a>
        </div>
      </nav>

      {/* 2. THE CORE - No Scroll Logic */}
      <div className="flex-grow flex flex-col justify-center max-w-3xl mx-auto w-full">
        {status === 'idle' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-5xl font-light tracking-tighter text-white">
              Compliance, <span className="font-bold">Automated.</span>
            </h1>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
              Statutory enforcement for digital infrastructure is shifting. We monitor legislative feeds and deploy invisible patches before fines hit.
            </p>
            <div className="relative border-b border-zinc-800 focus-within:border-white transition-colors py-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value.toLowerCase())}
                onKeyDown={(e) => e.key === 'Enter' && runAudit()}
                placeholder="TARGET_DOMAIN_URL"
                className="bg-transparent w-full outline-none text-lg uppercase placeholder:text-zinc-900"
              />
              <button
                onClick={runAudit}
                className="absolute right-0 bottom-2 text-[10px] font-bold text-zinc-400 hover:text-white transition"
              >
                [ RUN_AUDIT ]
              </button>
            </div>
          </div>
        )}

        {(status === 'scanning' || status === 'failed') && (
          <div className="space-y-4">
            <div className="bg-zinc-950 border border-zinc-900 p-6 min-h-[200px] font-mono text-xs space-y-2">
              {logs.map((log, i) => (
                <p key={i} className={log.includes('CRITICAL') ? 'text-red-500' : 'text-zinc-400'}>{log}</p>
              ))}
              {status === 'scanning' && <span className="inline-block h-4 w-2 bg-white animate-bounce ml-1"></span>}
            </div>

            {status === 'failed' && (
              <div className="pt-6 animate-in zoom-in-95 duration-500 flex flex-col items-center text-center">
                <p className="text-red-500 font-bold mb-4 tracking-[0.2em] uppercase text-sm">Action Required: Statutory Patch v2026.04 missing.</p>
                <a
                  href="https://buy.stripe.com/00wdR31uZ9KAa8yao71kA00"
                  className="bg-white text-black px-12 py-4 font-bold text-sm hover:bg-zinc-200 transition uppercase tracking-widest"
                >
                  Acquire Patch — $49
                </a>
                <p className="mt-4 text-[10px] text-zinc-600 italic">Estimated daily fine for non-compliance: $2,500.00 USD</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. FOOTER - Minimalist Data */}
      <footer className="flex justify-between items-end text-[9px] text-zinc-700 uppercase tracking-[0.5em] mt-auto">
        <div className="flex flex-col gap-1">
          <span>Active Mandate: B49-2026</span>
          <span>Security Protocol: AES-256-GCM</span>
        </div>
        <div className="max-w-[200px] text-right leading-loose">
          Authorized use only. Unauthorized audits are logged and reported to local regulatory bodies.
        </div>
      </footer>
    </main>
  )
}
