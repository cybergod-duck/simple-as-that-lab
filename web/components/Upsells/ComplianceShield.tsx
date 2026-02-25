'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function ComplianceShield({ onAdd }: { onAdd: (added: boolean) => void }) {
    const [added, setAdded] = useState(false);

    const toggle = () => {
        const newState = !added;
        setAdded(newState);
        onAdd(newState);
    };

    return (
        <div className={`p-6 rounded-xl border-2 transition-all cursor-pointer flex flex-col md:flex-row items-center gap-6 ${added ? 'border-green-500 bg-green-50/20 dark:bg-green-900/10 shadow-lg' : 'border-gray-200 dark:border-gray-700 hover:border-green-300'}`} onClick={toggle}>
            <div className="relative w-24 h-24 shrink-0">
                {/* We assume the user has a shield logo.png in public dir */}
                <Image src="/shield logo.png" alt="State Compliance Shield" fill className="object-contain" />
            </div>
            <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">State Compliance Shield</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Protect your business from fines. Automatically generates Privacy Policies, Terms of Service, and ensures accessibility criteria are met based on Simple-As-That lab standards.
                </p>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-deep-purple dark:text-periwinkle mb-2">+$30</span>
                <button
                    className={`px-6 py-2 rounded-lg font-bold transition-all w-full md:w-auto ${added ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-500 text-white hover:bg-green-600 shadow'}`}
                    onClick={(e) => { e.stopPropagation(); toggle(); }}
                >
                    {added ? 'Remove' : 'Add Shield'}
                </button>
            </div>
        </div>
    );
}
