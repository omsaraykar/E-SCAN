# E-SCAN: Ethereum Smart Contract Analyzer

E-SCAN is a modern AI SaaS dashboard for Web3 smart contract analysis. Built with cutting-edge technologies, it currently features wallet integration, intelligent intent routing, frontend interaction, and a mock AI deep learning simulation, establishing the infrastructure for future ML and NLP agent replacements.

## Features

- **Web3 Wallet Connection**: Connect with MetaMask, securely checking address, live balances, and network parameters.
- **Intent Router Core**: Distinguishes between checking "balance", querying "transactions", or running "analysis".
- **AI Vulnerability Analysis Simulation**: Includes a mock delay and response framework built in Preparation for advanced deep-learning NLP integration. 
- **Modern User Interface**: State-of-the-art UI utilizing Tailwind CSS, Framer Motion, and Glassmorphism design principles.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
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

## Upcoming Milestones

- Replace `mockAI.ts` backend service with actual Deep Learning implementation.
- Introduce advanced LLM integration inside the NLP Chatbot intent responder.
