import "./globals.css";
import type { Metadata } from "next";
import { FeedbackProvider } from "@/components/feedback-provider";

export const metadata: Metadata = {
  title: "VAULT Terminal | Institutional Trading Ecosystem",
  description: "Advanced SMC/ICT Trading Analytics, Journaling, & AI Insights",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050505] text-slate-100 min-h-screen flex antialiased selection:bg-cyan-500/20 selection:text-cyan-400">
        <FeedbackProvider>
          <div className="flex-1 flex w-full min-h-screen overflow-x-hidden">
            {children}
          </div>
        </FeedbackProvider>
      </body>
    </html>
  );
}
