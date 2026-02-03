'use client';
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { personas } from '@/config/personas';

export default function ChatPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const persona = personas.find(p => p.slug === resolvedParams.slug);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!persona) {
    return <div className="min-h-screen bg-gray-900 text-white p-8">Persona not found</div>;
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaSlug: persona.slug,
          messages: newMessages
        })
      });

      const data = await response.json();
      if (data.message) {
        setMessages([...newMessages, { role: 'assistant', content: data.message }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={() => router.push('/')}
          className="mb-4 text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Lab
        </button>
        
        <div className="bg-gray-800 border border-cyan-500 rounded-lg p-6 mb-4">
          <h1 className="text-3xl font-bold text-white mb-2">{persona.name}</h1>
          <p className="text-gray-400">{persona.description}</p>
        </div>

        <div className="bg-gray-800 border border-cyan-500 rounded-lg p-6 mb-4 h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center">Start chatting with {persona.name}...</p>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`mb-4 ${ msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-700 text-white'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {loading && <div className="text-gray-400">Thinking...</div>}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white rounded-lg font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
