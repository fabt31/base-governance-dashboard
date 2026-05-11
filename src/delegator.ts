import { ethers } from "ethers";
const TOKEN_ABI = ["function delegate(address delegatee)", "function delegates(address account) view returns (address)", "function getVotes(address account) view returns (uint256)"];
export async function delegateVotes(tokenAddress: string, delegatee: string, wallet: ethers.Wallet) {
  const token = new ethers.Contract(tokenAddress, TOKEN_ABI, wallet);
  const current = await token.delegates(wallet.address);
  if (current.toLowerCase() === delegatee.toLowerCase()) { console.log("Already delegated"); return; }
  const tx = await token.delegate(delegatee);
  await tx.wait();
  const newVotes = await token.getVotes(delegatee);
  console.log(`Delegated to ${delegatee}. New voting power: ${ethers.formatEther(newVotes)}`);
}
