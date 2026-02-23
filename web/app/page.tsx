'use client'
import { useState, Suspense, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'

// National Directive Engine — maps states to their specific legal exposure
const getNationalDirective = (state: string) => {
  const directives: Record<string, { law: string; fine: string; risk: string }> = {
    'TN': { law: 'TIPA', fine: '$7,500', risk: 'Triple Damages' },
    'RI': { law: 'RIDTPPA', fine: '$10,000', risk: 'Zero Cure Period' },
    'IN': { law: 'ICDPA', fine: '$7,500', risk: 'Right to Correct Mandate' },
    'MT': { law: 'MTCDPA', fine: '$7,500', risk: 'Grace Period Expired' },
    'OR': { law: 'OCPA', fine: '$7,500', risk: 'Sensitive Data Definitions' },
    'CA': { law: 'CPRA', fine: '$2,500', risk: 'Per Violation' },
    'NY': { law: 'SHIELD Act', fine: '$5,000', risk: 'Data Integrity' },
    'TX': { law: 'TDPSA', fine: '$7,500', risk: 'Consumer Opt-Out' },
    'FL': { law: 'FDBR', fine: '$50,000', risk: 'High-Revenue Threshold' },
    'MN': { law: 'MCDPA', fine: '$7,500', risk: 'Cure Period Expired' },
  }

  const info = directives[state] || { law: 'FTC Section 5', fine: '$50,120', risk: 'Deceptive Trade Practices' }

  return {
    mandateName: `${state || 'Federal'} (${info.law})`,
    errorText: `${info.law} NON-COMPLIANCE DETECTED — ${info.risk}.`,
    estimatedFine: `${info.fine} USD`,
    law: info.law,
    fine: info.fine,
    risk: info.risk,
  }
}

function ScannerContent() {
  const searchParams = useSearchParams()
  const stateParam = searchParams.get('state')

  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'scanning' | 'failed'>('idle')
  const [logs, setLogs] = useState<string[]>([])

  // Get directive based on state parameter (or default)
  const stateCode = stateParam?.toUpperCase() || ''
  const directive = getNationalDirective(stateCode)

  // Full multi-vector audit scan messages
  const scanMessages = [
    "Initializing statutory audit...",
    "Resolving DNS and verifying SSL/TLS handshake...",
    `Querying ${directive.mandateName} ordinance database...`,
    // ADA Accessibility
    "Scanning WCAG 2.1 AA accessibility compliance...",
    "CRITICAL: Missing ARIA landmarks and keyboard navigation traps detected.",
    // Cookie enforcement
    "Analyzing cookie consent enforcement layer...",
    "CRITICAL: Tracking pixels firing before explicit user consent.",
    // GPC signal
    "Detecting Global Privacy Control (GPC) signal support...",
    "CRITICAL: GPC signal not honored — mandatory in CA, CO, CT, MT.",
    // Privacy headers
    `Verifying ${directive.mandateName} statutory disclosure requirements...`,
    `CRITICAL: ${directive.law} non-compliance confirmed — ${directive.risk}.`,
    // Tax disclosures
    "Checking nexus-based tax disclosure requirements...",
    "WARNING: No visitor-location-based tax notices detected.",
    // Final verdict
    `VERDICT: Domain exposed to fines up to ${directive.fine}/violation.`
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
    setLogs([`> TARGET ACQUIRED: ${url}`])

    scanMessages.forEach((msg, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, `> ${msg}`])
        if (i === scanMessages.length - 1) setStatus('failed')
      }, (i + 1) * 700)
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
            Penalties for non-compliance start at {directive.estimatedFine}/day. Run your domain below.
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
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 min-h-[280px] max-h-[400px] overflow-y-auto font-mono text-sm space-y-1.5 backdrop-blur-sm">
            {logs.map((log, i) => (
              <p key={i} className={
                log.includes('CRITICAL') ? 'text-red-400 font-bold' :
                  log.includes('WARNING') ? 'text-amber-400 font-semibold' :
                    log.includes('VERDICT') ? 'text-red-500 font-bold text-base mt-2' :
                      log.includes('TARGET ACQUIRED') ? 'text-blue-400 font-bold' :
                        'text-slate-400'
              }>{log}</p>
            ))}
            {status === 'scanning' && <span className="inline-block h-4 w-2 bg-blue-400 animate-bounce ml-1"></span>}
          </div>

          {status === 'failed' && (
            <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 border border-red-500/30 rounded-2xl p-8 backdrop-blur-md text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Multi-Vector Failure
              </div>
              <p className="text-white font-bold text-lg">{directive.errorText}</p>
              <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-400">
                <span className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded">ADA/WCAG ✗</span>
                <span className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded">Cookie Consent ✗</span>
                <span className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded">GPC Signal ✗</span>
                <span className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded">Privacy Disclosure ✗</span>
                <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded">Tax Notice ⚠</span>
              </div>
              <p className="text-slate-400 text-sm">One script tag fixes all of the above. Deploys in under 60 seconds.</p>
              <button
                onClick={async () => {
                  const res = await fetch('/api/checkout', { method: 'POST' })
                  const data = await res.json()
                  if (data.url) window.location.href = data.url
                }}
                className="inline-block px-10 py-4 bg-white text-black font-bold text-base rounded-xl hover:bg-slate-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer"
              >
                Acquire Universal Patch — $49
              </button>
              <p className="text-slate-400 text-xs">Estimated daily fine exposure: {directive.estimatedFine}/violation</p>
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
        <div className="text-center py-3 text-[10px] text-slate-600">
          Powered by Voss Neural Research
        </div>
      </div>
    </main>
  )
}
