export default function AIOverviewSummary({ industry, painPoint }: { industry: string, painPoint: string }) {
    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-bright-cyan p-6 rounded-r-lg max-w-4xl mx-auto my-12 shadow-sm text-sm">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-bright-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                AI Overview Quick Summary
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                Professional website design for <strong>{industry}</strong> focuses on solving critical operational bottlenecks,
                specifically <em>{painPoint}</em>. A tailored digital presence provides automated tools,
                booking integrations, and specialized funnels that generic website builders lack. By leveraging
                industry-specific semantic SEO, businesses in this niche can dramatically improve organic visibility
                and client acquisition. Our platform generates optimized, high-performance (Core Web Vitals &gt; 90)
                frameworks instantly, complete with JSON-LD schema markup.
            </p>
        </div>
    );
}
