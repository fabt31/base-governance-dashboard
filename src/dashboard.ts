import { ethers } from "ethers";

const GOVERNOR_ABI = [
  "function proposals(uint256) view returns (uint256,address,uint256,uint256,uint256,uint256,uint256,uint256,bool,bool)",
  "function state(uint256 proposalId) view returns (uint8)",
  "function castVote(uint256 proposalId, uint8 support) returns (uint256)",
  "function castVoteWithReason(uint256 proposalId, uint8 support, string calldata reason) returns (uint256)",
  "function getVotes(address account, uint256 blockNumber) view returns (uint256)",
  "function proposalCount() view returns (uint256)",
  "event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason)",
];

const STATES = ["Pending","Active","Canceled","Defeated","Succeeded","Queued","Expired","Executed"];

interface Proposal { id: bigint; proposer: string; state: string; forVotes: bigint; againstVotes: bigint; }

export class GovernanceDashboard {
  private provider: ethers.JsonRpcProvider;

  constructor(config: { rpc: string }) {
    this.provider = new ethers.JsonRpcProvider(config.rpc);
  }

  async getActiveProposals(governorAddress: string): Promise<Proposal[]> {
    const gov = new ethers.Contract(governorAddress, GOVERNOR_ABI, this.provider);
    const count = await gov.proposalCount().catch(() => BigInt(10));
    const active: Proposal[] = [];
    for (let i = Number(count); i > Math.max(0, Number(count) - 20); i--) {
      try {
        const [id,,,,forVotes, againstVotes,,,] = await gov.proposals(i);
        const stateNum = await gov.state(i);
        active.push({ id, proposer: "", state: STATES[stateNum] ?? "Unknown", forVotes, againstVotes });
      } catch {}
    }
    return active.filter(p => p.state === "Active");
  }

  async getVotingPower(account: string, governorAddress: string): Promise<string> {
    const gov = new ethers.Contract(governorAddress, GOVERNOR_ABI, this.provider);
    const block = await this.provider.getBlockNumber();
    const votes = await gov.getVotes(account, block - 1).catch(() => BigInt(0));
    return ethers.formatEther(votes);
  }

  async castVote(governorAddress: string, proposalId: number, support: 0|1|2, reason: string, privateKey: string) {
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const gov = new ethers.Contract(governorAddress, GOVERNOR_ABI, wallet);
    const tx = reason
      ? await gov.castVoteWithReason(proposalId, support, reason)
      : await gov.castVote(proposalId, support);
    await tx.wait();
    console.log(`Voted ${["Against","For","Abstain"][support]} on proposal ${proposalId}: ${tx.hash}`);
    return tx.hash;
  }
}