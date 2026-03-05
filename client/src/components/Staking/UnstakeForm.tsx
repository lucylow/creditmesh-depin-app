import { useState } from "react";
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

export function UnstakeForm() {
  const { stakingPool } = useContracts();
  const { devices } = useDevices();
  const [selectedDevice, setSelectedDevice] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUnstake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stakingPool || !selectedDevice || !amount) return;
    try {
      setLoading(true);
      setError("");
      const { ethers } = await import("ethers");
      const amountWei = ethers.utils.parseEther(amount);
      const tx = await (stakingPool as { unstakeFromDevice: (id: string, amount: import("ethers").BigNumber) => Promise<unknown> }).unstakeFromDevice(selectedDevice, amountWei);
      await (tx as { wait: () => Promise<unknown> }).wait();
      alert("Unstake successful");
      setAmount("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unstake failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Unstake from Device</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUnstake} className="space-y-4">
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
            <Label htmlFor="unstake-amount">Amount (CMESH)</Label>
            <Input
              id="unstake-amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          {error && <ErrorAlert message={error} />}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Unstaking..." : "Unstake"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
