'use client';
import { useState } from 'react';

export default function NanoBananaLogo({ onAdd }: { onAdd: (added: boolean) => void }) {
    const [added, setAdded] = useState(false);

    const toggle = () => {
        const newState = !added;
        setAdded(newState);
        onAdd(newState);
    };

    return (
        <div className={`p-6 rounded-xl border-2 transition-all cursor-pointer flex flex-col md:flex-row items-center gap-6 ${added ? 'border-bright-cyan bg-blue-50/20 dark:bg-dark-navy shadow-lg' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`} onClick={toggle}>
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full flex items-center justify-center shrink-0 shadow-inner">
                <span className="text-4xl font-black text-white filter drop-shadow-md">NB</span>
            </div>
            <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Nano Banana Logo Creator</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Get a professional, high-resolution Text + Image logo generated instantly for your brand. Includes vector files for print and web.
                </p>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-deep-purple dark:text-periwinkle mb-2">+$50</span>
                <button
                    className={`px-6 py-2 rounded-lg font-bold transition-all w-full md:w-auto ${added ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-500 text-white hover:bg-green-600 shadow'}`}
                    onClick={(e) => { e.stopPropagation(); toggle(); }}
                >
                    {added ? 'Remove' : 'Add to Order'}
                </button>
            </div>
        </div>
    );
}
