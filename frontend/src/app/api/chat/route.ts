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

                    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            // model: "openai/gpt-4o-mini",
                            // model: "openai/gpt-4o-mini",
                            model: "deepseek/deepseek-r1",
                            messages: [
                                {
                                    role: "system",
                                    content: `You are an AI-powered smart contract vulnerability explainer.

Goal:
Take:
1. Solidity smart contract code (user input)
2. Predicted vulnerability label from ML model

Then generate a clear, structured explanation.

Requirements for Output:
Return your response using beautifully formatted Markdown (use **bold** for emphasis, \`code\` blocks, and headings).
Structure your response EXACTLY with these headings:

### 1. Vulnerability Name
State the vulnerability clearly.

### 2. What it means
Explain the vulnerability in simple terms.

### 3. Why this contract is vulnerable
Refer to specific code patterns using \`inline code\`.

### 4. Risk level
State if it's **Low**, **Medium**, or **High**.

### 5. Real-world impact
Explain the potential damage (fund loss, attack scenarios, etc.).

### 6. How to fix it
Describe the fix and provide an improved Solidity code snippet enclosed in \`\`\`solidity ... \`\`\`.`
                                },
                                {
                                    role: "user",
                                    content: `Code:\n\`\`\`solidity\n${code}\n\`\`\`\n\nPredicted Vulnerability: ${analysis.vulnerability}`
                                }
                            ]
                        })
                    });

                    const openRouterData = await openRouterResponse.json();

                    if (!openRouterResponse.ok) {
                        throw new Error(`OpenRouter Error: ${openRouterData.error?.message || "Unknown error"}`);
                    }

                    if (openRouterData.choices && openRouterData.choices.length > 0) {
                        assistantReply = openRouterData.choices[0].message.content;
                    } else {
                        assistantReply = `Expected choices from OpenRouter, got: ${JSON.stringify(openRouterData)}`;
                    }
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
