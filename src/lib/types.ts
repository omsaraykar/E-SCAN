export type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

export type AnalysisResult = {
    vulnerability: string;
    confidence: number;
    explanation: string;
};

export type WalletState = {
    address: string | null;
    balance: string | null;
    network: string | null;
    isConnected: boolean;
};
