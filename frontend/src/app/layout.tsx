import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletConnect } from "@/components/WalletConnect";
import { Search } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-SCAN | Ethereum Smart Contract Analyzer",
  description: "Minimalist web3 platform for smart contract analysis and wallet intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col bg-black text-white selection:bg-neutral-800 selection:text-white`}>

        {/* Global Navbar */}
        <header className="h-16 sticky top-0 z-50 w-full border-b border-white/5 bg-black">
          <div className="max-w-[1200px] h-full mx-auto flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-neutral-400" />
              <h1 className="text-[15px] font-medium tracking-wide text-neutral-200">
                E-SCAN
              </h1>
            </div>

            <WalletConnect />
          </div>
        </header>

        {/* Content Portal */}
        <main className="flex-1 overflow-hidden relative bg-black">
          {children}
        </main>

      </body>
    </html>
  );
}
