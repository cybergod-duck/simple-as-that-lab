export default function JsonLdService({ industry, painPoint }: { industry: string, painPoint: string }) {
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `Website Creation for ${industry}`,
        "provider": {
            "@type": "Organization",
            "name": "Simple-As-That AI Platform"
        },
        "description": `Professional website design and development services specifically tailored for ${industry}. We help you stop ${painPoint} and grow your business.`,
        "areaServed": {
            "@type": "Country",
            "name": "United States"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Website Packages",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "name": "Starter Template",
                    "price": "199.00",
                    "priceCurrency": "USD"
                },
                {
                    "@type": "Offer",
                    "name": "Pro Template",
                    "price": "999.00",
                    "priceCurrency": "USD"
                },
                {
                    "@type": "Offer",
                    "name": "Elite Template",
                    "price": "1999.00",
                    "priceCurrency": "USD"
                }
            ]
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `Do I need a custom website for my ${industry} business?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Yes. A dedicated website helps build trust, capture leads, and stop ${painPoint}. Our pre-built templates are specifically designed to address these distinct industry challenges.`
                }
            },
            {
                "@type": "Question",
                "name": `How long does it take to launch a website for ${industry}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "With our AI-driven platform, your foundational website is generated instantly during checkout. Customizations take just a few hours depending on the tier you choose."
                }
            },
            {
                "@type": "Question",
                "name": `Are these websites better than Squarespace for ${industry}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Absolutely. While general builders are broad, our platform uses data-driven logic to map your specific needs (${painPoint}) to specialized features designed directly for ${industry}.`
                }
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
        </>
    );
}
