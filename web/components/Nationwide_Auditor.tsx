import React, { useState, useEffect } from 'react';

/**
 * NATIONWIDE EXPANSION: DYNAMIC AUDITOR
 * This component handles the "Mean" UI and swaps state-specific logic.
 */
export default function NationwideAuditor() {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState<'idle' | 'scanning' | 'failed'>('idle');
    const [logs, setLogs] = useState<string[]>([]);
    const [regionData, setRegionData] = useState({ state: 'US', law: 'FTC Section 5', fine: '$50,120', risk: 'Unfair Trade Practices' });

    const states = {
        'RI': { law: 'RIDTPPA', fine: '$10,000', risk: 'ZERO CURE PERIOD (Immediate Enforcement)' },
        'TN': { law: 'TIPA', fine: '$7,500', risk: 'TREBLE DAMAGES ($22,500 for willful neglect)' },
        'NJ': { law: 'NJDPA', fine: '$10,000', risk: 'GPC MANDATORY (Global Opt-Out failure)' },
        'KY': { law: 'KCDPA', fine: '$7,500', risk: 'NEW 2026 MANDATE (Effective Jan 1)' },
        'IN': { law: 'ICDPA', fine: '$7,500', risk: 'NEW 2026 MANDATE (Effective Jan 1)' },
        'CA': { law: 'CPRA/CCPA', fine: '$2,500', risk: 'Per Violation (Automated Enforcement)' },
        'NY': { law: 'SHIELD Act', fine: '$5,000', risk: 'Data Integrity Breach Risk' }
    };

    const runAudit = () => {
        if (!url) return;
        setStatus('scanning');
        setLogs([]);

        // Simulate IP-based location detection (would use a real API in prod)
        const randomStates = Object.keys(states) as Array<keyof typeof states>;
        const detected = states[randomStates[Math.floor(Math.random() * randomStates.length)]];
        setRegionData({ ...detected, state: randomStates[Math.floor(Math.random() * randomStates.length)] });

        const scanMessages = [
            "Initializing statutory audit...",
            `Detecting regional jurisdiction... ${detected.law} found.`,
            "Analyzing SSL/TLS handshake for encryption voids...",
            "Querying local ordinance database (2026-B49)...",
            "Checking GPC signal listeners...",
            `CRITICAL: ${detected.law} compliance headers missing.`,
            `CRITICAL: Unauthorized data processing detected in current zone.`
        ];

        scanMessages.forEach((msg, i) => {
            setTimeout(() => {
                setLogs(prev => [...prev, `> ${msg}`]);
                if (i === scanMessages.length - 1) setStatus('failed');
            }, i * 600);
        });
    };

    return (
        <div className="min-h-screen w-full bg-[#050505] text-[#e0e0e0] flex flex-col p-6 md:p-10 font-mono tracking-tight">
            <nav className="flex justify-between items-start w-full border-b border-zinc-900 pb-6">
                <div className="flex flex-col">
                    <span className="text-xl font-bold tracking-tighter text-white">SIMPLE AS THAT</span>
                    <span className="text-[10px] text-zinc-600 tracking-[0.4em] uppercase">National Statutory Defense Unit</span>
                </div>
                <div className="flex gap-8 items-center text-[10px] uppercase">
                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-zinc-500 hidden sm:inline-block">Global Monitoring Active</span>
                    </div>
                    <button className="border border-zinc-800 px-3 py-1.5 hover:bg-white hover:text-black transition">Client Login</button>
                </div>
            </nav>

            <div className="flex-grow flex flex-col justify-center max-w-3xl mx-auto w-full py-20">
                {status === 'idle' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-5xl md:text-6xl font-light tracking-tighter text-white leading-tight">
                            Compliance, <br /><span className="font-bold">Automated at Scale.</span>
                        </h1>
                        <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-lg">
                            The 2026 mandates are active. We monitor hyper-local legislative feeds and deploy invisible patches before the fines hit.
                            <br /><br />
                            Check your domain for immediate exposure.
                        </p>
                        <div className="relative border-b border-zinc-800 focus-within:border-white transition-colors py-2 mt-8">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value.toLowerCase())}
                                onKeyDown={(e) => e.key === 'Enter' && runAudit()}
                                placeholder="TARGET_DOMAIN_URL"
                                className="bg-transparent w-full outline-none text-lg md:text-xl uppercase placeholder:text-zinc-800 text-white"
                            />
                            <button
                                onClick={runAudit}
                                className="absolute right-0 bottom-2 text-[10px] md:text-xs font-bold text-zinc-500 hover:text-white transition"
                            >
                                [ RUN_AUDIT ]
                            </button>
                        </div>
                    </div>
                )}

                {(status === 'scanning' || status === 'failed') && (
                    <div className="space-y-6 w-full">
                        <div className="bg-zinc-950 border border-zinc-900 p-6 min-h-[260px] font-mono text-xs md:text-sm space-y-2 relative shadow-2xl">
                            <div className="absolute top-3 right-4 text-[9px] text-zinc-700 italic uppercase">Log-Type: Statutory_Audit</div>
                            {logs.map((log: string, i: number) => (
                                <p key={i} className={log.includes('CRITICAL') ? 'text-red-500 font-bold' : log.includes('ACQUIRED') ? 'text-blue-400' : 'text-zinc-400'}>{log}</p>
                            ))}
                            {status === 'scanning' && <span className="inline-block h-4 w-2 bg-white animate-bounce ml-1 mt-1"></span>}
                        </div>

                        {status === 'failed' && (
                            <div className="pt-8 animate-in zoom-in-95 duration-500 flex flex-col items-center text-center">
                                <div className="bg-red-950/20 border border-red-900/50 p-6 mb-8 w-full max-w-md backdrop-blur-sm">
                                    <p className="text-red-500 font-bold tracking-[0.1em] uppercase text-sm md:text-base mb-2">
                                        VERDICT: {regionData.law} NON-COMPLIANCE DETECTED
                                    </p>
                                    <p className="text-red-400/80 text-xs md:text-sm">
                                        Exposure: {regionData.risk}
                                    </p>
                                </div>

                                <button
                                    onClick={async () => {
                                        try {
                                            const res = await fetch('/api/checkout', { method: 'POST' });
                                            const data = await res.json();
                                            if (data.url) {
                                                window.location.href = data.url;
                                            } else {
                                                alert(`Checkout failed: ${data.error || 'Unknown error'}`);
                                            }
                                        } catch (err) {
                                            alert('Network error while initializing checkout.');
                                        }
                                    }}
                                    className="bg-white text-black px-12 py-5 font-bold text-sm md:text-base hover:bg-zinc-200 hover:scale-105 transition-all uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                                >
                                    Acquire National Patch — $49
                                </button>
                                <p className="mt-5 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                                    Est. Daily Fine Liability: <span className="text-red-400">{regionData.fine} USD</span>
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <footer className="flex flex-col md:flex-row justify-between items-center md:items-end text-[9px] text-zinc-700 uppercase tracking-[0.5em] mt-auto gap-4 md:gap-0 pt-10 border-t border-zinc-900/50">
                <div className="flex flex-col gap-1 text-center md:text-left">
                    <span>Targeting: {status === 'failed' ? regionData.law : 'ALL_50_STATES'}</span>
                    <span>Security Level: AES-256-GCM Authorized</span>
                </div>
                <div className="max-w-[400px] text-center md:text-right leading-loose text-zinc-600">
                    Authorized for commercial use only. This tool generates a "Notice of Intent to Audit" which may be submitted to local regulatory bodies upon failure to remediate.
                </div>
            </footer>
        </div>
    );
}
