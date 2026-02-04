import { NextResponse } from 'next/server';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
export async function POST(req) {
  const body = await req.json();
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  return NextResponse.json(data);
}
