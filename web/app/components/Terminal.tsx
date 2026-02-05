'use client';
import { useState, useEffect, useRef } from 'react';

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
  isPrompt?: boolean;
}

interface SavedAI extends BuildData {
  id: string;
}

export default function Terminal({ onCommandChange }: { onCommandChange: (cmd: string) => void }) {
  const [view, setView] = useState<'initial' | 'building' | 'chatting' | 'refining' | 'myais'>('initial');
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
  const [selectedAction, setSelectedAction] = useState<'back' | 'refine'>('refine');
  const [savedAIs, setSavedAIs] = useState<SavedAI[]>([]);
  const [menuSelection, setMenuSelection] = useState<'newai' | 'myais'>('newai');
  const [selectedAI, setSelectedAI] = useState<number>(0);
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (view === 'initial' && savedAIs.length > 0) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault();
          setMenuSelection(prev => prev === 'newai' ? 'myais' : 'newai');
        }
      } else if (showSavePrompt) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          setSelectedAction(prev => prev === 'back' ? 'refine' : 'back');
        }
      } else if (view === 'myais') {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedAI(prev => Math.max(0, prev - 1));
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedAI(prev => Math.min(savedAIs.length - 1, prev + 1));
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [view, showSavePrompt, savedAIs.length, selectedAI]);

  // Typewriter effect
  useEffect(() => {
    messages.forEach((msg, index) => {
      if (msg.role === 'assistant' && msg.isStreaming && msg.content && !msg.isPrompt) {
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

  const startBuilding = () => {
    setView('building');
    setMessageCount(0);
    setTimeout(() => setShowTitle(true), 100);
    
    const welcomeMsg = "Hey! I'm Simple_AI, your builder. Let's create your custom AI personality.";
    const firstQuestion = QUESTIONS[0];
    
    setTimeout(() => {
      addMessageWithTypewriter({ role: 'assistant', content: welcomeMsg, persona: 'Simple_AI' });
      
      setTimeout(() => {
        addMessageWithTypewriter({ role: 'assistant', content: firstQuestion, persona: 'Simple_AI' });
      }, welcomeMsg.length * 20 + 300);
      
      setApiMessages([
        { role: 'assistant', content: welcomeMsg },
        { role: 'assistant', content: firstQuestion }
      ]);
    }, 600);
  };

  const handleBuildingInput = (text: string) => {
    setMessages(prev => [...prev, { role: 'user', content: text, displayedContent: text }]);
    setApiMessages(prev => [...prev, { role: 'user', content: text }]);

    const newData = { ...buildData };
    const questionKeys: (keyof BuildData)[] = ['name', 'personality', 'topics', 'quirks', 'tone', 'special'];
    newData[questionKeys[currentQuestion]] = text;
    setBuildData(newData);

    if (currentQuestion === 0) {
      setBotName(text);
    }

    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => {
        const nextQuestion = QUESTIONS[currentQuestion + 1];
        addMessageWithTypewriter({
          role: 'assistant',
          content: nextQuestion,
          persona: 'Simple_AI'
        });
        setApiMessages(prev => [...prev, { role: 'assistant', content: nextQuestion }]);
      }, 500);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setTimeout(() => {
        const doneMsg = `Perfect! ${newData.name || 'Your AI'} is ready to go. Start chatting below!`;
        addMessageWithTypewriter({
          role: 'assistant',
          content: doneMsg,
          persona: 'Simple_AI'
        });
        setTimeout(() => {
          setShowTitle(false);
          setTimeout(() => {
            setView('chatting');
            setShowTitle(true);
            const greetingMsg = `Hey! I'm ${newData.name}. ${newData.personality || 'Ready to chat!'}`;
            addMessageWithTypewriter({
              role: 'assistant',
              content: greetingMsg,
              persona: newData.name
            });
            setApiMessages([{
              role: 'system',
              content: `You are ${newData.name}. Personality: ${newData.personality}. Topics: ${newData.topics}. Quirks: ${newData.quirks}. Tone: ${newData.tone}. ${newData.special}`
            }]);
          }, 300);
        }, doneMsg.length * 20 + 1000);
      }, 500);
    }
  };

  const handleChattingInput = async (text: string) => {
    if (showSavePrompt) {
      // Handle save/refine selection
      if (text.toLowerCase() === 'enter' || text === '') {
        if (selectedAction === 'back') {
          saveAI();
        } else {
          startRefining();
        }
      }
      return;
    }

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

  const saveAI = () => {
    const newAI: SavedAI = {
      ...buildData,
      id: Date.now().toString()
    };
    setSavedAIs(prev => [...prev, newAI]);
    setView('initial');
    setMessages([]);
    setShowSavePrompt(false);
    setShowTitle(false);
    setBuildData({});
    setMessageCount(0);
    setCurrentQuestion(0);
  };

  const startRefining = () => {
    setView('refining');
    setShowSavePrompt(false);
    setShowTitle(false);
    
    setTimeout(() => {
      setShowTitle(true);
      addMessageWithTypewriter({
        role: 'assistant',
        content: "No problem! What would you like to change about your AI?",
        persona: 'Simple_AI'
      });
    }, 300);
  };

  const selectMenuItem = () => {
    if (menuSelection === 'newai') {
      startBuilding();
    } else {
      setView('myais');
    }
  };

  const selectSavedAI = (ai: SavedAI) => {
    setBuildData(ai);
    setBotName(ai.name || 'AI');
    setView('chatting');
    setShowTitle(true);
    setMessageCount(0);
    setMessages([{
      role: 'assistant',
      content: `Hey! I'm ${ai.name}. ${ai.personality || 'Ready to chat!'}`,
      displayedContent: `Hey! I'm ${ai.name}. ${ai.personality || 'Ready to chat!'}`,
      persona: ai.name
    }]);
    setApiMessages([{
      role: 'system',
      content: `You are ${ai.name}. Personality: ${ai.personality}. Topics: ${ai.topics}. Quirks: ${ai.quirks}. Tone: ${ai.tone}. ${ai.special}`
    }]);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (view === 'initial') {
      selectMenuItem();
      setInput('');
      return;
    }

    if (view === 'myais') {
      selectSavedAI(savedAIs[selectedAI]);
      setInput('');
      return;
    }

    if (showSavePrompt) {
      if (selectedAction === 'back') {
        saveAI();
      } else {
        startRefining();
      }
      setInput('');
      return;
    }
    
    if (!input.trim()) return;
    
    if (view === 'building' || view === 'refining') {
      handleBuildingInput(input);
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

        {view === 'myais' && (
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6">Your AIs</h2>
            {savedAIs.map((ai, i) => (
              <div
                key={ai.id}
                className={`p-3 rounded-lg transition-all ${
                  i === selectedAI 
                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300' 
                    : 'bg-purple-900/20 border border-purple-500/30 text-white/60'
                }`}
              >
                <p className="font-bold">{ai.name}</p>
                <p className="text-xs mt-1">{ai.personality}</p>
              </div>
            ))}
          </div>
        )}

        {(view === 'building' || view === 'chatting' || view === 'refining') && (
          <div className="space-y-4">
            {/* Title with navigation buttons */}
            <div className="flex items-center justify-between mb-6">
              {showSavePrompt && (
                <button
                  onClick={() => {
                    setSelectedAction('back');
                    saveAI();
                  }}
                  className={`text-sm px-3 py-1 rounded transition-all ${
                    selectedAction === 'back' 
                      ? 'bg-green-500/30 text-green-300 animate-pulse' 
                      : 'text-purple-400/60'
                  }`}
                >
                  ← Back
                </button>
              )}
              
              <div 
                className={`text-3xl font-bold text-cyan-400 text-center drop-shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-opacity duration-1000 flex-1 ${
                  showTitle ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {view === 'building' || view === 'refining' ? 'Simple_AI' : botName}
              </div>
              
              {showSavePrompt && (
                <button
                  onClick={startRefining}
                  className={`text-sm px-3 py-1 rounded transition-all ${
                    selectedAction === 'refine' 
                      ? 'bg-yellow-500/30 text-yellow-300 animate-pulse' 
                      : 'text-purple-400/60'
                  }`}
                >
                  Refine →
                </button>
              )}
            </div>
            
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block max-w-[80%] px-4 py-2 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-cyan-500/20 text-cyan-300' 
                    : msg.isPrompt
                    ? 'bg-orange-500/20 text-orange-300'
                    : 'bg-purple-900/30 text-white'
                }`}>
                  <span className="opacity-0 animate-[fadeIn_0.3s_ease-in_forwards]">
                    {msg.displayedContent || msg.content}
                  </span>
                  {msg.isStreaming && msg.displayedContent && msg.displayedContent.length < msg.content.length && (
                    <span className="inline-block w-1 h-4 bg-cyan-400 ml-1 animate-pulse"></span>
                  )}
                </div>
              </div>
            ))}
            
            {showSavePrompt && (
              <div className="text-center">
                <p className="text-orange-300 text-sm animate-pulse">
                  Are you satisfied with your AI or does it need further refining?
                </p>
                <p className="text-purple-400 text-xs mt-2">Use ← → to select, Enter to confirm</p>
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

      {/* Input Area */}
      <div className="p-4 border-t border-cyan-500/30 bg-slate-900/50 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || showSavePrompt}
            className="flex-1 bg-slate-800/50 text-white px-4 py-2 rounded outline-none border border-cyan-500/30 focus:border-cyan-500 placeholder-gray-500 disabled:opacity-50"
            placeholder={
              view === 'initial' 
                ? "Press Enter to begin..." 
                : view === 'myais'
                ? "Press Enter to select..."
                : showSavePrompt
                ? "Use ← → to choose, Enter to confirm..."
                : "Type your message..."
            }
            autoFocus
          />
          {view !== 'initial' && view !== 'myais' && !showSavePrompt && (
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
