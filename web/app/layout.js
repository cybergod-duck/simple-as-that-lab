import { AuthProvider } from './contexts/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Simple As That - AI Personality Lab & Bot Factory',
  description: 'Create custom AI personalities and deploy them as bots',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
