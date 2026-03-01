"use client";

import { useState } from "react";
import { connectWallet, getBalance, getNetwork } from "@/lib/ethereum";
import { Wallet, Loader2 } from "lucide-react";

export const WalletConnect = ({ onConnect }: { onConnect?: (address: string) => void }) => {
    const [address, setAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState<string | null>(null);
    const [network, setNetwork] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConnect = async () => {
        setLoading(true);
        setError(null);
        try {
            const addr = await connectWallet();
            setAddress(addr);

            const bal = await getBalance(addr);
            setBalance(bal);

            const net = await getNetwork();
            setNetwork(net);

            if (onConnect) onConnect(addr);
        } catch (err: any) {
            setError(err.message || "Failed to connect wallet");
        } finally {
            setLoading(false);
        }
    };

    if (address) {
        return (
            <div className="flex items-center gap-3 px-3 py-1.5 border border-white/10 rounded-md bg-[#0A0A0A]">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <span className="text-[11px] text-neutral-400 font-medium tracking-wide">{network}</span>
                </div>

                <div className="h-4 w-[1px] bg-white/10" />

                <span className="text-xs text-neutral-300 font-mono tracking-wide">
                    {address.slice(0, 6)}...{address.slice(-4)}
                </span>

                <div className="h-4 w-[1px] bg-white/10" />

                <span className="text-xs text-white font-medium">
                    {parseFloat(balance || "0").toFixed(3)} ETH
                </span>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={handleConnect}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-1.5 bg-white text-black hover:bg-neutral-200 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
                {loading ? "Connecting..." : "Connect"}
            </button>
            {error && (
                <span className="absolute top-10 right-0 text-xs text-white bg-red-900/50 px-2 py-1 rounded border border-red-500/20 whitespace-nowrap">{error}</span>
            )}
        </div>
    );
};
