import { NextResponse } from 'next/server';
import { intentRouter } from '@/lib/intentRouter';
import { getBalance, getRecentTransactions } from '@/lib/ethereum';
import { analyzeContract, genericChatResponse } from '@/lib/mockAI';

export async function POST(req: Request) {
    try {
        const { message, walletAddress } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const intent = intentRouter(message);
        let assistantReply = "";

        switch (intent) {
            case "balance":
                if (!walletAddress) {
                    assistantReply = "⚠️ Please connect your wallet first to check your balance.";
                } else {
                    try {
                        const balance = await getBalance(walletAddress);
                        assistantReply = `Your current balance is **${parseFloat(balance).toFixed(4)} ETH**.`;
                    } catch (error: any) {
                        assistantReply = `Failed to fetch balance: ${error.message}`;
                    }
                }
                break;

            case "transactions":
                if (!walletAddress) {
                    assistantReply = "⚠️ Please connect your wallet first to check your transactions.";
                } else {
                    try {
                        const txInfo = await getRecentTransactions(walletAddress);
                        assistantReply = txInfo;
                    } catch (error: any) {
                        assistantReply = `Failed to fetch transactions: ${error.message}`;
                    }
                }
                break;

            case "analyze":
                try {
                    // Extract contract code if provided in the message, else use dummy
                    const codeMatch = message.match(/```([\s\S]*?)```/);
                    const code = codeMatch ? codeMatch[1] : message.replace(/analyze(?:\s*contract)?/gi, "").trim() || "Dummy contract";

                    const analysis = await analyzeContract(code);
                    assistantReply = `🔍 **Vulnerability Found**: ${analysis.vulnerability}\n\n📈 **Confidence**: ${(analysis.confidence * 100).toFixed(1)}%\n\n📝 **Explanation**: ${analysis.explanation}`;
                } catch (error: any) {
                    assistantReply = `Analysis failed: ${error.message}`;
                }
                break;

            case "general":
            default:
                assistantReply = await genericChatResponse(message);
                break;
        }

        return NextResponse.json({ reply: assistantReply });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
