import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, buildingMode, botData } = await req.json();

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    
    if (!OPENROUTER_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenRouter API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Use DeepSeek R1 (thinking model) for better responses
    const model = 'deepseek/deepseek-r1';

    const systemPrompt = buildingMode
      ? "You are Simple_AI, a friendly AI builder. Ask questions one at a time to help users create custom AI personalities. Keep responses brief and conversational."
      : (botData?.systemPrompt || "You are a helpful AI assistant.");

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://simple-as-that.org',
        'X-Title': 'Simple As That'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500,
        stream: true
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter error:', errorData);
      return new Response(
        JSON.stringify({ error: 'AI service error', details: errorData }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Stream the response back to client
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
