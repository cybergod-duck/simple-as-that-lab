import { NextRequest, NextResponse } from 'next/server';
import { selectBestModel, getModelDescription } from '@/utils/modelRouter';

export async function POST(req: NextRequest) {
  try {
    const { messages, botData, buildingMode } = await req.json();
    
    // For Simple_AI free chat, use DeepSeek R1
    let selectedModel = 'deepseek/deepseek-r1';
    let modelDescription = 'Deep reasoning model';
    
    // For actual bots, select best model based on purpose
    if (!buildingMode && botData) {
      selectedModel = selectBestModel(botData);
      modelDescription = getModelDescription(selectedModel);
    }
    
    console.log('🤖 Selected model:', selectedModel);
    console.log('📝 Model description:', modelDescription);
    console.log('🎯 Bot data:', botData);

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://simple-as-that.org',
        'X-Title': 'Simple As That'
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!openRouterResponse.ok) {
      throw new Error(`OpenRouter error: ${openRouterResponse.statusText}`);
    }

    // Stream the response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = openRouterResponse.body?.getReader();
        if (!reader) return;

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } catch (error) {
          console.error('Stream error:', error);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
