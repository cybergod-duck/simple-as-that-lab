import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
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
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://simple-as-that.org'}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://simple-as-that.org'}/`,
            custom_fields: [
                {
                    key: 'website_domain',
                    label: { type: 'custom', custom: 'Your Website Domain' },
                    type: 'text',
                    optional: false,
                },
            ],
        })

        return NextResponse.json({ url: session.url })
    } catch (err: any) {
        console.error('Stripe Checkout Error:', err.message)
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        )
    }
}
