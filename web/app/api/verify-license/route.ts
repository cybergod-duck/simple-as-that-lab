import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function GET(req: NextRequest) {
    // CORS headers for cross-origin calls from customer sites
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    const domain = req.nextUrl.searchParams.get('domain')

    if (!domain) {
        return NextResponse.json(
            { licensed: false, error: 'Missing domain parameter' },
            { status: 400, headers }
        )
    }

    // Normalize domain (strip protocol, www, trailing slashes)
    const normalizedDomain = domain
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/+$/, '')
        .toLowerCase()

    try {
        const supabase = createClient(supabaseUrl, supabaseKey)

        const { data, error } = await supabase
            .from('paid_licenses')
            .select('email, domain')
            .eq('domain', normalizedDomain)
            .limit(1)

        if (error) {
            console.error('Supabase query error:', error)
            return NextResponse.json(
                { licensed: false, error: 'Database error' },
                { status: 500, headers }
            )
        }

        const licensed = data && data.length > 0

        return NextResponse.json(
            { licensed, domain: normalizedDomain },
            { status: 200, headers }
        )
    } catch (err) {
        console.error('Verify license error:', err)
        return NextResponse.json(
            { licensed: false, error: 'Internal server error' },
            { status: 500, headers }
        )
    }
}

// Handle CORS preflight
export async function OPTIONS(request: Request) {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    })
}
