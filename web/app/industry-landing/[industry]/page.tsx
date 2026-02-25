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

            {/* Hero Section */}
            <section className="bg-deep-purple text-white pt-24 pb-32 px-4 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/grid.svg')] z-0"></div>
                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                        Website Creation for <span className="text-bright-cyan">{data.industry}</span>
                    </h1>
                    <h2 className="text-2xl md:text-3xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
                        Stop <span className="font-bold underline decoration-red-500">{painPoint}</span> and start growing your business with a platform built for your exact needs.
                    </h2>
                    <div className="mt-12">
                        <a href="/onboarding" className="bg-bright-cyan text-deep-purple hover:bg-white text-xl font-bold py-4 px-10 rounded-full transition-all shadow-[0_0_20px_rgba(0,217,255,0.4)] transform hover:scale-105 inline-block">
                            Start Building Free
                        </a>
                    </div>
                </div>
            </section>

            <AIOverviewSummary industry={data.industry} painPoint={painPoint} />

            {/* Why Choose Us */}
            <section className="py-24 px-4 bg-white dark:bg-gray-800">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-16">
                        Everything you need, nothing you don't.
                    </h2>
                    <div className="grid md:grid-cols-3 gap-12 text-left">
                        <div>
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Lightning Fast</h3>
                            <p className="text-gray-600 dark:text-gray-300">Google prioritizes fast sites. Our Next.js infrastructure guarantees 90+ Core Web Vitals scores out of the box.</p>
                        </div>
                        <div>
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Brand Lock</h3>
                            <p className="text-gray-600 dark:text-gray-300">Never worry about bad design. Our algorithms ensure perfect contrast and professional aesthetics tailored for {data.industry}.</p>
                        </div>
                        <div>
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Built-in SEO</h3>
                            <p className="text-gray-600 dark:text-gray-300">Semantic HTML and JSON-LD schema help you rank automatically for "best {data.industry} near me".</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Upsells Section */}
            <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Accelerate your launch with Add-ons
                    </h2>
                    <div className="flex flex-col gap-6">
                        <NanoBananaLogo onAdd={() => { }} />
                        <ComplianceShield onAdd={() => { }} />
                    </div>
                    <div className="mt-12 text-center">
                        <a href="/onboarding" className="text-deep-purple dark:text-bright-cyan font-bold text-lg hover:underline inline-flex items-center">
                            Proceed to Domain Selection <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </a>
                    </div>
                </div>
            </section>

        </div>
    );
}
