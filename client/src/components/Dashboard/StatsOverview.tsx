import { useEffect, useState } from "react";
import { useContracts } from "@/hooks/useContracts";
import { formatEther } from "@/utils/formatters";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function StatsOverview() {
  const { deviceNFT, rewardDistributor, stakingPool } = useContracts();
  const [stats, setStats] = useState({
    totalDevices: 0,
    totalStaked: "0",
    totalRewards: "0",
    activeVerifiers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!deviceNFT || !rewardDistributor || !stakingPool) return;
      try {
        const totalDevices = await deviceNFT.totalSupply();
        const totalStaked = await stakingPool.totalStaked();
        const totalRewards = await rewardDistributor.totalRewardsDistributed();
        const activeVerifiers = await stakingPool.getActiveVerifierCount();
        setStats({
          totalDevices: (totalDevices as { toNumber: () => number }).toNumber(),
          totalStaked: formatEther(totalStaked as import("ethers").BigNumber),
          totalRewards: formatEther(totalRewards as import("ethers").BigNumber),
          activeVerifiers: (activeVerifiers as { toNumber: () => number }).toNumber(),
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, [deviceNFT, rewardDistributor, stakingPool]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <span className="text-sm text-muted-foreground">Total Devices</span>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold text-primary">{stats.totalDevices}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <span className="text-sm text-muted-foreground">Total Staked (CMESH)</span>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold text-green-600 dark:text-green-400">
            {stats.totalStaked}
          </span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <span className="text-sm text-muted-foreground">Rewards Distributed</span>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.totalRewards}
          </span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <span className="text-sm text-muted-foreground">Active Verifiers</span>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {stats.activeVerifiers}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
