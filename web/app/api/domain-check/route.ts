import { NextResponse } from 'next/server';

// Domain Name Middleman Route
export async function POST(request: Request) {
    try {
        const { businessName } = await request.json();

        if (!businessName) {
            return NextResponse.json({ error: 'Business name is required' }, { status: 400 });
        }

        // Mock API Call - simulated registrar scan
        // Note: In an actual implementation, integration with Namecheap/GoDaddy API goes here
        const normalizedName = businessName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const domains = [
            { domain: `${normalizedName}.com`, available: Math.random() > 0.3, price: 12.99 },
            { domain: `${normalizedName}.net`, available: Math.random() > 0.1, price: 10.99 },
            { domain: `${normalizedName}.org`, available: Math.random() > 0.1, price: 9.99 },
            { domain: `${normalizedName}.co`, available: true, price: 29.99 },
        ];

        return NextResponse.json({
            domains,
            checkoutLinkBase: 'https://simple-as-that.org/checkout?domain=' // Placeholder callback link
        });

    } catch (error) {
        console.error("Domain API error", error);
        return NextResponse.json({ error: 'Failed to fetch domains' }, { status: 500 });
    }
}
