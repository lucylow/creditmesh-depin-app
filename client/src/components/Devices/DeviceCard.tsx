import { Link } from "wouter";
import { ethers } from "ethers";
import type { Device } from "@/hooks/useDevices";
import { IPFS_GATEWAY } from "@/services/contractAddresses";
import { DEVICE_TYPES } from "@/utils/constants";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const imageUrl = device.metadata?.image?.replace("ipfs://", IPFS_GATEWAY) || "";
  const name = device.metadata?.name ?? `Device #${device.id}`;
  const description = device.metadata?.description ?? "";
  const typeLabel = DEVICE_TYPES[device.deviceType] ?? "Unknown";

  return (
    <Link href={`/devices/${device.id}`}>
      <Card className="overflow-hidden hover:border-primary transition-colors cursor-pointer h-full">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-48 object-cover"
          />
        )}
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-lg truncate">{name}</h3>
            <span className="shrink-0 text-xs text-yellow-600 dark:text-yellow-400">
              Rep: {device.reputation}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <div className="flex justify-between items-center">
            <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded">
              {typeLabel}
            </span>
          </div>
          <div className="text-muted-foreground">
            <div>Staked: {ethers.utils.formatEther(device.stakeAmount)} CMESH</div>
            <div>Earned: {ethers.utils.formatEther(device.totalEarned)} CMESH</div>
            <div>Last Active: {new Date(device.lastActive * 1000).toLocaleDateString()}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
