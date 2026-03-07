import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "@/contexts/Web3Context";
import { useContracts } from "@/hooks/useContracts";
import { useDevices } from "@/hooks/useDevices";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StakeForm() {
  const { account } = useWeb3();
  const { stakingPool, cmesh } = useContracts();
  const { devices } = useDevices();
  const [selectedDevice, setSelectedDevice] = useState("");
  const [amount, setAmount] = useState("");
  const [allowance, setAllowance] = useState<ethers.BigNumber>(ethers.constants.Zero);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllowance = async () => {
      if (!cmesh || !stakingPool || !account) return;
      try {
        const all = await cmesh.allowance(account, stakingPool.address);
        setAllowance(all as ethers.BigNumber);
      } catch (err) {
        console.error("[StakeForm] Failed to fetch allowance:", err);
      }
    };
    fetchAllowance();
  }, [cmesh, stakingPool, account]);

  const handleApprove = async () => {
    if (!cmesh || !stakingPool || !amount) return;
    try {
      setLoading(true);
      setError("");
      const amountWei = ethers.utils.parseEther(amount);
      const tx = await cmesh.approve(stakingPool.address, amountWei);
      await tx.wait();
      alert("Approval successful");
      const newAllowance = await cmesh.allowance(account!, stakingPool.address);
      setAllowance(newAllowance as ethers.BigNumber);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Approval failed");
    } finally {
      setLoading(false);
    }
  };

  const handleStake = async () => {
    if (!stakingPool || !selectedDevice || !amount) return;
    try {
      setLoading(true);
      setError("");
      const amountWei = ethers.utils.parseEther(amount);
      const tx = await stakingPool.stakeForDevice(selectedDevice, amountWei);
      await tx.wait();
      alert("Stake successful");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Stake failed");
    } finally {
      setLoading(false);
    }
  };

  const amountWei = amount ? ethers.utils.parseEther(amount) : ethers.constants.Zero;
  const needsApproval = amountWei.gt(allowance);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Stake for Device</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Select Device</Label>
          <Select value={selectedDevice} onValueChange={setSelectedDevice}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a device" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.metadata?.name ?? d.id} (ID: {d.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="stake-amount">Amount (CMESH)</Label>
          <Input
            id="stake-amount"
            type="number"
            step="0.01"
            min="100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        {error && <ErrorAlert message={error} />}
        <div className="flex gap-4">
          {needsApproval ? (
            <Button
              type="button"
              variant="secondary"
              onClick={handleApprove}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Approving..." : "Approve CMESH"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleStake}
              disabled={loading || !selectedDevice}
              className="flex-1"
            >
              {loading ? "Staking..." : "Stake"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
