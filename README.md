# E-SCAN: Ethereum Smart Contract Analyzer

E-SCAN (Ethereum Smart Contract Analyzer) is a Web3 security assistant that enables smart contract analysis through an interactive chat-based interface. It integrates Ethereum wallet connectivity, blockchain data retrieval, and intelligent backend intent routing within a scalable full-stack architecture.

## Features

- **Web3 Wallet Connection**: Connect with MetaMask, securely checking address, live balances, and network parameters.
- **Intent Router Core**: Distinguishes between checking "balance", querying "transactions", or running "analysis".
- **AI Vulnerability Analysis Simulation**: Includes a mock delay and response framework built in Preparation for advanced deep-learning NLP integration. 
- **Modern User Interface**: State-of-the-art UI utilizing Tailwind CSS, featuring a sleek, Vercel-inspired monochrome minimal dark theme allowing you to focus on the code.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TypeScript, Tailwind Css, Lucide Icons.
- **Blockchain**: `ethers.js` v6 for client-side and server-side RPC interaction.
- **Backend API**: Modular Next.js Serverless Route.

## Getting Started

1. Clone and install dependencies:
   ```bash
   npm install
   ```

2. Setup Environment Variables:
   Add your configurations to `.env.local`:
   ```env
   NEXT_PUBLIC_RPC_URL=https://your-rpc-url.example.com
   NEXT_PUBLIC_CHAIN_ID=1
   ```
   *(If omitted, server-side blockchain queries may not function properly, but client MetaMask connections will still work.)*

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

