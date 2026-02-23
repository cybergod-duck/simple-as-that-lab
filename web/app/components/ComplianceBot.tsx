'use client'

import { useState, useRef, useEffect } from 'react'

// Pre-scripted compliance horror knowledge base
const KNOWLEDGE: { keywords: string[]; response: string }[] = [
    {
        keywords: ['fine', 'fines', 'penalty', 'penalties', 'how much'],
        response: "Under the 2026 state mandates, fines range from $2,500/violation (Tennessee) up to $7,500/violation (California CPRA). A single website can rack up hundreds of violations per day — that's potentially $750,000+ in annual exposure for a small business."
    },
    {
        keywords: ['ada', 'accessibility', 'wcag', 'disabled', 'blind'],
        response: "ADA web accessibility lawsuits hit 4,600+ in 2025 alone. The average settlement is $25,000-$50,000, and plaintiff firms actively crawl for easy targets. Missing ARIA labels, poor contrast, or no keyboard navigation? You're on their list."
    },
    {
        keywords: ['cookie', 'cookies', 'tracking', 'consent', 'gdpr'],
        response: "If your site fires Google Analytics, Meta Pixel, or any tracking cookie before getting explicit consent, you're in violation of multiple state laws. California, Colorado, Connecticut, and Montana all require opt-in consent now. One pixel = one violation."
    },
    {
        keywords: ['gpc', 'global privacy', 'do not track', 'opt out'],
        response: "The Global Privacy Control signal is now legally binding in California, Colorado, Connecticut, and Montana. If a visitor's browser sends GPC and your site ignores it, that's an automatic violation — no user complaint needed."
    },
    {
        keywords: ['lawsuit', 'sue', 'sued', 'attorney', 'lawyer', 'legal'],
        response: "Privacy plaintiff firms use automated crawlers to find non-compliant sites, then file demand letters in bulk. The average small business settles for $15,000-$40,000 to avoid court. They target businesses that clearly can't afford a legal fight."
    },
    {
        keywords: ['patch', 'fix', 'solution', 'help', 'protect'],
        response: "Our Universal Compliance Patch is a single script tag you paste into your site. It auto-injects ADA accessibility fixes, cookie consent hard-blocking, GPC signal support, and the required privacy disclosure — all for $49. Takes 60 seconds to deploy."
    },
    {
        keywords: ['state', 'states', 'which', 'where', 'law', 'laws'],
        response: "As of 2026, active enforcement states include: Tennessee (TIPA), Rhode Island (RIDTPPA), Indiana (ICDPA), Montana (MTCDPA), Oregon (OCPA), California (CPRA), plus the FTC's Section 5 covers everyone nationally. More states are adding laws every quarter."
    },
    {
        keywords: ['time', 'deadline', 'when', 'hurry', 'urgent'],
        response: "Most 2026 state privacy laws have NO cure period — meaning you can't fix it after getting caught to avoid the fine. Rhode Island's RIDTPPA is especially brutal: enforcement started January 1, 2026 with zero grace period."
    },
    {
        keywords: ['small business', 'small', 'startup', 'solo'],
        response: "Small businesses are actually the primary targets. Large companies have legal teams. Plaintiff firms know that a small business will settle for $20K-$40K rather than spend $100K+ fighting in court. You're the low-hanging fruit."
    },
    {
        keywords: ['how', 'work', 'script', 'install', 'deploy'],
        response: "After purchasing, you get a single script tag: <script src=\"https://simple-as-that.org/patch.js\"></script>. Paste it in your site's footer or tag manager. It verifies your license, then auto-injects all compliance layers. No code changes needed."
    },
    {
        keywords: ['hello', 'hi', 'hey', 'sup', 'what up'],
        response: "Hey. I'm the Compliance Monitor. I can tell you about 2026 privacy law fines, ADA lawsuit risks, cookie consent requirements, GPC signals, and how our patch fixes all of it. What's keeping you up at night?"
    },
    {
        keywords: ['thanks', 'thank', 'cool', 'good', 'great'],
        response: "Anytime. Remember — every day without compliance is another day of exposure. The average non-compliant site accumulates $2,500+ in potential fines daily. Run your site through our scanner above to see where you stand."
    }
]

const FALLBACK_RESPONSES = [
    "That's a valid concern. Did you know the average ADA web accessibility lawsuit settles for $25,000? Run your site through our scanner above — it's free.",
    "I focus on compliance risks. Ask me about fines, ADA lawsuits, cookie consent, GPC signals, or how our patch protects you.",
    "Here's a scary stat: 4,600+ ADA lawsuits were filed against websites in 2025. Is your site protected? Try the scanner above.",
    "Not sure about that, but I can tell you this — every day your site runs without proper privacy disclosures, you're accumulating potential violations. Ask me about state laws or our patch.",
]

function findResponse(input: string): string {
    const lower = input.toLowerCase()
    for (const entry of KNOWLEDGE) {
        if (entry.keywords.some(kw => lower.includes(kw))) {
            return entry.response
        }
    }
    return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
}

export default function ComplianceBot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<{ role: 'bot' | 'user'; text: string }[]>([
        { role: 'bot', text: "I'm the Compliance Monitor. Ask me about 2026 privacy fines, ADA lawsuits, cookie consent, or how to protect your site." }
    ])
    const [input, setInput] = useState('')
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = () => {
        if (!input.trim()) return
        const userMsg = input.trim()
        setInput('')

        setMessages(prev => [...prev, { role: 'user', text: userMsg }])

        // Simulate typing delay
        setTimeout(() => {
            const response = findResponse(userMsg)
            setMessages(prev => [...prev, { role: 'bot', text: response }])
        }, 600)
    }

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-black hover:bg-slate-900 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center transition-all hover:scale-110 cursor-pointer border border-white/10"
                    aria-label="Open compliance chatbot"
                >
                    <img src="/logo.png" alt="ST Logo" className="w-[85%] h-[85%] select-none rounded-[14px]" />
                    {/* Pulse ring */}
                    <span className="absolute w-full h-full rounded-2xl bg-white/10 animate-ping pointer-events-none"></span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[360px] h-[480px] bg-[#0a0a1a]/95 border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col overflow-hidden animate-fade-in">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-sm font-bold text-white">Compliance Monitor</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-white transition text-lg leading-none cursor-pointer"
                            aria-label="Close chatbot"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-blue-600/30 border border-blue-500/20 text-blue-100'
                                    : 'bg-white/[0.04] border border-white/10 text-slate-300'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="border-t border-white/10 p-3 bg-white/[0.02]">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about compliance risks..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition"
                            />
                            <button
                                onClick={handleSend}
                                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-bold transition cursor-pointer"
                            >
                                →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
