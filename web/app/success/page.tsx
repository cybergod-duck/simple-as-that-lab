import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'STAT-2026-PATCH-V1 | Simple As That',
    description: 'Certified Statutory Compliance Patch for IN, KY, NJ, and TN 2026 Privacy Mandates.',
};

export default function SuccessPage() {
    return (
        <main className="min-h-screen bg-[#050511] font-sans text-slate-300 selection:bg-blue-500/30">
            {/* Dynamic Background */}
            <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen animate-pulse filter" style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-pink-900/10 rounded-full blur-[150px] mix-blend-screen animate-pulse filter" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20">

                {/* Header Ribbon */}
                <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-bold tracking-widest uppercase mb-3">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Certified Patch
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                            STAT-2026-PATCH-V1
                        </h1>
                        <p className="text-slate-400 mt-2 text-sm font-medium">
                            Resolution for 2026 State Privacy Mandates (IN, KY, NJ, TN)
                        </p>
                    </div>

                    <Link href="/" className="px-5 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium transition-all backdrop-blur-md self-start text-white">
                        ← Return to Scanner
                    </Link>
                </div>

                {/* Main Content Area */}
                <div className="space-y-12 animate-fade-in">

                    {/* Section 1 */}
                    <section className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded bg-blue-500/20 text-blue-400 text-sm">1</span>
                            Mandatory Site Footer Link
                        </h2>
                        <div className="pl-11 space-y-4 text-sm leading-relaxed text-slate-400">
                            <p>
                                Per the Indiana (ICDPA), Kentucky (KCDPA), New Jersey (NJDPA), and Tennessee (TIPA) statutes, you must display a clear link on your homepage footer.
                            </p>
                            <div className="bg-black/50 p-4 rounded-lg border border-white/5 font-mono text-blue-300">
                                <span className="text-slate-500">Required Link Text:</span> "Your Privacy Choices & 2026 State Rights"
                                <br />
                                <span className="text-slate-500">Target Page:</span> /privacy-rights <span className="text-slate-500 italic">(or your existing Privacy Policy page)</span>
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
                                Add the following text to your target `/privacy-rights` page to satisfy the 30-day "Cure Period" requirements:
                            </p>

                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative bg-black/80 p-6 rounded-xl border border-white/10 font-mono text-[13px] leading-relaxed text-slate-300">
                                    <h3 className="text-white font-bold mb-3">NOTICE OF CONSUMER PRIVACY RIGHTS (2026)</h3>
                                    <p className="mb-3">Residents of IN, KY, NJ, and TN are granted specific rights under state law regarding personal data:</p>
                                    <ul className="space-y-2 mb-4 list-disc list-inside text-slate-400">
                                        <li><strong className="text-slate-200">Right to Access/Confirm:</strong> Confirm if data is processed and obtain a portable copy.</li>
                                        <li><strong className="text-slate-200">Right to Correct/Delete:</strong> Correct inaccuracies or delete personal data provided.</li>
                                        <li><strong className="text-slate-200">Right to Opt-Out:</strong> Opt-out of data sales, targeted ads, and profiling.</li>
                                        <li><strong className="text-slate-200">Right to Appeal:</strong> If a request is denied, you have 60 days to submit an appeal.</li>
                                    </ul>
                                    <p>Contact: <span className="text-blue-400">[Enter Business Email]</span> to exercise these rights.</p>
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
                                Alternatively, bypass manual CMS editing. Paste this script into your site's global footer or tag manager to automate the link injection immediately:
                            </p>

                            <div className="bg-[#0c0c16] rounded-xl border border-white/10 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                                    <span className="text-xs font-mono text-slate-400">HTML / JavaScript</span>
                                    <button className="text-xs font-medium text-pink-400 hover:text-pink-300 transition-colors">Copy to Clipboard</button>
                                </div>
                                <pre className="p-4 overflow-x-auto">
                                    <code className="text-[13px] font-mono leading-relaxed opacity-90">
                                        <span className="text-pink-400">&lt;script&gt;</span>{'\n'}
                                        <span className="text-blue-300">(function()</span> {'{\n'}
                                        {'  '}var l = document.<span className="text-purple-300">createElement</span>(<span className="text-green-300">'a'</span>);{'\n'}
                                        {'  '}l.href = <span className="text-green-300">'/privacy-rights'</span>;{'\n'}
                                        {'  '}l.innerText = <span className="text-green-300">'Your Privacy Choices & 2026 State Rights'</span>;{'\n'}
                                        {'  '}l.style = <span className="text-green-300">'font-size:11px;color:#777;text-decoration:none;margin:10px;display:block;'</span>;{'\n'}
                                        {'  '}document.<span className="text-purple-300">querySelector</span>(<span className="text-green-300">'footer'</span>).<span className="text-purple-300">appendChild</span>(l);{'\n'}
                                        {'}'}<span className="text-blue-300">)();</span>{'\n'}
                                        <span className="text-pink-400">&lt;/script&gt;</span>
                                    </code>
                                </pre>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}
