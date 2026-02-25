import { NextResponse } from 'next/server';

// https://www.namecheap.com/support/api/methods/domains/create/
export async function POST(request: Request) {
    try {
        const { domain, years } = await request.json();

        if (!domain) {
            return NextResponse.json({ error: 'Domain name is required' }, { status: 400 });
        }

        const NAMECHEAP_API_USER = process.env.NAMECHEAP_API_USER;
        const NAMECHEAP_API_KEY = process.env.NAMECHEAP_API_KEY;
        const CLIENT_IP = process.env.SERVER_IP || '127.0.0.1'; // Required by Namecheap API

        if (!NAMECHEAP_API_USER || !NAMECHEAP_API_KEY) {
            // For development without API keys, simulate success
            console.log(`[Mock Namecheap] Would purchase ${domain} for ${years || 1} years.`);
            return NextResponse.json({
                success: true,
                message: `Domain ${domain} mock-registered successfully.`,
                domain: domain,
                // Status 200 implies API called successfully
            });
        }

        // --- Real Implementation ---
        // Construct the Namecheap API query URL (Using Sandbox for typical integration scaffolding)
        const baseUrl = 'https://api.sandbox.namecheap.com/xml.response';

        const params = new URLSearchParams({
            ApiUser: NAMECHEAP_API_USER,
            ApiKey: NAMECHEAP_API_KEY,
            UserName: NAMECHEAP_API_USER,
            Command: 'namecheap.domains.create',
            ClientIp: CLIENT_IP,
            DomainName: domain,
            Years: (years || 1).toString(),
            // Registrant details would typically be pulled from user account/DB
            RegistrantFirstName: 'Simple',
            RegistrantLastName: 'AsThat',
            RegistrantAddress1: '123 Tech Lane',
            RegistrantCity: 'Austin',
            RegistrantStateProvince: 'TX',
            RegistrantPostalCode: '78701',
            RegistrantCountry: 'US',
            RegistrantPhone: '+1.5555555555',
            RegistrantEmailAddress: 'create@simple-as-that.org',
            // Tech, Admin, and AuxBilling details require identical sets in the API
            TechFirstName: 'Simple',
            TechLastName: 'AsThat',
            TechAddress1: '123 Tech Lane',
            TechCity: 'Austin',
            TechStateProvince: 'TX',
            TechPostalCode: '78701',
            TechCountry: 'US',
            TechPhone: '+1.5555555555',
            TechEmailAddress: 'create@simple-as-that.org',
            AdminFirstName: 'Simple',
            AdminLastName: 'AsThat',
            AdminAddress1: '123 Tech Lane',
            AdminCity: 'Austin',
            AdminStateProvince: 'TX',
            AdminPostalCode: '78701',
            AdminCountry: 'US',
            AdminPhone: '+1.5555555555',
            AdminEmailAddress: 'create@simple-as-that.org',
            AuxBillingFirstName: 'Simple',
            AuxBillingLastName: 'AsThat',
            AuxBillingAddress1: '123 Tech Lane',
            AuxBillingCity: 'Austin',
            AuxBillingStateProvince: 'TX',
            AuxBillingPostalCode: '78701',
            AuxBillingCountry: 'US',
            AuxBillingPhone: '+1.5555555555',
            AuxBillingEmailAddress: 'create@simple-as-that.org',
        });

        // Uncomment to execute the actual fetch when moving to production/sandbox testing
        /*
        const response = await fetch(`${baseUrl}?${params.toString()}`);
        const xmlText = await response.text();
        
        // Basic check for success in the XML response
        if (xmlText.includes('Status="OK"')) {
            return NextResponse.json({ success: true, message: 'Domain registered via Namecheap' });
        } else {
            // Parse error carefully in production
            return NextResponse.json({ error: 'Namecheap API Error', details: xmlText }, { status: 400 });
        }
        */

        // Until keys are loaded, return the mock
        return NextResponse.json({
            success: true,
            message: `Domain ${domain} mock-registered via configured Namecheap endpoint.`,
            domain: domain,
        });

    } catch (error) {
        console.error("Namecheap API error", error);
        return NextResponse.json({ error: 'Failed to process domain registration' }, { status: 500 });
    }
}
