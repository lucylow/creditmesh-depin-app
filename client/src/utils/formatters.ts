import { ethers } from "ethers";

export function formatEther(wei: ethers.BigNumber): string {
  return ethers.utils.formatEther(wei);
}

export function parseEther(eth: string): ethers.BigNumber {
  return ethers.utils.parseEther(eth);
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
