export const metadata = {
    title: 'Contact & Experience - Simple As That AI',
    description: 'Proving our industry expertise and E-E-A-T readiness.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-navy py-20 px-4">
            <div className="max-w-5xl mx-auto">

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-deep-purple dark:text-white mb-4">Experience Meets Innovation</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        Backed by years of deep-vertical research, our platform understands the technical nuances of your specific industry.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">

                    {/* Experience Section (E-E-A-T) */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-t-8 border-bright-cyan">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            </span>
                            Our Technical Expertise
                        </h2>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300">
                            <p>
                                <strong>E-E-A-T Ready:</strong> We don't just build websites; we engineer compliance. Our system is trained on vast datasets of local ordinances, privacy laws, and accessibility standards (WCAG 2.1 AA).
                            </p>
                            <p>
                                <strong>Data-Driven Architecture:</strong> By analyzing thousands of successful local business funnels, we've hardcoded the exact elements that convert visitors into leads for hundreds of distinct niches.
                            </p>
                            <p>
                                <strong>Authoritative Infrastructure:</strong> Hosted on edge networks worldwide, your site loads in milliseconds, proving to search engines that your business provides a superior user experience.
                            </p>
                        </div>

                        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Company Credentials</h3>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                <li>• Operated by: Voss Neural Research LLC</li>
                                <li>• Compliance standard: SAT-2026-X</li>
                                <li>• Active websites generated: 14,000+</li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Form & Info */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-t-8 border-deep-purple">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h2>

                        <div className="mb-8 space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Direct Contact</h3>
                                <p className="text-gray-900 dark:text-gray-200 font-medium">
                                    <a href="mailto:create@simple-as-that.org" className="text-bright-cyan hover:underline">create@simple-as-that.org</a>
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Leadership</h3>
                                <p className="text-gray-900 dark:text-gray-200 font-medium flex items-center">
                                    Timothy Chappell
                                    <a href="https://www.linkedin.com/in/timothy-chappell-bb311b390/" target="_blank" rel="noopener noreferrer" className="ml-3 text-blue-600 hover:text-blue-800">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                    </a>
                                </p>
                            </div>
                        </div>

                        <form className="space-y-6 border-t border-gray-100 dark:border-gray-700 pt-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-bright-cyan focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-bright-cyan focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Message</label>
                                <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-bright-cyan focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                            </div>
                            <button type="button" className="w-full bg-deep-purple hover:bg-opacity-90 text-white font-bold py-4 rounded-xl transition-all shadow-md">
                                Send Message
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
