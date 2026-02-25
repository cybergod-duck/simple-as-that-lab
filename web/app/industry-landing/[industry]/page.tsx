import { notFound } from 'next/navigation';
import { getIndustryData } from '../../../utils/csvParser';
import NanoBananaLogo from '../../../components/Upsells/NanoBananaLogo';
import ComplianceShield from '../../../components/Upsells/ComplianceShield';
import JsonLdService from '../../../components/SEO/JsonLdService';
import AIOverviewSummary from '../components/AIOverviewSummary';

interface PageProps {
    params: { industry: string };
}

export async function generateStaticParams() {
    const industries = getIndustryData();
    return industries.map((ind) => ({
        industry: ind.slug.replace('website-creation-for-', ''),
    }));
}

export default function IndustryLandingPage({ params }: PageProps) {
    const industrySlug = params.industry;

    const allData = getIndustryData();
    const data = allData.find(d => d.slug === `website-creation-for-${industrySlug}` || d.industry.toLowerCase().replace(/[^a-z0-9]/g, '-') === industrySlug);

    if (!data) {
        notFound();
    }

    const painPoint = data.pain_point;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-navy">
            <JsonLdService industry={data.industry} painPoint={painPoint} />

            {/* Hero Section - Premium Overhaul */}
            <section className="bg-[#0A0F1C] text-white pt-32 pb-40 px-4 relative overflow-hidden flex flex-col items-center justify-center min-h-[85vh]">
                {/* Dynamic Radial Gradient Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0A0F1C] to-[#0A0F1C] z-0"></div>

                {/* Animated Grid Overlay */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] z-0 pointer-events-none mix-blend-overlay"></div>

                <div className="relative z-10 max-w-6xl mx-auto text-center px-4">
                    {/* Premium Badge */}
                    <div className="inline-flex items-center px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                        <span className="w-2 h-2 rounded-full bg-bright-cyan animate-pulse mr-3"></span>
                        <span className="text-sm font-medium tracking-wide text-blue-200">Next-Generation Infrastructure</span>
                    </div>

                    <h1 className="text-Oklch-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-400 text-6xl md:text-8xl font-black mb-8 tracking-tighter drop-shadow-sm">
                        Website Creation for <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-bright-cyan to-blue-500">{data.industry}</span>
                    </h1>

                    <h2 className="text-xl md:text-2xl text-gray-400 font-light max-w-4xl mx-auto leading-relaxed mb-12">
                        Stop suffering from <span className="font-semibold text-rose-400">{painPoint}</span>. Launch a high-performance, fully automated digital growth engine built precisely for your exact needs.
                    </h2>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <a href="/onboarding" className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white transition-all duration-300 ease-in-out bg-transparent rounded-full overflow-hidden w-full sm:w-auto">
                            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                            <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out bg-gradient-to-r from-blue-600 to-bright-cyan opacity-90 group-hover:opacity-100"></span>
                            <span className="absolute top-0 left-0 w-full bg-gradient-to-b from-white to-transparent opacity-10 h-1/3"></span>
                            <span className="relative flex items-center shadow-[0_0_30px_rgba(0,217,255,0.4)] group-hover:shadow-[0_0_50px_rgba(0,217,255,0.6)] transition-all">
                                Deploy Your Platform Now
                                <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </span>
                        </a>
                        <p className="text-sm text-gray-500 font-medium">Starts at just $199. Fully compliant.</p>
                    </div>
                </div>

                {/* Bottom Fade Gradient to blend into the next section */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 dark:from-dark-navy to-transparent z-10 pointer-events-none"></div>
            </section>

            <AIOverviewSummary industry={data.industry} painPoint={painPoint} />

            {/* Why Choose Us - Premium Glassmorphism Cards */}
            <section className="py-32 px-4 bg-gray-50 dark:bg-dark-navy relative">
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                        Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-bright-cyan">Dominance.</span>
                    </h2>
                    <p className="text-xl text-gray-500 dark:text-gray-400 mb-20 max-w-2xl mx-auto">We don't build brochures. We build high-velocity data capture machines optimized explicitly for the {data.industry} sector.</p>

                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        {/* Card 1 */}
                        <div className="bg-white dark:bg-[#131B2F] border border-gray-100 dark:border-gray-800 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-8 text-blue-600 dark:text-bright-cyan border border-blue-100 dark:border-blue-800/50 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">Microsecond Load Times</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">Google severely penalizes slow sites. Our Edge-cached Next.js infrastructure guarantees perfect 100/100 Core Web Vitals scores out of the box.</p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white dark:bg-[#131B2F] border border-gray-100 dark:border-gray-800 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                            <div className="w-16 h-16 bg-green-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-8 text-green-600 dark:text-emerald-400 border border-green-100 dark:border-emerald-800/50 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">Brand Lock™ Typography</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">Never worry about amateur design again. Our proprietary algorithms ensure perfect color contrast and premium typography tailored exclusively for {data.industry}.</p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white dark:bg-[#131B2F] border border-gray-100 dark:border-gray-800 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                            <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-8 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800/50 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">Semantic AI SEO</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">Outrank older competitors automatically. We inject compliant HTML5 and JSON-LD schema into every single page to dominate local search results.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Upsells Section - Premium Checkout styling */}
            <section className="py-24 px-4 bg-[#0A0F1C] relative border-t border-gray-800/50">
                {/* Subtle Glow Effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[100px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <h2 className="text-4xl font-black text-center text-white mb-4 tracking-tight">
                        Accelerate Your Launch.
                    </h2>
                    <p className="text-center text-gray-400 mb-16 text-lg">Bolt-on infrastructure to instantly elevate your authority.</p>

                    <div className="flex flex-col gap-6">
                        <div className="transform transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] rounded-2xl bg-gray-900/40 p-1 border border-gray-800/60 backdrop-blur-sm">
                            <NanoBananaLogo onAdd={() => { }} />
                        </div>
                        <div className="transform transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] rounded-2xl bg-gray-900/40 p-1 border border-gray-800/60 backdrop-blur-sm">
                            <ComplianceShield onAdd={() => { }} />
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <a href="/onboarding" className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 hover:border-gray-600 overflow-hidden shadow-lg hover:shadow-xl">
                            <span className="relative flex items-center gap-2">
                                Proceed to Domain Selection
                                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 text-bright-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </span>
                        </a>
                    </div>
                </div>
            </section>

        </div>
    );
}
