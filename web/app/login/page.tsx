'use client'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function LoginPage() {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            alert(error.message)
        } else {
            alert('If you have a license, check your email!')
        }
    }

    return (
        <main className="min-h-screen bg-[#050511] font-sans text-slate-300 selection:bg-blue-500/30 flex items-center justify-center p-6">
            <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen animate-pulse filter" style={{ animationDuration: '4s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                        System Access
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Authenticate via Magic Link to secure your STAT-2026-PATCH.
                    </p>
                </div>

                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">
                                Administrator Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@simple-as-that.org"
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full px-6 py-3.5 bg-white text-black font-bold rounded-xl hover:bg-slate-200 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                            Access the Patch
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center text-xs text-slate-500 font-mono">
                    <Link href="/" className="hover:text-slate-300 transition-colors">
                        ← Return to Scanner Home
                    </Link>
                </div>
            </div>
        </main>
    )
}
