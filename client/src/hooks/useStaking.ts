import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "@/contexts/Web3Context";
import { useContracts } from "@/hooks/useContracts";

export function useStaking() {
  const { account } = useWeb3();
  const { stakingPool, cmesh } = useContracts();
  const [totalStaked, setTotalStaked] = useState<ethers.BigNumber>(ethers.constants.Zero);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!stakingPool || !account) {
        setLoading(false);
        return;
      }
      try {
        const staked = await stakingPool.totalStaked();
        setTotalStaked(staked);
      } catch {
        setTotalStaked(ethers.constants.Zero);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [account, stakingPool]);

  return { totalStaked, loading, stakingPool, cmesh };
}
