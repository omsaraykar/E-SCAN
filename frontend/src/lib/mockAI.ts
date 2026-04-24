import { AnalysisResult } from "./types";

export const analyzeContract = async (code: string): Promise<AnalysisResult> => {
    try {
        const response = await fetch("http://localhost:8000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ code })
        });
        
        if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`);
        }
        
        const data = await response.json();
        
        return {
            vulnerability: data.vulnerability,
            confidence: 1.0,
            explanation: `Your code belongs to vulnerability: ${data.vulnerability}`
        };
    } catch (error: any) {
        throw new Error(`Failed to contact analyzer service: ${error.message}`);
    }
};

/**
 * Simulates a general AI assistant response.
 */
export const genericChatResponse = async (message: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return `I am E-SCAN's AI assistant. My deep learning module is pending implementation. Currently, I can check your account balance, transaction count, or mock-analyze a smart contract. How may I be of service?`;
};
