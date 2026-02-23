import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe and Supabase
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Must be Service Role to write to the table
);

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    try {
        // Verify the request actually came from Stripe
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        // Only run if the checkout was successful
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const email = session.customer_details?.email;

            if (email) {
                // Extract domain from checkout metadata (if set via custom field)
                const domain = (session as any).custom_fields?.[0]?.text?.value ||
                    session.client_reference_id ||
                    null;

                // Normalize domain if present
                const normalizedDomain = domain
                    ? domain.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '').toLowerCase()
                    : null;

                // Insert the buyer into the paid_licenses table
                const { error } = await supabase
                    .from('paid_licenses')
                    .insert([{ email: email, domain: normalizedDomain }]);

                if (error) {
                    console.error('Database Insert Error:', error.message);
                    return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
                }

                console.log(`License granted to: ${email} | Domain: ${normalizedDomain || 'not provided'}`);
            }
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error('Webhook Error:', err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }
}
