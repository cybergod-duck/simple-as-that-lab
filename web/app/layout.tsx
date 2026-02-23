import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Simple As That | Compliance-as-a-Code',
    description: 'Automated compliance patching for hyper-local digital ordinances.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="antialiased min-h-screen">
                {children}
            </body>
        </html>
    );
}
