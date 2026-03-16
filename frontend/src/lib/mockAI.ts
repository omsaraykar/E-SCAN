import { AnalysisResult } from "./types";

/**
 * Simulates an AI deep learning model processing a smart contract.
 */
export const analyzeContract = async (code: string): Promise<AnalysisResult> => {
    // Simulate network delay for mock AI
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
        vulnerability: "Reentrancy",
        confidence: 0.84,
        explanation: "Mock AI response. Deep learning model not integrated yet. The contract potentially allows an external call to hijack control flow before state updates are finalized."
    };
};

/**
 * Simulates a general AI assistant response.
 */
export const genericChatResponse = async (message: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return `I am E-SCAN's AI assistant. My deep learning module is pending implementation. Currently, I can check your account balance, transaction count, or mock-analyze a smart contract. How may I be of service?`;
};
