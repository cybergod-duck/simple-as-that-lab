import Link from 'next/link';
import { Metadata } from 'next';

// Helper to determine threat text based on the dynamic state parameter
function getThreatData(stateParam?: string | string[]) {
    const defaultData = {
        title: "STAT-2026-PATCH-V1",
        subtitle: "Resolution for 2026 State Privacy Mandates (IN, KY, NJ, TN)",
        description: "Your infrastructure is currently exposed to the latest iteration of the ICDPA, KCDPA, NJDPA, and TIPA statutes. Failing to implement this patch after the 30-day 'Cure Period' exposes you to significant regional fines.",
        alertPulse: "bg-red-500",
        alertBg: "bg-red-500/10",
        alertText: "text-red-400",
        alertBorder: "border-red-500/30"
    };

    if (!stateParam) return defaultData;

    const state = Array.isArray(stateParam) ? stateParam[0].toUpperCase() : stateParam.toUpperCase();

    switch (state) {
        case 'TN':
            return {
                ...defaultData,
                title: "STAT-2026-PATCH-TN",
                subtitle: "Resolution for Tennessee Information Protection Act (TIPA)",
                description: "Tennessee's TIPA carries 'Triple Damage' penalties of up to $7,500 per violation. Enforcement is in full swing. Implement this patch immediately to avoid escalating fines.",
            };
        case 'IN':
            return {
                ...defaultData,
                title: "STAT-2026-PATCH-IN",
                subtitle: "Resolution for Indiana Consumer Data Protection Act (ICDPA)",
                description: "Indiana's ICDPA mandates a specific 'Right to Correct' provision. Failing to comply after the 30-day Cure Period triggers $7,500 fines per violation.",
            };
        case 'RI':
            return {
                ...defaultData,
                title: "STAT-2026-PATCH-RI",
                subtitle: "Resolution for Rhode Island Data Transparency & Privacy Protection Act (RIDTPPA)",
                description: "This law contains NO CURE PERIOD. Failing to implement this patch exposes you to immediate $10,000 penalties per violation.",
            };
        case 'MN':
            return {
                ...defaultData,
                title: "STAT-2026-PATCH-MN",
                subtitle: "Resolution for Minnesota Consumer Data Protection Act (MCDPA)",
                description: "The 30-day 'Cure Period' has EXPIRED. Implement this patch immediately to halt active $7,500 penalties.",
            };
        case 'MT':
            return {
                ...defaultData,
                title: "STAT-2026-PATCH-MT",
                subtitle: "Resolution for Montana Consumer Data Privacy Act (MTCDPA)",
                description: "Montana's MTCDPA grace periods for small businesses have officially expired in 2026. Active enforcement with fines up to $7,500 is now underway.",
            };
        case 'OR':
            return {
                ...defaultData,
                title: "STAT-2026-PATCH-OR",
                subtitle: "Resolution for Oregon Consumer Privacy Act (OCPA)",
                description: "Oregon's OCPA has unique 'sensitive data' definitions that most standard site headers completely ignore. Non-compliance triggers fines up to $7,500 per violation.",
            };
        default:
            return defaultData;
    }
}

export default function SuccessPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const threatData = getThreatData(searchParams?.state);

    return (
        <main className="min-h-screen bg-[#050511] font-sans text-slate-300 selection:bg-blue-500/30 pb-20">
            {/* Dynamic Background */}
            <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen animate-pulse filter" style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-pink-900/10 rounded-full blur-[150px] mix-blend-screen animate-pulse filter" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20">

                {/* Header Ribbon */}
                <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
                    <div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${threatData.alertBorder} ${threatData.alertBg} ${threatData.alertText} text-xs font-bold tracking-widest uppercase mb-3`}>
                            <span className={`w-2 h-2 rounded-full ${threatData.alertPulse} animate-pulse`}></span>
                            License Required
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                            {threatData.title}
                        </h1>
                        <p className="text-slate-400 mt-2 text-sm font-medium">
                            {threatData.subtitle}
                        </p>
                    </div>

                    <Link href="/" className="px-5 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium transition-all backdrop-blur-md self-start text-white">
                        ← Return to Scanner
                    </Link>
                </div>

                {/* Priority Action Card (Stripe Link) */}
                <div className="mb-12 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/40 rounded-2xl p-8 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.15)] animate-fade-in">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1 space-y-4">
                            <h2 className="text-2xl font-bold text-white">Acquire Your Universal Compliance Patch</h2>
                            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                                {threatData.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Instant Activation
                                </span>
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Invisible Footprint
                                </span>
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    ADA + Privacy + Cookies
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={async () => {
                            const res = await fetch('/api/checkout', { method: 'POST' })
                            const data = await res.json()
                            if (data.url) window.location.href = data.url
                        }}
                        className="w-full md:w-auto px-8 py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-slate-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] whitespace-nowrap text-center cursor-pointer"
                    >
                        License Now — $49
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="space-y-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>

                {/* Section 1 */}
                <section className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden group">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded bg-blue-500/20 text-blue-400 text-sm">1</span>
                        Mandatory Site Footer Link
                    </h2>
                    <div className="pl-11 space-y-4 text-sm leading-relaxed text-slate-400 pb-2">
                        <p>
                            Per state statutes, you must display a clear privacy rights link on your site. Our patch auto-injects this — no manual CMS editing needed.
                        </p>

                        <div className="relative mt-4">
                            <div className="bg-black/50 p-4 rounded-lg border border-white/5 font-mono text-blue-300 filter blur-sm select-none opacity-50">
                                <span className="text-slate-500">Required Link Text:</span> "Your Privacy Choices & 2026 State Rights"
                                <br />
                                <span className="text-slate-500">Target Page:</span> /privacy-rights <span className="text-slate-500 italic">(or your existing Privacy Policy page)</span>
                            </div>

                            {/* Lock Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-lg">
                                <svg className="w-8 h-8 text-white/80 mb-2 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span className="text-xs font-bold tracking-widest text-white/90 uppercase drop-shadow-md">Unlock with License</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2 */}
                <section className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded bg-purple-500/20 text-purple-400 text-sm">2</span>
                        Statutory Disclosure Block
                    </h2>
                    <div className="pl-11 space-y-4 text-sm leading-relaxed text-slate-400">
                        <p>
                            Our patch handles ADA accessibility (ARIA landmarks, focus styles, skip links), cookie consent hard-blocking, GPC signal support, and the full statutory disclosure — all auto-injected:
                        </p>

                        <div className="relative mt-4">
                            <div className="bg-black/80 p-6 rounded-xl border border-white/10 font-mono text-[13px] leading-relaxed text-slate-300 filter blur-sm select-none opacity-50">
                                <h3 className="text-white font-bold mb-3">NOTICE OF CONSUMER PRIVACY RIGHTS (2026)</h3>
                                <p className="mb-3">Residents are granted specific rights under state law regarding personal data...</p>
                                <ul className="space-y-2 mb-4 list-disc list-inside text-slate-400">
                                    <li><strong className="text-slate-200">Right to Access/Confirm...</strong></li>
                                    <li><strong className="text-slate-200">Right to Correct/Delete...</strong></li>
                                    <li><strong className="text-slate-200">Right to Opt-Out...</strong></li>
                                </ul>
                            </div>

                            {/* Lock Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-xl">
                                <svg className="w-10 h-10 text-white/80 mb-2 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <button onClick={async () => { const res = await fetch('/api/checkout', { method: 'POST' }); const data = await res.json(); if (data.url) window.location.href = data.url; }} className="mt-2 px-6 py-2 bg-white/10 border border-white/20 hover:bg-white/20 transition-colors rounded-full text-sm font-bold text-white backdrop-blur-md cursor-pointer">
                                    Purchase to View
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3 */}
                <section className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded bg-pink-500/20 text-pink-400 text-sm">3</span>
                        Automated Deployment Script
                    </h2>
                    <div className="pl-11 space-y-4 text-sm leading-relaxed text-slate-400">
                        <p>
                            Forget manual editing. Paste this single script tag into your site's global footer or tag manager. It handles everything — privacy, accessibility, cookies, GPC — automatically:
                        </p>

                        <div className="relative mt-4">
                            <div className="bg-[#0c0c16] rounded-xl border border-white/10 overflow-hidden filter blur-sm select-none opacity-50">
                                <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                                    <span className="text-xs font-mono text-slate-400">HTML / JavaScript</span>
                                </div>
                                <pre className="p-4 overflow-hidden">
                                    <code className="text-[13px] font-mono leading-relaxed opacity-90 block">
                                        &lt;script src="https://simple-as-that.org/patch.js" data-license="YOUR_EMAIL_HERE"&gt;&lt;/script&gt;
                                    </code>
                                </pre>
                            </div>

                            {/* Lock Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-xl">
                                <svg className="w-10 h-10 text-white/80 mb-2 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span className="text-xs font-bold tracking-wider text-white/90 uppercase drop-shadow-md pb-2">License Required for Auto-Deployment Script</span>
                                <button onClick={async () => { const res = await fetch('/api/checkout', { method: 'POST' }); const data = await res.json(); if (data.url) window.location.href = data.url; }} className="px-6 py-2 bg-pink-500 hover:bg-pink-400 transition-colors rounded-full text-sm font-bold text-white shadow-[0_0_15px_rgba(236,72,153,0.4)] cursor-pointer">
                                    Get Access
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}
