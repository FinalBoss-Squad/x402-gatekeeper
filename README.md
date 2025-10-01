# 🤖 Paywall

**Monetizing internet traffic: Pay-per-Request with Celo**  
_“The infrastructure to make bots pay 4 fairly, transparently, and instantly.”_



## 💡 Overview

**Paywall, Bot** is a protocol and Celo-integrated platform that monetizes API and web traffic from bots, scrapers, and AI agents using micropayments. Built with `x402 Payment Required`, Celo stablecoins, it transforms abusive or unpaid automation into a sustainable, machine-native economy.


## 🧩 The Problem

- Bots and AI agents generate massive traffic — often for free
- This creates **real costs** (bandwidth, compute) for creators and developers
- There's **no seamless way to require small payments per request**
- Traditional defenses (IP bans, CAPTCHAs) are blunt and break legitimate use


## 🚀 Our Solution

A plug-and-play system that:

1. **Intercepts requests** via an x402-compliant proxy
2. **Returns a payment challenge** with invoice metadata
3. **Verifies on-chain micropayments** (Celo/TON)
4. **Grants access** if the bot pays — blocks if it doesn’t


## 🛠️ Key Features

- ⚡ **x402 Proxy Server** — Adds payment enforcement to any endpoint
- 🪙 **Smart Contracts on Celo** — Lightweight, fast, and cost-efficient
- 🤖 **Bot Agent SDK** — Handles payment flow for compliant bots
- 📊 **Dashboard** — Tracks blocked/paying agents, revenue, and request logs


## 📦 Use Cases

- **API Providers** — Monetize automated access fairly
- **Web Content Platforms** — Protect from scrapers
- **AI Agent Platforms** — Enable pay-as-you-go data access


## 💰 Business Model

- Micropayment fees per request
- Prepaid credits and subscriptions
- Paid access tiers (priority, unlimited, surge-protected)
- SaaS APIs for devs and companies


## 🧠 Tech Stack

- Node.js / Express (x402 Proxy)
- Solidity (Celo smart contract)
- Telegram WebApp SDK (Mini-App frontend)
- Web3 / ethers.js (On-chain verification)
- Celo Alfajores (Testnet for MVP)
- Python/JS SDK for agent automation


## 🧪 Demo Flow

1. Crawler hits a protected endpoint
2. Receives HTTP 402 with invoice ID
3. Bot pays in cUSD via smart contract
4. Repeats request with proof of payment
5. Proxy verifies and serves the resource
6. Telegram Mini-App dashboard updates in real time


## 🔒 Security / Anti-Abuse

- Invoice-specific events prevent replay attacks
- Dynamic pricing adjusts cost during traffic spikes
- Prepaid quotas for trusted bots
- Signed keys or stake-based access (optional)


## 🧾 License

MIT — use it, improve it, build on it.


## 🧠 Made at Hackathon ORIGINS Token2049

By FinalBOSS Squad 

Guilherme dos Santos de Almeida Silva – gsantos@bankbook.com.br

Ademola Adebowale – ​​ademolajohn844@gmail.com

Kwang Wei Sim – kwang@adappter.xyz

Samuel Danso – me.samueldanso@gmail.com 
