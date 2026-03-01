import { BrowserProvider, JsonRpcProvider, formatEther } from 'ethers';

/**
 * Helper to get the correct provider depending on the environment.
 * In a browser with MetaMask, it uses BrowserProvider.
 * On the server, it attempts to use JsonRpcProvider via .env.local.
 */
export const getProvider = () => {
    if (typeof window !== 'undefined' && 'ethereum' in window) {
        return new BrowserProvider((window as any).ethereum);
    }

    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
    if (rpcUrl) {
        return new JsonRpcProvider(rpcUrl);
    }

    return null;
};

/**
 * Requests the user to connect their MetaMask wallet.
 * Must be called from the frontend only.
 */
export const connectWallet = async (): Promise<string> => {
    if (typeof window === 'undefined' || !('ethereum' in window)) {
        throw new Error("MetaMask is not installed");
    }
    const provider = new BrowserProvider((window as any).ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    if (!accounts || accounts.length === 0) throw new Error("No accounts found");

    return accounts[0] as string;
};

/**
 * Fetches the ETH balance for a given address.
 */
export const getBalance = async (address: string): Promise<string> => {
    const provider = getProvider();
    if (!provider) throw new Error("Ethereum provider not configured");

    const balance = await provider.getBalance(address);
    return formatEther(balance);
};

/**
 * Fetches the current network name or ID.
 */
export const getNetwork = async (): Promise<string> => {
    const provider = getProvider();
    if (!provider) throw new Error("Ethereum provider not configured");

    const network = await provider.getNetwork();
    return network.name === "unknown" ? `Chain ID ${network.chainId}` : network.name;
};

/**
 * Fetches the total outgoing transaction count (nonce) for an address.
 */
export const getRecentTransactions = async (address: string): Promise<string> => {
    const provider = getProvider();
    if (!provider) throw new Error("Ethereum provider not configured");

    const txCount = await provider.getTransactionCount(address);
    return `Account has ${txCount} total outgoing transactions recorded on this network.`;
};
