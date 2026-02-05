interface BuildData {
  name?: string;
  personality?: string;
  topics?: string;
  quirks?: string;
  tone?: string;
  special?: string;
}

export function selectBestModel(botData: BuildData): string {
  const topics = (botData.topics || '').toLowerCase();
  const personality = (botData.personality || '').toLowerCase();
  const tone = (botData.tone || '').toLowerCase();
  const special = (botData.special || '').toLowerCase();
  const quirks = (botData.quirks || '').toLowerCase();
  
  const allText = `${topics} ${personality} ${tone} ${special} ${quirks}`;
  
  // Coding/tech tasks
  if (
    topics.includes('coding') || 
    topics.includes('programming') || 
    topics.includes('tech') ||
    topics.includes('developer') ||
    topics.includes('software') ||
    allText.includes('code') ||
    allText.includes('debug') ||
    allText.includes('api')
  ) {
    return 'deepseek/deepseek-r1';
  }
  
  // Creative writing / storytelling / roleplay
  if (
    personality.includes('storyteller') ||
    personality.includes('writer') ||
    personality.includes('roleplay') ||
    personality.includes('character') ||
    topics.includes('creative writing') ||
    topics.includes('fiction') ||
    topics.includes('story') ||
    topics.includes('novel') ||
    topics.includes('script') ||
    allText.includes('narrative') ||
    allText.includes('immersive')
  ) {
    return 'google/gemini-2.0-flash-thinking-exp:free';
  }
  
  // Expressive roleplay / dialogue
  if (
    personality.includes('flirty') ||
    personality.includes('expressive') ||
    personality.includes('emotional') ||
    personality.includes('dramatic') ||
    topics.includes('relationship') ||
    topics.includes('conversation') ||
    allText.includes('empathy') ||
    allText.includes('feelings')
  ) {
    return 'qwen/qwen-2.5-72b-instruct';
  }
  
  // Multilingual
  if (
    topics.includes('translation') ||
    topics.includes('multilingual') ||
    topics.includes('language') ||
    allText.includes('spanish') ||
    allText.includes('french') ||
    allText.includes('chinese') ||
    allText.includes('japanese') ||
    allText.includes('german')
  ) {
    return 'qwen/qwen-2.5-72b-instruct';
  }
  
  // Long context / strategic
  if (
    topics.includes('analysis') ||
    topics.includes('strategy') ||
    topics.includes('business') ||
    topics.includes('consulting') ||
    allText.includes('enterprise') ||
    allText.includes('long context') ||
    allText.includes('comprehensive')
  ) {
    return 'google/gemini-2.0-flash-thinking-exp:free';
  }
  
  // Fast/lightweight
  if (
    tone.includes('quick') ||
    tone.includes('fast') ||
    tone.includes('brief') ||
    allText.includes('simple answers') ||
    allText.includes('concise')
  ) {
    return 'meta-llama/llama-3.3-70b-instruct';
  }
  
  // Default: General reasoning
  return 'deepseek/deepseek-r1';
}

export function getModelDescription(modelId: string): string {
  const modelMap: Record<string, string> = {
    'deepseek/deepseek-r1': 'Deep reasoning model for coding and complex tasks',
    'google/gemini-2.0-flash-thinking-exp:free': 'Creative and strategic thinking model',
    'qwen/qwen-2.5-72b-instruct': 'Expressive dialogue and multilingual model',
    'meta-llama/llama-3.3-70b-instruct': 'Fast lightweight reasoning model'
  };
  
  return modelMap[modelId] || 'General purpose AI model';
}
