import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { QueryProvider } from '../providers/QueryProvider';

export const metadata: Metadata = {
  title: 'AI JobPilot | Autonomous Job Search & Workflow Automation',
  description:
    'Production-grade AI-powered Job Search & Workflow Automation platform with BullMQ background workers and LLM tool calling.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-slate-100 antialiased">
        <QueryProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 pl-64 flex flex-col min-w-0">
              <Navbar />
              <main className="flex-1 p-8 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
