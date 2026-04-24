/**
 * A robust intent router.
 * Detects whether the user is pasting code or asking about account balances/transactions.
 */
export const intentRouter = (message: string): "balance" | "transactions" | "analyze" | "general" => {
    const lowerMsg = message.toLowerCase();

    // Prioritize code detection: if there are markdown blocks or common solidity keywords + brackets
    if (
        message.includes("```") || 
        (lowerMsg.includes("pragma solidity") || lowerMsg.includes("contract ")) && (message.includes("{") && message.includes("}")) ||
        (lowerMsg.includes("function") && lowerMsg.includes("public"))
    ) {
        return "analyze";
    }

    if (lowerMsg.includes("analyze") && (lowerMsg.includes("contract") || lowerMsg.includes("code"))) {
        return "analyze";
    }

    // Otherwise, check for standard commands
    if (lowerMsg.includes("balance") || lowerMsg.includes("eth")) return "balance";
    if (lowerMsg.includes("transaction") || lowerMsg.includes("tx")) return "transactions";

    // Fallback if they just say "analyze this"
    if (lowerMsg.includes("analyze")) return "analyze";

    return "general";
};
