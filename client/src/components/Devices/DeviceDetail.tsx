import { useRoute } from "wouter";
import { useDevices } from "@/hooks/useDevices";
import { IPFS_GATEWAY } from "@/services/contractAddresses";
import { DEVICE_TYPES } from "@/utils/constants";
import { ethers } from "ethers";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorAlert } from "@/components/common/ErrorAlert";

export function DeviceDetail() {
  const [, params] = useRoute("/devices/:id");
  const id = params?.id;
  const { devices, loading, error } = useDevices();
  const device = id ? devices.find((d) => d.id === id) : null;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) return <ErrorAlert message={error} />;
  if (!device) return <div className="text-center py-12">Device not found.</div>;

  const imageUrl = device.metadata?.image?.replace("ipfs://", IPFS_GATEWAY) || "";
  const typeLabel = DEVICE_TYPES[device.deviceType] ?? "Unknown";

  return (
    <Card className="max-w-2xl mx-auto">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={device.metadata?.name}
          className="w-full h-64 object-cover"
        />
      )}
      <CardHeader>
        <h1 className="text-2xl font-bold">{device.metadata?.name ?? `Device #${device.id}`}</h1>
        <p className="text-muted-foreground">{device.metadata?.description}</p>
        <div className="flex gap-2 mt-2">
          <span className="bg-primary/20 text-primary text-sm px-2 py-1 rounded">{typeLabel}</span>
          <span className="text-sm text-muted-foreground">Reputation: {device.reputation}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Staked</span>
            <p className="font-medium">{ethers.utils.formatEther(device.stakeAmount)} CMESH</p>
          </div>
          <div>
            <span className="text-muted-foreground">Total Earned</span>
            <p className="font-medium">{ethers.utils.formatEther(device.totalEarned)} CMESH</p>
          </div>
          <div>
            <span className="text-muted-foreground">Last Active</span>
            <p className="font-medium">{new Date(device.lastActive * 1000).toLocaleString()}</p>
          </div>
        </div>
        {device.metadata?.attributes?.length ? (
          <div>
            <h3 className="font-medium mb-2">Attributes</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              {device.metadata.attributes.map((a: { trait_type: string; value: string }) => (
                <li key={a.trait_type}>
                  {a.trait_type}: {a.value}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
