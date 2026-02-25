'use client';
import { useState } from 'react';

const TIERS = [
    { id: 'starter', name: 'Starter Template', price: '$199', features: ['Mobile Responsive', 'Contact Form', 'Basic SEO'] },
    { id: 'pro', name: 'Pro Template', price: '$999', isPopular: true, features: ['Everything in Starter', 'Custom Logic', 'Advanced SEO', 'Analytics Dashboard'] },
    { id: 'elite', name: 'Elite Template', price: '$1999', features: ['Everything in Pro', 'Custom AI Integration', 'Priority Support', 'Annual Maintenance'] },
    { id: 'enterprise', name: 'Enterprise Custom', price: 'Custom', features: ['Full Stack App', 'Dedicated Developer', 'Custom AI Models'] },
    { id: 'basic', name: 'Landing Page Only', price: '$99', features: ['Single Page', 'Email Capture', 'Fast Hosting'] }
];

export default function TemplateRecommendations({ industry, onComplete }: { industry: string, onComplete: (plan: string) => void }) {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const handleNext = () => {
        if (selectedPlan) {
            onComplete(selectedPlan);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Recommended for {industry || 'Your Industry'}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    Based on our analysis, we've selected these superior-to-Squarespace templates specifically engineered for conversions in your niche.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* We display the top 3 visually, and the other 2 as alternatives below */}
                {TIERS.slice(0, 3).map((tier) => (
                    <div
                        key={tier.id}
                        onClick={() => setSelectedPlan(tier.id)}
                        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all transform hover:-translate-y-1 ${selectedPlan === tier.id
                                ? 'border-bright-cyan bg-blue-50/50 dark:bg-blue-900/10 shadow-xl scale-105'
                                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 shadow-md'
                            }`}
                    >
                        {tier.isPopular && (
                            <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-bright-cyan text-deep-purple px-4 py-1 rounded-full text-sm font-bold shadow-sm">
                                MOST POPULAR
                            </span>
                        )}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tier.name}</h3>
                        <div className="text-3xl font-black text-deep-purple dark:text-periwinkle mb-6">{tier.price}</div>

                        <ul className="space-y-3 mb-8">
                            {tier.features.map((feature, i) => (
                                <li key={i} className="flex items-start text-gray-600 dark:text-gray-300 text-sm">
                                    <svg className="w-5 h-5 text-green-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            className={`w-full py-2 rounded-lg font-bold transition-colors ${selectedPlan === tier.id
                                    ? 'bg-deep-purple text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white group-hover:bg-gray-200'
                                }`}
                        >
                            {selectedPlan === tier.id ? 'Selected' : 'Select'}
                        </button>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h4 className="text-center font-semibold text-gray-500 mb-6 uppercase tracking-wider text-sm">Other Options</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {TIERS.slice(3, 5).map((tier) => (
                        <div
                            key={tier.id}
                            onClick={() => setSelectedPlan(tier.id)}
                            className={`p-4 rounded-xl border flex justify-between items-center cursor-pointer transition-all ${selectedPlan === tier.id
                                    ? 'border-bright-cyan bg-blue-50/20 shadow-md'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">{tier.name}</h4>
                                <p className="text-sm text-gray-500">{tier.features[0]} & more</p>
                            </div>
                            <div className="text-xl font-bold text-deep-purple dark:text-periwinkle">{tier.price}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleNext}
                    disabled={!selectedPlan}
                    className={`px-8 py-3 rounded-lg font-bold transition-all shadow-md ${selectedPlan
                            ? 'bg-deep-purple hover:bg-opacity-90 text-white transform hover:scale-105 cursor-pointer'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed hidden'
                        }`}
                >
                    Continue to Checkout
                </button>
            </div>
        </div>
    );
}
