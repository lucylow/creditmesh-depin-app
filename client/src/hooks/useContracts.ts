import { useWeb3 } from "@/contexts/Web3Context";
import { ethers } from "ethers";
import {
  CMESH_TOKEN_ADDRESS,
  DATA_MARKETPLACE_ADDRESS,
  DEVICE_NFT_ADDRESS,
  REWARD_DISTRIBUTOR_ADDRESS,
  STAKING_POOL_ADDRESS,
} from "@/services/contractAddresses";
import CreditMeshToken_ABI from "@/services/abi/CreditMeshToken.json";
import DataMarketplace_ABI from "@/services/abi/DataMarketplace.json";
import DeviceNFT_ABI from "@/services/abi/DeviceNFT.json";
import RewardDistributor_ABI from "@/services/abi/RewardDistributor.json";
import StakingPool_ABI from "@/services/abi/StakingPool.json";

export function useContracts() {
  const { signer, isActive } = useWeb3();

  const getContract = (address: string, abi: string[]) => {
    if (!signer) return null;
    return new ethers.Contract(address, abi, signer);
  };

  return {
    deviceNFT: isActive ? getContract(DEVICE_NFT_ADDRESS, DeviceNFT_ABI as string[]) : null,
    stakingPool: isActive ? getContract(STAKING_POOL_ADDRESS, StakingPool_ABI as string[]) : null,
    rewardDistributor: isActive
      ? getContract(REWARD_DISTRIBUTOR_ADDRESS, RewardDistributor_ABI as string[])
      : null,
    marketplace: isActive
      ? getContract(DATA_MARKETPLACE_ADDRESS, DataMarketplace_ABI as string[])
      : null,
    cmesh: isActive ? getContract(CMESH_TOKEN_ADDRESS, CreditMeshToken_ABI as string[]) : null,
  };
}
