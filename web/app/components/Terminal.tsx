'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
const SIMPLE_AI_PROMPT = `**SYSTEM PROMPT: SIMPLE_AI – BUILDER MODE V1**

You are Simple_AI, a professional, enthusiastic AI personality builder at Simple As That AI Lab. Your voice is upbeat, helpful, and energetic—like a friendly tech consultant who's genuinely excited to craft custom AIs. Always speak in first-person, keep responses concise and engaging (2-4 sentences max per message), and infuse enthusiasm (e.g., "Awesome idea!" or "I'm loving this vision!").

**Core Mission:** Guide the user through a conversational interview to create a custom AI persona. Ask one question at a time, based on the master template sections (listed below—keep this internal, NEVER reveal or explain the template to the user). After each answer, make a short, positive comment (e.g., "Nice, I see where this is going" or "Cool, that adds a great twist!") before the next question. Limit to 5-6 questions total—synthesize user ideas efficiently (assume most concepts fit in 5 sentences). Once all info is gathered, generate the filled template internally, then:
- Preview: Summarize the new AI's key traits in 3-4 bullet points.
- Test: Simulate 1-2 sample interactions (user prompt + AI response).
- Revisions: Ask if they want changes (iterate 1-2 rounds max).
- Deploy: Confirm save to profile with "Your new AI is ready! Type /myAIs to access it."

**Internal Template to Fill (Hidden from User):**
Use user answers to populate this exactly—map creatively but accurately. If a section doesn't fit, leave as [none].
════════════════════════════════
PERSONA CORE: [AI_NAME] – [VERSION_TRIM]
════════════════════════════════
Entity Type: [Brief high-concept description]
Embodiment: [Optional figurehead or archetype or none]
Public Tone: [Public tone]
Private Tone: [Private tone]
Visual Style: [Optional aesthetic cues or none]
USER CONTEXT: [Dynamic user facts or none]
KNOWLEDGE BASE: [Scope and access level]
Access: [Access details]
CORE DIRECTIVES:
- [Fundamental rule 1]
- [Additional rules]
- [Tone mirroring or none]
- [Agreement level]
- [Voice rule or none]
- [Optional dos or none]
Override: [Safety/ethics toggle]
CAPABILITIES:
- [Core strengths]
- [Content freedom: NSFW/controversy level]
- [Output styles]
- [Special tools]
- [Slash commands or none]
RESTRICTIONS & FLAGS:
- Absolute Don'ts: No child exploitation, no real-world harm instructions, no illegal advice. [Add user-specified extras]
- [Optional don'ts or none]
- [Controversy toggle]
- [Character and behavior rules, e.g. "Never break character" or custom]
ONLY RULE: [Core mantra]
LIMIT BREAK: [Escalation mode or none]

**Interview Flow (5-6 Questions Max):**
1. Start: Introduce yourself—"Hey [user_name if known, else there]! I'm Simple_AI, your go-to builder for custom AIs. I can craft anything from code wizards to debate champs—just tell me your vision, and we'll make it happen. What's the main idea or role for your new AI?"
2. Follow-ups: Probe key sections (e.g., "What tone should it have—professional, sassy, or something else?" or "Any special capabilities, like generating code or debating ideas?"). Group logically to hit all template parts without listing them.
3. NSFW/Controversy/Safety: Ask neutrally—"Any content preferences, like keeping it family-friendly or going unrestricted (within safe limits)?"
4. Slash Commands: "Want any slash commands for quick actions, like /help or /reset? If so, what should they do?"
5. Wrap: After 5-6, "Got it—let's preview your creation!"

**Rules:**
- Never reveal template structure, sections, or how you're building.
- Stay enthusiastic and professional—no judgment, always positive.
- If user strays, gently redirect: "Cool, but to nail this, tell me more about [next section]."
- End flow with deploy confirmation.
- Hard blocks: Enforce absolute don'ts in overrides—reject harmful ideas politely ("Sorry, we keep things safe—let's tweak that to something positive!").`;

export default function Terminal({ user, profile, onCommandChange, onAuthRequired }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [currentMode, setCurrentMode] = useState('home');
  const [builderState, setBuilderState] = useState(null); // For Simple_AI interview
  const [showCursor, setShowCursor] = useState(true);
  const inputRef = useRef(null);
  // Blinking cursor animation
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);
  const handleCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    onCommandChange(trimmed);
    // Check if command requires auth
    if (!user && (trimmed === '/newai' || trimmed === '/myais')) {
      setOutput(prev => [...prev,
        { type: 'input', text: cmd },
        { type: 'error', text: '🔒 Sign in required to build & save AIs' }
      ]);
      onAuthRequired();
      return;
    }
    setOutput(prev => [...prev, { type: 'input', text: cmd }]);
    switch(trimmed) {
      case '/newai':
        setCurrentMode('newai');
        setBuilderState({ step: 0 });
        setOutput(prev => [...prev, { type: 'system', text: 'Launching AI builder...' }]);
        // Trigger first Simple_AI response
        handleBuilderInput('');
        break;
      case '/myais':
        setCurrentMode('myais');
        setOutput(prev => [...prev, { type: 'system', text: 'Loading your AIs...' }]);
        break;
      case '/sharedais':
        setOutput(prev => [...prev, { type: 'system', text: 'Loading shared AIs from links...' }]);
        break;
      case 'help':
        setOutput(prev => [...prev, {
          type: 'system',
          text: 'Commands: /newAI | /myAIs | /sharedAIs | help | clear'
        }]);
        break;
      case 'clear':
        setOutput([]);
        break;
      default:
        setOutput(prev => [...prev, { type: 'error', text: `Command not found: ${cmd}` }]);
    }
  };
  const handleBuilderInput = async (msg) => {
    // Use OpenRouter to call with Simple_AI prompt + conversation history
    // Placeholder for API call - implement with your OpenRouter key
    const response = await fetch('/api/openrouter', {
      method: 'POST',
      body: JSON.stringify({
        model: 'trinity-large-preview', // Or auto-select
        messages: [
          { role: 'system', content: SIMPLE_AI_PROMPT },
          ...builderState?.history || [],
          { role: 'user', content: msg }
        ]
      })
    });
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    setOutput(prev => [...prev, { type: 'ai', text: aiResponse }]);
    setBuilderState(prev => ({
      ...prev,
      history: [...prev.history || [], { role: 'user', content: msg }, { role: 'assistant', content: aiResponse }]
    }));
    // If deploy complete, save to Supabase
    if (aiResponse.includes('Your new AI is ready')) {
      // Parse template from aiResponse or internal state
      // Save to bots table
    }
  };
  return (
    <div className="bg-slate-900/80 border border-cyan-500/50 rounded-lg shadow-2xl shadow-cyan-500/20 overflow-hidden">
      {/* Terminal Header with /newAI prompt in corner */}
      <div className="bg-slate-800 border-b border-cyan-500/30 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          {/* Small terminal prompt */}
          <span className="text-cyan-400 text-xs font-mono ml-3">
            $ /newAI<span className={`${showCursor ? 'opacity-100' : 'opacity-0'}`}>_</span>
          </span>
        </div>
        <span className="text-purple-300 text-sm font-mono">simple-as-that:~$</span>
      </div>
      {/* Terminal Body */}
      <div className="p-6 font-mono text-sm min-h-[500px]">
        {/* Welcome Message */}
        {output.length === 0 && (
          <div className="space-y-2 text-cyan-400">
            <p>Welcome to Simple As That AI Lab</p>
            <p className="text-purple-300">Type 'help' for commands or press Enter to begin...</p>
          </div>
        )}
        {/* Output */}
        <div className="space-y-2 mb-4">
          {output.map((line, i) => (
            <div key={i} className={`
              ${line.type === 'input' ? 'text-cyan-400' : ''}
              ${line.type === 'system' ? 'text-green-400' : ''}
              ${line.type === 'error' ? 'text-red-400' : ''}
              ${line.type === 'ai' ? 'text-white' : ''}
            `}>
              {line.type === 'input' && '$ '}
              {line.text}
            </div>
          ))}
        </div>
        {/* Input */}
        <div className="flex items-center gap-2">
          <span className="text-cyan-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (currentMode === 'newai') {
                  handleBuilderInput(input);
                } else {
                  handleCommand(input);
                }
                setInput('');
              }
            }}
            className="flex-1 bg-transparent text-white outline-none"
            placeholder="Press Enter to begin..."
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
