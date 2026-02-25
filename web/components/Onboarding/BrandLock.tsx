'use client';
import { useState } from 'react';

const APPROVED_PALETTES = [
    { name: 'Executive Navy', primary: '#1E3A8A', secondary: '#F3F4F6', accent: '#3B82F6' },
    { name: 'Forest Growth', primary: '#064E3B', secondary: '#F0FDF4', accent: '#10B981' },
    { name: 'Modern Slate', primary: '#334155', secondary: '#F8FAFC', accent: '#64748B' },
    { name: 'Vibrant Sunset', primary: '#7C2D12', secondary: '#FFF7ED', accent: '#F97316' },
];

export default function BrandLock({ onComplete }: { onComplete: (brand: any) => void }) {
    const [selectedPalette, setSelectedPalette] = useState(APPROVED_PALETTES[0]);
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

    const handleNext = () => {
        onComplete({ palette: selectedPalette, mode: themeMode });
    };

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Brand Lock Engine</h2>
                <p className="text-gray-600 dark:text-gray-300">
                    Our Brand Lock ensures your website always maintains professional contrast and aesthetic harmony.
                </p>
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Select a Professional Color Palette
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {APPROVED_PALETTES.map((palette) => (
                        <button
                            key={palette.name}
                            onClick={() => setSelectedPalette(palette)}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${selectedPalette.name === palette.name
                                    ? 'border-bright-cyan bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                }`}
                        >
                            <div className="font-semibold text-gray-900 dark:text-white mb-2">{palette.name}</div>
                            <div className="flex gap-2 h-8 rounded overflow-hidden">
                                <div className="flex-1" style={{ backgroundColor: palette.primary }}></div>
                                <div className="flex-1" style={{ backgroundColor: palette.secondary }}></div>
                                <div className="flex-1" style={{ backgroundColor: palette.accent }}></div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4 mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Preview Theme Mode
                </label>
                <div className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <button
                        onClick={() => setThemeMode('light')}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${themeMode === 'light' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                    >
                        Light Mode
                    </button>
                    <button
                        onClick={() => setThemeMode('dark')}
                        className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${themeMode === 'dark' ? 'bg-gray-800 shadow text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                    >
                        Dark Mode
                    </button>
                </div>
            </div>

            {/* Preview Box */}
            <div
                className="mt-6 p-6 rounded-lg border transition-colors shadow-inner"
                style={{
                    backgroundColor: themeMode === 'light' ? selectedPalette.secondary : selectedPalette.primary,
                    borderColor: themeMode === 'light' ? selectedPalette.primary : selectedPalette.secondary,
                    color: themeMode === 'light' ? selectedPalette.primary : selectedPalette.secondary,
                }}
            >
                <h3 className="text-xl font-bold mb-2">Live Preview</h3>
                <p className="opacity-80 mb-4">This section demonstrates how your content will look with the selected palette and mode.</p>
                <button
                    className="px-4 py-2 rounded font-semibold transition-opacity hover:opacity-90"
                    style={{
                        backgroundColor: selectedPalette.accent,
                        color: '#ffffff'
                    }}
                >
                    Primary Call to Action
                </button>
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleNext}
                    className="bg-deep-purple hover:bg-opacity-90 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md transform hover:scale-105"
                >
                    Confirm Brand Settings
                </button>
            </div>
        </div>
    );
}
