'use client';
import { useAuth } from '../contexts/AuthContext';

export default function AuthModal({ onClose }) {
  const { signInWithProvider } = useAuth();

  const providers = [
    { name: 'GitHub', id: 'github', color: 'bg-gray-800 hover:bg-gray-700' },
    { name: 'Google', id: 'google', color: 'bg-red-600 hover:bg-red-500' },
    { name: 'Discord', id: 'discord', color: 'bg-[#5865F2] hover:bg-[#4752C4]' },
    { name: 'Twitter', id: 'twitter', color: 'bg-sky-500 hover:bg-sky-400' },
    { name: 'Facebook', id: 'facebook', color: 'bg-blue-600 hover:bg-blue-500' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-lg max-w-md w-full p-8 shadow-2xl shadow-cyan-500/20">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-2">Sign in to build & save your AIs</h2>
            <p className="text-purple-300 text-sm">Choose your preferred sign-in method</p>
          </div>
          <button onClick={onClose} className="text-purple-300 hover:text-cyan-400 text-2xl">
            ×
          </button>
        </div>

        <div className="space-y-3">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => signInWithProvider(provider.id)}
              className={`w-full ${provider.color} text-white font-semibold py-3 px-4 rounded-lg transition-all`}
            >
              Continue with {provider.name}
            </button>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-purple-500/30">
          <p className="text-purple-300 text-xs text-center">
            By signing in, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}
