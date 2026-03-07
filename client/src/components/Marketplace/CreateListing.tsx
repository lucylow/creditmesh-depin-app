import { useState } from "react";
import { ethers } from "ethers";
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

export function CreateListing() {
  const { marketplace } = useContracts();
  const { devices } = useDevices();
  const [selectedDevice, setSelectedDevice] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [duration, setDuration] = useState("7");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketplace || !selectedDevice) return;
    setLoading(true);
    setError("");
    try {
      const priceWei = ethers.utils.parseEther(price);
      const durationSeconds = parseInt(duration, 10) * 24 * 60 * 60;
      const tx = await (marketplace as unknown as { listData: (deviceId: string, price: import("ethers").BigNumber, quantity: string, duration: number) => Promise<unknown> }).listData(
        selectedDevice,
        priceWei,
        quantity,
        durationSeconds
      );
      await (tx as { wait: () => Promise<unknown> }).wait();
      alert("Listing created!");
      setPrice("");
      setQuantity("");
      setDuration("7");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">List Data for Sale</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Device</Label>
            <Select value={selectedDevice} onValueChange={setSelectedDevice} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a device" />
              </SelectTrigger>
              <SelectContent>
                {devices.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.metadata?.name ?? d.id} (Rep: {d.reputation})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="price">Price per data point (CMESH)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity (data points)</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="duration">Listing duration (days)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          {error && <ErrorAlert message={error} />}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Listing"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
