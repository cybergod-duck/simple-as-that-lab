const Stripe = require('stripe');

const stripe = new Stripe('sk_test_123');
async function test() {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Universal Compliance Patch — STAT-2026',
                            description: 'One-tag script covering ADA/WCAG, Cookie Consent, GPC, Privacy Disclosures, and State-Level Compliance.',
                        },
                        unit_amount: 4900, // $49.00
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `https://simple-as-that.org/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `https://simple-as-that.org/`,
            custom_fields: [
                {
                    key: 'website_domain',
                    label: { type: 'custom', custom: 'Your Website Domain' },
                    type: 'text',
                    optional: false,
                },
            ],
        });
        console.log("SUCCESS");
    } catch (e) {
        console.error("ERROR:", e.message);
    }
}
test();
