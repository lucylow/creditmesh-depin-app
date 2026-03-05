import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "@/contexts/Web3Context";
import { useContracts } from "@/hooks/useContracts";
import { IPFS_GATEWAY } from "@/services/contractAddresses";

export interface Device {
  id: string;
  tokenId: ethers.BigNumber;
  deviceType: number;
  reputation: number;
  stakeAmount: ethers.BigNumber;
  totalEarned: ethers.BigNumber;
  lastActive: number;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: { trait_type: string; value: string }[];
  };
}

export function useDevices() {
  const { account } = useWeb3();
  const { deviceNFT } = useContracts();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = async () => {
    if (!deviceNFT || !account) {
      setDevices([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const deviceIds = await deviceNFT.getDevicesByOwner(account);
      const devicePromises = (deviceIds as ethers.BigNumber[]).map(async (id: ethers.BigNumber) => {
        const info = await deviceNFT.getDeviceInfo(id);
        const tokenURI = await deviceNFT.tokenURI(id);
        const gateway = IPFS_GATEWAY;
        const url = (tokenURI as string).replace("ipfs://", gateway);
        const metadata = await fetch(url).then((r) => r.json());
        const [deviceType, reputation, stakeAmount, totalEarned, lastActive] = info as [
          number,
          ethers.BigNumber,
          ethers.BigNumber,
          ethers.BigNumber,
          ethers.BigNumber,
        ];
        return {
          id: id.toString(),
          tokenId: id,
          deviceType,
          reputation: reputation.toNumber(),
          stakeAmount,
          totalEarned,
          lastActive: lastActive.toNumber(),
          metadata,
        };
      });
      const results = await Promise.all(devicePromises);
      setDevices(results);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch devices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [account, deviceNFT]);

  return { devices, loading, error, refetch: fetchDevices };
}
