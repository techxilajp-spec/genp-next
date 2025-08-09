import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import { Toaster } from "sonner";
import { I18nProvider } from '@/lib/i18n'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Startup Hub - Management Dashboard",
  description:
    "Comprehensive startup management dashboard for tracking users, tasks, finances, and support payments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <I18nProvider>
          <Providers>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
              <main className="flex-1 min-w-0">{children}</main>
            </div>
            <Toaster position="top-right" richColors />
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
