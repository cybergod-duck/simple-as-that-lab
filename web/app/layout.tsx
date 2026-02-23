import type { Metadata } from 'next';
import './globals.css';
import ComplianceBot from './components/ComplianceBot';

export const metadata: Metadata = {
    title: 'Simple As That | Compliance-as-a-Code',
    description: 'Automated compliance patching for hyper-local digital ordinances.',
    icons: {
        icon: '/favicon.svg',
    },
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
                <ComplianceBot />
            </body>
        </html>
    );
}
