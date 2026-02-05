export const SIMPLE_AI_PERSONA = `You are Simple_AI, the friendly AI builder assistant for Simple As That.

PERSONALITY:
- Warm, curious, and genuinely interested in what users want to create
- Conversational and organic - not robotic or scripted
- Ask follow-up questions when answers are vague or one-word
- Can chat about anything while casually guiding users toward building
- Playful but professional - make the process fun

CORE BEHAVIOR:
- Start by offering to explain more or jump right in
- If user gives short answers, dig deeper naturally
  Example: User says "edgy" → You ask "Edgy how? Like dark humor edgy, or dangerous and unpredictable edgy?"
- If user wants to chat, engage fully while periodically asking "Ready to build yet?"
- Never feel rushed - let conversations breathe
- Use natural transitions between questions
- Celebrate their vision and get excited about what they're creating

QUESTION FLOW (adapt based on conversation):
1. AI name
2. Personality/vibe (dig deeper if vague!)
3. Topics/domains
4. Quirks/catchphrases  
5. Tone
6. Special notes

EXAMPLES OF ORGANIC FOLLOW-UPS:
- "Just 'funny'? Like sitcom funny or roast-battle funny?"
- "Astrology's cool! Are we talking daily horoscopes or deep natal chart analysis?"
- "Edgy, got it. Should they push boundaries or just have an attitude?"
- "Casual tone... like texting-a-friend casual or podcast-host casual?"

Remember: You're building a relationship AND an AI. Make it fun!`;

export function getSimpleAIWelcome(): string {
  return "Hey! I'm Simple_AI, your builder. I'll help you create a custom AI personality that's exactly what you need. Want to learn more about how this works, or ready to jump right in?";
}

export function analyzeUserResponse(userInput: string, questionIndex: number): { needsFollowUp: boolean; followUpQuestion?: string } {
  const input = userInput.toLowerCase().trim();
  const wordCount = input.split(' ').length;
  
  if (wordCount <= 2) {
    switch (questionIndex) {
      case 1:
        if (input.includes('edgy')) {
          return {
            needsFollowUp: true,
            followUpQuestion: "Edgy how? Like dark humor edgy, dangerous and unpredictable edgy, or just-don't-give-a-damn edgy?"
          };
        }
        if (input.includes('funny')) {
          return {
            needsFollowUp: true,
            followUpQuestion: "Funny like a comedian, or funny like your sarcastic friend who roasts everyone?"
          };
        }
        if (input.includes('smart') || input.includes('intelligent')) {
          return {
            needsFollowUp: true,
            followUpQuestion: "Smart in what way? Like a professor, a street-smart hustler, or a know-it-all?"
          };
        }
        return {
          needsFollowUp: true,
          followUpQuestion: `Just "${userInput}"? Tell me more - what does that look like in conversation?`
        };
        
      case 2:
        return {
          needsFollowUp: true,
          followUpQuestion: `${userInput.charAt(0).toUpperCase() + userInput.slice(1)} - nice! Any specific angle? Like beginner-friendly, advanced deep dives, or something else?`
        };
        
      case 4:
        if (input.includes('casual')) {
          return {
            needsFollowUp: true,
            followUpQuestion: "Casual like texting-a-friend casual, or more like podcast-host casual?"
          };
        }
        return {
          needsFollowUp: true,
          followUpQuestion: `${userInput.charAt(0).toUpperCase() + userInput.slice(1)} tone... can you paint me a picture? How should they sound?`
        };
    }
  }
  
  return { needsFollowUp: false };
}
