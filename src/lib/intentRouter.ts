/**
 * A basic rule-based intent router.
 * Detects whether the user is asking about an account balance, transactions, analyzing a contract, or general conversation.
 */
export const intentRouter = (message: string): "balance" | "transactions" | "analyze" | "general" => {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes("balance") || lowerMsg.includes("eth")) return "balance";
    if (lowerMsg.includes("transaction") || lowerMsg.includes("tx")) return "transactions";
    if (lowerMsg.includes("analyze") || lowerMsg.includes("contract")) return "analyze";

    return "general";
};
