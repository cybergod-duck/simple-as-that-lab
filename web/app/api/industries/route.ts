import { NextResponse } from 'next/server';
import { getIndustryData } from '../../../utils/csvParser';

export async function GET() {
    try {
        const industries = getIndustryData();
        // Return only unique industry names for the dropdown
        const names = industries.map(i => i.industry);
        return NextResponse.json({ industries: names });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch industries' }, { status: 500 });
    }
}
