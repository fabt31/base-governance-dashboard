# base-governance-dashboard

> On-Chain Governance Dashboard for Base L2

Track, vote, and delegate across all major Base protocol governance systems. Supports Governor Bravo, OpenZeppelin Governor, and custom governance contracts.

## Supported Protocols
| Protocol | Governance Token | Type |
|----------|-----------------|------|
| Aerodrome | AERO | veNFT |
| Compound v3 | COMP | GovernorBravo |
| Uniswap | UNI | GovernorBravo |
| ENS (Base) | ENS | OZGovernor |

## Features
- 📋 Active proposal feed (all protocols)
- 🗳️ Vote directly from dashboard
- 🤝 Delegate voting power
- 📊 Voting power calculator
- 🔔 Proposal alert notifications
- 📜 On-chain vote history

## Installation
```bash
git clone https://github.com/fabt31/base-governance-dashboard
cd base-governance-dashboard
npm install && npm run dev
```

## API
```typescript
import { GovernanceDashboard } from "./src/dashboard";

const dash = new GovernanceDashboard({ rpc: "https://mainnet.base.org" });

// Get active proposals
const proposals = await dash.getActiveProposals();

// Check voting power
const power = await dash.getVotingPower("0xYourAddress", COMP_TOKEN);

// Cast vote
await dash.castVote(governorAddress, proposalId, 1, "For"); // 1=For, 0=Against, 2=Abstain
```

## License
MIT