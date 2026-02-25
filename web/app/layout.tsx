import type { Metadata } from 'next';
import './globals.css';
import ComplianceBot from './components/ComplianceBot';

export const metadata: Metadata = {
    title: 'Simple As That | Compliance-as-a-Code',
    description: 'Automated compliance patching for hyper-local digital ordinances.',
};

const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Simple As That AI Platform",
    "url": "https://simple-as-that.org",
    "logo": "https://simple-as-that.org/brand/logo.png",
    "description": "AI-driven website generator and compliance automation for SMBs."
};
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="antialiased min-h-screen">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                />
                {children}
                <ComplianceBot />
            </body>
        </html>
    );
}
