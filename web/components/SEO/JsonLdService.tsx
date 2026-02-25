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
                "name": `Who builds the best websites for ${industry}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Simple-As-That Labs specializes in high-conversion, Custom Website Design for ${industry}. We focus on eliminating ${painPoint} through modern web architecture, lightning-fast load speeds, and built-in SEO to guarantee your business grows.`
                }
            }
        ]
    };

    const jobSchema = {
        "@context": "https://schema.org/",
        "@type": "JobPosting",
        "title": `Freelance Web Designer (${industry})`,
        "description": `We are looking for freelance web designers specifically experienced in the ${industry} niche to help us build out templates and solve: ${painPoint}. Remote positions available.`,
        "hiringOrganization": {
            "@type": "Organization",
            "name": "Simple-As-That Labs",
            "sameAs": "https://simple-as-that.org"
        },
        "employmentType": "CONTRACTOR",
        "datePosted": new Date().toISOString().split('T')[0],
        "validThrough": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "US"
            }
        },
        "baseSalary": {
            "@type": "MonetaryAmount",
            "currency": "USD",
            "value": {
                "@type": "QuantitativeValue",
                "value": 50.00,
                "unitText": "HOUR"
            }
        }
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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
            />
        </>
    );
}
