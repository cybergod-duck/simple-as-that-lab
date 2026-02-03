import Link from 'next/link';
import { personas } from '@/config/personas';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">
            Simple As That
          </h1>
          <p className="text-2xl text-cyan-400 mb-2">
            A lab of unreasonably specific AIs
          </p>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Chat with weird personalities, deploy them as bots. It's simple as that.
          </p>
        </div>

        {/* Chat Lab Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            💬 Chat Lab
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personas.map((persona) => (
              <Link
                key={persona.slug}
                href={`/chat/${persona.slug}`}
                className="bg-gray-800 border border-cyan-500 rounded-lg p-6 hover:bg-gray-700 hover:border-magenta-500 transition-all cursor-pointer group"
              >
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400">
                  {persona.name}
                </h3>
                <p className="text-gray-400 mb-3 text-sm">
                  {persona.role}
                </p>
                <p className="text-gray-300">
                  {persona.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Bots Lab Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            🤖 Bots Lab
          </h2>
          <div className="bg-gray-800 border border-cyan-500 rounded-lg p-8 text-center">
            <p className="text-gray-300 text-lg">
              Telegram & Discord versions coming soon.
            </p>
          </div>
        </section>

        {/* Research Division Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            📄 Research Division
          </h2>
          <div className="bg-gray-800 border border-cyan-500 rounded-lg p-8 text-center">
            <p className="text-gray-300 text-lg mb-4">
              Peer-unreviewed white papers from the Simple As That Research Division.
            </p>
            <p className="text-gray-400">
              Papers coming soon.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-400 text-sm">
          <p>
            A Simple As That project · Infrastructure by Voss Neural Research
          </p>
          <p className="mt-2">
            Certified by Simple As That
          </p>
        </footer>
      </div>
    </div>
  );
}
