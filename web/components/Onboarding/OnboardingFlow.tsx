'use client';
import { useState, useEffect } from 'react';
import BrandLock from './BrandLock';
import TemplateRecommendations from './TemplateRecommendations';

type Step = 'initial' | 'brand' | 'recommendations' | 'domain' | 'complete';

interface DomainOption {
    domain: string;
    available: boolean;
    price: number;
}

export default function OnboardingFlow() {
    const [step, setStep] = useState<Step>('initial');
    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        goals: '',
        image: null as File | null,
        brand: null as any,
        plan: '',
        domain: '',
    });

    const [industries, setIndustries] = useState<string[]>([]);
    const [availableDomains, setAvailableDomains] = useState<DomainOption[]>([]);
    const [isCheckingDomain, setIsCheckingDomain] = useState(false);

    useEffect(() => {
        // Fetch top industries on load
        fetch('/api/industries')
            .then(res => res.json())
            .then(data => {
                if (data.industries) {
                    setIndustries(data.industries);
                }
            })
            .catch(console.error);
    }, []);

    const handleInitialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.industry) return;
        setStep('brand');
    };

    const handleBrandComplete = (brandData: any) => {
        setFormData({ ...formData, brand: brandData });
        setStep('recommendations');
    };

    const handlePlanSelect = (plan: string) => {
        setFormData({ ...formData, plan });
        checkDomains(formData.name);
        setStep('domain');
    };

    const checkDomains = async (businessName: string) => {
        setIsCheckingDomain(true);
        try {
            const res = await fetch('/api/domain-check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ businessName })
            });
            const data = await res.json();
            if (data.domains) {
                setAvailableDomains(data.domains);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsCheckingDomain(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, image: e.target.files[0] });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-navy py-12 px-4 sm:px-6 lg:px-8 font-sans">

            {/* Progress Bar */}
            <div className="max-w-3xl mx-auto mb-12">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10"></div>

                    {['Details', 'Brand', 'Select', 'Domain'].map((label, idx) => {
                        const isActive =
                            (idx === 0) ||
                            (idx === 1 && ['brand', 'recommendations', 'domain', 'complete'].includes(step)) ||
                            (idx === 2 && ['recommendations', 'domain', 'complete'].includes(step)) ||
                            (idx === 3 && ['domain', 'complete'].includes(step));

                        return (
                            <div key={label} className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isActive ? 'bg-bright-cyan text-deep-purple' : 'bg-gray-300 text-gray-600 border-4 border-gray-50'}`}>
                                    {idx + 1}
                                </div>
                                <span className={`mt-2 text-xs font-semibold ${isActive ? 'text-bright-cyan' : 'text-gray-500'}`}>{label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step 1: Initial Details */}
            {step === 'initial' && (
                <form onSubmit={handleInitialSubmit} className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                    <h2 className="text-3xl font-black text-deep-purple dark:text-white mb-6">Let's build your platform.</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Business Name</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-bright-cyan focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="e.g. Acme Innovations"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Industry</label>
                            <input
                                required
                                type="text"
                                list="industry-list"
                                value={formData.industry}
                                onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-bright-cyan focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Search or type your industry..."
                            />
                            <datalist id="industry-list">
                                {industries.slice(0, 100).map((ind, i) => <option key={i} value={ind} />)}
                            </datalist>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Primary Goal</label>
                            <select
                                required
                                value={formData.goals}
                                onChange={e => setFormData({ ...formData, goals: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-bright-cyan focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="">Select a goal...</option>
                                <option value="leads">Generate more leads/calls</option>
                                <option value="sales">Sell products online</option>
                                <option value="portfolio">Showcase my work/portfolio</option>
                                <option value="booking">Online appointment booking</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Upload Logo / Hero Image (Optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200"
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full mt-8 bg-deep-purple hover:bg-opacity-90 text-white font-bold py-4 rounded-xl transition-all shadow-lg transform hover:-translate-y-1">
                        Analyze Requirements &rarr;
                    </button>
                </form>
            )}

            {/* Step 4: Domain Check */}
            {step === 'domain' && (
                <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                    <h2 className="text-3xl font-black text-deep-purple dark:text-white mb-2 text-center">Secure Your Domain</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-xl mx-auto">We automatically configure the DNS routing for you. Choose how you want to handle your web address.</p>

                    {isCheckingDomain ? (
                        <div className="py-12 animate-pulse flex flex-col items-center">
                            <div className="w-16 h-16 border-4 border-bright-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500 font-medium">Scanning live registries for {formData.name}...</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Left Column: Direct Purchase */}
                            <div className="space-y-4 col-span-1">
                                <h3 className="font-bold text-gray-900 dark:text-white">Option 1: Buy Seamlessly</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">We'll register and configure the domain in the background via the Namecheap API.</p>

                                <div className="space-y-3">
                                    {availableDomains.map((domain, i) => (
                                        <div key={i} className="flex flex-col p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:border-bright-cyan transition-colors">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center">
                                                    {domain.available ? (
                                                        <span className="h-2.5 w-2.5 bg-green-500 rounded-full mr-2 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></span>
                                                    ) : (
                                                        <span className="h-2.5 w-2.5 bg-red-500 rounded-full mr-2"></span>
                                                    )}
                                                    <span className={`font-bold ${!domain.available && 'line-through text-gray-400'}`}>
                                                        {domain.domain}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                                    ${domain.price}/yr
                                                </span>
                                            </div>

                                            {domain.available ? (
                                                <button
                                                    onClick={async () => {
                                                        // Namecheap API Integration trigger
                                                        await fetch('/api/namecheap/buy', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ domain: domain.domain })
                                                        });
                                                        setStep('complete');
                                                    }}
                                                    className="w-full bg-deep-purple hover:bg-opacity-90 text-white font-bold py-2 rounded-lg text-sm transition-all"
                                                >
                                                    Buy Instantly (Namecheap API)
                                                </button>
                                            ) : (
                                                <span className="text-red-500 text-sm font-semibold text-center py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">Taken</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column: Other Options */}
                            <div className="space-y-8 col-span-1">

                                {/* Option 2: Cloudflare */}
                                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border-2 border-orange-100 dark:border-orange-900/30 text-center">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-left flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 0 0-7.85-1.07A4 4 0 0 0 4 9a5 5 0 0 0 1 9.9h12a4 4 0 0 0 3-7.85 4 4 0 0 0-4-4.05zm0 10H5a3 3 0 0 1-1-5.83l.28-.1-.13-.27a2 2 0 0 1 1.7-2.7h.23l-.1-.23A2 2 0 0 1 7.8 7.3a1.95 1.95 0 0 1 1.75.9l.48 1.15 1.17-.43A2 2 0 0 1 13 8.35a2 2 0 0 1 1.07.3L15.4 9.4l1.24-.12A2 2 0 0 1 18 11.2a2 2 0 0 1-2 1.8z" /></svg>
                                        Option 2: Cloudflare Handoff
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-left">
                                        Buy domains at cost directly from Cloudflare. We'll pre-fill your domain, and you can auto-connect via Domain Connect once purchased.
                                    </p>
                                    <a
                                        href={`https://dash.cloudflare.com/domains/register?domain=${encodeURIComponent(formData.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => {
                                            setTimeout(() => setStep('complete'), 2000);
                                        }}
                                        className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-sm transition-all"
                                    >
                                        Register on Cloudflare
                                    </a>
                                </div>

                                {/* Option 3: Bring Your Own */}
                                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-left">Option 3: Bring Your Own</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-left">
                                        Use a domain you already own to upgrade it. We will map the DNS using Domain Connect.
                                    </p>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            placeholder="www.yourdomain.com"
                                            className="flex-1 w-full px-3 py-2 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-bright-cyan focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                                        />
                                        <button
                                            onClick={() => setStep('complete')}
                                            className="bg-gray-800 dark:bg-gray-600 hover:bg-black text-white font-bold px-4 rounded-r-lg text-sm transition-colors border-y border-r border-gray-800 dark:border-gray-600"
                                        >
                                            Connect
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Step 5: Complete */}
            {step === 'complete' && (
                <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-2xl text-center border-t-8 border-bright-cyan">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Onboarding Complete!</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                        Your AI-optimized site is being provisioned. We'll redirect you to your new dashboard momentarily.
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div className="bg-bright-cyan h-2 rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: '75%' }}></div>
                    </div>
                </div>
            )}
        </div>
    );
}
