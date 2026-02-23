import Link from 'next/link'

export const metadata = {
    title: 'Privacy Policy & Consumer Rights — Simple As That',
    description: 'Your Privacy Choices and 2026 State Consumer Rights disclosure for Simple As That Labs.',
}

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#050511] font-sans text-slate-300">
            {/* Ambient Background */}
            <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen animate-pulse filter" style={{ animationDuration: '4s' }}></div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 space-y-10">
                <Link href="/" className="text-sm text-blue-400 hover:text-blue-300 transition">← Back to Scanner</Link>

                <h1 className="text-3xl font-bold text-white">Privacy Policy & Consumer Rights Notice</h1>
                <p className="text-xs text-slate-500">Last updated: February 23, 2026</p>

                <section className="space-y-4 text-sm leading-relaxed">
                    <h2 className="text-lg font-semibold text-white">1. Information We Collect</h2>
                    <p>When you use our service, we may collect:</p>
                    <ul className="list-disc list-inside text-slate-400 space-y-1">
                        <li><strong className="text-slate-300">Email address</strong> — provided during checkout for license delivery.</li>
                        <li><strong className="text-slate-300">Website domain</strong> — provided during checkout for patch activation.</li>
                        <li><strong className="text-slate-300">Payment information</strong> — processed securely by Stripe. We do not store card details.</li>
                        <li><strong className="text-slate-300">Domain scan data</strong> — URLs entered into our scanner for compliance checks. This data is not stored.</li>
                    </ul>
                </section>

                <section className="space-y-4 text-sm leading-relaxed">
                    <h2 className="text-lg font-semibold text-white">2. How We Use Your Information</h2>
                    <ul className="list-disc list-inside text-slate-400 space-y-1">
                        <li>To deliver and activate your Universal Compliance Patch license.</li>
                        <li>To verify domain authorization when your patch.js script loads.</li>
                        <li>To send transactional emails related to your purchase.</li>
                    </ul>
                    <p className="text-slate-400">We do <strong className="text-slate-300">not</strong> sell, rent, or share your personal information with third parties for marketing purposes.</p>
                </section>

                <section className="space-y-4 text-sm leading-relaxed">
                    <h2 className="text-lg font-semibold text-white">3. Cookies & Tracking</h2>
                    <p className="text-slate-400">This site uses only essential cookies required for functionality. We do not use advertising pixels, analytics trackers, or third-party cookies. We honor the <strong className="text-slate-300">Global Privacy Control (GPC)</strong> signal.</p>
                </section>

                <section className="space-y-4 text-sm leading-relaxed">
                    <h2 className="text-lg font-semibold text-white">4. Third-Party Services</h2>
                    <ul className="list-disc list-inside text-slate-400 space-y-1">
                        <li><strong className="text-slate-300">Stripe</strong> — Payment processing. Subject to <a href="https://stripe.com/privacy" className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">Stripe&apos;s Privacy Policy</a>.</li>
                        <li><strong className="text-slate-300">Supabase</strong> — License database hosting. Subject to <a href="https://supabase.com/privacy" className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">Supabase&apos;s Privacy Policy</a>.</li>
                        <li><strong className="text-slate-300">Vercel</strong> — Site hosting. Subject to <a href="https://vercel.com/legal/privacy-policy" className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">Vercel&apos;s Privacy Policy</a>.</li>
                    </ul>
                </section>

                <section className="space-y-4 text-sm leading-relaxed bg-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white">5. NOTICE OF CONSUMER PRIVACY RIGHTS (2026)</h2>
                    <p className="text-slate-400">Residents of applicable states are granted specific rights under state privacy law regarding their personal data, including but not limited to:</p>
                    <ul className="list-disc list-inside text-slate-400 space-y-2">
                        <li><strong className="text-slate-300">Right to Access / Confirm</strong> — You may request what personal data we hold about you.</li>
                        <li><strong className="text-slate-300">Right to Correct</strong> — You may request correction of inaccurate personal data.</li>
                        <li><strong className="text-slate-300">Right to Delete</strong> — You may request deletion of your personal data, subject to legal exceptions.</li>
                        <li><strong className="text-slate-300">Right to Opt-Out</strong> — You may opt out of the sale or sharing of your personal data. We do not sell your data.</li>
                        <li><strong className="text-slate-300">Right to Non-Discrimination</strong> — You will receive equal service and pricing regardless of your privacy choices.</li>
                    </ul>
                    <p className="text-slate-400">These rights apply under: TIPA (TN), RIDTPPA (RI), ICDPA (IN), MTCDPA (MT), OCPA (OR), CPRA (CA), SHIELD Act (NY), TDPSA (TX), and FTC Section 5 (Federal).</p>
                    <p className="text-slate-400 mt-4">To exercise any of these rights, contact us at: <a href="mailto:info@crmindex.net" className="text-blue-400 underline">info@crmindex.net</a></p>
                </section>

                <section className="space-y-4 text-sm leading-relaxed">
                    <h2 className="text-lg font-semibold text-white">6. Data Retention</h2>
                    <p className="text-slate-400">We retain your email and domain for as long as your license is active. You may request deletion at any time by contacting us.</p>
                </section>

                <section className="space-y-4 text-sm leading-relaxed">
                    <h2 className="text-lg font-semibold text-white">7. Contact</h2>
                    <p className="text-slate-400">For any privacy-related inquiries:<br />
                        <strong className="text-slate-300">Simple As That Labs</strong><br />
                        Email: <a href="mailto:info@crmindex.net" className="text-blue-400 underline">info@crmindex.net</a>
                    </p>
                </section>

                <div className="border-t border-white/10 pt-6 text-center text-xs text-slate-600">
                    Powered by Voss Neural Research
                </div>
            </div>
        </main>
    )
}
