'use client';
import { useState, useEffect, useRef } from 'react';
import { generatePersonaTemplate } from '@/utils/personaTemplate';
import { SIMPLE_AI_PERSONA, getSimpleAIWelcome, analyzeUserResponse } from '@/utils/simpleAI';

const QUESTIONS = [
  "What's the name of your AI?",
  "What's the main personality or vibe? (e.g., brutally honest, supportive coach, sarcastic critic)",
  "What topics or domains should it focus on? (e.g., astrology, coding, fitness, etc.)",
  "Any specific quirks or catchphrases?",
  "What tone should it use? (e.g., casual, formal, edgy)",
  "Anything else special about this AI?"
];

interface BuildData {
  name?: string;
  personality?: string;
  topics?: string;
  quirks?: string;
  tone?: string;
  special?: string;
}

interface Message {
  role: string;
  content: string;
}

interface DisplayMessage extends Message {
  persona?: string;
  isStreaming?: boolean;
  displayedContent?: string;
  isSimpleAI?: boolean;
}

interface SavedAI extends BuildData {
  id: string;
}

export default function Terminal({ onCommandChange }: { onCommandChange: (cmd: string) => void }) {
  const [view, setView] = useState<'initial' | 'building' | 'waitingToContinue' | 'chatting' | 'refining' | 'freeChat'>('initial');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [apiMessages, setApiMessages] = useState<Message[]>([]);
  const [buildData, setBuildData] = useState<BuildData>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [botName, setBotName] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [savedAIs, setSavedAIs] = useState<SavedAI[]>([]);
  const [menuSelection, setMenuSelection] = useState<'newai' | 'myais'>('newai');
  const [waitingForFollowUp, setWaitingForFollowUp] = useState(false);
  const [pendingAnswer, setPendingAnswer] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typewriterIntervals = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Blinking cursor animation
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Keyboard navigation for main menu
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (view === 'initial' && savedAIs.length > 0) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault();
          setMenuSelection(prev => prev === 'newai' ? 'myais' : 'newai');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [view, savedAIs.length]);

  // Typewriter effect
  useEffect(() => {
    messages.forEach((msg, index) => {
      if (msg.role === 'assistant' && msg.isStreaming && msg.content) {
        const currentDisplayed = msg.displayedContent || '';
        
        if (currentDisplayed.length < msg.content.length) {
          const existingInterval = typewriterIntervals.current.get(index);
          if (existingInterval) clearInterval(existingInterval);
          
          const interval = setInterval(() => {
            setMessages(prev => {
              const updated = [...prev];
              const currentMsg = updated[index];
              const currentLen = currentMsg.displayedContent?.length || 0;
              
              if (currentLen < currentMsg.content.length) {
                updated[index] = {
                  ...currentMsg,
                  displayedContent: currentMsg.content.slice(0, currentLen + 1)
                };
              } else {
                updated[index] = {
                  ...currentMsg,
                  isStreaming: false
                };
                clearInterval(interval);
                typewriterIntervals.current.delete(index);
              }
              return updated;
            });
          }, 20);
          
          typewriterIntervals.current.set(index, interval);
        }
      }
    });
    
    return () => {
      typewriterIntervals.current.forEach(interval => clearInterval(interval));
      typewriterIntervals.current.clear();
    };
  }, [messages]);

  const addMessageWithTypewriter = (msg: DisplayMessage) => {
    setMessages(prev => [...prev, { ...msg, displayedContent: '', isStreaming: true }]);
  };

  const startBuilding = async () => {
    setView('building');
    setMessageCount(0);
    setShowSavePrompt(false);
    setBuildData({});
    setCurrentQuestion(0);
    setBotName('');
    setMessages([]);
    
    setTimeout(() => setShowTitle(true), 100);
    
    const welcomeMsg = getSimpleAIWelcome();
    
    setTimeout(() => {
      addMessageWithTypewriter({ role: 'assistant', content: welcomeMsg, persona: 'Simple_AI' });
      
      setApiMessages([
        { role: 'system', content: SIMPLE_AI_PERSONA },
        { role: 'assistant', content: welcomeMsg }
      ]);
    }, 600);
  };

  const handleBuildingInput = async (text: string) => {
    setMessages(prev => [...prev, { role: 'user', content: text, displayedContent: text }]);
    
    const textLower = text.toLowerCase();
    
    // Check if user wants to learn more or chat
    if (currentQuestion === 0 && messages.length <= 2) {
      if (textLower.includes('learn') || textLower.includes('more') || textLower.includes('explain') || textLower.includes('how')) {
        setView('freeChat');
        await handleFreeChatInput(text);
        return;
      }
    }
    
    // Handle follow-up responses
    if (waitingForFollowUp) {
      const combined = `${pendingAnswer} ${text}`;
      setPendingAnswer('');
      setWaitingForFollowUp(false);
      
      const newData = { ...buildData };
      const questionKeys: (keyof BuildData)[] = ['name', 'personality', 'topics', 'quirks', 'tone', 'special'];
      newData[questionKeys[currentQuestion]] = combined;
      setBuildData(newData);
      
      if (currentQuestion === 0) {
        setBotName(combined);
      }
      
      proceedToNextQuestion();
      return;
    }
    
    // Check if answer needs follow-up
    const analysis = analyzeUserResponse(text, currentQuestion);
    
    if (analysis.needsFollowUp && analysis.followUpQuestion) {
      setPendingAnswer(text);
      setWaitingForFollowUp(true);
      
      setTimeout(() => {
        addMessageWithTypewriter({
          role: 'assistant',
          content: analysis.followUpQuestion,
          persona: 'Simple_AI'
        });
      }, 500);
      return;
    }
    
    // Normal flow - save answer
    const newData = { ...buildData };
    const questionKeys: (keyof BuildData)[] = ['name', 'personality', 'topics', 'quirks', 'tone', 'special'];
    newData[questionKeys[currentQuestion]] = text;
    setBuildData(newData);

    if (currentQuestion === 0) {
      setBotName(text);
    }

    proceedToNextQuestion();
  };

  const proceedToNextQuestion = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => {
        const nextQuestion = QUESTIONS[currentQuestion + 1];
        addMessageWithTypewriter({
          role: 'assistant',
          content: nextQuestion,
          persona: 'Simple_AI'
        });
      }, 500);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Done building
      setTimeout(() => {
        const doneMsg = `Perfect! ${buildData.name || 'Your AI'} is ready to go.`;
        addMessageWithTypewriter({
          role: 'assistant',
          content: doneMsg,
          persona: 'Simple_AI'
        });
        setTimeout(() => {
          setView('waitingToContinue');
        }, doneMsg.length * 20 + 500);
      }, 500);
    }
  };

  const handleFreeChatInput = async (text: string) => {
    setMessages(prev => [...prev, { role: 'user', content: text, displayedContent: text }]);
    const newApiMessages = [...apiMessages, { role: 'user', content: text }];
    setApiMessages(newApiMessages);
    setIsLoading(true);
    
    const streamingMessageIndex = messages.length + 1;
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '',
      displayedContent: '',
      persona: 'Simple_AI',
      isStreaming: false
    }]);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newApiMessages,
          buildingMode: true,
          botData: {}
        })
      });

      if (!response.ok || !response.body) {
        throw new Error('Stream failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              
              if (content) {
                accumulatedContent += content;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[streamingMessageIndex] = {
                    role: 'assistant',
                    content: accumulatedContent,
                    displayedContent: accumulatedContent,
                    persona: 'Simple_AI',
                    isStreaming: true
                  };
                  return updated;
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      setApiMessages(prev => [...prev, { role: 'assistant', content: accumulatedContent }]);

    } catch (error) {
      console.error('❌ Chat error:', error);
    }
    
    setIsLoading(false);
  };

  const startChatting = () => {
    console.log('🚀 Starting chatting phase with bot:', buildData.name);
    console.log('📊 Bot configuration:', buildData);
    
    // Generate persona template
    const personaTemplate = generatePersonaTemplate(buildData);
    console.log('🧠 Generated persona template:\n', personaTemplate);
    
    // Fade out Simple_AI title
    setShowTitle(false);
    
    setTimeout(() => {
      setView('chatting');
      setMessages([]); // CLEAR CHAT HISTORY
      setMessageCount(0);
      
      // Fade in bot name
      setTimeout(() => setShowTitle(true), 100);
      
      // Create greeting
      const greetingMsg = `Hey! I'm ${buildData.name}. Ready to chat!`;
      addMessageWithTypewriter({
        role: 'assistant',
        content: greetingMsg,
        persona: buildData.name
      });
      
      setApiMessages([{
        role: 'system',
        content: personaTemplate
      }]);
    }, 1000);
  };

  const handleChattingInput = async (text: string) => {
    setMessages(prev => [...prev, { role: 'user', content: text, displayedContent: text }]);
    const newApiMessages = [...apiMessages, { role: 'user', content: text }];
    setApiMessages(newApiMessages);
    setIsLoading(true);
    setMessageCount(prev => prev + 1);
    
    const streamingMessageIndex = messages.length + 1;
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '',
      displayedContent: '',
      persona: botName,
      isStreaming: false
    }]);
    
    try {
      console.log('🎯 Sending to API with bot data:', buildData);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newApiMessages,
          buildingMode: false,
          botData: buildData
        })
      });

      if (!response.ok || !response.body) {
        throw new Error('Stream failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              
              if (content) {
                accumulatedContent += content;
                setMessages(prev => {
                  const updated = [...prev];
                  updated[streamingMessageIndex] = {
                    role: 'assistant',
                    content: accumulatedContent,
                    displayedContent: accumulatedContent.slice(0, (updated[streamingMessageIndex].displayedContent?.length || 0) + content.length),
                    persona: botName,
                    isStreaming: true
                  };
                  return updated;
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      setMessages(prev => {
        const updated = [...prev];
        updated[streamingMessageIndex] = {
          ...updated[streamingMessageIndex],
          content: accumulatedContent,
          isStreaming: true
        };
        return updated;
      });
      
      setApiMessages(prev => [...prev, { role: 'assistant', content: accumulatedContent }]);

      // Show save prompt after 6 interactions
      if (messageCount + 1 >= 6) {
        setTimeout(() => {
          setShowSavePrompt(true);
        }, accumulatedContent.length * 20 + 1000);
      }

    } catch (error) {
      console.error('❌ Chat error:', error);
      setMessages(prev => {
        const updated = [...prev];
        updated[streamingMessageIndex] = {
          role: 'assistant',
          content: 'Connection error. Please try again.',
          displayedContent: 'Connection error. Please try again.',
          persona: botName,
          isStreaming: false
        };
        return updated;
      });
    }
    
    setIsLoading(false);
  };

  const startRefining = () => {
    setView('refining');
    setShowSavePrompt(false);
    setMessageCount(0);
    
    addMessageWithTypewriter({
      role: 'assistant',
      content: "What would you like to change about your AI?",
      persona: 'Simple_AI',
      isSimpleAI: true
    });
  };

  const handleRefiningInput = async (text: string) => {
    setMessages(prev => [...prev, { role: 'user', content: text, displayedContent: text }]);
    setIsLoading(true);
    
    setTimeout(() => {
      addMessageWithTypewriter({
        role: 'assistant',
        content: "Revisions made. Let me know what you think!",
        persona: 'Simple_AI',
        isSimpleAI: true
      });
      
      setTimeout(() => {
        // Regenerate template with updates
        const updatedTemplate = generatePersonaTemplate(buildData);
        console.log('🔄 Updated persona template:\n', updatedTemplate);
        
        setView('chatting');
        setMessages([]);
        setMessageCount(0);
        
        const greetingMsg = `Hey! I'm ${buildData.name}. Let's try this again!`;
        addMessageWithTypewriter({
          role: 'assistant',
          content: greetingMsg,
          persona: buildData.name
        });
        setApiMessages([{
          role: 'system',
          content: `${updatedTemplate}\n\nUser requested changes: ${text}`
        }]);
      }, 2000);
    }, 1500);
    
    setIsLoading(false);
  };

  const saveAI = () => {
    const newAI: SavedAI = {
      ...buildData,
      id: Date.now().toString()
    };
    setSavedAIs(prev => [...prev, newAI]);
    
    // Reset to initial state
    setView('initial');
    setMessages([]);
    setShowSavePrompt(false);
    setShowTitle(false);
    setBuildData({});
    setMessageCount(0);
    setCurrentQuestion(0);
    setBotName('');
    setMenuSelection('newai');
  };

  const selectMenuItem = () => {
    if (menuSelection === 'newai') {
      startBuilding();
    } else {
      alert('/myAIs view coming soon!');
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (view === 'initial') {
      selectMenuItem();
      setInput('');
      return;
    }

    if (view === 'waitingToContinue') {
      startChatting();
      setInput('');
      return;
    }
    
    if (!input.trim()) return;
    
    if (view === 'building') {
      handleBuildingInput(input);
    } else if (view === 'freeChat') {
      handleFreeChatInput(input);
    } else if (view === 'refining') {
      handleRefiningInput(input);
    } else if (view === 'chatting') {
      handleChattingInput(input);
    }
    
    setInput('');
  };

  return (
    <div className="bg-[#0A0E27] border-2 border-cyan-500/50 rounded-lg shadow-2xl shadow-cyan-500/20 overflow-hidden h-full flex flex-col">
      {/* Terminal Header */}
      <div className="bg-slate-800 border-b border-cyan-500/30 px-4 py-2 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        <span className="text-purple-300 text-sm font-mono">simple-as-that:~$</span>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 p-6 font-mono text-sm overflow-y-auto">
        {view === 'initial' && (
          <div className="flex flex-col h-full">
            <div className="space-y-4">
              <div className={`${menuSelection === 'newai' ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'text-cyan-400/40'} text-base font-bold transition-all`}>
                /newAI<span className={`${showCursor && menuSelection === 'newai' ? 'opacity-100' : 'opacity-0'}`}>_</span>
              </div>
              {savedAIs.length > 0 && (
                <div className={`${menuSelection === 'myais' ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'text-cyan-400/40'} text-base font-bold transition-all`}>
                  /myAIs<span className={`${showCursor && menuSelection === 'myais' ? 'opacity-100' : 'opacity-0'}`}>_</span>
                </div>
              )}
            </div>
          </div>
        )}

        {(view === 'building' || view === 'freeChat' || view === 'waitingToContinue' || view === 'chatting' || view === 'refining') && (
          <div className="space-y-4">
            {/* Title with Refine/Save buttons */}
            <div className="flex items-center justify-between mb-6">
              {(view === 'chatting' || view === 'refining') && (
                <button
                  onClick={startRefining}
                  className={`text-sm px-3 py-1 rounded transition-all ${
                    showSavePrompt 
                      ? 'bg-yellow-500/30 text-yellow-300 animate-pulse' 
                      : 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30'
                  }`}
                >
                  ← Refine
                </button>
              )}
              
              {(view === 'building' || view === 'freeChat' || view === 'waitingToContinue') && <div className="w-20" />}
              
              <div 
                className={`text-3xl font-bold text-cyan-400 text-center drop-shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-opacity duration-1000 flex-1 ${
                  showTitle ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {(view === 'building' || view === 'freeChat' || view === 'waitingToContinue') ? 'Simple_AI' : (view === 'refining' ? 'Simple_AI' : botName)}
              </div>
              
              {(view === 'chatting' || view === 'refining') && (
                <button
                  onClick={saveAI}
                  className={`text-sm px-3 py-1 rounded transition-all ${
                    showSavePrompt 
                      ? 'bg-green-500/30 text-green-300 animate-pulse' 
                      : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                  }`}
                >
                  Save →
                </button>
              )}
              
              {(view === 'building' || view === 'freeChat' || view === 'waitingToContinue') && <div className="w-20" />}
            </div>
            
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block max-w-[80%] px-4 py-2 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-cyan-500/20 text-cyan-300' 
                    : msg.isSimpleAI
                    ? 'bg-purple-500/20 text-purple-200 text-sm'
                    : 'bg-purple-900/30 text-white'
                }`}>
                  {msg.isSimpleAI && (
                    <span className="text-xs text-purple-400 block mb-1">Simple_AI</span>
                  )}
                  <span className="opacity-0 animate-[fadeIn_0.3s_ease-in_forwards]">
                    {msg.displayedContent || msg.content}
                  </span>
                  {msg.isStreaming && msg.displayedContent && msg.displayedContent.length < msg.content.length && (
                    <span className="inline-block w-1 h-4 bg-cyan-400 ml-1 animate-pulse"></span>
                  )}
                </div>
              </div>
            ))}
            
            {view === 'waitingToContinue' && (
              <div className="text-center mt-6">
                <p className="text-purple-300 text-sm animate-pulse">Press Enter to continue...</p>
              </div>
            )}
            
            {showSavePrompt && (
              <div className="text-center mt-6">
                <p className="text-orange-300 text-sm animate-pulse">
                  Are you satisfied with your AI or does it need further refining?
                </p>
                <p className="text-purple-400 text-xs mt-2">Click Refine or Save buttons above</p>
              </div>
            )}
            
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="text-left">
                <div className="inline-block bg-purple-900/30 px-4 py-2 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area - ALWAYS VISIBLE */}
      <div className="p-4 border-t border-cyan-500/30 bg-slate-900/50 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || view === 'waitingToContinue'}
            className="flex-1 bg-slate-800/50 text-white px-4 py-2 rounded outline-none border border-cyan-500/30 focus:border-cyan-500 placeholder-gray-500 disabled:opacity-50"
            placeholder={
              view === 'initial' 
                ? "Press Enter to begin..." 
                : view === 'waitingToContinue'
                ? "Press Enter to continue..."
                : "Type your message..."
            }
            autoFocus
          />
          {view !== 'initial' && view !== 'waitingToContinue' && (
            <button
              type="submit"
              disabled={isLoading}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-6 py-2 rounded transition-all disabled:opacity-50"
            >
              Send
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
