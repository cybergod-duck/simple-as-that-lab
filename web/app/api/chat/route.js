import { NextResponse } from 'next/server';
import { personas } from '@/config/personas';

export async function POST(request) {
  try {
    const { messages, personaSlug } = await request.json();
    
    const persona = personas.find(p => p.slug === personaSlug);
    if (!persona) {
      return NextResponse.json({ error: 'Persona not found' }, { status: 404 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: persona.model,
        messages: [
          { role: 'system', content: persona.systemPrompt },
          ...messages
        ],
        max_tokens: 800,
      })
    });

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || 'No response';

    return NextResponse.json({ message });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
