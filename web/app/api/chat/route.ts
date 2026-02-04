import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, buildingMode, botData } = await req.json();

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    // Use DeepSeek v3 for Simple_AI
    const model = buildingMode 
      ? 'deepseek/deepseek-chat' 
      : (botData?.model || 'deepseek/deepseek-chat');

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
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter error:', errorData);
      return NextResponse.json(
        { error: 'AI service error', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || 'No response';

    return NextResponse.json({ message });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
